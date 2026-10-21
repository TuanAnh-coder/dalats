"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Phone, Mail, MapPin, Sparkles } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#faf7f1] text-[#333333] pt-12 sm:pt-16 pb-32 sm:pb-14 border-t border-[#ece7dd]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#ece7dd]">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group py-1">
              <div className="relative h-12 sm:h-16 lg:h-18 w-52 sm:w-72 lg:w-80 max-w-[220px] sm:max-w-none transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/m_dalats_logo_horizontal.svg"
                  alt="M_Dalats Villa - Stay Close To Nature"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#666666] font-light max-w-sm leading-relaxed font-sans">
              Một không gian nghỉ dưỡng ấm cúng mang hơi thở đồi thông cao nguyên và kiến trúc mộc mạc nép mình trên con dốc thơ mộng của xứ sở sương mù Đà Lạt.
            </p>

            <p className="font-script text-xl text-[#F4A261] font-normal">
              “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wider text-[#367156] hover:text-[#f27052] transition-colors"
              >
                Facebook
              </a>
              <span className="text-[#cccccc]">•</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wider text-[#367156] hover:text-[#f27052] transition-colors"
              >
                Instagram
              </a>
              <span className="text-[#cccccc]">•</span>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wider text-[#367156] hover:text-[#f27052] transition-colors"
              >
                Pinterest
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-lg text-[#367156] font-semibold mb-4">
              Khám phá M_Dalats
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-[#367156] transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#367156] transition-colors">Giới thiệu & Câu chuyện</Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-[#367156] transition-colors">Hệ thống phòng nghỉ</Link>
              </li>
              <li>
                <Link href="/dining" className="hover:text-[#367156] transition-colors">Ẩm thực & Cà phê</Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-[#367156] transition-colors">Trải nghiệm & Tiện ích</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#367156] transition-colors">Vị trí & Liên hệ</Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#367156] font-bold hover:text-[#f27052] transition-colors flex items-center gap-1.5">
                  <span>Trang quản trị</span>
                  <span className="text-[9px] uppercase tracking-wider bg-[#367156] text-white px-1.5 py-0.5 rounded-xs font-mono">
                    Admin
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-lg text-[#367156] font-semibold mb-4">
              Liên hệ trực tiếp
            </h4>
            <p className="text-xs text-[#555555] flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#367156] flex-shrink-0 mt-0.5" />
              <span>14/2 Đường 3/4, Phường 3, TP. Đà Lạt, Lâm Đồng</span>
            </p>
            <p className="text-xs text-[#555555] flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#367156] flex-shrink-0" />
              <a href="tel:0939014234" className="hover:text-[#367156]">
                Hotline: 0939 014 234
              </a>
            </p>
            <p className="text-xs text-[#555555] flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#367156] flex-shrink-0" />
              <a href="mailto:dalat@mdalatsvilla.com" className="hover:text-[#367156]">
                dalat@mdalatsvilla.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>&copy; {new Date().getFullYear()} M_Dalats Villa Đà Lạt. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("mdalats_intro_seen");
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#367156] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>Xem lại mở đầu nghệ thuật</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-[#367156] hover:text-[#f27052] transition-colors cursor-pointer"
            >
              <span>Đầu trang</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
