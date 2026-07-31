const db = require('../config/db');

// In-Memory fallback store populated with exact seed data from UI design
let users = [
  { id: 1, name: 'Alex Johnson', email: 'alex@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Computer Science', academic_year: 'Third Year', credits: 190, approved_projects: 9, skills: ['React', 'Node.js', 'Python'], domain_of_interest: 'Machine Learning', initials: 'AJ' },
  { id: 2, name: 'Dr. Sarah Smith', email: 'sarah.smith@university.edu', password: 'password', role: 'Faculty', status: 'Active', dept: 'Computer Science', academic_year: 'Reviewer', credits: 0, approved_projects: 0, skills: [], domain_of_interest: '', initials: 'SS' },
  { id: 3, name: 'Dr. Rajesh Kumar', email: 'rajesh@university.edu', password: 'password', role: 'Faculty', status: 'Active', dept: 'Computer Science', academic_year: 'Reviewer', credits: 0, approved_projects: 0, skills: [], domain_of_interest: '', initials: 'RK' },
  { id: 4, name: 'Dr. Anita Verma', email: 'anita@university.edu', password: 'password', role: 'Faculty', status: 'Active', dept: 'Computer Science', academic_year: 'Reviewer', credits: 0, approved_projects: 0, skills: [], domain_of_interest: '', initials: 'AV' },
  { id: 5, name: 'Maya Patel', email: 'maya@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Information Technology', academic_year: 'Final Year', credits: 195, approved_projects: 8, skills: ['Java', 'Spring Boot', 'SQL'], domain_of_interest: 'Backend Development', initials: 'MP' },
  { id: 6, name: 'Rahul Mehta', email: 'rahul@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Computer Science', academic_year: 'Final Year', credits: 168, approved_projects: 7, skills: ['Angular', 'TypeScript', 'Node.js'], domain_of_interest: 'Web Development', initials: 'RM' },
  { id: 7, name: 'Priya Sharma', email: 'priya@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Information Technology', academic_year: 'Third Year', credits: 155, approved_projects: 6, skills: ['Flutter', 'Dart', 'Firebase'], domain_of_interest: 'Mobile Development', initials: 'PS' },
  { id: 8, name: 'Sneha Rao', email: 'sneha@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Electronics', academic_year: 'Second Year', credits: 142, approved_projects: 5, skills: ['C++', 'Arduino', 'Raspberry Pi'], domain_of_interest: 'Internet of Things', initials: 'SR' },
  { id: 9, name: 'Daniel Lee', email: 'daniel@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Computer Science', academic_year: 'Third Year', credits: 138, approved_projects: 6, skills: ['Python', 'PyTorch', 'NLTK'], domain_of_interest: 'Artificial Intelligence', initials: 'DL' },
  { id: 10, name: 'James Wilson', email: 'james@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Electronics', academic_year: 'Third Year', credits: 172, approved_projects: 7, skills: ['VHDL', 'Verilog', 'Embedded C'], domain_of_interest: 'Embedded Systems', initials: 'JW' },
  { id: 11, name: 'Sarah Chen', email: 'sarah.chen@university.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Computer Science', academic_year: 'Final Year', credits: 245, approved_projects: 12, skills: ['React Native', 'Node.js', 'AWS'], domain_of_interest: 'Fullstack Mobile', initials: 'SC' },
  { id: 12, name: 'Admin User', email: 'admin@university.edu', password: 'password', role: 'Administrator', status: 'Active', dept: 'Platform Admin', academic_year: '—', credits: 0, approved_projects: 0, skills: [], domain_of_interest: '', initials: 'AU' }
];

let projects = [
  {
    id: 1, type: 'Internal', status: 'Approved', title: 'AI-Powered Attendance System', author: 'Alex Johnson', dept: 'Computer Science', category: 'Machine Learning', likes: 42, commentsCount: 2, views: 315, liked: false,
    abstract: 'An automated attendance management system using facial recognition to track student presence in classes. Built using Python, OpenCV, and Flask.',
    github: 'https://github.com/alexj/ai-attendance', doc: 'https://docs.google.com/document/d/1attendance', ppt: 'https://docs.google.com/presentation/d/1attendance-ppt', demo: 'https://youtube.com/watch?v=attendance-demo', vercel: 'https://ai-attendance.vercel.app',
    tech: ['Python', 'OpenCV', 'Flask'], collaborators: ['Priya Sharma', 'Daniel Lee'],
    comments: [
      { id: 1, author: 'Dr. Sarah Smith', text: 'Excellent implementation of face recognition algorithm. Accurate and fast.', time: '2 days ago' },
      { id: 2, author: 'Priya Sharma', text: 'This is great! I would love to work on extending this to mobile.', time: '1 day ago' }
    ],
    enhancements: []
  },
  {
    id: 2, type: 'Internal', status: 'Approved', title: 'Smart Campus Navigation', author: 'Priya Sharma', dept: 'Computer Science', category: 'Mobile Development', likes: 36, commentsCount: 1, views: 240, liked: false,
    abstract: 'An interactive mobile app providing step-by-step navigation around the campus using beacon technology and custom layouts.',
    github: 'https://github.com/priya/smart-nav', doc: 'https://docs.google.com/document/d/1smart-nav', ppt: 'https://docs.google.com/presentation/d/1smart-nav-ppt', demo: 'https://youtube.com/watch?v=nav-demo', vercel: '',
    tech: ['Flutter', 'Dart', 'Google Maps API'], collaborators: ['Alex Johnson'],
    comments: [
      { id: 3, author: 'Dr. Rajesh Kumar', text: 'Very useful utility for freshers. The routing algorithm is quite efficient.', time: '3 days ago' }
    ],
    enhancements: []
  },
  {
    id: 3, type: 'External', status: 'In Review', title: 'Campus Marketplace App', author: 'Alex Johnson', dept: 'Computer Science', category: 'Mobile Development', likes: 28, commentsCount: 0, views: 198, liked: false,
    abstract: 'A marketplace application designed exclusively for university students to buy, sell, or rent textbooks, electronics, and room utilities.',
    github: 'https://github.com/alexj/campus-market', doc: 'https://docs.google.com/document/d/1campus-market', ppt: '', cert: 'https://certs.com/alexj-marketplace', demo: '', vercel: 'https://campus-market.vercel.app',
    tech: ['React Native', 'Node.js', 'MongoDB'], collaborators: ['Maya Patel'], comments: [], enhancements: []
  },
  {
    id: 4, type: 'External', status: 'Approved', title: 'Open Source LMS Plugin', author: 'Rahul Mehta', dept: 'Computer Science', category: 'Web Development', likes: 55, commentsCount: 0, views: 420, liked: false,
    abstract: 'A modular LMS plugin that integrates peer-to-peer coding challenges directly into course modules, supporting interactive feedback.',
    github: 'https://github.com/rahul/lms-plugin', doc: 'https://docs.google.com/document/d/1lms-plugin', ppt: '', cert: 'https://certs.com/rahul-lms', demo: 'https://youtube.com/watch?v=lms-demo', vercel: '',
    tech: ['PHP', 'JavaScript', 'Moodle'], collaborators: [], comments: [], enhancements: []
  },
  {
    id: 5, type: 'Idea', status: null, title: 'Blockchain-Based Certificate Verification', author: 'Alex Johnson', dept: 'Computer Science', category: 'Blockchain', likes: 15, commentsCount: 0, views: 87, liked: false,
    abstract: 'A decentralized verification system ensuring tampering-proof transcripts and degree certificates using smart contracts.',
    github: '', doc: '', ppt: '', demo: '', vercel: '', tech: ['Solidity', 'Ethereum', 'React'], collaborators: [], comments: [], enhancements: []
  },
  {
    id: 6, type: 'Idea', status: null, title: 'IoT Waste Management Sensor', author: 'Sneha Rao', dept: 'Electronics', category: 'Internet of Things', likes: 22, commentsCount: 0, views: 134, liked: false,
    abstract: 'Smart bin sensor node that alerts the waste management agency when bin capacity is exceeded, optimizing routing schedules.',
    github: '', doc: '', ppt: '', demo: '', vercel: '', tech: ['C++', 'Arduino', 'LoRaWAN'], collaborators: [], comments: [], enhancements: []
  },
  {
    id: 7, type: 'Idea', status: null, title: 'AI Study Buddy Chatbot', author: 'Daniel Lee', dept: 'Computer Science', category: 'Artificial Intelligence', likes: 31, commentsCount: 0, views: 205, liked: false,
    abstract: 'Conversational LLM agent custom-trained on university syllabus to answer students queries and quiz them dynamically.',
    github: '', doc: '', ppt: '', demo: '', vercel: '', tech: ['Python', 'PyTorch', 'NLTK'], collaborators: [], comments: [], enhancements: []
  }
];

let reviewQueue = [
  { id: 102, title: 'Predictive Maintenance Dashboard', author: 'Rahul Mehta', category: 'Machine Learning', submitted: '4 days ago', type: 'Internal', faculty: 'Dr. Anita Verma', isEnhancement: false },
  { id: 103, title: 'Peer Tutoring Scheduler', author: 'Priya Sharma', category: 'Web Development', submitted: '6 days ago', type: 'Internal', faculty: 'Dr. Rajesh Kumar', isEnhancement: false }
];

let guideRequests = [
  { id: 301, student: 'Sneha Rao', project: 'AI Resume Builder', faculty: 'Dr. Sarah Smith', category: 'Artificial Intelligence', requested: '3 days ago' }
];

let collaborationRequests = [
  { id: 1, projectId: 2, projectTitle: 'Smart Campus Navigation', requester: 'Alex Johnson', owner: 'Priya Sharma', status: 'Pending' }
];

let notifications = [
  { id: 1, email: 'alex@university.edu', icon: 'star', text: 'Your Internal Project was approved. +10 credits', time: '2 hours ago' },
  { id: 2, email: 'alex@university.edu', icon: 'bell', text: 'Dr. Smith accepted your External Project guide request', time: '5 hours ago' },
  { id: 3, email: 'alex@university.edu', icon: 'award', text: 'You earned 5 credits for publishing a new Idea', time: '1 day ago' },
  { id: 4, email: 'Administrator', icon: 'folder', text: 'New project uploaded: "Open Source LMS Plugin"', time: '3 hours ago' }
];

let departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'];

let accessTiers = [
  { min: 0, label: 'No Repository Access' },
  { min: 60, label: 'Idea Repository' },
  { min: 100, label: 'Internal Projects' },
  { min: 200, label: 'External Projects' }
];

let nextProjectId = 8;
let nextCollabRequestId = 2;

module.exports = {
  users,
  projects,
  reviewQueue,
  guideRequests,
  collaborationRequests,
  notifications,
  departments,
  accessTiers,
  getNextProjectId: () => nextProjectId++,
  getNextCollabId: () => nextCollabRequestId++
};
