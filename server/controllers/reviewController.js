const dataStore = require('../services/dataStore');

exports.getReviews = (req, res) => {
  try {
    const facultyName = req.user.name;
    const reviews = dataStore.reviewQueue.filter(r => r.faculty === facultyName);
    return res.json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.reviewAction = (req, res) => {
  try {
    const { id, approve } = req.body;
    const r = dataStore.reviewQueue.find(x => x.id === parseInt(id));

    if (!r) {
      return res.status(404).json({ success: false, message: 'Review item not found' });
    }

    dataStore.reviewQueue = dataStore.reviewQueue.filter(x => x.id !== parseInt(id));
    const authorUser = dataStore.users.find(u => u.name === r.author);

    if (r.isEnhancement) {
      const proj = dataStore.projects.find(p => p.id === r.projectId);
      if (approve) {
        if (proj) {
          proj.enhancements = proj.enhancements || [];
          proj.enhancements.push({
            title: r.enhancementTitle,
            details: r.details,
            author: r.author
          });

          const ownerUser = dataStore.users.find(u => u.name === proj.author);
          if (ownerUser) {
            ownerUser.credits = (ownerUser.credits || 0) + 10;
            dataStore.notifications.unshift({
              id: dataStore.notifications.length + 1,
              email: ownerUser.email,
              icon: 'award',
              text: `Your project "${proj.title}" was enhanced by ${r.author}. +10 credits awarded.`,
              time: 'Just now'
            });
          }
          if (authorUser) {
            authorUser.credits = (authorUser.credits || 0) + 10;
            dataStore.notifications.unshift({
              id: dataStore.notifications.length + 1,
              email: authorUser.email,
              icon: 'award',
              text: `Your enhancement on "${proj.title}" was approved. +10 credits awarded.`,
              time: 'Just now'
            });
          }
        }
        return res.json({ success: true, message: 'Enhancement approved! +10 credits awarded' });
      } else {
        if (authorUser) {
          dataStore.notifications.unshift({
            id: dataStore.notifications.length + 1,
            email: authorUser.email,
            icon: 'x',
            text: `Your enhancement was rejected.`,
            time: 'Just now'
          });
        }
        return res.json({ success: true, message: 'Enhancement rejected' });
      }
    } else {
      const proj = dataStore.projects.find(p => p.id === parseInt(id));
      const credits = (r.type === 'External') ? 20 : 10;

      if (approve) {
        if (proj) proj.status = 'Approved';
        if (authorUser) {
          authorUser.credits = (authorUser.credits || 0) + credits;
          authorUser.approved_projects = (authorUser.approved_projects || 0) + 1;
          dataStore.notifications.unshift({
            id: dataStore.notifications.length + 1,
            email: authorUser.email,
            icon: 'star',
            text: `Your project "${r.title}" was approved! +${credits} credits awarded.`,
            time: 'Just now'
          });
        }
        return res.json({ success: true, message: `${r.title} approved — +${credits} credits awarded to ${r.author}` });
      } else {
        if (proj) dataStore.projects = dataStore.projects.filter(p => p.id !== parseInt(id));
        if (authorUser) {
          dataStore.notifications.unshift({
            id: dataStore.notifications.length + 1,
            email: authorUser.email,
            icon: 'x',
            text: `Your project "${r.title}" was rejected and sent back for changes.`,
            time: 'Just now'
          });
        }
        return res.json({ success: true, message: `${r.title} sent back for changes` });
      }
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
