import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { Compass, Home, PhoneCall, BedDouble } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf7f1] flex flex-col justify-between selection:bg-[#367156] selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#367156]/10 text-[#367156] text-[11px] uppercase tracking-[0.25em] font-semibold">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span>M_Dalats Boutique Villa</span>
          </div>

          <div className="relative">
            <span className="font-serif text-8xl sm:text-9xl font-bold text-[#367156]/10 select-none block tracking-tighter">
              404
            </span>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#222222] font-normal">
                Lạc lối giữa màn sương
              </h1>
              <p className="text-xs sm:text-sm text-[#666666] font-light mt-2 max-w-md">
                Trang quý khách đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ mới.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-wider font-medium">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#367156] hover:bg-[#113123] text-white px-5 py-3 rounded-xs shadow-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>

            <Link
              href="/#rooms"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f3eee4] text-[#367156] border border-[#d6cebf] px-5 py-3 rounded-xs transition-all"
            >
              <BedDouble className="w-4 h-4" />
              <span>Xem 11 phòng nghỉ</span>
            </Link>

            <a
              href="tel:0939014234"
              className="inline-flex items-center gap-2 bg-[#f27052] hover:bg-[#e05c3c] text-white px-5 py-3 rounded-xs shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline 0939 014 234</span>
            </a>
          </div>

          <p className="text-[11px] text-[#888888] font-light pt-4">
            M_Dalats Villa • 14 Đường 3 Tháng 4, Phường 3, TP. Đà Lạt
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
