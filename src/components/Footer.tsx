"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    /* Chapter 8: Signature PlayStation Blue Full-Bleed Footer (footer-section spec: #0070d1) */
    <footer style={{ zIndex: 13 }} className="relative z-[13] section-stack-blue rounded-t-[1.75rem] md:rounded-t-[2.5rem] shadow-[0_-35px_80px_-20px_rgba(0,0,0,0.7)] bg-[#0070d1] text-white pt-16 sm:pt-20 pb-28 sm:pb-16 w-full max-w-full overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/20">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group py-1">
              <div className="relative h-12 sm:h-14 w-52 sm:w-64 max-w-[220px] sm:max-w-none transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/m_dalats_logo_white.svg"
                  alt="M_Dalats Villa - Stay Close To Nature"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/80 font-normal max-w-sm leading-relaxed">
              Không gian nghỉ dưỡng boutique ấm cúng mang hơi thở đồi thông cao nguyên và kiến trúc mộc mạc nép mình trên con dốc thơ mộng của xứ sở sương mù Đà Lạt.
            </p>

            <p className="text-xs uppercase tracking-[1.5px] text-white font-bold">
              M_Dalats Boutique Villa • Stay Close To Nature
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/90 hover:text-white transition-colors font-medium underline underline-offset-4"
              >
                Facebook
              </a>
              <span className="text-white/40">•</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/90 hover:text-white transition-colors font-medium underline underline-offset-4"
              >
                Instagram
              </a>
              <span className="text-white/40">•</span>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/90 hover:text-white transition-colors font-medium underline underline-offset-4"
              >
                Pinterest
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Khám Phá M_Dalats
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">Giới thiệu & Câu chuyện</Link>
              </li>
              <li>
                <Link href="/rooms" className="text-white/80 hover:text-white transition-colors">Hệ thống phòng nghỉ</Link>
              </li>
              <li>
                <Link href="/dining" className="text-white/80 hover:text-white transition-colors">Ẩm thực & Cà phê</Link>
              </li>
              <li>
                <Link href="/experiences" className="text-white/80 hover:text-white transition-colors">Trải nghiệm & Tiện ích</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Vị trí & Liên hệ</Link>
              </li>
              <li>
                <Link href="/admin" className="text-white font-bold hover:underline transition-colors flex items-center gap-1.5">
                  <span>Trang quản trị (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info & Location Distances */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Concierge Privé • Liên Hệ
            </h4>
            <p className="text-xs sm:text-sm text-white/85 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>14B Khe Sanh, Phường 10, TP. Đà Lạt, Lâm Đồng</span>
            </p>
            <p className="text-xs sm:text-sm text-white/85 flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-white shrink-0" />
              <a href="tel:0939014234" className="text-white hover:underline font-bold transition-colors">
                Hotline Concierge: 0939 014 234
              </a>
            </p>
            <p className="text-xs sm:text-sm text-white/85 flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-white shrink-0" />
              <a href="mailto:dalat@mdalatsvilla.com" className="text-white/90 hover:text-white hover:underline transition-colors">
                dalat@mdalatsvilla.com
              </a>
            </p>

            <div className="pt-3 text-xs text-white/80 space-y-1 border-t border-white/20">
              <p className="text-white font-bold">Khoảng cách thuận tiện:</p>
              <p>• Hồ Xuân Hương & Chợ đêm Đà Lạt: 5 phút</p>
              <p>• Cáp treo Đồi Robin & Hồ Tuyền Lâm: 4 phút</p>
              <p>• Bến xe liên tỉnh Đà Lạt: 2 phút</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/75 gap-4">
          <p>&copy; {new Date().getFullYear()} M_Dalats Boutique Villa Đà Lạt. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("mdalats:open_cookie_preferences"));
                }
              }}
              className="text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Cài đặt Cookie & Quyền riêng tư
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-white hover:underline transition-colors cursor-pointer font-bold"
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
