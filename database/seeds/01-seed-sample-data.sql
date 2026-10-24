-- ========================================================
-- Seed Data for Development & Testing
-- ========================================================

INSERT INTO skills (name, category) VALUES
('React', 'Frontend'),
('TypeScript', 'Programming Language'),
('Node.js', 'Backend'),
('PostgreSQL', 'Database'),
('Docker', 'DevOps'),
('UI/UX Design', 'Design'),
('Python', 'Backend')
ON CONFLICT (name) DO NOTHING;
