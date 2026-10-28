"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  RefreshCw,
  Plus,
  ExternalLink,
  LogOut,
  Bell,
  ChevronRight,
  Shield,
  Home,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import type { AdminTab } from "./types";

interface DashboardHeaderProps {
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
  onOpenAddRoom: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function DashboardHeader({
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
  onOpenAddRoom,
  searchQuery,
  setSearchQuery,
}: DashboardHeaderProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const tabLabels: Record<AdminTab, string> = {
    overview: "Tổng quan hoạt động",
    bookings: "Quản lý đơn đặt phòng",
    rooms: "Quản lý phòng nghỉ",
    customers: "Khách hàng & CRM",
    messages: "Hộp thư liên hệ",
  };

  return (
    <header className="shrink-0 sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Mobile Menu Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-stone-700 hover:bg-stone-100"
                aria-label="Mở menu quản trị"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-white border-stone-200">
              <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                pendingBookingsCount={pendingBookingsCount}
                roomsCount={roomsCount}
                customersCount={customersCount}
                messagesCount={messagesCount}
                userName={userName}
                userEmail={userEmail}
                userRole={userRole}
                userImage={userImage}
                isRefreshing={isRefreshing}
                onRefreshAll={onRefreshAll}
                onSignOut={onSignOut}
                isMobileDrawer
                onCloseMobileDrawer={() => setMobileSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 truncate" aria-label="Breadcrumb">
            <Link
              href="/"
              className="hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Villa</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-600 font-medium hidden md:inline">Admin Extranet</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0 hidden md:inline" />
            <span className="text-stone-900 font-semibold truncate">
              {tabLabels[activeTab]}
            </span>
          </nav>
        </div>

        {/* Center: Quick Search Input */}
        <div className="hidden md:flex items-center max-w-xs w-full mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh mã đơn, tên, SĐT..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 rounded-md transition-all outline-none"
            />
          </div>
        </div>

        {/* Right: Actions & User Dropdown */}
        <div className="flex items-center gap-2">
          {/* Quick Add Room Button */}
          <Button
            size="sm"
            onClick={onOpenAddRoom}
            className="hidden sm:inline-flex bg-stone-900 hover:bg-stone-800 text-white gap-1.5 shadow-none font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phòng</span>
          </Button>

          {/* Refresh Data Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefreshAll}
            disabled={isRefreshing}
            title="Đồng bộ dữ liệu"
            className="h-9 w-9 text-stone-600 hover:text-stone-900 border-stone-200"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-stone-900" : ""}`}
            />
          </Button>

          {/* Notification Button */}
          {pendingBookingsCount > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setActiveTab("bookings")}
              title={`${pendingBookingsCount} đơn đặt phòng chờ xử lý`}
              className="relative h-9 w-9 text-stone-700 border-stone-200 hover:bg-stone-50"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-900 text-white font-medium text-[9px] flex items-center justify-center">
                {pendingBookingsCount}
              </span>
            </Button>
          )}

          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors outline-none cursor-pointer"
              >
                <Avatar className="w-8 h-8 rounded-full border border-stone-200 bg-stone-100 text-stone-800">
                  {userImage && <AvatarImage src={userImage} alt={userName || "Admin"} />}
                  <AvatarFallback className="bg-stone-200 text-stone-800 text-xs font-semibold">
                    {userName ? userName.charAt(0).toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 bg-white border-stone-200 shadow-lg">
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold text-stone-900 leading-none">
                    {userName || "Quản trị viên"}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-none truncate">
                    {userEmail || "admin@dalats.vn"}
                  </p>
                  <div className="pt-1">
                    <Badge
                      variant={userRole === "admin" ? "destructive" : "warning"}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {userRole === "admin" ? "Quản trị viên" : "Lễ tân Villa"}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-stone-100 my-1" />
              <DropdownMenuItem
                onClick={() => setActiveTab("overview")}
                className="text-xs text-stone-700 hover:text-stone-900 cursor-pointer"
              >
                Dashboard tổng quan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveTab("bookings")}
                className="text-xs text-stone-700 hover:text-stone-900 cursor-pointer flex justify-between"
              >
                <span>Đơn đặt phòng</span>
                {pendingBookingsCount > 0 && (
                  <Badge variant="warning" className="text-[9px] px-1 py-0">
                    {pendingBookingsCount}
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveTab("rooms")}
                className="text-xs text-stone-700 hover:text-stone-900 cursor-pointer"
              >
                Quản trị danh sách phòng
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-stone-100 my-1" />
              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  target="_blank"
                  className="text-xs text-stone-700 hover:text-stone-900 cursor-pointer flex items-center justify-between w-full"
                >
                  <span>Xem Website khách</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-stone-100 my-1" />
              <DropdownMenuItem
                onClick={onSignOut}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất hệ thống</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
