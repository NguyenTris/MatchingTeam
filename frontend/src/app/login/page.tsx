"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { signIn, signUp, loginAsDemo, user } = useSupabaseAuth();

  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
      router.push(redirect);
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi khi xác thực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push(redirect);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-navy-900 via-primary to-pastelBlue-400 text-white shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-foreground">
            Matching<span className="text-primary font-bold">Team</span>
          </span>
        </Link>
        <p className="text-xs text-muted-foreground">
          Nền tảng kết nối & quản trị dự án thông minh
        </p>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pastelBlue-100 text-pastelBlue-900 dark:bg-navy-800 dark:text-pastelBlue-300 px-3 py-1 text-xs font-semibold mx-auto mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Supabase Authentication</span>
          </div>
          <CardTitle className="text-xl font-bold">
            {isSignUp ? "Đăng Ký Tài Khoản Mới" : "Đăng Nhập Vào Hệ Thống"}
          </CardTitle>
          <CardDescription className="text-xs">
            {isSignUp
              ? "Tạo hồ sơ năng lực để bắt đầu tham gia các dự án công nghệ."
              : "Vui lòng đăng nhập để truy cập Dashboard và Không gian làm việc."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {errorMessage}
            </div>
          )}

          {/* Quick Demo Login Button */}
          <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Thử nghiệm nhanh không cần mật khẩu</span>
              </span>
              <Badge variant="pastel" className="text-[10px]">1-Click</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Trải nghiệm ngay với tài khoản mẫu <strong>Lê Hoàng Nam (Team Lead)</strong>.
            </p>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDemoLogin}
              className="w-full font-semibold gap-1.5 h-8 text-xs shadow-xs"
            >
              <span>Đăng Nhập Nhanh (Demo Account)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-wider absolute">
              Hoặc với Supabase Auth
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    placeholder="Nguyễn Văn A"
                    className="pl-9 h-9 text-xs"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email sinh viên / trường học</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  placeholder="student@university.edu.vn"
                  className="pl-9 h-9 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-9 text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold h-9 text-xs mt-2"
            >
              {loading ? "Đang xử lý..." : isSignUp ? "Tạo Tài Khoản" : "Đăng Nhập"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center border-t border-border pt-4 text-xs text-muted-foreground">
          {isSignUp ? (
            <p>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-primary font-semibold hover:underline"
              >
                Đăng nhập ngay
              </button>
            </p>
          ) : (
            <p>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-primary font-semibold hover:underline"
              >
                Đăng ký thành viên
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
          Đang tải trang đăng nhập...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
