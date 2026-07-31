const dataStore = require('../services/dataStore');

exports.getCollaborations = (req, res) => {
  try {
    const username = req.user.name;
    const myCollabs = [];

    dataStore.projects.forEach(p => {
      if (p.author === username) {
        myCollabs.push({
          id: p.id,
          title: p.title,
          role: 'Owner',
          collaborators: p.collaborators || []
        });
      } else if (p.collaborators && p.collaborators.includes(username)) {
        myCollabs.push({
          id: p.id,
          title: p.title,
          role: 'Contributor',
          collaborators: [p.author + ' (owner)'].concat((p.collaborators || []).filter(c => c !== username))
        });
      }
    });

    const incoming = dataStore.collaborationRequests.filter(r => r.owner === username && r.status === 'Pending');
    const outgoing = dataStore.collaborationRequests.filter(r => r.requester === username);

    const availableProjects = dataStore.projects.filter(p =>
      p.type !== 'Idea' && p.status === 'Approved' && p.author !== username && (!p.collaborators || !p.collaborators.includes(username))
    );

    return res.json({
      success: true,
      myCollabs,
      incoming,
      outgoing,
      availableProjects
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestAccess = (req, res) => {
  try {
    const { projectId } = req.body;
    const p = dataStore.projects.find(x => x.id === parseInt(projectId));

    if (!p) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const requester = req.user.name;
    const exists = dataStore.collaborationRequests.some(r => r.projectId === p.id && r.requester === requester && r.status === 'Pending');
    if (exists) {
      return res.status(400).json({ success: false, message: 'Collaboration request already pending' });
    }

    const newReq = {
      id: dataStore.getNextCollabId(),
      projectId: p.id,
      projectTitle: p.title,
      requester: requester,
      owner: p.author,
      status: 'Pending'
    };

    dataStore.collaborationRequests.unshift(newReq);

    const ownerUser = dataStore.users.find(u => u.name === p.author);
    if (ownerUser) {
      dataStore.notifications.unshift({
        id: dataStore.notifications.length + 1,
        email: ownerUser.email,
        icon: 'users',
        text: `${requester} requested to collaborate on your project "${p.title}"`,
        time: 'Just now'
      });
    }

    return res.status(201).json({ success: true, message: 'Collaboration request sent', request: newReq });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.respondRequest = (req, res) => {
  try {
    const { reqId, accept } = req.body;
    const request = dataStore.collaborationRequests.find(r => r.id === parseInt(reqId));

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = accept ? 'Accepted' : 'Declined';
    const p = dataStore.projects.find(x => x.id === request.projectId);

    if (p) {
      if (accept) {
        p.collaborators = p.collaborators || [];
        if (!p.collaborators.includes(request.requester)) {
          p.collaborators.push(request.requester);
        }
        const reqUser = dataStore.users.find(u => u.name === request.requester);
        if (reqUser) {
          dataStore.notifications.unshift({
            id: dataStore.notifications.length + 1,
            email: reqUser.email,
            icon: 'users',
            text: `${request.owner} accepted your collaboration request for "${p.title}"`,
            time: 'Just now'
          });
        }
      } else {
        const reqUser = dataStore.users.find(u => u.name === request.requester);
        if (reqUser) {
          dataStore.notifications.unshift({
            id: dataStore.notifications.length + 1,
            email: reqUser.email,
            icon: 'x',
            text: `${request.owner} declined your collaboration request for "${p.title}"`,
            time: 'Just now'
          });
        }
      }
    }

    return res.json({ success: true, message: accept ? 'Request accepted' : 'Request declined' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitEnhancement = (req, res) => {
  try {
    const { projectId, title, details, codeLink } = req.body;
    const proj = dataStore.projects.find(p => p.id === parseInt(projectId));

    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const requester = req.user.name;
    const newId = dataStore.getNextProjectId();

    dataStore.reviewQueue.unshift({
      id: newId,
      isEnhancement: true,
      projectId: proj.id,
      projectTitle: proj.title,
      enhancementTitle: title,
      details,
      codeLink,
      author: requester,
      category: proj.category,
      submitted: 'Just now',
      type: 'Enhancement',
      faculty: 'Dr. Sarah Smith'
    });

    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Dr. Sarah Smith',
      icon: 'bell',
      text: `Enhancement review requested for project "${proj.title}" by ${requester}`,
      time: 'Just now'
    });

    return res.status(201).json({ success: true, message: 'Enhancement submitted for faculty review' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
