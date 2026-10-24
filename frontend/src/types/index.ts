export interface User {
  id: number;
  email: string;
  full_name: string;
  bio?: string;
  skills: string[];
  github_url?: string;
  linkedin_url?: string;
  is_active: boolean;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  target_hackathon?: string;
  max_members: number;
  required_skills: string[];
  leader_id: number;
  status: 'recruiting' | 'full' | 'closed';
}

export interface MatchResult {
  team: Team;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  reasoning: string;
}
