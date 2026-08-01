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
  { id: 102, title: 'Predictive Maintenance Dashboard', author: 'Rahul Mehta', category: 'Machine Learning', submitted: '4 days ago', type: 'Internal', faculty: 'Dr. Anita Verma', isEnhancement: false, abstract: 'Real-time telemetry analysis dashboard predicting equipment breakdowns using Random Forest and Time-Series anomaly detection.', github: 'https://github.com/rahul/predictive-maint', doc: 'https://docs.google.com/document/d/1pred-maint', ppt: 'https://docs.google.com/presentation/d/1pred-maint-ppt', tech: ['Python', 'Scikit-Learn', 'React', 'FastAPI'] },
  { id: 103, title: 'Peer Tutoring Scheduler', author: 'Priya Sharma', category: 'Web Development', submitted: '6 days ago', type: 'Internal', faculty: 'Dr. Rajesh Kumar', isEnhancement: false, abstract: 'Matching engine for senior and junior students for peer-to-peer academic assistance with integrated calendar syncing.', github: 'https://github.com/priya/peer-tutoring', doc: 'https://docs.google.com/document/d/1peer-tutor', ppt: 'https://docs.google.com/presentation/d/1peer-tutor-ppt', tech: ['Node.js', 'PostgreSQL', 'FullCalendar'] }
];

let guideRequests = [
  { id: 301, student: 'Sneha Rao', project: 'AI Resume Builder', faculty: 'Dr. Sarah Smith', category: 'Artificial Intelligence', requested: '3 days ago' }
];

let collaborationRequests = [
  { id: 1, projectId: 2, projectTitle: 'Smart Campus Navigation', requester: 'Alex Johnson', owner: 'Priya Sharma', status: 'Pending' }
];

let reports = [
  { id: 1, projectId: 3, projectTitle: 'Campus Marketplace App', reporter: 'Rahul Mehta', category: 'Copyright / Plagiarism', reason: 'Uncredited reuse of component source from another repository.', status: 'Pending', createdAt: '1 day ago' }
];

let notifications = [
  { id: 1, email: 'alex@university.edu', icon: 'star', text: 'Your Internal Project was approved. +10 credits', time: '2 hours ago', route: '/profile', read: false },
  { id: 2, email: 'alex@university.edu', icon: 'bell', text: 'Dr. Smith accepted your External Project guide request', time: '5 hours ago', route: '/projects', read: false },
  { id: 3, email: 'alex@university.edu', icon: 'award', text: 'You earned 5 credits for publishing a new Idea', time: '1 day ago', route: '/profile', read: false },
  { id: 4, email: 'Administrator', icon: 'bell', text: 'Project "Campus Marketplace App" reported by Rahul Mehta', time: '1 day ago', route: '/admin?tab=reports', read: false }
];

let departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'];

let accessTiers = [
  { min: 0, label: 'No Repository Access' },
  { min: 60, label: 'Idea Repository' },
  { min: 100, label: 'Internal Projects' },
  { min: 200, label: 'External Projects' },
  { min: 300, label: 'Gold Level Projects' }
];

// Next-level projects for Showcase & Tier Locking
projects.push(
  {
    id: 8, type: 'External', status: 'Approved', title: 'Autonomous Swarm Robotics Controller', author: 'Sarah Chen', dept: 'Computer Science', category: 'Robotics', likes: 89, commentsCount: 5, views: 610, liked: false,
    abstract: 'Distributed path planning and obstacle avoidance algorithms for multi-uav swarm formations operating in GPS-denied environments.',
    github: 'https://github.com/sarahchen/swarm-robotics', doc: 'https://docs.google.com/document/d/1swarm-robotics', ppt: 'https://docs.google.com/presentation/d/1swarm-ppt', demo: 'https://youtube.com/watch?v=swarm-demo', vercel: '',
    tech: ['ROS 2', 'C++', 'Python', 'Gazebo'], collaborators: ['James Wilson'], comments: [], enhancements: []
  },
  {
    id: 9, type: 'External', status: 'Approved', title: 'Quantum-Safe Encryption Protocol', author: 'Sarah Chen', dept: 'Computer Science', category: 'Cybersecurity', likes: 112, commentsCount: 8, views: 890, liked: false,
    abstract: 'Lattice-based post-quantum cryptographic primitives implementation in Rust for secure end-to-end telemetry communication.',
    github: 'https://github.com/sarahchen/quantum-safe-crypto', doc: 'https://docs.google.com/document/d/1quantum-crypto', ppt: 'https://docs.google.com/presentation/d/1quantum-ppt', demo: '', vercel: 'https://quantum-crypto-demo.vercel.app',
    tech: ['Rust', 'Qiskit', 'C'], collaborators: [], comments: [], enhancements: []
  },
  {
    id: 10, type: 'External', status: 'Approved', title: 'Global Decentralized Healthcare Ledger', author: 'Sarah Chen', dept: 'Computer Science', category: 'Blockchain', likes: 140, commentsCount: 12, views: 1250, liked: false,
    abstract: 'Zero-knowledge proof medical record exchange platform enabling patients to share cryptographic consents with hospital networks securely.',
    github: 'https://github.com/sarahchen/healthcare-zk-ledger', doc: 'https://docs.google.com/document/d/1healthcare-zk', ppt: 'https://docs.google.com/presentation/d/1zk-ppt', demo: 'https://youtube.com/watch?v=zk-demo', vercel: 'https://zk-health.vercel.app',
    tech: ['Solidity', 'Hyperledger', 'Go', 'Zero-Knowledge Proofs'], collaborators: ['Maya Patel'], comments: [], enhancements: []
  }
);

let nextProjectId = 11;
let nextCollabRequestId = 2;
let nextReportId = 2;

module.exports = {
  users,
  projects,
  reviewQueue,
  guideRequests,
  collaborationRequests,
  reports,
  notifications,
  departments,
  accessTiers,
  getNextProjectId: () => nextProjectId++,
  getNextCollabId: () => nextCollabRequestId++,
  getNextReportId: () => nextReportId++
};
