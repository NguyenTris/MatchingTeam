import Link from "next/link";
import { Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-navy-900 to-primary text-white shadow-md shadow-primary/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-foreground">Matching<span className="text-primary font-bold">Team</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1.5 text-primary font-semibold">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/projects/create" className="hover:text-foreground transition-colors">Tạo Dự Án</Link>
          <Link href="/workspace/team-alpha" className="hover:text-foreground transition-colors">Kanban Board</Link>
          <Link href="http://localhost:8000/docs" target="_blank" className="hover:text-foreground transition-colors">FastAPI Docs</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
          >
            <span>Vào Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
