# Comprehensive Project Report
## Student Project Repository and Showcase Platform
**TechNova Software Hackathon** | **Team Name**: Codexx

---

## Executive Summary
The **Student Project Repository and Showcase Platform** is a full-stack digital ecosystem designed to streamline academic project submissions, automate domain-specific faculty evaluations, facilitate peer collaboration, and motivate student innovation through a gamified Credit Point System and access control policy.

---

## 1. Problem Statement & Motivation
Educational institutions frequently suffer from fragmented and manual project management workflows. Project submissions, guide requests, evaluations, and archiving rely heavily on emails, physical paper forms, or unorganized spreadsheets. This leads to several major drawbacks:
1. **Inefficient Faculty Review**: Manual distribution leads to faculty workload imbalance and delayed feedback.
2. **Underutilized Student Work**: High-quality projects are archived into offline folders and rarely reused or showcased.
3. **Lack of Student Motivation**: Without structured recognition or peer visibility, students treat projects as passive academic requirements rather than opportunities for technical growth.
4. **Lack of Repository Access Control**: Open access without contribution requirements leads to plagiarism or passive consumption without contribution.

---

## 2. Proposed System & Technical Solution
Our platform digitizes the entire project lifecycle with four core pillars:

1. **Structured Project Submissions**:
   - **Internal Academic Projects**: Auto-assigned to eligible faculty members based on domain expertise and availability limits.
   - **External Showcase Projects**: Mentorship guide requests routed to specialized faculty.
   - **Idea Showcase**: Rapid publishing of early-stage project concepts.
   - **Predefined & Custom Domains**: Predefined list (`Machine Learning`, `Web Development`, `Mobile Development`, `Blockchain`, `IoT`, `Cybersecurity`, `Cloud Computing`) with a custom domain verification workflow for emerging topics.

2. **Automated & Confidential Faculty Workload Balancing**:
   - Algorithms evaluate faculty domain specializations and pending evaluation queues against max pending thresholds.
   - Assigned faculty reviewer identities are redacted from student views to prevent review bias.

3. **Gamified Credit Point System & Repository Access Tiers**:
   - Students earn credits for approved projects (+10 to +25), published ideas (+5 to +10), peer enhancements (+10), and engagement (1 credit per 10 likes).
   - Repository access is controlled via credit tiers (Idea Tier: 60 credits, Internal Tier: 100 credits, External Tier: 200 credits), requiring a minimum floor of 3 approved projects.

4. **Peer Collaboration & Moderation System**:
   - Students can propose enhancements or extensions to existing projects.
   - Violation reporting routes reports to domain faculty with mandatory written investigation remarks and a -5 credit penalty for fake/invalid reports.

---

## 3. System Architecture & Technical Implementation

```text
+-------------------------------------------------------------------+
|                     PRESENTATION LAYER (Client)                   |
|  React.js (Vite) + Vanilla CSS Glassmorphism + React Router DOM  |
+-------------------------------------------------------------------+
                                  │  REST API / JSON
                                  ▼
+-------------------------------------------------------------------+
|                    APPLICATION LAYER (Server)                     |
| Node.js + Express.js + JWT Auth + Multer Engine + Workload Engine |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|                      DATABASE LAYER (Data)                        |
|   PostgreSQL Relational DB (schema.sql / seed.sql) + In-Memory    |
+-------------------------------------------------------------------+
```

### Key Modules Implemented:
- `server/controllers/projectController.js`: Handles submission, domain verification queueing, file uploads via Multer, automated reviewer assignment, likes, and comments.
- `server/controllers/reviewController.js`: Manages faculty evaluation queues, feedback comments, project approval/rejection, and credit awards.
- `server/controllers/adminController.js`: Provides institutional analytics, user directory governance, custom domain approval, and moderation queues.
- `server/services/dataStore.js`: Implements dataset management, workload threshold algorithms, credit history logging, and automated matching.

---

## 4. Experimental Results & Key Outcomes
- **Sub-3-Second Page Loads**: Optimized React client architecture with instant feedback toasts.
- **Zero Evaluation Overload**: Faculty workload thresholds ensure no single professor is overwhelmed with pending reviews.
- **Transparent Accountability**: Audit log records every credit transaction (+25, +20, +10, -5) with timestamps and titles.
- **Authentic Demonstration Datasets**: Includes authentic Tamil student and faculty profiles (*Kavitha Sundaram*, *Karthik Raja*, *Dr. Arumugam Pillai*, *Dr. Senthamizhan V*) with pre-configured credit locks and domain specializations.

---

## 5. Team Contributions (Team Codexx)
- **Aarthi S (Team Lead - 7376241CS102)**: Overall project coordination, SRS documentation, system architecture design, and database schema definition.
- **Swathi S (Member 1 - 7376241CS427)**: Frontend component development, glassmorphism UI design, leaderboard, and profile management views.
- **Abishek R (Member 2 - 7376241CS111)**: Backend API routes, JWT authentication, Express controllers, and review evaluation workflow.
- **K S Ragul Rakav (Member 3 - 7376241CS221)**: Automated faculty assignment algorithm, custom domain verification flow, file upload integration, and test verification.
