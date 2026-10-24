"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const { user, signOut } = useSupabaseAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Tìm kiếm dự án, kỹ năng, đồng đội..."
            className="w-full pl-9 pr-12 h-9 bg-background/60 focus-visible:bg-background rounded-lg border-border"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Theme Toggle & User Avatar Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Realtime Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
          title="Thông báo mới"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
          <span className="sr-only">Thông báo</span>
        </Button>

        {/* Theme Toggle (Dark / Light mode) */}
        <ThemeToggle />

        {/* User Avatar with Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all p-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                  alt={user?.full_name || "User"}
                />
                <AvatarFallback>{user?.full_name ? user.full_name[0] : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {user?.full_name || "Lê Hoàng Nam"}
                  </p>
                  <Badge variant="pastel" className="text-[9px] px-1 py-0">
                    {user?.role || "Sinh viên"}
                  </Badge>
                </div>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "nam.le@matchingteam.dev"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Hồ sơ năng lực</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Cài đặt tài khoản</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Trợ giúp & Hướng dẫn</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
