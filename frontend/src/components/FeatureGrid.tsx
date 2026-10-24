import { Cpu, Zap, ShieldCheck, Database, Layers, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Thuật toán Ghép Thông Minh",
    desc: "Tính toán độ tương thích Jaccard & Vector similarity giữa kỹ năng của ứng viên và vị trí còn thiếu của đội thi.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Cpu,
    title: "Python FastAPI Hiệu Năng Cao",
    desc: "Backend bất đồng bộ (Async/Await) chuẩn xác, tự động sinh tài liệu OpenAPI Swagger và ReDoc tức thì.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Layers,
    title: "Next.js App Router & Tailwind CSS",
    desc: "Server-side rendering, React Server Components (RSC), tối ưu SEO và bundle size cực nhỏ.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Database,
    title: "PostgreSQL & Async SQLAlchemy",
    desc: "Lưu trữ dữ liệu quan hệ mạnh mẽ, hỗ trợ kết nối Connection Pooling và migration dễ dàng qua Alembic.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Bảo Mật Chuẩn Doanh Nghiệp",
    desc: "JWT Auth Bearer tokens, băm mật khẩu chuẩn Bcrypt an toàn tuyệt đối và phân quyền role-based chặt chẽ.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "1-Click Docker Deployment",
    desc: "Đóng gói toàn bộ Frontend, Backend, Database và Reverse Proxy Nginx sẵn sàng chạy chỉ với 1 lệnh compose.",
    gradient: "from-rose-500 to-red-500",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">Kiến Trúc & Tính Năng Vượt Trội</h2>
        <p className="text-slate-400 mt-2">Được thiết kế từ gốc để chịu tải lớn và phát triển tính năng cực nhanh.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-tr ${feat.gradient} text-white mb-4 shadow-lg shadow-indigo-500/10`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
