"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  Calendar,
  Menu as MenuIcon,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  MapPin,
  ChevronRight,
} from "lucide-react";

import { authClient } from "~/server/better-auth/client";
import { normalizeRole, isStaffRole } from "~/lib/roles";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

interface NavbarProps {
  onOpenBookingModal?: (roomId?: number) => void;
  onOpenAuthModal?: () => void;
  onOpenMyBookingsModal?: () => void;
}

export function Navbar({
  onOpenBookingModal,
  onOpenAuthModal,
  onOpenMyBookingsModal,
}: NavbarProps) {
  const { data: session } = authClient.useSession();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const sessionRole = normalizeRole(
    (session?.user as { role?: string } | undefined)?.role,
  );
  const canAccessAdmin = isStaffRole(sessionRole);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookingClick = () => {
    if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      window.location.href = "/rooms";
    }
  };

  const handleAuthClick = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      router.push("/login");
    }
  };

  const handleMyBookingsClick = () => {
    if (onOpenMyBookingsModal) {
      onOpenMyBookingsModal();
    } else {
      router.push("/my-bookings");
    }
  };

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Phòng nghỉ", href: "/rooms" },
    { label: "Giới thiệu", href: "/about" },
    { label: "Ẩm thực", href: "/dining" },
    { label: "Trải nghiệm", href: "/experiences" },
    { label: "Liên hệ", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full select-none">
      {/* Top Utility Ribbon (PlayStation dark sub-nav style) */}
      <div className="bg-[#000000] text-neutral-400 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 text-white/90 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#0070d1]" />
              14B Khe Sanh, Phường 10, Đà Lạt
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-400">
              Boutique Forest Villa Resort
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:0939014234"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#53b1ff] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0070d1]" />
              <span className="font-semibold">0939 014 234</span>
            </a>
            <span className="hidden xs:inline text-neutral-700">|</span>
            <span className="hidden xs:inline text-[11px] text-neutral-400 font-medium tracking-wider">
              VI / EN
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar (PlayStation primary-nav: height 64px, pure black #000000, hairline border) */}
      <nav
        className={`w-full h-16 transition-all duration-300 border-b border-white/10 ${
          scrolled ? "bg-[#000000]/95 backdrop-blur-md" : "bg-[#000000]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo Left */}
          <Link href="/" className="inline-flex items-center shrink-0 py-1" aria-label="M_Dalats Villa">
            <div className="relative h-10 w-44 sm:w-52">
              <Image
                src="/images/m_dalats_logo_horizontal.svg"
                alt="M_Dalats Villa"
                fill
                className="object-contain object-left invert"
                priority
              />
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0070d1] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* User Profile or Login */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 px-4 gap-2 border-white/20 text-xs font-bold text-white bg-transparent hover:bg-white/10 rounded-full"
                  >
                    <Avatar className="h-5 w-5 rounded-full border border-white/30">
                      <AvatarFallback className="text-[10px] bg-[#0070d1] text-white font-bold">
                        {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[90px] truncate font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#121314] border-white/15 text-white rounded-[8px] p-2 shadow-2xl">
                  <DropdownMenuLabel className="p-2 space-y-1">
                    <p className="font-semibold text-white text-xs truncate">
                      {session.user.name || "Hội viên"}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate font-normal">
                      {session.user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleMyBookingsClick}
                    className="cursor-pointer text-xs text-neutral-300 hover:text-white focus:bg-white/10 focus:text-white rounded-[6px] gap-2 py-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#0070d1]" />
                    <span>Lịch sử đặt phòng</span>
                  </DropdownMenuItem>
                  {canAccessAdmin && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="cursor-pointer text-xs text-white focus:bg-white/10 focus:text-white rounded-[6px] gap-2 py-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#0070d1]" />
                      <span>Trang quản trị (Admin)</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={async () => {
                      await authClient.signOut();
                      router.refresh();
                    }}
                    className="cursor-pointer text-xs text-[#ef4444] focus:bg-red-950/40 focus:text-white rounded-[6px] gap-2 py-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                onClick={handleAuthClick}
                className="hidden sm:inline-flex border-white/20 bg-transparent text-white hover:bg-white/10 h-10 px-5 text-xs font-bold rounded-full"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#0070d1]" />
                <span>Đăng nhập</span>
              </Button>
            )}

            {/* PlayStation Commerce CTA Pill (Commerce Orange #d53b00, fully-rounded pill) */}
            <Button
              variant="commerce"
              onClick={handleBookingClick}
              className="bg-[#d53b00] hover:bg-[#aa2f00] text-white h-10 px-6 text-xs sm:text-sm font-bold rounded-full shadow-none"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đặt phòng ngay</span>
            </Button>

            {/* Mobile Navigation Drawer Trigger */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full"
                  aria-label="Menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#000000] border-l border-white/10 text-white p-0 flex flex-col justify-between w-80">
                <SheetHeader className="p-6 border-b border-white/10 text-left">
                  <SheetTitle>
                    <div className="relative h-9 w-40">
                      <Image
                        src="/images/m_dalats_logo_horizontal.svg"
                        alt="M_Dalats Villa"
                        fill
                        className="object-contain object-left invert"
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-6 flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                    Menu điều hướng
                  </span>
                  <nav className="flex flex-col divide-y divide-white/10">
                    {navLinks.map((item, idx) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileSheetOpen(false)}
                          className={`flex items-center justify-between py-4 text-sm font-medium transition-colors ${
                            isActive ? "text-[#53b1ff]" : "text-neutral-300 hover:text-white"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs text-neutral-500 font-mono">0{idx + 1}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-6 border-t border-white/10 space-y-3 bg-[#121314]">
                  {!session?.user && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileSheetOpen(false);
                        handleAuthClick();
                      }}
                      className="w-full h-11 border-white/20 bg-transparent text-white rounded-full text-sm font-bold"
                    >
                      Đăng nhập tài khoản
                    </Button>
                  )}
                  <Button
                    variant="commerce"
                    onClick={() => {
                      setMobileSheetOpen(false);
                      handleBookingClick();
                    }}
                    className="w-full h-11 bg-[#d53b00] hover:bg-[#aa2f00] text-white rounded-full text-sm font-bold"
                  >
                    Đặt phòng trực tuyến
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
