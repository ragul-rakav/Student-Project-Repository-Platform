-- PostgreSQL Seed Data

-- Insert Departments
INSERT INTO departments (name) VALUES 
('Computer Science'),
('Information Technology'),
('Electronics'),
('Mechanical')
ON CONFLICT (name) DO NOTHING;

-- Insert Repository Tiers
INSERT INTO repository_tiers (tier_name, min_credits_required, min_projects_required) VALUES
('No Repository Access', 0, 3),
('Idea Repository', 60, 3),
('Internal Projects', 100, 3),
('External Projects', 200, 3)
ON CONFLICT (tier_name) DO NOTHING;
