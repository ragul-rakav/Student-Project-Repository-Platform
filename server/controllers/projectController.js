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
      views: (a, b) => b.views - a.views,
      credits: (a, b) => {
        const uA = dataStore.users.find(u => u.name === a.author);
        const uB = dataStore.users.find(u => u.name === b.author);
        return (uB ? uB.credits : 0) - (uA ? uA.credits : 0);
      },
      popular: (a, b) => ((b.likes + (b.comments ? b.comments.length : 0)) - (a.likes + (a.comments ? a.comments.length : 0)))
    };

    list.sort(sortFns[sort] || sortFns.latest);

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

exports.submitProject = (req, res) => {
  try {
    const { title, category, tech, abstract, github, doc, ppt, cert, demo, vercel, faculty, type } = req.body;
    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    if (!title || !category || !tech || !abstract || !type) {
      return res.status(400).json({ success: false, message: 'Title, category, tech stack, abstract, and project type are required' });
    }

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
        author: user.name,
        dept: user.dept,
        category,
        likes: 0,
        commentsCount: 0,
        views: 0,
        liked: false,
        abstract,
        github: github || '',
        doc: doc || '',
        ppt: ppt || '',
        demo: demo || '',
        vercel: vercel || '',
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
        author: user.name,
        category,
        submitted: 'Just now',
        type: 'Internal',
        faculty: faculty || 'Dr. Sarah Smith',
        isEnhancement: false
      });

      dataStore.notifications.unshift({
        id: dataStore.notifications.length + 1,
        email: faculty || 'Faculty',
        icon: 'bell',
        text: `New Internal Project submitted: "${title}" by ${user.name}`,
        time: 'Just now'
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
        author: user.name,
        dept: user.dept,
        category,
        likes: 0,
        commentsCount: 0,
        views: 0,
        liked: false,
        abstract,
        github: github || '',
        doc: doc || '',
        cert: cert || '',
        demo: demo || '',
        vercel: vercel || '',
        tech: techArray,
        collaborators: [],
        comments: [],
        enhancements: [],
        files: uploadedFiles
      };

      dataStore.projects.unshift(newProj);
      dataStore.guideRequests.unshift({
        id: newId,
        student: user.name,
        project: title,
        faculty: faculty || 'Dr. Sarah Smith',
        category,
        requested: 'Just now'
      });

      dataStore.notifications.unshift({
        id: dataStore.notifications.length + 1,
        email: faculty || 'Faculty',
        icon: 'chat',
        text: `${user.name} requested you as guide for external project "${title}"`,
        time: 'Just now'
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
      time: 'Just now'
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
            time: 'Just now'
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
          time: 'Just now'
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
    const p = dataStore.projects.find(x => x.id === id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const user = dataStore.users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

    dataStore.notifications.unshift({
      id: dataStore.notifications.length + 1,
      email: 'Administrator',
      icon: 'bell',
      text: `Project "${p.title}" reported by ${user.name}`,
      time: 'Just now'
    });

    return res.json({ success: true, message: 'Project reported to administrator' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
