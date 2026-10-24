"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Users2,
  Calendar,
  Layers,
  Code2,
  CheckCircle2,
  Clock,
  BookOpen
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const commonSkills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Docker",
  "Figma",
  "PyTorch",
  "Supabase",
  "Node.js",
];

const commonRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "UI/UX Designer",
  "AI/ML Engineer",
  "DevOps Engineer",
];

export default function CreateProjectPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = React.useState("");
  const [courseCode, setCourseCode] = React.useState("CS402");
  const [description, setDescription] = React.useState("");
  const [targetMembers, setTargetMembers] = React.useState("4");
  const [deadline, setDeadline] = React.useState("2026-11-30");
  const [commitmentHours, setCommitmentHours] = React.useState("15");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([
    "Next.js",
    "FastAPI",
    "TypeScript",
  ]);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([
    "Frontend Developer",
    "Backend Developer",
  ]);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessDialog(true);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Tạo Dự Án Mới</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pastelBlue-100 text-pastelBlue-900 dark:bg-navy-800 dark:text-pastelBlue-300 px-3 py-1 text-xs font-semibold w-fit">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Đăng ký Đề Tài & Tìm Kiếm Đồng Đội</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Khởi Tạo Dự Án Mới
          </h1>
          <p className="text-sm text-muted-foreground">
            Điền đầy đủ thông tin đề tài để thuật toán Matching tự động đề xuất những thành viên có kỹ năng phù hợp nhất.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span>1. Thông Tin Chung Về Dự Án</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Mô tả chi tiết mục tiêu sản phẩm và môn học tương ứng.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tên dự án / đề tài <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="VD: Hệ Thống Ghép Đội Thông Minh Dựa Trên AI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Mã môn học / Đồ án <span className="text-destructive">*</span>
                  </label>
                  <Select value={courseCode} onValueChange={setCourseCode}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn mã môn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS402">CS402 - Đồ Án Tốt Nghiệp</SelectItem>
                      <SelectItem value="SE330">SE330 - Phát Triển Web Hiện Đại</SelectItem>
                      <SelectItem value="AI502">AI502 - Trí Tuệ Nhân Tạo Ứng Dụng</SelectItem>
                      <SelectItem value="IS301">IS301 - Hệ Thống Thông Tin Doanh Nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Mô tả dự án & mục tiêu nghiên cứu <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Mô tả công nghệ dự kiến sử dụng, kiến trúc hệ thống, vấn đề thực tế cần giải quyết..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>

            <div className="border-t border-border/80 my-2" />

            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users2 className="h-4 w-4 text-primary" />
                <span>2. Yêu Cầu Nhân Sự & Ghép Nhóm</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Số lượng thành viên, hạn chót và những vị trí còn thiếu.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Số thành viên mong muốn
                  </label>
                  <Select value={targetMembers} onValueChange={setTargetMembers}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Số lượng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 người</SelectItem>
                      <SelectItem value="3">3 người</SelectItem>
                      <SelectItem value="4">4 người (Chuẩn)</SelectItem>
                      <SelectItem value="5">5 người</SelectItem>
                      <SelectItem value="6">6 người</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Hạn chót tuyển quân / nộp đồ án
                  </label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Cam kết thời gian (giờ/tuần)
                  </label>
                  <Input
                    type="number"
                    min="5"
                    max="40"
                    value={commitmentHours}
                    onChange={(e) => setCommitmentHours(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Roles selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Vai trò đang cần tìm:
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonRoles.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {role} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills tags selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Bộ kỹ năng ưu tiên (Matching tags):
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          isSelected
                            ? "bg-pastelBlue-500 text-white border-pastelBlue-600 dark:bg-primary dark:border-primary shadow-xs"
                            : "bg-muted/40 text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {skill} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/80 bg-muted/20 py-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline" size="sm">
                  Hủy Bỏ
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" size="sm">
                  Lưu Nháp
                </Button>
                <Button type="submit" size="sm" className="gap-2 font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>Tạo Dự Án & Bắt Đầu Ghép Đội</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>

        {/* Confirmation Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 mb-2">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <DialogTitle className="text-center text-lg">
                Tạo Dự Án Thành Công!
              </DialogTitle>
              <DialogDescription className="text-center text-xs">
                Dự án <strong>{title || "Dự án mới"}</strong> đã được thêm vào hệ thống với mã học phần <strong>{courseCode}</strong>. Hệ thống Matching đang quét các ứng viên tiềm năng!
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-accent/40 p-3 border border-border/50 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chỉ tiêu thành viên:</span>
                <span className="font-semibold text-foreground">{targetMembers} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kỹ năng yêu cầu:</span>
                <span className="font-semibold text-primary">{selectedSkills.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hạn chót:</span>
                <span className="font-semibold text-foreground">{deadline}</span>
              </div>
            </div>

            <DialogFooter className="sm:justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push("/dashboard");
                }}
              >
                Về Bảng Điều Khiển
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push("/workspace/team-alpha");
                }}
              >
                Đến Không Gian Làm Việc (Kanban)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
