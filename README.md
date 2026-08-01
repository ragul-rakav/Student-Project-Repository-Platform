<div align="center">

# 🎓 Student Project Repository Platform

**An All-in-One Campus Academic Portfolio, Peer Collaboration & Project Governance System**

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Server-Express%204.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](CONTRIBUTING.md)

---

### 🌟 Overview

**Student Project Repository Platform** is a state-of-the-art web platform engineered for universities and academic institutions. It bridges the gap between students, faculty mentors, and campus administrators by providing a centralized hub to showcase projects, apply for faculty guidance, submit peer reviews, track leaderboard rankings, and govern project repositories.

</div>

---

## ✨ Key Features

### 🔐 1. Multi-Role Authentication & Access Control
- **Student Tier**: Submit projects/ideas, request faculty guides, earn credit points, unlock project repositories, and engage with peer submissions.
- **Faculty Tier**: Inspect full project details **prior to approval**, manage review queues, accept/reject guide requests, and award credits.
- **Administrator Super-User**: Full access across all student & faculty views, moderation controls, user management, and direct content removal.

### 🎥 2. YouTube-Inspired Popularity Algorithm
- Non-LLM engagement scoring formula designed to highlight trending submissions dynamically:
  $$\text{Score} = (\text{Views} \times 1.0) + (\text{Likes} \times 4.0) + (\text{Comments} \times 6.0)$$
- Real-time sorting by **Popular**, **Latest**, **Most Viewed**, and **Highest Credits**.

### 🔍 3. Pre-Approval Inspection & Inline Link Verification
- **Faculty Pre-Approval Inspector**: Allows faculty to review full source code links, documentation PDFs, tech stacks, and team members before approving a project into public repositories.
- **Automatic URL Normalizer & Validator**: Backend automatically formats external links (`github.com/...`, `docs.google.com/...`) while displaying clear, field-level inline validation warnings without intrusive popups.

### 🛡️ 4. Structured Reporting & Moderation Center
- **Structured Violation Reporting**: Modal system allowing users to report suspicious links, copyright issues, or inappropriate content directly to administrators.
- **Admin Moderation Tab**: Dedicated queue for reviewing, resolving, or rejecting reports with automated notifications sent to involved parties.

### 🏆 5. Gamified Credit Tiers & Leaderboard
- Students earn credit points through approved submissions and peer interactions.
- Dynamic unlocks for **Idea Repository** (60+ credits), **Internal Projects** (100+ credits), and **External Projects** (200+ credits, min. 3 approved projects).
- Clickable student profiles linking to customized user portfolio pages (`/profile?name=...`).

### 🔔 6. Synchronized Interactive Notifications
- Real-time notifications synced across top-bar dropdowns and dashboard views.
- Direct route navigation (e.g., clicking a credit notification opens the target project; clicking a report notification opens the Admin moderation tab).
- Manual notification removal controls on all views.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Lightning-fast component-driven UI |
| **Routing** | React Router v6 | Client-side dynamic route management |
| **Styling** | Custom Dark Theme CSS | HSL-tailored colors, smooth glassmorphism |
| **Icons** | Custom SVG Icon Registry | Scalable, lightweight vector graphics |
| **Backend** | Node.js, Express.js | Modular REST API server architecture |
| **Data Layer** | Custom DataStore & SQL | Flexible JSON persistent store with PostgreSQL schema |
| **HTTP Client** | Axios | Intercepted asynchronous backend requests |

---

## 📂 Project Architecture

```
Student_Project_Repository_Platform/
├── client/                      # Frontend Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # Layout, Header, Navigation, Modals & Icons
│   │   ├── context/            # AuthContext & AppState Context Providers
│   │   ├── pages/              # Dashboard, Projects, Leaderboard, Reviews, Profile, Admin
│   │   ├── services/           # Axios API configuration
│   │   └── styles/             # Core CSS Design System & Global Styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend REST API Server (Node.js + Express)
│   ├── config/                 # Environment & Server configuration
│   ├── controllers/            # Route business logic (Projects, Reviews, Auth, Admin)
│   ├── database/               # PostgreSQL Database Schema (`schema.sql`)
│   ├── middleware/             # Role authorization & request validation
│   ├── routes/                 # Express API Endpoint definitions
│   ├── services/               # Data persistence layer (`dataStore.js`)
│   ├── uploads/                # File storage directory
│   ├── package.json
│   └── server.js               # Application entry point
│
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/ragul-rakav/Student-Project-Repository-Platform.git
cd Student-Project-Repository-Platform
```

### 2. Setup & Launch Server (Backend)
```bash
cd server
npm install
npm start
```
*The backend API will start on `http://localhost:5000`.*

### 3. Setup & Launch Client (Frontend)
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*The React application will open on `http://localhost:5173`.*

---

## 📡 API Endpoint Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | All | Fetch projects (supports sorting by `popular`, `latest`, `views`, `credits`) |
| `POST` | `/api/projects` | Student | Submit new project for faculty review |
| `POST` | `/api/projects/:id/report` | All | Submit structured content violation report |
| `GET` | `/api/reviews` | Faculty / Admin | Fetch pending project review queue |
| `POST` | `/api/reviews/action` | Faculty / Admin | Approve or reject submitted project |
| `GET` | `/api/leaderboard` | All | Fetch student rankings & credit standings |
| `GET` | `/api/admin/reports` | Admin | Fetch moderation queue of reported content |
| `DELETE` | `/api/admin/projects/:id` | Admin | Super-user content removal |
| `DELETE` | `/api/admin/notifications/:id` | All | Remove notification entry |

---

## 🤝 Contributing

Contributions are always welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide before opening pull requests or feature suggestions.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">
  <sub>Built with ❤️ by Ragul Rakav & The Student Project Repository Team</sub>
</div>