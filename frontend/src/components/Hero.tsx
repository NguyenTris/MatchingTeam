import { ArrowRight, Bot, Code2, Users2, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-md">
        <Cpu className="h-3.5 w-3.5" />
        <span>Next.js 15 App Router & Python FastAPI Backend</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Ghép Đội Ngũ Hackathon & Startup <br />
        <span className="gradient-text">Chính Xác & Tức Thì</span>
      </h1>

      <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
        Nền tảng kết nối lập trình viên, designer và founders thông minh. Tự động đề xuất đồng đội lý tưởng dựa trên bộ kỹ năng, vai trò và mục tiêu dự án.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="#explore"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 transition-all"
        >
          <span>Khám phá thuật toán ghép đội</span>
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
        >
          <Code2 className="h-4 w-4 text-emerald-400" />
          <span>FastAPI Swagger Docs</span>
        </a>
      </div>

      {/* Stats counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/10">
        <div>
          <div className="text-3xl font-bold text-white">99.8%</div>
          <div className="text-xs text-slate-400 mt-1">Độ chính xác ghép kỹ năng</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-indigo-400">&lt; 50ms</div>
          <div className="text-xs text-slate-400 mt-1">Tốc độ phản hồi FastAPI</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-violet-400">100%</div>
          <div className="text-xs text-slate-400 mt-1">TypeScript & Type-Safe</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-pink-400">Dockerized</div>
          <div className="text-xs text-slate-400 mt-1">Sẵn sàng triển khai 1-click</div>
        </div>
      </div>
    </section>
  );
}
