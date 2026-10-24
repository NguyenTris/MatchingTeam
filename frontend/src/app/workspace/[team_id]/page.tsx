"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Kanban,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  Users2,
  Sparkles,
  Radio,
  Calendar,
  MessageSquare,
  Check
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "Cao" | "Trung bình" | "Thấp";
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
}

export default function TeamWorkspacePage() {
  const params = useParams();
  const teamId = (params?.team_id as string) || "team-alpha";

  // Realtime tasks state
  const [tasks, setTasks] = React.useState<TaskItem[]>([
    {
      id: "task-1",
      title: "Thiết kế cơ sở dữ liệu PostgreSQL & Supabase RLS",
      description: "Tạo file schema.sql với profiles, projects, teams, tasks, feedbacks và RLS policies.",
      status: "DONE",
      priority: "Cao",
      dueDate: "26/10/2026",
      assignee: {
        name: "Lê Hoàng Nam",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      },
    },
    {
      id: "task-2",
      title: "Xây dựng Backend REST API bằng FastAPI",
      description: "Tích hợp Pydantic v2 schemas, endpoints auth, users, teams và thuật toán matching.",
      status: "DONE",
      priority: "Cao",
      dueDate: "27/10/2026",
      assignee: {
        name: "Minh Tuấn",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
    },
    {
      id: "task-3",
      title: "Tích hợp shadcn/ui & Theme Light/Dark Mode",
      description: "Cấu hình Next.js App Router, Tailwind Navy pastel theme và Global Layout.",
      status: "IN_PROGRESS",
      priority: "Cao",
      dueDate: "29/10/2026",
      assignee: {
        name: "Lê Hoàng Nam",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      },
    },
    {
      id: "task-4",
      title: "Cấu hình Supabase Realtime Channels cho Tasks",
      description: "Lắng nghe postgres_changes trên bảng tasks để tự động cập nhật Kanban mà không cần reload.",
      status: "IN_PROGRESS",
      priority: "Trung bình",
      dueDate: "02/11/2026",
      assignee: {
        name: "Hương Giang",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
    },
    {
      id: "task-5",
      title: "Viết module đánh giá chéo thành viên (Feedbacks)",
      description: "Thang điểm 1-100 cho on_time_score, communication_score, contribution_score.",
      status: "TODO",
      priority: "Trung bình",
      dueDate: "08/11/2026",
      assignee: {
        name: "Minh Tuấn",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
    },
    {
      id: "task-6",
      title: "Kiểm thử Docker Compose và triển khai máy chủ Nginx",
      description: "Kiểm tra reverse proxy chuyển luồng giữa frontend:3000 và backend:8000.",
      status: "TODO",
      priority: "Thấp",
      dueDate: "14/11/2026",
      assignee: {
        name: "Hương Giang",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
    },
  ]);

  // Dialog State for adding new Task
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newStatus, setNewStatus] = React.useState<TaskStatus>("TODO");
  const [newPriority, setNewPriority] = React.useState<"Cao" | "Trung bình" | "Thấp">("Cao");
  const [newDueDate, setNewDueDate] = React.useState("2026-11-15");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      status: newStatus,
      priority: newPriority,
      dueDate: newDueDate,
      assignee: {
        name: "Lê Hoàng Nam",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      },
    };

    setTasks([newTask, ...tasks]);
    setNewTitle("");
    setNewDescription("");
    setIsDialogOpen(false);
  };

  const moveTask = (taskId: string, targetStatus: TaskStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
  };

  const columns: { id: TaskStatus; title: string; count: number; color: string }[] = [
    {
      id: "TODO",
      title: "Cần Thực Hiện",
      count: tasks.filter((t) => t.status === "TODO").length,
      color: "border-t-blue-500",
    },
    {
      id: "IN_PROGRESS",
      title: "Đang Triển Khai",
      count: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      color: "border-t-amber-500",
    },
    {
      id: "DONE",
      title: "Đã Hoàn Thành",
      count: tasks.filter((t) => t.status === "DONE").length,
      color: "border-t-emerald-500",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header & Team Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="font-mono text-[10px]">
                CS402
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-mono">Team ID: {teamId}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Realtime Đang Hoạt Động</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Bảng Kanban Quản Trị Công Việc</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Dự án: <strong className="text-foreground">AI Multi-Agent Copilot & Team Matching</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Team Members List */}
            <div className="hidden sm:flex items-center -space-x-2 border-r border-border pr-4 mr-1">
              <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
                <AvatarFallback>LN</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                <AvatarFallback>HG</AvatarFallback>
              </Avatar>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground border-2 border-background">
                +1
              </div>
            </div>

            {/* Dialog Trigger to Create Task */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 font-semibold shadow-sm">
                  <Plus className="h-4 w-4" />
                  <span>Tạo Task Mới</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleCreateTask}>
                  <DialogHeader>
                    <DialogTitle className="text-lg">Thêm Công Việc Mới</DialogTitle>
                    <DialogDescription className="text-xs">
                      Công việc mới sẽ được lưu vào bảng <code>tasks</code> và đồng bộ thời gian thực qua Realtime.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Tiêu đề công việc <span className="text-destructive">*</span>
                      </label>
                      <Input
                        required
                        placeholder="VD: Viết Unit Test cho Matching Algorithm"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Chi tiết yêu cầu
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border border-input bg-background p-2.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Mô tả các tiêu chí nghiệm thu, link tài liệu hoặc Figma..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Cột trạng thái
                        </label>
                        <Select
                          value={newStatus}
                          onValueChange={(val) => setNewStatus(val as TaskStatus)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TODO">Cần Làm (TODO)</SelectItem>
                            <SelectItem value="IN_PROGRESS">Đang Làm (IN_PROGRESS)</SelectItem>
                            <SelectItem value="DONE">Hoàn Thành (DONE)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Độ ưu tiên
                        </label>
                        <Select
                          value={newPriority}
                          onValueChange={(val) => setNewPriority(val as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cao">Ưu tiên Cao</SelectItem>
                            <SelectItem value="Trung bình">Trung bình</SelectItem>
                            <SelectItem value="Thấp">Thấp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Hạn chót (Due date)
                      </label>
                      <Input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" size="sm" className="font-semibold">
                      Lưu Công Việc
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Kanban Board Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl bg-card border border-border overflow-hidden shadow-xs"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-border border-t-4 ${col.color} bg-muted/20 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {col.title}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setNewStatus(col.id);
                      setIsDialogOpen(true);
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title={`Thêm task vào cột ${col.title}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Column Tasks Body */}
                <div className="p-3 space-y-3 min-h-[350px]">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 rounded-lg border border-dashed border-border text-center p-4">
                      <span className="text-xs text-muted-foreground">Chưa có công việc nào</span>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="p-3.5 bg-background hover:border-primary/40 transition-all hover:shadow-xs group space-y-2.5"
                      >
                        {/* Task Priority & Due Date */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              task.priority === "Cao"
                                ? "destructive"
                                : task.priority === "Trung bình"
                                ? "pastel"
                                : "secondary"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {task.priority}
                          </Badge>

                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                        {/* Task Title & Description */}
                        <div>
                          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Task Footer: Assignee & Column Mover Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="text-[9px]">
                                {task.assignee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] text-muted-foreground">
                              {task.assignee.name}
                            </span>
                          </div>

                          {/* Quick Stage Transitions */}
                          <div className="flex items-center gap-1">
                            {task.status !== "TODO" && (
                              <button
                                onClick={() => moveTask(task.id, task.status === "DONE" ? "IN_PROGRESS" : "TODO")}
                                title="Chuyển lùi lại"
                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                <ArrowLeft className="h-3 w-3" />
                              </button>
                            )}

                            {task.status !== "DONE" && (
                              <button
                                onClick={() => moveTask(task.id, task.status === "TODO" ? "IN_PROGRESS" : "DONE")}
                                title="Chuyển sang bước tiếp theo"
                                className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
