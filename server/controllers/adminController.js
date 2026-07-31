const bcrypt = require('bcryptjs');
const dataStore = require('../services/dataStore');

function helperInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

exports.getUsers = (req, res) => {
  try {
    const usersClean = dataStore.users.map(({ password, ...u }) => u);
    return res.json({ success: true, users: usersClean });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
    }

    const hashedPassword = await bcrypt.hash('password', 10);
    const newUser = {
      id: dataStore.users.length + 1,
      name,
      email,
      password: hashedPassword,
      role,
      status: 'Active',
      dept: role === 'Student' ? 'Computer Science' : role === 'Faculty' ? 'Computer Science' : 'Platform Admin',
      academic_year: role === 'Student' ? 'Third Year' : '—',
      credits: 0,
      approved_projects: 0,
      skills: [],
      domain_of_interest: '',
      initials: helperInitials(name)
    };

    dataStore.users.push(newUser);
    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'users',
      text: `Added user: ${name} as ${role}`,
      time: 'Just now'
    });

    const { password: _, ...userClean } = newUser;
    return res.status(201).json({ success: true, message: `${name} added as ${role}`, user: userClean });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeUser = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userIndex = dataStore.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const removed = dataStore.users.splice(userIndex, 1)[0];
    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'users',
      text: `User removed: ${removed.name}`,
      time: 'Just now'
    });

    return res.json({ success: true, message: `${removed.name} removed` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDepartments = (req, res) => {
  try {
    return res.json({ success: true, departments: dataStore.departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.addDepartment = (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const deptName = name.trim();
    if (dataStore.departments.includes(deptName)) {
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }

    dataStore.departments.push(deptName);
    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'bell',
      text: `New department added: ${deptName}`,
      time: 'Just now'
    });

    return res.status(201).json({ success: true, message: `Department "${deptName}" added`, departments: dataStore.departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeDepartment = (req, res) => {
  try {
    const { name } = req.params;
    const index = dataStore.departments.findIndex(d => d.toLowerCase() === name.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const removed = dataStore.departments.splice(index, 1)[0];
    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'bell',
      text: `Department removed: ${removed}`,
      time: 'Just now'
    });

    return res.json({ success: true, message: `Department "${removed}" removed`, departments: dataStore.departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTiers = (req, res) => {
  try {
    return res.json({ success: true, accessTiers: dataStore.accessTiers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTiers = (req, res) => {
  try {
    const { idea, internal, external } = req.body;
    if (idea !== undefined) dataStore.accessTiers[1].min = parseInt(idea);
    if (internal !== undefined) dataStore.accessTiers[2].min = parseInt(internal);
    if (external !== undefined) dataStore.accessTiers[3].min = parseInt(external);

    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'bell',
      text: `Repository access tiers settings updated`,
      time: 'Just now'
    });

    return res.json({ success: true, message: 'Repository access tiers updated successfully', accessTiers: dataStore.accessTiers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnalytics = (req, res) => {
  try {
    const totalProjects = dataStore.projects.length;
    const approvedProjects = dataStore.projects.filter(p => p.status === 'Approved').length;
    const activeStudents = dataStore.users.filter(u => u.role === 'Student').length;
    const pendingReviews = dataStore.reviewQueue.length;

    const internalCount = dataStore.projects.filter(p => p.type === 'Internal').length;
    const externalCount = dataStore.projects.filter(p => p.type === 'External').length;
    const ideaCount = dataStore.projects.filter(p => p.type === 'Idea').length;

    const categories = [
      ['Internal Projects', internalCount, totalProjects || 1],
      ['External Projects', externalCount, totalProjects || 1],
      ['Ideas', ideaCount, totalProjects || 1]
    ];

    const deptCounts = {};
    dataStore.projects.forEach(p => {
      deptCounts[p.dept] = (deptCounts[p.dept] || 0) + 1;
    });

    const departments = Object.keys(deptCounts).map(d => [d, deptCounts[d]]);

    return res.json({
      success: true,
      analytics: {
        totalProjects,
        approvedProjects,
        activeStudents,
        pendingReviews,
        categories,
        departments
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = (req, res) => {
  try {
    const userEmail = req.user.email;
    const userRole = req.user.role;

    const myNotifs = dataStore.notifications.filter(n =>
      n.email.toLowerCase() === userEmail.toLowerCase() || n.email === userRole
    );

    return res.json({ success: true, notifications: myNotifs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
