import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Users, Sparkles, CheckCircle2, ArrowUpRight, Github } from "lucide-react";

export default function Home() {
  const sampleTeams = [
    {
      id: 1,
      name: "AI Agents Innovators",
      event: "Gemini AI Global Challenge",
      role: "Backend Engineer Needed",
      skills: ["FastAPI", "Python", "LangChain", "PostgreSQL"],
      matchRate: 96,
      leader: "Nguyễn Văn A",
    },
    {
      id: 2,
      name: "Nexus Web3 Matching",
      event: "ETH Vietnam 2026",
      role: "Frontend Engineer Needed",
      skills: ["Next.js", "TypeScript", "Tailwind CSS"],
      matchRate: 92,
      leader: "Trần Thị B",
    },
    {
      id: 3,
      name: "EduTech Copilot",
      event: "EdTech Asia Summit",
      role: "Fullstack Developer Needed",
      skills: ["Next.js", "FastAPI", "Docker", "Tailwind"],
      matchRate: 88,
      leader: "Lê Hoàng C",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Hero />
        
        {/* Live Matching Demo Section */}
        <section id="explore" className="py-12 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Matching Preview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Đội Ngũ Đang Tuyển Thành Viên</h2>
            </div>
            <span className="text-xs text-slate-400">Kết nối trực tiếp qua Backend API: <code className="text-indigo-300 font-mono">/api/v1/matching/recommend</code></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleTeams.map((team) => (
              <div
                key={team.id}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {team.event}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {team.matchRate}% Tương thích
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                  <p className="text-sm text-indigo-300 font-medium mb-4">{team.role}</p>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs text-slate-400 font-medium">Kỹ năng yêu cầu:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {team.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-200 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Trưởng nhóm: <span className="text-white font-medium">{team.leader}</span>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    <span>Ứng tuyển</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FeatureGrid />
      </main>

      <footer className="border-t border-white/10 bg-[#070a11] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 MatchingTeam. Next.js App Router + Python FastAPI Monorepo.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Github className="h-4 w-4" />
              <span>GitHub Repository</span>
            </a>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Swagger API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
