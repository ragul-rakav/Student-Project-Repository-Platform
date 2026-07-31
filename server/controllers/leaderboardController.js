const dataStore = require('../services/dataStore');

exports.getLeaderboard = (req, res) => {
  try {
    const { filter = 'overall', dept, year, search } = req.query;

    let students = dataStore.users.filter(u => u.role === 'Student');

    students.sort((a, b) => {
      if (b.credits !== a.credits) return b.credits - a.credits;
      return (b.approved_projects || 0) - (a.approved_projects || 0);
    });

    let list = students.map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      dept: s.dept,
      year: s.academic_year,
      credits: s.credits,
      projects: s.approved_projects || 0,
      email: s.email,
      skills: s.skills,
      domain_of_interest: s.domain_of_interest
    }));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q));
    }

    if (filter === 'dept' && dept) {
      list = list.filter(s => s.dept === dept);
    } else if (filter === 'year' && year) {
      list = list.filter(s => s.year === year);
    }

    return res.json({
      success: true,
      leaderboard: list
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
