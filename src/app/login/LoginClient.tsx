"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

import { AuthForm } from "~/components/AuthForm";
import { canAccessPath, getRoleHome, type AppRole } from "~/lib/roles";

const ERROR_MESSAGES: Record<string, string> = {
  forbidden:
    "Tài khoản đang đăng nhập không đủ quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản Quản trị viên hoặc Lễ tân.",
  unauthorized: "Vui lòng đăng nhập để tiếp tục.",
};

/** Blocks open-redirects: only same-site absolute paths are accepted. */
function sanitizeCallbackUrl(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return null;
  return raw;
}

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
  const errorCode = searchParams.get("error");
  const externalError = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? "Không thể truy cập trang được yêu cầu.")
    : null;

  const handleSuccess = ({ role }: { role: AppRole }) => {
    const destination =
      callbackUrl && canAccessPath(role, callbackUrl) ? callbackUrl : getRoleHome(role);

    router.push(destination);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#0070d1] selection:text-white">
      <div className="flex-1 grid lg:grid-cols-2">
        {/* Brand panel — desktop only */}
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#000000] p-10 xl:p-14 text-white border-r border-white/10">
          <Image
            src="/images/DSCF1106-1024x683.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-[#000000]/40" />

          <div className="relative z-10">
            <div className="relative h-16 w-64 xl:h-20 xl:w-80">
              <Image
                src="/images/m_dalats_logo_horizontal.svg"
                alt="M_Dalats Boutique Villa"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </div>

          <div className="relative z-10 space-y-4 max-w-md">
            <p className="text-2xl xl:text-3xl font-light text-white tracking-[-0.1px] leading-snug">
              “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
            </p>
            <p className="text-sm text-white/70 font-light leading-relaxed">
              Đăng nhập một lần để quản lý đặt phòng, theo dõi lịch sử lưu trú và truy cập cổng
              quản trị theo đúng vai trò tài khoản của bạn.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[10px] uppercase tracking-[0.18em] font-semibold">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#53b1ff]">
                Quản trị viên
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80">
                Lễ tân
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80">
                Khách hàng
              </span>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 bg-[#000000]">
          <div className="w-full max-w-md">
            {/* Mobile brand header */}
            <div className="lg:hidden text-center mb-6">
              <div className="relative h-14 w-60 sm:w-72 mx-auto">
                <Image
                  src="/images/m_dalats_logo_horizontal.svg"
                  alt="M_Dalats Boutique Villa"
                  fill
                  priority
                  className="object-contain"
                  sizes="288px"
                />
              </div>
            </div>

            <div className="bg-[#181818] border border-white/10 rounded-[8px] p-6 sm:p-8 shadow-none">
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block">
                  Cổng đăng nhập hợp nhất
                </span>
                <h1 className="text-2xl sm:text-3xl text-white font-light mt-1.5 tracking-[-0.1px]">
                  Đăng nhập / Đăng ký
                </h1>
                <p className="text-xs text-white/60 font-light mt-1.5 leading-relaxed">
                  Hệ thống tự nhận diện vai trò và chuyển bạn đến đúng khu vực sau khi xác thực.
                </p>
              </div>

              {externalError && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-[4px] flex items-start gap-2.5 animate-fadeIn"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#ef4444]" />
                  <span className="leading-relaxed">{externalError}</span>
                </div>
              )}

              <AuthForm showHeader={false} onSuccess={handleSuccess} />
            </div>

            <div className="mt-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-white/60 hover:text-[#53b1ff] font-medium transition-colors py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang chủ</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 text-white/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0070d1]" />
                <span>Phân quyền tự động theo vai trò</span>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
