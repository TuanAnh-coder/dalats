"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, PhoneCall } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or telemetry
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#faf7f1] flex items-center justify-center p-4 selection:bg-[#367156] selection:text-white">
      <div className="max-w-md w-full bg-white border border-[#ece7dd] rounded-sm p-6 sm:p-8 text-center shadow-lg space-y-5">
        <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-200">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#666666] font-semibold block">
            M_Dalats Villa • Gián đoạn tạm thời
          </span>
          <h2 className="font-serif text-2xl text-[#222222] font-medium">
            Có lỗi xảy ra trong quá trình xử lý
          </h2>
          <p className="text-xs text-[#666666] leading-relaxed">
            Hệ thống gặp sự cố không mong muốn. Quý khách vui lòng thử tải lại hoặc liên hệ quản gia trực tiếp.
          </p>
        </div>

        {error.digest && (
          <p className="font-mono text-[10px] text-[#999999] bg-[#faf7f1] p-2 rounded-xs border border-[#ece7dd]">
            Mã lỗi tham chiếu: {error.digest}
          </p>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center text-xs uppercase tracking-wider font-medium">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#367156] hover:bg-[#113123] text-white px-4 py-2.5 rounded-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#faf7f1] hover:bg-[#eae3d5] text-[#222222] border border-[#d6cebf] px-4 py-2.5 rounded-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-[#ece7dd] text-[11px] text-[#777777] flex items-center justify-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-[#f27052]" />
          <span>Hotline hỗ trợ 24/7: <strong>0939 014 234</strong></span>
        </div>
      </div>
    </div>
  );
}
