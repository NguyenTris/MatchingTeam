-- ==============================================================================
-- Matching Team - Complete Database Schema for Supabase (PostgreSQL)
-- Features:
--   - Tables: profiles, projects, teams, team_members, tasks, feedbacks
--   - Enums: project_status, team_member_status, task_status
--   - Row Level Security (RLS) with optimized SECURITY DEFINER helper functions
--   - Realtime enabled for `teams` and `tasks`
--   - Automated Profile generation trigger on Supabase Auth sign-up
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & ENUMS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum: Project Status
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('OPEN', 'MATCHING', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Enum: Team Member Status
DO $$ BEGIN
    CREATE TYPE team_member_status AS ENUM ('INVITED', 'ACCEPTED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Enum: Task Status
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABLES CREATION
-- ------------------------------------------------------------------------------

-- 2.1 Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_roles TEXT[] NOT NULL DEFAULT '{}',
    availability_schedule JSONB NOT NULL DEFAULT '{"weekdays": [], "hours_per_day": 0}'::jsonb,
    commitment_hours INT NOT NULL DEFAULT 10 CHECK (commitment_hours >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course_code VARCHAR(50) NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    target_member_count INT NOT NULL DEFAULT 4 CHECK (target_member_count > 0),
    status project_status NOT NULL DEFAULT 'OPEN',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Đội mới',
    status TEXT NOT NULL DEFAULT 'RECRUITING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_role TEXT NOT NULL DEFAULT 'Thành viên',
    status team_member_status NOT NULL DEFAULT 'INVITED',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(team_id, user_id)
);

-- 2.5 Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    status task_status NOT NULL DEFAULT 'TODO',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 Feedbacks Table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    on_time_score INT NOT NULL CHECK (on_time_score BETWEEN 1 AND 100),
    communication_score INT NOT NULL CHECK (communication_score BETWEEN 1 AND 100),
    contribution_score INT NOT NULL CHECK (contribution_score BETWEEN 1 AND 100),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_peer_review_per_team UNIQUE (team_id, reviewer_id, reviewee_id),
    CONSTRAINT cannot_review_self CHECK (reviewer_id <> reviewee_id)
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR HIGH QUERY PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_projects_course_code ON public.projects(course_code);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_teams_project_id ON public.teams(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON public.tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_team_id ON public.feedbacks(team_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_reviewer ON public.feedbacks(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_reviewee ON public.feedbacks(reviewee_id);

-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC TIMESTAMPS & USER SYNC TRIGGERS
-- ------------------------------------------------------------------------------

-- 4.1 Trigger function: update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4.2 Trigger function: Automatically create profile when user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5. RLS HELPER FUNCTIONS (SECURITY DEFINER to avoid infinite recursion)
-- ------------------------------------------------------------------------------

-- Check if user is an accepted member of a given team
CREATE OR REPLACE FUNCTION public.is_team_member(_team_id UUID, _user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.team_members
        WHERE team_id = _team_id
          AND user_id = _user_id
          AND status = 'ACCEPTED'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is a member of any team in a project or is the project creator
CREATE OR REPLACE FUNCTION public.is_project_participant(_project_id UUID, _user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user created the project
    IF EXISTS (SELECT 1 FROM public.projects WHERE id = _project_id AND created_by = _user_id) THEN
        RETURN TRUE;
    END IF;

    -- Check if user is in an accepted team within the project
    RETURN EXISTS (
        SELECT 1
        FROM public.teams t
        JOIN public.team_members tm ON tm.team_id = t.id
        WHERE t.project_id = _project_id
          AND tm.user_id = _user_id
          AND tm.status = 'ACCEPTED'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 6.1 PROFILES POLICIES
-- ==============================================================================

-- Anyone authenticated can view profiles (to discover teammates & skills)
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can only insert or update their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- 6.2 PROJECTS POLICIES
-- ==============================================================================

-- Students can view projects that are OPEN/MATCHING, or projects they are participating in
CREATE POLICY "Students can view open or participating projects"
    ON public.projects
    FOR SELECT
    TO authenticated
    USING (
        status IN ('OPEN', 'MATCHING')
        OR public.is_project_participant(id, auth.uid())
    );

-- Authenticated users (teachers/students) can create projects
CREATE POLICY "Authenticated users can create projects"
    ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Only project creator can update the project
CREATE POLICY "Project creator can update project"
    ON public.projects
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- ==============================================================================
-- 6.3 TEAMS POLICIES
-- ==============================================================================

-- Students can view teams if the project is open for matching OR if they participate in the project
CREATE POLICY "Students can view teams of matching or participating projects"
    ON public.teams
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = teams.project_id
              AND (p.status IN ('OPEN', 'MATCHING') OR public.is_project_participant(p.id, auth.uid()))
        )
    );

-- Students can create a team in an open project
CREATE POLICY "Students can create teams in open projects"
    ON public.teams
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
              AND p.status IN ('OPEN', 'MATCHING')
        )
    );

-- Only team members can update their own team's details
CREATE POLICY "Team members can update their team"
    ON public.teams
    FOR UPDATE
    TO authenticated
    USING (public.is_team_member(id, auth.uid()))
    WITH CHECK (public.is_team_member(id, auth.uid()));

-- ==============================================================================
-- 6.4 TEAM MEMBERS POLICIES
-- ==============================================================================

-- Students can view members of teams in open projects or teams they participate in
CREATE POLICY "Students can view team members in accessible projects"
    ON public.team_members
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1
            FROM public.teams t
            JOIN public.projects p ON p.id = t.project_id
            WHERE t.id = team_members.team_id
              AND (p.status IN ('OPEN', 'MATCHING') OR public.is_project_participant(p.id, auth.uid()))
        )
    );

-- Team members can invite other students, or a student can register themselves into a team
CREATE POLICY "Users can join or invite to teams"
    ON public.team_members
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- User adding themselves as initial member
        user_id = auth.uid()
        -- Or an existing accepted team member inviting someone
        OR public.is_team_member(team_id, auth.uid())
    );

-- A student can accept an invite for themselves, or team members can manage roles
CREATE POLICY "Users can accept invite or team members update role"
    ON public.team_members
    FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid()
        OR public.is_team_member(team_id, auth.uid())
    )
    WITH CHECK (
        user_id = auth.uid()
        OR public.is_team_member(team_id, auth.uid())
    );

-- A student can leave a team, or team members can remove a member
CREATE POLICY "Users can leave or be removed from team"
    ON public.team_members
    FOR DELETE
    TO authenticated
    USING (
        user_id = auth.uid()
        OR public.is_team_member(team_id, auth.uid())
    );

-- ==============================================================================
-- 6.5 TASKS POLICIES (Scoped strictly to student's team)
-- ==============================================================================

-- Students can ONLY view tasks of their own teams
CREATE POLICY "Team members can view their tasks"
    ON public.tasks
    FOR SELECT
    TO authenticated
    USING (public.is_team_member(team_id, auth.uid()));

-- Students can ONLY create tasks for their own teams
CREATE POLICY "Team members can create tasks"
    ON public.tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_team_member(team_id, auth.uid()));

-- Students can update tasks in their own teams
CREATE POLICY "Team members can update their tasks"
    ON public.tasks
    FOR UPDATE
    TO authenticated
    USING (public.is_team_member(team_id, auth.uid()))
    WITH CHECK (public.is_team_member(team_id, auth.uid()));

-- Students can delete tasks in their own teams
CREATE POLICY "Team members can delete their tasks"
    ON public.tasks
    FOR DELETE
    TO authenticated
    USING (public.is_team_member(team_id, auth.uid()));

-- ==============================================================================
-- 6.6 FEEDBACKS POLICIES (Peer reviews within the team)
-- ==============================================================================

-- Students can view feedbacks in their team where they are the reviewer or reviewee
CREATE POLICY "Team members can view their own peer feedbacks"
    ON public.feedbacks
    FOR SELECT
    TO authenticated
    USING (
        reviewer_id = auth.uid()
        OR reviewee_id = auth.uid()
        OR public.is_team_member(team_id, auth.uid())
    );

-- Students can ONLY submit feedback for teammates in their same team
CREATE POLICY "Team members can submit peer reviews"
    ON public.feedbacks
    FOR INSERT
    TO authenticated
    WITH CHECK (
        reviewer_id = auth.uid()
        AND reviewer_id <> reviewee_id
        AND public.is_team_member(team_id, reviewer_id)
        AND public.is_team_member(team_id, reviewee_id)
    );

-- Reviewers can modify their submitted feedback
CREATE POLICY "Reviewer can update their submitted feedback"
    ON public.feedbacks
    FOR UPDATE
    TO authenticated
    USING (reviewer_id = auth.uid())
    WITH CHECK (
        reviewer_id = auth.uid()
        AND reviewer_id <> reviewee_id
        AND public.is_team_member(team_id, reviewer_id)
        AND public.is_team_member(team_id, reviewee_id)
    );

-- ==============================================================================
-- 7. SUPABASE REALTIME CONFIGURATION
-- ==============================================================================

-- Set REPLICA IDENTITY FULL so Realtime broadcasts the entire previous record on UPDATE and DELETE
ALTER TABLE public.teams REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;

-- Add teams and tasks to Supabase Realtime publication
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
