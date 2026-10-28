import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";

import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "Đăng nhập | M_Dalats Boutique Villa Đà Lạt",
  description:
    "Đăng nhập một lần để quản lý đặt phòng, theo dõi lịch sử lưu trú và truy cập cổng quản trị M_Dalats Villa theo vai trò tài khoản.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0070d1]" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
