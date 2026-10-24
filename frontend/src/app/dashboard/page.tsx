"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderGit2,
  Users2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Sparkles,
  Search,
  Filter,
  Bot,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchProjects, requestTeamMatch, Project, MatchResponse } from "@/lib/api";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const COURSE_FILTERS = [
  { label: "Tất cả học phần", value: "ALL" },
  { label: "CS402 - Đồ Án Tốt Nghiệp", value: "CS402" },
  { label: "AI502 - Trí Tuệ Nhân Tạo", value: "AI502" },
  { label: "SE330 - Web Hiện Đại", value: "SE330" },
  { label: "IS301 - HTTT Doanh Nghiệp", value: "IS301" },
];

export default function DashboardPage() {
  const { user } = useSupabaseAuth();

  // State for Projects fetched from backend API
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCourse, setSelectedCourse] = React.useState("ALL");
  const [searchTerm, setSearchTerm] = React.useState("");

  // AI Matching Dialog State
  const [matchingLoadingId, setMatchingLoadingId] = React.useState<string | null>(null);
  const [matchResponse, setMatchResponse] = React.useState<MatchResponse | null>(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = React.useState(false);

  // Fetch projects from backend API
  const loadProjects = React.useCallback(async () => {
    setLoading(true);
    try {
      const filter = selectedCourse === "ALL" ? undefined : selectedCourse;
      const data = await fetchProjects(filter);
      setProjects(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách dự án:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Handle AI Matching button click for a project
  const handleAIMatch = async (project: Project) => {
    setMatchingLoadingId(project.id);
    try {
      const response = await requestTeamMatch(project.id);
      setMatchResponse(response);
      setIsMatchDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi gọi AI Matching:", error);
    } finally {
      setMatchingLoadingId(null);
    }
  };

  // Filter projects by search keyword
  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.course_code.toLowerCase().includes(term) ||
      p.required_skills.some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pastelBlue-100 text-pastelBlue-900 dark:bg-navy-800 dark:text-pastelBlue-300 px-3 py-1 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>FastAPI & Supabase Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Xin chào, {user?.full_name || "Lê Hoàng Nam"}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Theo dõi tiến độ, trạng thái và khám phá cơ hội ghép đội với thuật toán Gemini AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadProjects}
              disabled={loading}
              className="gap-1.5 h-9"
              title="Làm mới dữ liệu từ backend"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Đồng Bộ API</span>
            </Button>
            <Link href="/projects/create">
              <Button size="sm" className="gap-2 h-9 font-semibold shadow-sm">
                <Plus className="h-4 w-4" />
                <span>Tạo Dự Án Mới</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-primary bg-card/60 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground font-medium">Tổng Số Đề Tài Tuyển Quân</div>
            <div className="text-2xl font-bold text-foreground mt-1">{projects.length}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Dữ liệu thực từ FastAPI</span>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-pastelBlue-500 bg-card/60 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground font-medium">Đang Mở Tuyển (OPEN)</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {projects.filter((p) => p.status === "OPEN").length}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Sẵn sàng nhận ứng viên</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500 bg-card/60 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground font-medium">Đang Ghép Cặp (MATCHING)</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {projects.filter((p) => p.status === "MATCHING").length}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">AI đang xử lý hồ sơ</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-indigo-600 bg-card/60 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground font-medium">Gemini 2.5 AI Matching</div>
            <div className="text-2xl font-bold text-foreground mt-1">Sẵn Sàng</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Độ chính xác cao</div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          {/* Course filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {COURSE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setSelectedCourse(f.value)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCourse === f.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo kỹ năng, tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* Section: Danh sách Dự Án (Mapped to Card components) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Danh Sách Dự Án Đang Tuyển Thành Viên ({filteredProjects.length})
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Endpoint: <code>GET /api/projects</code></span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-4 animate-pulse bg-card/60">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-12 bg-muted rounded w-full" />
                  <div className="h-2 bg-muted rounded w-full" />
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Không tìm thấy dự án phù hợp</p>
              <p className="text-xs text-muted-foreground mt-1">
                Thử thay đổi bộ lọc học phần hoặc tạo một dự án mới.
              </p>
              <Link href="/projects/create">
                <Button size="sm" className="mt-4 gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tạo Dự Án Ngay</span>
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {project.course_code}
                      </Badge>

                      {/* Trạng thái dự án */}
                      <Badge
                        variant={
                          project.status === "OPEN"
                            ? "success"
                            : project.status === "MATCHING"
                            ? "pastel"
                            : "secondary"
                        }
                        className="text-[10px] font-bold tracking-wide"
                      >
                        ● {project.status === "OPEN" ? "Đang Mở Tuyển" : project.status === "MATCHING" ? "Đang Ghép Cặp" : "Đã Đóng"}
                      </Badge>
                    </div>

                    {/* Tên dự án */}
                    <CardTitle className="text-base text-foreground leading-snug line-clamp-2">
                      {project.title}
                    </CardTitle>

                    {project.description && (
                      <CardDescription className="text-xs line-clamp-2 mt-1">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4 pb-3">
                    {/* Tiến độ dự án (Progress Bar) */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                        <span>Tiến độ tuyển quân & hoàn thiện</span>
                        <span className="font-semibold text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    {/* Vị trí cần tuyển */}
                    {project.needed_roles && project.needed_roles.length > 0 && (
                      <div className="rounded-lg bg-accent/40 p-2 border border-border/50 text-xs">
                        <span className="text-muted-foreground text-[11px]">Vị trí cần tìm:</span>
                        <div className="font-semibold text-primary mt-0.5 line-clamp-1">
                          {project.needed_roles.join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Kỹ năng yêu cầu */}
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">
                        Kỹ năng yêu cầu:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.required_skills.slice(0, 4).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {project.required_skills.length > 4 && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            +{project.required_skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between text-xs bg-muted/20">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users2 className="h-3.5 w-3.5" />
                      <span>{project.current_members_count}/{project.target_member_count} tv</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Button: Request Team Match with Gemini AI */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAIMatch(project)}
                        disabled={matchingLoadingId === project.id}
                        className="h-8 text-xs font-semibold gap-1 text-primary hover:text-primary"
                        title="Dùng Gemini AI đánh giá và gợi ý ứng viên phù hợp"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>{matchingLoadingId === project.id ? "Đang quét..." : "Ghép Đội AI"}</span>
                      </Button>

                      <Link href={`/workspace/${project.id}`}>
                        <Button size="sm" variant="default" className="h-8 text-xs font-semibold gap-1">
                          <span>Vào</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* AI Matching Recommendation Modal Dialog */}
        <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-pastelBlue-100 text-pastelBlue-900 dark:bg-navy-800 dark:text-pastelBlue-300 px-3 py-1 text-xs font-semibold w-fit mb-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Powered by Gemini 2.5 Flash</span>
              </div>
              <DialogTitle className="text-lg">
                Đề Xuất Ứng Viên Phù Hợp: {matchResponse?.project_title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Gemini AI đã phân tích hồ sơ và tính toán điểm tương thích cùng lý do đề xuất cho từng ứng viên.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 my-3">
              {matchResponse?.matches.map((cand) => (
                <div
                  key={cand.candidate_id}
                  className="p-4 rounded-xl border border-border bg-card space-y-2.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://images.unsplash.com/photo-${cand.candidate_id === "cand-01" ? "1507003211169-0a1dd7228f2d" : "1494790108377-be9c29b29330"}?w=100&h=100&fit=crop`} />
                        <AvatarFallback>{cand.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-sm text-foreground">{cand.full_name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">ID: {cand.candidate_id}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="text-lg font-black text-primary">
                        {cand.match_score}%
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        Tương thích
                      </span>
                    </div>
                  </div>

                  {/* AI Reasoning (under 50 words) */}
                  <div className="p-2.5 rounded-lg bg-accent/30 border border-border/60 text-xs">
                    <span className="font-semibold text-primary block mb-0.5">Lý do đề xuất (AI):</span>
                    <p className="text-foreground/90 leading-relaxed text-[11px] italic">
                      "{cand.reasoning}"
                    </p>
                  </div>

                  {/* Matched skills tags */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-muted-foreground">Kỹ năng trùng khớp:</span>
                    <div className="flex flex-wrap gap-1">
                      {cand.matched_skills.map((skill, idx) => (
                        <Badge key={idx} variant="success" className="text-[10px] px-1.5 py-0 font-normal">
                          ✓ {skill}
                        </Badge>
                      ))}
                      {cand.missing_skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0 opacity-60">
                          - {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsMatchDialogOpen(false)}
                className="w-full sm:w-auto font-semibold"
              >
                Đóng Hộp Thoại
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
