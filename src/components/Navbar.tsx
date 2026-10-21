"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, User as UserIcon, Menu as MenuIcon, X, Calendar, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";
import { authClient } from "~/server/better-auth/client";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onOpenBookingModal?: (roomId?: number) => void;
  onOpenAuthModal?: () => void;
  onOpenMyBookingsModal?: () => void;
}

export function Navbar({ onOpenBookingModal, onOpenAuthModal, onOpenMyBookingsModal }: NavbarProps) {
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Giới thiệu", href: "/about" },
    { label: "Hệ thống phòng", href: "/rooms" },
    { label: "Ẩm thực", href: "/dining" },
    { label: "Trải nghiệm", href: "/experiences" },
    { label: "Liên hệ", href: "/contact" },
  ];

  const handleBookingClick = () => {
    if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      window.location.href = "/rooms";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Ribbon with Brand Slogan */}
      <div className="bg-[#367156] text-[#FAF9F6] text-[11px] sm:text-xs py-2 px-3 sm:px-4 transition-colors border-b border-white/10 shadow-xs">
        <div className="max-w-6xl mx-auto px-1 sm:px-8 flex items-center justify-between text-center tracking-wide gap-2 sm:gap-4 w-full min-w-0">
          <span className="font-sans font-light truncate max-w-[190px] xs:max-w-[280px] sm:max-w-none tracking-wider text-left">
            M_Dalats Villa • STAY CLOSE TO NATURE
          </span>
          <span className="hidden md:inline font-script text-lg text-[#F4A261] font-normal">
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
          </span>
          <a
            href="https://zalo.me/0939014234"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[#F4A261] text-[#F4A261] font-medium hover:text-white hover:border-white transition-colors shrink-0 text-[10.5px] sm:text-[11px]"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>

      {/* Main Navbar aligned with 6xl container */}
      <div
        className={`bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled
            ? "py-2 sm:py-2.5 shadow-md border-[#e5dfd3]"
            : "py-2.5 sm:py-3 border-[#ece7dd]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between w-full min-w-0">
          {/* Brand Logo M_Dalats Villa Horizontal */}
          <Link href="/" className="flex items-center group py-0.5 min-w-0 shrink">
            <div className="relative h-9 xs:h-11 sm:h-14 lg:h-16 w-36 xs:w-48 sm:w-64 lg:w-76 max-w-[155px] xs:max-w-[210px] sm:max-w-none transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/m_dalats_logo_horizontal.svg"
                alt="M_Dalats Villa - Stay Close to Nature"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[11px] xl:text-xs uppercase tracking-[0.16em] font-medium transition-all relative py-1.5 group/nav ${
                  isActive
                    ? "text-[#367156] font-bold"
                    : "text-[#444444] hover:text-[#367156]"
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#367156] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover/nav:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Hotline link desktop */}
          <a
            href="tel:0939014234"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#444444] hover:text-[#367156] transition-colors pr-2.5 border-r border-[#ece7dd]"
          >
            <Phone className="w-3.5 h-3.5 text-[#367156]" />
            <span className="font-semibold tracking-wider text-[11px]">0939 014 234</span>
          </a>

          {/* User Auth Profile / Login */}
          <div className="relative">
            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs font-medium bg-[#faf7f1] hover:bg-[#ece7dd] text-[#367156] px-2.5 sm:px-3 py-1.5 rounded-full border border-[#d6cebf] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate text-[11px]">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#ece7dd] rounded-md shadow-xl py-1.5 z-50 animate-fadeIn">
                    <div className="px-3.5 py-2 border-b border-[#ece7dd] text-xs">
                      <p className="font-semibold text-[#367156] truncate">{session.user.name || "Khách hàng"}</p>
                      <p className="text-[#888888] truncate text-[11px]">{session.user.email}</p>
                    </div>
                    {onOpenMyBookingsModal ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMyBookingsModal();
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-[#333333] hover:bg-[#faf7f1] flex items-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#367156]" />
                        Lịch sử đặt phòng
                      </button>
                    ) : (
                      <Link
                        href="/my-bookings"
                        className="w-full text-left px-3.5 py-2 text-xs text-[#333333] hover:bg-[#faf7f1] flex items-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#367156]" />
                        Lịch sử đặt phòng
                      </Link>
                    )}
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#367156] font-semibold hover:bg-[#FAF9F6] flex items-center gap-2 cursor-pointer border-t border-[#ece7dd]/60"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#367156]" />
                      Trang quản trị (Admin)
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await authClient.signOut();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-[#ece7dd]/60"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="hidden sm:flex items-center gap-1.5 text-xs text-[#333333] hover:text-[#367156] font-medium py-1 px-2 transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider">Đăng nhập</span>
              </button>
            )}
          </div>

          {/* Primary CTA Book Room Button */}
          <button
            type="button"
            onClick={handleBookingClick}
            className="bg-[#f27052] hover:bg-[#e05c3c] text-white text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-semibold px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-sm shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Đặt phòng
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 -mr-2 text-[#222222] hover:text-[#367156] transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
        </div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-[#ece7dd] px-6 py-5 shadow-2xl flex flex-col gap-3 overflow-hidden"
          >
            <nav className="flex flex-col divide-y divide-[#ece7dd]/50">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[13px] uppercase tracking-wider font-medium text-[#333333] hover:text-[#367156] py-3 min-h-[44px] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#aaaaaa]" />
                </Link>
              ))}
            </nav>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-[#555555]">
              <a href="tel:0939014234" className="flex items-center gap-2 py-1 text-[#367156] font-medium">
                <Phone className="w-3.5 h-3.5" /> Hotline: 0939 014 234
              </a>

              {session?.user ? (
                <div className="pt-2 border-t border-[#ece7dd] flex flex-col gap-2">
                  <p className="text-[11px] font-semibold text-[#367156]">
                    Tài khoản: {session.user.name || session.user.email}
                  </p>
                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left text-xs text-[#333333] flex items-center gap-2 py-1"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#367156]" /> Lịch sử đặt phòng
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left text-xs text-[#367156] font-semibold flex items-center gap-2 py-1"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#367156]" /> Trang quản trị (Admin)
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await authClient.signOut();
                    }}
                    className="text-left text-xs text-red-600 flex items-center gap-2 py-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-[#ece7dd]">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center border border-[#ece7dd] text-[#367156] bg-[#FAF9F6] py-2 text-xs uppercase font-medium rounded-sm flex items-center justify-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#367156]" />
                    <span>Trang quản trị (Admin)</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal?.();
                    }}
                    className="w-full text-center border border-[#367156] text-[#367156] py-2 text-xs uppercase font-medium rounded-sm"
                  >
                    Đăng nhập / Đăng ký
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBookingClick();
                }}
                className="w-full text-center bg-[#f27052] text-white py-3 min-h-[46px] text-[13px] uppercase font-semibold tracking-wider rounded-sm shadow-sm"
              >
                Đặt phòng trực tiếp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
