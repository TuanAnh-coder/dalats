"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import { api } from "~/trpc/react";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Home,
  CheckCircle2,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "forbidden"
      ? "Tài khoản của bạn không có quyền Quản trị viên (Admin)."
      : urlError === "unauthorized"
      ? "Vui lòng đăng nhập với quyền Quản trị viên để truy cập."
      : null
  );

  // Auto seed admin user if this is first launch
  const seedAdminMutation = api.customer.seedAdminIfMissing.useMutation();

  useEffect(() => {
    seedAdminMutation.mutate();
  }, []);

  const handleQuickFillAdmin = () => {
    setEmail("admin@mdalatsvilla.com");
    setPassword("admin123456");
    setErrorMessage(null);
  };

  const handleQuickFillStaff = () => {
    setEmail("staff@mdalatsvilla.com");
    setPassword("staff123456");
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // Sign in using better-auth client
      const res = await authClient.signIn.email({
        email: email.trim(),
        password: password.trim(),
      });

      if (res.error) {
        setErrorMessage(
          res.error.message || "Email hoặc mật khẩu không chính xác. Vui lòng thử lại."
        );
        setLoading(false);
        return;
      }

      // Check user role from session
      const session = await authClient.getSession();
      const role = (session?.data?.user as { role?: string })?.role;

      if (role !== "admin") {
        setErrorMessage(
          `Tài khoản đăng nhập mang quyền "${role || "user"}", không đủ thẩm quyền truy cập hệ thống Quản Trị Admin.`
        );
        setLoading(false);
        return;
      }

      // Success -> navigate to target or /admin
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#ece7dd] rounded-sm shadow-xl p-6 sm:p-9 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-[#367156]/10 text-[#367156] rounded-full flex items-center justify-center mx-auto border border-[#367156]/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#367156] font-bold block">
          Cổng Quản Trị Nội Bộ • M_Dalats Villa
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#367156] font-normal">
          Đăng Nhập Quản Trị
        </h1>
        <p className="text-xs text-[#666666] font-light">
          Xác thực danh tính & phân quyền quản lý phòng, khách hàng và đặt phòng
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1.5">
            Email Quản Trị Viên *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888888]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mdalatsvilla.com"
              required
              className="w-full bg-[#faf7f1] border border-[#d6cebf] pl-9 pr-3 py-2.5 text-base sm:text-xs text-[#222222] rounded-xs focus:outline-hidden focus:border-[#367156] font-medium min-h-[44px] sm:min-h-[38px]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium">
              Mật khẩu *
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888888]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#faf7f1] border border-[#d6cebf] pl-9 pr-10 py-2.5 text-base sm:text-xs text-[#222222] rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[44px] sm:min-h-[38px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#888888] hover:text-[#222222]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#367156] hover:bg-[#244b39] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xác thực quyền Admin...</span>
            </>
          ) : (
            <>
              <span>Đăng nhập hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Credentials */}
      <div className="pt-2 border-t border-[#ece7dd] space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-[#367156] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tài khoản mẫu để test phân quyền Role:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={handleQuickFillAdmin}
            className="p-2.5 bg-[#faf7f1] hover:bg-[#ece7dd] border border-[#d6cebf] rounded-xs text-left transition-colors cursor-pointer"
          >
            <div className="font-semibold text-[#367156] flex items-center justify-between">
              <span>Admin (Toàn quyền)</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs">Role: admin</span>
            </div>
            <div className="text-[10px] text-[#666666] mt-0.5 font-mono truncate">
              admin@mdalatsvilla.com
            </div>
            <div className="text-[10px] text-[#888888]">Pass: admin123456</div>
          </button>

          <button
            type="button"
            onClick={handleQuickFillStaff}
            className="p-2.5 bg-[#faf7f1] hover:bg-[#ece7dd] border border-[#d6cebf] rounded-xs text-left transition-colors cursor-pointer"
          >
            <div className="font-semibold text-[#584636] flex items-center justify-between">
              <span>Staff (Lễ tân)</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded-xs">Role: staff</span>
            </div>
            <div className="text-[10px] text-[#666666] mt-0.5 font-mono truncate">
              staff@mdalatsvilla.com
            </div>
            <div className="text-[10px] text-[#888888]">Pass: staff123456</div>
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#367156] font-light transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Quay lại trang chủ M_Dalats Villa</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#faf7f1] flex items-center justify-center p-4 selection:bg-[#367156] selection:text-white">
      <Suspense
        fallback={
          <div className="p-8 text-center text-[#666666]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#367156]" />
            <p className="text-xs mt-2">Đang tải biểu mẫu xác thực...</p>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
