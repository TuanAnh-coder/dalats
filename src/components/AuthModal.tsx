"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";
import { authClient } from "~/server/better-auth/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (res.error) {
          setErrorMessage(res.error.message || "Đăng ký không thành công. Vui lòng thử lại.");
        } else {
          onClose();
        }
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
        });
        if (res.error) {
          setErrorMessage(res.error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } else {
          onClose();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-[#ece7dd] max-w-md w-full relative p-6 sm:p-8 max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-[#222222] p-1.5 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="relative w-10 h-10 mx-auto mb-2">
            <Image
              src="/images/LE_LogoIcon.svg"
              alt="M_Dalats Logo"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="font-serif text-2xl text-[#367156] font-semibold">
            {mode === "signin" ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
          </h3>
          <p className="text-xs text-[#777777] font-light mt-1">
            {mode === "signin"
              ? "Quản lý đặt phòng & nhận ưu đãi thành viên M_Dalats"
              : "Trở thành thành viên thân thiết của M_Dalats Boutique Villa"}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#faf7f1] border border-[#d6cebf] pl-9 pr-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
              Email đăng nhập
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full bg-[#faf7f1] border border-[#d6cebf] pl-9 pr-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#faf7f1] border border-[#d6cebf] pl-9 pr-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#367156] hover:bg-[#113123] text-white py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{mode === "signin" ? "Đăng nhập" : "Đăng ký thành viên"}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-[#666666] pt-4 border-t border-[#ece7dd]">
          {mode === "signin" ? (
            <p>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setMode("signup");
                }}
                className="font-medium text-[#f27052] hover:underline cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setMode("signin");
                }}
                className="font-medium text-[#367156] hover:underline cursor-pointer"
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
