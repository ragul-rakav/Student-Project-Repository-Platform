const dataStore = require('../services/dataStore');

exports.getGuideRequests = (req, res) => {
  try {
    const facultyName = req.user.name;
    const requests = dataStore.guideRequests.filter(g => g.faculty === facultyName);
    return res.json({ success: true, requests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.guideAction = (req, res) => {
  try {
    const { id, accept } = req.body;
    const g = dataStore.guideRequests.find(x => x.id === parseInt(id));

    if (!g) {
      return res.status(404).json({ success: false, message: 'Guide request not found' });
    }

    dataStore.guideRequests = dataStore.guideRequests.filter(x => x.id !== parseInt(id));
    const proj = dataStore.projects.find(p => p.id === parseInt(id));
    const studentUser = dataStore.users.find(u => u.name === g.student);

    if (accept) {
      if (proj) proj.status = 'In Review';
      dataStore.reviewQueue.unshift({
        id: parseInt(id),
        title: g.project,
        author: g.student,
        category: g.category || 'General',
        submitted: 'Just now',
        type: 'External',
        faculty: g.faculty,
        isEnhancement: false
      });

      if (studentUser) {
        dataStore.notifications.unshift({
          id: dataStore.notifications.length + 1,
          email: studentUser.email,
          icon: 'bell',
          text: `${g.faculty} accepted your guide request for "${g.project}"`,
          time: 'Just now'
        });
      }
      return res.json({ success: true, message: `Accepted ${g.student}'s guide request` });
    } else {
      if (proj) proj.status = 'Guide Declined';
      if (studentUser) {
        dataStore.notifications.unshift({
          id: dataStore.notifications.length + 1,
          email: studentUser.email,
          icon: 'x',
          text: `${g.faculty} declined your guide request for "${g.project}"`,
          time: 'Just now'
        });
      }
      return res.json({ success: true, message: `Request from ${g.student} declined` });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
