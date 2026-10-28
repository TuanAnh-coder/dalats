"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Users,
  MessageSquare,
  ExternalLink,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import type { AdminTab } from "./types";

interface DashboardSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingBookingsCount: number;
  roomsCount: number;
  customersCount: number;
  messagesCount: number;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  userImage?: string | null;
  isRefreshing?: boolean;
  onRefreshAll: () => void;
  onSignOut: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  pendingBookingsCount,
  roomsCount,
  customersCount,
  messagesCount,
  userName = "Quản trị viên",
  userEmail = "admin@dalats.vn",
  userRole = "admin",
  userImage,
  isRefreshing = false,
  onRefreshAll,
  onSignOut,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: DashboardSidebarProps) {
  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: LayoutDashboard,
    },
    {
      id: "bookings",
      label: "Đơn đặt phòng",
      icon: CalendarCheck,
      badge: pendingBookingsCount,
    },
    {
      id: "rooms",
      label: "Quản lý phòng",
      icon: BedDouble,
      badge: roomsCount,
    },
    {
      id: "customers",
      label: "Khách hàng CRM",
      icon: Users,
      badge: customersCount,
    },
    {
      id: "messages",
      label: "Hộp thư liên hệ",
      icon: MessageSquare,
      badge: messagesCount,
    },
  ];

  const handleTabClick = (tab: AdminTab) => {
    setActiveTab(tab);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside
      className={`flex flex-col h-full bg-white text-stone-900 border-r border-stone-200 ${
        isMobileDrawer ? "w-full" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-stone-200">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-stone-900 text-sm leading-tight">
              M_Dalats Villa
            </span>
            <span className="text-[11px] text-stone-500 font-normal">
              Admin Extranet
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          <div className="px-3 mb-2 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
            Quản trị
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-stone-100 text-stone-900 font-semibold"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-stone-900" : "text-stone-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${
                        isActive
                          ? "bg-white text-stone-900 border border-stone-200"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
            Lối tắt
          </div>
          <div className="space-y-1">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-stone-400" />
                <span>Xem Website</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onRefreshAll}
              disabled={isRefreshing}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RefreshCw
                  className={`w-4 h-4 text-stone-400 ${
                    isRefreshing ? "animate-spin text-stone-900" : ""
                  }`}
                />
                <span>Làm mới dữ liệu</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/50">
        <div className="flex items-center justify-between gap-2 p-2 rounded-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="w-8 h-8 rounded-full border border-stone-200 bg-stone-100 text-stone-800">
              {userImage && <AvatarImage src={userImage} alt={userName || "Admin"} />}
              <AvatarFallback className="bg-stone-200 text-stone-800 text-xs font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-900 truncate leading-tight">
                {userName || "Quản trị viên"}
              </p>
              <p className="text-[11px] text-stone-500 truncate leading-tight mt-0.5">
                {userRole === "admin" ? "Admin" : "Lễ tân"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            title="Đăng xuất"
            className="h-8 w-8 text-stone-400 hover:text-stone-900 hover:bg-stone-200"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
