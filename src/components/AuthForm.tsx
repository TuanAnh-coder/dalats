"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";

import { authClient } from "~/server/better-auth/client";
import { normalizeRole, type AppRole } from "~/lib/roles";

export interface AuthFormResult {
  role: AppRole;
}

interface AuthFormProps {
  onSuccess?: (result: AuthFormResult) => void;
  initialMode?: "signin" | "signup";
  externalError?: string | null;
  showHeader?: boolean;
}

const inputClassName =
  "w-full bg-[#181818] border border-white/20 pl-10 pr-3 py-2.5 text-base sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] transition-colors min-h-[46px]";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  INVALID_EMAIL: "Email không hợp lệ. Vui lòng kiểm tra lại.",
  USER_ALREADY_EXISTS: "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.",
  PASSWORD_TOO_SHORT: "Mật khẩu phải có ít nhất 6 ký tự.",
  PASSWORD_TOO_LONG: "Mật khẩu quá dài. Vui lòng chọn mật khẩu ngắn hơn.",
  BANNED_USER: "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ M_Dalats Villa để được hỗ trợ.",
  TOO_MANY_REQUESTS: "Bạn đã thử quá nhiều lần. Vui lòng chờ một lát rồi thử lại.",
};

function getAuthErrorMessage(
  error: { code?: string; message?: string } | null,
  fallback: string
): string {
  if (!error) return fallback;
  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code]!;
  }
  return error.message || fallback;
}

export function AuthForm({
  onSuccess,
  initialMode = "signin",
  externalError = null,
  showHeader = true,
}: AuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setErrorMessage(null);
  };

  const resolveRole = async (): Promise<AppRole> => {
    const session = await authClient.getSession();
    const user = session?.data?.user as { role?: string | null } | undefined;
    return normalizeRole(user?.role);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim();

      if (mode === "signup") {
        const result = await authClient.signUp.email({
          email: trimmedEmail,
          password,
          name: name.trim() || trimmedEmail,
        });

        if (result.error) {
          setErrorMessage(
            getAuthErrorMessage(result.error, "Đăng ký không thành công. Vui lòng thử lại.")
          );
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email: trimmedEmail,
          password,
        });

        if (result.error) {
          setErrorMessage(
            getAuthErrorMessage(
              result.error,
              "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
            )
          );
          return;
        }
      }

      const role = await resolveRole();
      onSuccess?.({ role });
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      setErrorMessage(raw || "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const visibleError = errorMessage ?? externalError;

  return (
    <div className="w-full text-white">
      {showHeader && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-white tracking-tight">
            {mode === "signin" ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-normal">
            Trải nghiệm dịch vụ nghỉ dưỡng boutique trọn vẹn cùng M_Dalats Villa
          </p>
        </div>
      )}

      {/* Mode Switcher Tabs: PlayStation filter-pill style */}
      <div className="flex border border-white/10 bg-[#181818] p-1 rounded-full mb-5">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            mode === "signin"
              ? "bg-[#0070d1] text-white shadow-sm"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            mode === "signup"
              ? "bg-[#0070d1] text-white shadow-sm"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Đăng ký
        </button>
      </div>

      {visibleError && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-[4px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{visibleError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate={false}>
        {mode === "signup" && (
          <div>
            <label
              htmlFor="auth-name"
              className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-1"
            >
              Họ và tên
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                className={inputClassName}
                required
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="auth-email"
            className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-1"
          >
            Email đăng nhập
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your-email@example.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              className={inputClassName}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-1"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full bg-[#181818] border border-white/20 pl-10 pr-11 py-2.5 text-base sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] transition-colors min-h-[46px]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white py-3 min-h-[48px] rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xác thực…</span>
            </>
          ) : (
            <span>{mode === "signin" ? "Đăng nhập" : "Đăng ký thành viên"}</span>
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-neutral-400">
        {mode === "signin" ? (
          <p>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-bold text-[#53b1ff] hover:underline cursor-pointer"
            >
              Đăng ký ngay
            </button>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-bold text-[#53b1ff] hover:underline cursor-pointer"
            >
              Đăng nhập
            </button>
          </p>
        )}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#53b1ff]" />
        <span>Hệ thống tự phân quyền theo vai trò tài khoản sau khi đăng nhập.</span>
      </p>
    </div>
  );
}
