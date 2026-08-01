const dataStore = require('../services/dataStore');

function checkProjectAccess(p, currentUser) {
  if (!currentUser) return true;
  if (currentUser.role !== 'Student') return true;
  if (p.author === currentUser.name) return true;
  if (p.collaborators && p.collaborators.includes(currentUser.name)) return true;

  if ((currentUser.approved_projects || 0) < 3) return false;

  let req = 0;
  if (p.type === 'Idea') req = dataStore.accessTiers[1].min;
  if (p.type === 'Internal') req = dataStore.accessTiers[2].min;
  if (p.type === 'External') req = dataStore.accessTiers[3].min;

  return (currentUser.credits || 0) >= req;
}

exports.getProjects = (req, res) => {
  try {
    let { filter, search, sort, page = 1, limit = 50 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let list = dataStore.projects.filter(p => {
      if (p.type !== 'Idea' && p.status !== 'Approved') return false;
      if (filter && filter !== 'all' && p.type.toLowerCase() !== filter.toLowerCase()) return false;
      if (search) {
        const q = search.toLowerCase();
        const techStr = p.tech ? p.tech.join(' ').toLowerCase() : '';
        const hay = `${p.title} ${p.author} ${p.dept} ${p.category} ${techStr}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sortFns = {
      latest: (a, b) => b.id - a.id,
      popular: (a, b) => {
        const scoreA = (a.views * 1.0) + (a.likes * 4.0) + ((a.commentsCount || (a.comments ? a.comments.length : 0)) * 6.0);
        const scoreB = (b.views * 1.0) + (b.likes * 4.0) + ((b.commentsCount || (b.comments ? b.comments.length : 0)) * 6.0);
        return scoreB - scoreA;
      },
      views: (a, b) => b.views - a.views,
      credits: (a, b) => {
        const uA = dataStore.users.find(u => u.name === a.author);
        const uB = dataStore.users.find(u => u.name === b.author);
        return (uB ? uB.credits : 0) - (uA ? uA.credits : 0);
      }
    };

    list.sort(sortFns[sort] || sortFns.popular);

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginatedList = list.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      projects: paginatedList
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProjectById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = dataStore.projects.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.views += 1;
    return res.json({ success: true, project });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function normalizeUrl(str) {
  if (!str || !str.trim()) return '';
  let val = str.trim();
  if (!val.startsWith('http://') && !val.startsWith('https://')) {
    val = 'https://' + val.replace(/^\/+/, '');
  }
  return val;
}

exports.submitProject = (req, res) => {
  try {
    const { title, category, tech, abstract, github, doc, ppt, cert, demo, vercel, faculty, type } = req.body;
    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    if (!title || !category || !tech || !abstract || !type) {
      return res.status(400).json({ success: false, message: 'Title, category, tech stack, abstract, and project type are required' });
    }

    const normGithub = normalizeUrl(github);
    const normDoc = normalizeUrl(doc);
    const normPpt = normalizeUrl(ppt);
    const normCert = normalizeUrl(cert);
    const normDemo = normalizeUrl(demo);
    const normVercel = normalizeUrl(vercel);

    const techArray = Array.isArray(tech) ? tech : tech.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const newId = dataStore.getNextProjectId();

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map(f => ({
        fileName: f.originalname,
        filePath: f.path.replace(/\\/g, '/'),
        fileType: f.mimetype
      }));
    }

    if (type === 'Internal') {
      const newProj = {
        id: newId,
        type: 'Internal',
        status: 'In Review',
        title,
        author: user ? user.name : 'Student',
        dept: user ? user.dept : 'Computer Science',
        category,
        likes: 0,
        commentsCount: 0,
        views: 0,
        liked: false,
        abstract,
        github: normGithub,
        doc: normDoc,
        ppt: normPpt,
        demo: normDemo,
        vercel: normVercel,
        tech: techArray,
        collaborators: [],
        comments: [],
        enhancements: [],
        files: uploadedFiles
      };

      dataStore.projects.unshift(newProj);
      dataStore.reviewQueue.unshift({
        id: newId,
        title,
        author: user ? user.name : 'Student',
        category,
        submitted: 'Just now',
        type: 'Internal',
        faculty: faculty || 'Dr. Sarah Smith',
        isEnhancement: false,
        abstract,
        github: normGithub,
        doc: normDoc,
        ppt: normPpt,
        tech: techArray,
        files: uploadedFiles
      });

      dataStore.notifications.unshift({
        id: dataStore.notifications.length + 1,
        email: faculty || 'Faculty',
        icon: 'bell',
        text: `New Internal Project submitted: "${title}" by ${user ? user.name : 'Student'}`,
        time: 'Just now',
        route: '/reviews',
        read: false
      });

      return res.status(201).json({
        success: true,
        message: `Submitted — sent to ${faculty || 'Faculty'} for review`,
        project: newProj
      });
    } else {
      const newProj = {
        id: newId,
        type: 'External',
        status: 'Pending Guide',
        title,
        author: user ? user.name : 'Student',
        dept: user ? user.dept : 'Computer Science',
        category,
        likes: 0,
        commentsCount: 0,
        views: 0,
        liked: false,
        abstract,
        github: normGithub,
        doc: normDoc,
        cert: normCert,
        demo: normDemo,
        vercel: normVercel,
        tech: techArray,
        collaborators: [],
        comments: [],
        enhancements: [],
        files: uploadedFiles
      };

      dataStore.projects.unshift(newProj);
      dataStore.guideRequests.unshift({
        id: newId,
        student: user ? user.name : 'Student',
        project: title,
        faculty: faculty || 'Dr. Sarah Smith',
        category,
        requested: 'Just now'
      });

      dataStore.notifications.unshift({
        id: dataStore.notifications.length + 1,
        email: faculty || 'Faculty',
        icon: 'chat',
        text: `${user ? user.name : 'Student'} requested you as guide for external project "${title}"`,
        time: 'Just now',
        route: '/guides',
        read: false
      });

      return res.status(201).json({
        success: true,
        message: `Guide request sent to ${faculty || 'Faculty'}`,
        project: newProj
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.publishIdea = (req, res) => {
  try {
    const { title, category, tech, description } = req.body;
    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    if (!title || !category || !tech || !description) {
      return res.status(400).json({ success: false, message: 'Title, category, tech stack, and description are required' });
    }

    const techArray = Array.isArray(tech) ? tech : tech.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const newId = dataStore.getNextProjectId();

    const newIdea = {
      id: newId,
      type: 'Idea',
      status: null,
      title,
      author: user.name,
      dept: user.dept,
      category,
      likes: 0,
      commentsCount: 0,
      views: 0,
      liked: false,
      abstract: description,
      description,
      tech: techArray,
      collaborators: [],
      comments: [],
      enhancements: []
    };

    dataStore.projects.unshift(newIdea);

    // Award +5 credits for idea publishing
    user.credits = (user.credits || 0) + 5;

    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: user.email,
      icon: 'award',
      text: `Published Idea "${title}". +5 credits earned.`,
      time: 'Just now',
      route: '/profile',
      read: false
    });

    return res.status(201).json({
      success: true,
      message: 'Idea published — +5 credits earned',
      project: newIdea
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleLike = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const p = dataStore.projects.find(x => x.id === id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    p.liked = !p.liked;
    const oldLikes = p.likes;
    p.likes += p.liked ? 1 : -1;

    // Check credit reward: Every 10 likes = 1 credit for author
    const authorUser = dataStore.users.find(u => u.name === p.author);
    if (authorUser) {
      const oldLikeCredits = Math.floor(oldLikes / 10);
      const newLikeCredits = Math.floor(p.likes / 10);
      const diff = newLikeCredits - oldLikeCredits;
      if (diff !== 0) {
        authorUser.credits = (authorUser.credits || 0) + diff;
        if (diff > 0) {
          dataStore.notifications.unshift({
            id: dataStore.notifications.length + 1,
            email: authorUser.email,
            icon: 'award',
            text: `Your project "${p.title}" crossed ${newLikeCredits * 10} likes! +1 credit points awarded.`,
            time: 'Just now',
            route: '/profile',
            read: false
          });
        }
      }
    }

    return res.json({ success: true, likes: p.likes, liked: p.liked });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.postComment = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { text } = req.body;
    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const p = dataStore.projects.find(x => x.id === id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    p.comments = p.comments || [];
    const newComment = {
      id: p.comments.length + 1,
      author: user.name,
      text: text.trim(),
      time: 'Just now'
    };

    p.comments.push(newComment);
    p.commentsCount = p.comments.length;

    if (p.author !== user.name) {
      const authorUser = dataStore.users.find(u => u.name === p.author);
      if (authorUser) {
        dataStore.notifications.unshift({
          id: dataStore.notifications.length + 1,
          email: authorUser.email,
          icon: 'chat',
          text: `${user.name} commented on your project "${p.title}"`,
          time: 'Just now',
          route: '/projects',
          read: false
        });
      }
    }

    return res.status(201).json({ success: true, comment: newComment, commentsCount: p.commentsCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.reportProject = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { category, reason } = req.body;
    const p = dataStore.projects.find(x => x.id === id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    const reportObj = {
      id: dataStore.getNextReportId(),
      projectId: p.id,
      projectTitle: p.title,
      reporter: user ? user.name : 'User',
      category: category || 'General Violation',
      reason: reason || 'Inappropriate or non-compliant content',
      status: 'Pending',
      createdAt: 'Just now'
    };

    if (!dataStore.reports) dataStore.reports = [];
    dataStore.reports.unshift(reportObj);

    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'bell',
      text: `Report on "${p.title}" by ${user ? user.name : 'User'}: ${category || 'Violation'}`,
      time: 'Just now',
      route: '/admin?tab=reports',
      read: false
    });

    return res.json({ success: true, message: 'Project reported to administrator' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProject = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = dataStore.projects.findIndex(x => x.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const deleted = dataStore.projects.splice(index, 1)[0];
    dataStore.reviewQueue = dataStore.reviewQueue.filter(r => r.id !== id);
    if (dataStore.reports) {
      dataStore.reports = dataStore.reports.filter(rep => rep.projectId !== id);
    }

    return res.json({ success: true, message: `Project "${deleted.title}" removed successfully` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
