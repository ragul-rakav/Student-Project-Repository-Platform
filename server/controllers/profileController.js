const dataStore = require('../services/dataStore');

exports.getProfile = (req, res) => {
  try {
    const { name } = req.params;
    const targetName = name || req.user.name;
    const user = dataStore.users.find(u => u.name.toLowerCase() === targetName.toLowerCase());

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const portfolio = dataStore.projects.filter(p => p.author === user.name && p.status === 'Approved');
    const ideas = dataStore.projects.filter(p => p.author === user.name && p.type === 'Idea');
    const inReview = dataStore.projects.filter(p => p.author === user.name && p.status === 'In Review');

    const { password: _, ...userClean } = user;
    return res.json({
      success: true,
      user: userClean,
      portfolio,
      ideas,
      inReview
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const { domainOfInterest, skills } = req.body;
    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (domainOfInterest !== undefined) user.domain_of_interest = domainOfInterest;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    const { password: _, ...userClean } = user;
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userClean
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
