-- PostgreSQL Database Schema for Student Project Repository and Showcase Platform

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Student', 'Faculty', 'Administrator')),
    status VARCHAR(50) DEFAULT 'Active',
    dept VARCHAR(255) NOT NULL,
    academic_year VARCHAR(100) DEFAULT '—',
    credits INT DEFAULT 0,
    approved_projects INT DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    domain_of_interest VARCHAR(255) DEFAULT '',
    initials VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Internal', 'External', 'Idea')),
    status VARCHAR(50) CHECK (status IN ('In Review', 'Pending Guide', 'Guide Declined', 'Approved', NULL)),
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    dept VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    abstract TEXT,
    description TEXT,
    github_url TEXT,
    doc_url TEXT,
    ppt_url TEXT,
    cert_url TEXT,
    demo_url TEXT,
    vercel_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_files (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_collaborators (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_comments (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_likes (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS review_queue (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    submitted_at VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    faculty_name VARCHAR(255) NOT NULL,
    is_enhancement BOOLEAN DEFAULT FALSE,
    enhancement_title VARCHAR(255),
    details TEXT,
    code_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guide_requests (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    faculty_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    requested_at VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration_requests (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    requester_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Declined')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    email_or_role VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repository_tiers (
    id SERIAL PRIMARY KEY,
    tier_name VARCHAR(50) UNIQUE NOT NULL,
    min_credits_required INT NOT NULL,
    min_projects_required INT DEFAULT 3
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(dept);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits DESC);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_name);
CREATE INDEX IF NOT EXISTS idx_projects_dept ON projects(dept);
