<div align="center">

# 🎓 Student Project Repository and Showcase Platform
### TechNova Software Hackathon Deliverable | Team Codexx

**An All-in-One Campus Academic Portfolio, Peer Collaboration & Automated Project Governance Platform**

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Server-Express%204.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

### 🌐 Live Application Deployment Link
- **Live Platform URL**: [https://student-project-repository-platform.vercel.app](https://student-project-repository-platform.vercel.app)
- **GitHub Repository**: [https://github.com/ragul-rakav/Student-Project-Repository-Platform](https://github.com/ragul-rakav/Student-Project-Repository-Platform)

</div>

---

## 👥 Team Details (Team Codexx)

| Role | Member Name | Register Number | Email |
| :--- | :--- | :--- | :--- |
| **Team Lead** | **Aarthi S** | `7376241CS102` | `aarthis.cs24@bitsathy.ac.in` |
| **Member 1** | **Swathi S** | `7376241CS427` | `swathis.cs24@bitsathy.ac.in` |
| **Member 2** | **Abishek R** | `7376241CS111` | `abishekr.cs24@bitsathy.ac.in` |
| **Member 3** | **K S Ragul Rakav** | `7376241CS221` | `ksragulrakav.cs24@bitsathy.ac.in` |

*For complete team member details, see [`TEAM_DETAILS.md`](TEAM_DETAILS.md).*

---

## 📁 Repository Deliverables Index

- 📄 **Software Requirements Specification**: [`SRS.md`](SRS.md)
- 📑 **Full SRS Documentation PDF**: [`docs/Student_Project_Repository_SRS_Documentation.pdf`](docs/Student_Project_Repository_SRS_Documentation.pdf)
- 📊 **Comprehensive Project Report**: [`PROJECT_REPORT.md`](PROJECT_REPORT.md)
- 👥 **Team Details Specification**: [`TEAM_DETAILS.md`](TEAM_DETAILS.md)
- 🗄️ **Database Schema SQL Script**: [`server/database/schema.sql`](server/database/schema.sql)
- 💾 **Database Seed Sample Data**: [`server/database/seed.sql`](server/database/seed.sql)
- 🖼️ **Diagram Assets**: ER Diagram ([`docs/assets/er-diagram.png`](docs/assets/er-diagram.png)), System Workflow ([`docs/assets/system-workflow.png`](docs/assets/system-workflow.png)), UI Sketches ([`docs/assets/ui-sketches-overview.png`](docs/assets/ui-sketches-overview.png))

---

## ✨ Key Platform Features

### 🔐 1. Multi-Role Authentication & Access Control
- **Student Tier**: Submit internal/external projects and ideas, earn credit points, access unlocked project repositories based on earned tiers, and engage with peer submissions.
- **Faculty Tier**: Inspect project specifications (abstract, tech stack, documentation, PPTs, videos, files) before approval, evaluate reviews, accept guide requests, and investigate violation reports.
- **Administrator Governance**: Institutional metrics dashboard, user account management (add/remove students & faculty), custom domain verification, and moderation controls.

### 🤖 2. Workload-Balanced Automated Reviewer Assignment
- Automatically matches newly submitted internal projects with eligible active faculty based on domain expertise.
- Enforces workload capacity thresholds per faculty member to prevent review overload.
- Redacts reviewer identities on student views to guarantee unbiased evaluations.

### ⚡ 3. Predefined & Custom Domain Verification
- Predefined domains: `Machine Learning`, `Web Development`, `Mobile Development`, `Blockchain`, `Internet of Things`, `Cybersecurity`, `Cloud Computing`.
- Custom domain requests (`Other`) trigger a greyed-out pending state (`⏳ Domain Approval Pending`) until verified by Administrators.

### 🏆 4. Gamified Credit Points & Tiered Access
- Earn credits for project approvals (+10 to +25), published ideas (+5 to +10), peer enhancements (+10), and project likes (1 credit per 10 likes).
- Access control tiers:
  - **Idea Repository**: $\ge$ 60 credits
  - **Internal Projects**: $\ge$ 100 credits
  - **External Projects**: $\ge$ 200 credits (minimum 3 approved projects floor)

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/ragul-rakav/Student-Project-Repository-Platform.git
cd Student-Project-Repository-Platform
```

### 2. Backend Setup (`server`)
```bash
cd server
npm install
# Configure PostgreSQL environment in .env
npm run dev
```

### 3. Frontend Setup (`client`)
```bash
cd ../client
npm install
npm run dev
```

---

## 📄 License
This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.