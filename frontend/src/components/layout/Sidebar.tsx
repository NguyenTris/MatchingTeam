"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderPlus,
  Kanban,
  Sparkles,
  LogOut,
  FolderGit2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const navItems = [
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Tạo dự án mới",
    href: "/projects/create",
    icon: FolderPlus,
    badge: "Mới",
  },
  {
    title: "Không gian làm việc",
    href: "/workspace/team-alpha",
    icon: Kanban,
    badge: null,
  },
];

const sampleProjects = [
  { id: "p1", name: "AI Vision Copilot", code: "CS402", color: "bg-blue-500" },
  { id: "p2", name: "FinTech Hub 2026", code: "IS301", color: "bg-indigo-500" },
  { id: "p3", name: "EduMatch Engine", code: "SE405", color: "bg-cyan-500" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useSupabaseAuth();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-navy-900 via-primary to-pastelBlue-400 text-white shadow-md shadow-primary/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-none text-foreground font-extrabold tracking-tight">
              Matching<span className="text-primary font-bold">Team</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Workspace Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Chính
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant={isActive ? "secondary" : "pastel"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Projects List */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Dự Án Đang Tham Gia
            </span>
            <Link
              href="/projects/create"
              className="text-[11px] text-primary hover:underline font-medium"
            >
              + Thêm
            </Link>
          </div>
          <div className="space-y-1">
            {sampleProjects.map((p) => (
              <Link
                key={p.id}
                href="/workspace/team-alpha"
                onClick={onClose}
                className="flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={cn("h-2 w-2 rounded-full", p.color)} />
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/80 font-mono">
                  {p.code}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* User Mini Profile Footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between rounded-lg p-2 hover:bg-accent transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-9 w-9 ring-1 ring-primary/20">
              <AvatarImage src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} />
              <AvatarFallback>{user?.full_name ? user.full_name[0] : "U"}</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <div className="text-xs font-semibold text-foreground truncate">
                {user?.full_name || "Lê Hoàng Nam"}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {user?.email || "nam.le@matchingteam.dev"}
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            title="Đăng xuất"
            className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
