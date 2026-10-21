"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  Users,
  Home,
  RefreshCw,
  Phone,
  Mail,
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Filter,
  LogOut,
  Shield,
  ShieldAlert,
  UserCheck,
  Plus,
  Edit,
  Award,
  Crown,
  Sparkles,
  Ban,
  Eye,
} from "lucide-react";
import { api } from "~/trpc/react";
import { authClient } from "~/server/better-auth/client";
import type { Room } from "~/server/db/schema";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "rooms" | "customers" | "messages">("overview");
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerTierFilter, setCustomerTierFilter] = useState<string>("all");

  // Editing state for rooms
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);

  // Customer detail modal
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isRegistered: boolean;
    banned: boolean;
    totalBookings: number;
    totalSpent: number;
    lastBookingDate: string | null;
    vipTier: string;
    bookingCodes: string[];
  } | null>(null);

  // Queries
  const { data: bookings = [], isLoading: bookingsLoading, refetch: refetchBookings } =
    api.booking.getAll.useQuery();
  const { data: rooms = [], isLoading: roomsLoading, refetch: refetchRooms } =
    api.room.getAll.useQuery();
  const { data: customers = [], isLoading: customersLoading, refetch: refetchCustomers } =
    api.customer.getAll.useQuery();
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } =
    api.contact.getAllMessages.useQuery();

  // Mutations
  const updateBookingStatus = api.booking.updateStatus.useMutation({
    onSuccess: () => refetchBookings(),
  });
  const deleteBooking = api.booking.delete.useMutation({
    onSuccess: () => refetchBookings(),
  });

  const createRoom = api.room.create.useMutation({
    onSuccess: () => {
      setIsAddRoomOpen(false);
      refetchRooms();
    },
  });
  const updateRoom = api.room.update.useMutation({
    onSuccess: () => {
      setEditingRoom(null);
      setEditingPriceId(null);
      refetchRooms();
    },
  });
  const toggleRoomAvailability = api.room.toggleAvailability.useMutation({
    onSuccess: () => refetchRooms(),
  });
  const deleteRoom = api.room.delete.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      refetchRooms();
    },
  });

  const updateCustomerRole = api.customer.updateRole.useMutation({
    onSuccess: () => refetchCustomers(),
  });
  const toggleCustomerBan = api.customer.toggleBan.useMutation({
    onSuccess: () => refetchCustomers(),
  });

  const deleteMessage = api.contact.deleteMessage.useMutation({
    onSuccess: () => refetchMessages(),
  });

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  // KPI Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === "confirmed").length;
  const availableRoomsCount = rooms.filter((r) => r.isAvailable).length;

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === "all" || b.status === bookingFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.toLowerCase().includes(q) ||
      (b.room?.name || "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q);

    const matchesTier =
      customerTierFilter === "all" || c.vipTier === customerTierFilter;

    return matchesSearch && matchesTier;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Đã xác nhận
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            <Clock className="w-3 h-3" /> Chờ xử lý
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            <Check className="w-3 h-3" /> Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            <XCircle className="w-3 h-3" /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const getVipBadge = (tier: string) => {
    switch (tier) {
      case "VIP Kim Cương":
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Crown className="w-3 h-3 text-purple-600" /> VIP Kim Cương
          </span>
        );
      case "VIP Vàng":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Award className="w-3 h-3 text-amber-600" /> VIP Vàng
          </span>
        );
      case "Khách Thân Thiết":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Thân Thiết
          </span>
        );
      case "Thành Viên":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-[10px]">
            Thành Viên
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[10px]">
            Khách Mới
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-xs text-[10px] font-bold">
            Admin
          </span>
        );
      case "staff":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-xs text-[10px] font-bold">
            Lễ tân
          </span>
        );
      default:
        return (
          <span className="bg-stone-50 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-xs text-[10px]">
            Khách hàng
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f1] text-[#222222] flex flex-col selection:bg-[#367156] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#ece7dd] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-[#367156] text-white rounded-xs flex items-center justify-center font-serif text-lg font-bold">
                M
              </div>
              <div>
                <span className="font-serif text-base tracking-tight font-bold text-[#367156] block leading-none">
                  M_Dalats
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#367156] font-semibold block mt-0.5">
                  Boutique Villa
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-5 w-px bg-[#ece7dd] mx-1" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#367156]/10 text-[#367156] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Extranet Management System</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-[#faf7f1] px-3 py-1.5 rounded-sm border border-[#ece7dd]">
              <div className="w-6 h-6 rounded-full bg-[#367156] text-white flex items-center justify-center font-bold text-[10px]">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="text-left">
                <span className="font-semibold text-[#367156] block text-[11px] leading-tight">
                  {session?.user?.name || "Quản Trị Viên"}
                </span>
                <span className="text-[9px] text-[#367156] font-bold uppercase tracking-wider block">
                  Role: {(session?.user as { role?: string })?.role || "admin"}
                </span>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[#555555] hover:text-[#367156] px-2.5 py-1.5 rounded-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Xem Website</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 bg-[#FAF9F6] hover:bg-rose-50 text-rose-700 border border-[#d6cebf] hover:border-rose-300 px-3 py-1.5 rounded-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#ece7dd] pb-3 overflow-x-auto no-scrollbar gap-2">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:bg-white hover:text-[#367156]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === "bookings"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:bg-white hover:text-[#367156]"
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Đơn đặt phòng</span>
              {pendingBookingsCount > 0 && (
                <span className="ml-1 bg-[#f27052] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rooms")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "rooms"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:bg-white hover:text-[#367156]"
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Quản trị phòng</span>
              <span className="text-[10px] opacity-80">({rooms.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "customers"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:bg-white hover:text-[#367156]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Khách hàng (CRM)</span>
              <span className="text-[10px] opacity-80">({customers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:bg-white hover:text-[#367156]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tin nhắn</span>
              {messages.length > 0 && (
                <span className="ml-1 bg-[#367156] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {messages.length}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                refetchBookings();
                refetchRooms();
                refetchCustomers();
                refetchMessages();
              }}
              className="p-2 text-[#666666] hover:text-[#367156] hover:bg-white rounded-xs border border-[#ece7dd] transition-colors cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-sm border border-[#ece7dd] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-xs uppercase tracking-wider font-semibold">Tổng doanh thu</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xs">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl font-bold text-[#367156]">
                  {formatPrice(totalRevenue)}
                </div>
                <p className="text-[11px] text-[#367156] font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Tự động cộng dồn từ các đơn xác nhận
                </p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-[#ece7dd] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-xs uppercase tracking-wider font-semibold">Đơn chờ xử lý</span>
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl font-bold text-[#f27052]">
                  {pendingBookingsCount} đơn
                </div>
                <p className="text-[11px] text-[#888888]">Cần liên hệ khách xác nhận cọc</p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-[#ece7dd] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-xs uppercase tracking-wider font-semibold">Tình trạng 11 phòng</span>
                  <div className="p-2 bg-[#367156]/10 text-[#367156] rounded-xs">
                    <BedDouble className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl font-bold text-[#367156]">
                  {availableRoomsCount} / {rooms.length} phòng
                </div>
                <p className="text-[11px] text-[#367156]">Đang mở đón khách tại Villa</p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-[#ece7dd] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-xs uppercase tracking-wider font-semibold">Tổng khách hàng</span>
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-xs">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl font-bold text-[#367156]">
                  {customers.length} khách
                </div>
                <p className="text-[11px] text-purple-700 font-medium">Hệ thống phân tầng VIP Agoda</p>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Bookings List */}
              <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-sm border border-[#ece7dd] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-[#367156]">
                    Đơn đặt phòng gần nhất
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs text-[#367156] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem tất cả ({bookings.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-[#FAF9F6] rounded-xs border border-[#ece7dd] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#367156]">{b.bookingCode}</span>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="font-medium text-[#222222]">
                          {b.customerName} • <span className="text-[#666666]">{b.customerPhone}</span>
                        </p>
                        <p className="text-[#777777]">
                          {b.room?.name || `Phòng #${b.roomId}`} • {b.checkIn} → {b.checkOut} ({b.totalNights} đêm)
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#f27052] block text-sm">
                          {formatPrice(b.totalPrice)}
                        </span>
                        {b.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus.mutate({ id: b.id, status: "confirmed" })}
                            className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded-xs text-[10px] font-semibold cursor-pointer"
                          >
                            Xác nhận ngay
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Villa Status Panel */}
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-[#ece7dd] shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-semibold text-[#367156]">
                  Phím tắt Quản Trị
                </h3>

                <div className="space-y-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("rooms");
                      setIsAddRoomOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-[#367156]/5 hover:bg-[#367156]/10 border border-[#367156]/20 rounded-xs text-[#367156] font-semibold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#367156]" /> Thêm phòng mới vào Villa
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("customers")}
                    className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xs text-purple-900 font-semibold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" /> Quản lý khách hàng & VIP
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("rooms")}
                    className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xs text-amber-900 font-semibold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-amber-600" /> Đổi giá & Khóa phòng
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-3 border-t border-[#ece7dd] text-[11px] text-[#666666] space-y-1">
                  <p><strong>Hotline Quản gia:</strong> 0939 014 234</p>
                  <p><strong>Địa chỉ:</strong> 14 Đường 3 Tháng 4, Phường 3, Đà Lạt</p>
                  <p><strong>Hệ thống:</strong> Agoda Extranet & Next.js 15 Engine</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-sm border border-[#ece7dd] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#888888]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                  className="w-full bg-[#FAF9F6] border border-[#d6cebf] pl-9 pr-3 py-1.5 text-xs rounded-xs focus:outline-hidden focus:border-[#367156]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setBookingFilter(filter)}
                    className={`px-3 py-1.5 rounded-xs font-medium uppercase tracking-wider text-[11px] transition-colors cursor-pointer ${
                      bookingFilter === filter
                        ? "bg-[#367156] text-white"
                        : "bg-[#FAF9F6] text-[#666666] hover:bg-[#ece7dd]"
                    }`}
                  >
                    {filter === "all" ? "Tất cả" : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table Desktop */}
            <div className="hidden md:block bg-white rounded-sm border border-[#ece7dd] shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#ece7dd] text-[#666666] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-semibold">Mã đơn</th>
                    <th className="py-3 px-4 font-semibold">Khách hàng</th>
                    <th className="py-3 px-4 font-semibold">Phòng nghỉ</th>
                    <th className="py-3 px-4 font-semibold">Thời gian lưu trú</th>
                    <th className="py-3 px-4 font-semibold">Tổng tiền</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece7dd]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#888888]">
                        Không tìm thấy đơn đặt phòng nào.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#367156] whitespace-nowrap">
                          {b.bookingCode}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#222222]">{b.customerName}</div>
                          <div className="text-[11px] text-[#666666]">{b.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-[#367156]">
                          {b.room?.name || `#${b.roomId}`}
                        </td>
                        <td className="py-3 px-4 text-[#555555] whitespace-nowrap">
                          {b.checkIn} → {b.checkOut} ({b.totalNights} đêm)
                        </td>
                        <td className="py-3 px-4 font-bold text-[#f27052] whitespace-nowrap">
                          {formatPrice(b.totalPrice)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(b.status)}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => updateBookingStatus.mutate({ id: b.id, status: "confirmed" })}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-xs transition-colors cursor-pointer"
                                title="Xác nhận"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {b.status === "confirmed" && (
                              <button
                                type="button"
                                onClick={() => updateBookingStatus.mutate({ id: b.id, status: "completed" })}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-xs transition-colors cursor-pointer"
                                title="Hoàn tất trả phòng"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {b.status !== "cancelled" && (
                              <button
                                type="button"
                                onClick={() => updateBookingStatus.mutate({ id: b.id, status: "cancelled" })}
                                className="bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded-xs transition-colors cursor-pointer"
                                title="Hủy đơn"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn xóa đơn ${b.bookingCode}?`)) {
                                  deleteBooking.mutate({ id: b.id });
                                }
                              }}
                              className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-xs transition-colors cursor-pointer"
                              title="Xóa đơn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-sm border border-[#ece7dd] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#367156] text-xs">{b.bookingCode}</span>
                    {getStatusBadge(b.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#222222]">{b.customerName}</h4>
                    <p className="text-xs text-[#555555]">{b.customerPhone} • {b.customerEmail}</p>
                  </div>
                  <div className="bg-[#FAF9F6] p-2 rounded-xs text-xs space-y-0.5">
                    <p className="font-medium text-[#367156]">Phòng: {b.room?.name || `#${b.roomId}`}</p>
                    <p className="text-[#666666]">{b.checkIn} → {b.checkOut} ({b.totalNights} đêm)</p>
                    <p className="text-[#f27052] font-bold">{formatPrice(b.totalPrice)}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-[#ece7dd]">
                    {b.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus.mutate({ id: b.id, status: "confirmed" })}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-xs text-xs font-semibold"
                      >
                        Xác nhận
                      </button>
                    )}
                    {b.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus.mutate({ id: b.id, status: "completed" })}
                        className="bg-blue-600 text-white px-3 py-1 rounded-xs text-xs font-semibold"
                      >
                        Hoàn tất
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ROOMS MANAGEMENT (AGODA EXTRANET STYLE) */}
        {activeTab === "rooms" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-sm border border-[#ece7dd]">
              <div>
                <h3 className="font-serif text-xl text-[#367156] font-semibold">
                  Hệ thống Quản Trị Phòng M_Dalats Villa
                </h3>
                <p className="text-xs text-[#777777]">
                  Toàn quyền chỉnh sửa giá bán, đóng/mở phòng đón khách, thêm phòng mới, cập nhật tiện ích
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddRoomOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#367156] hover:bg-[#244b39] text-white px-4 py-2 rounded-xs text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm phòng mới</span>
              </button>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms.map((room) => {
                const isPriceEditing = editingPriceId === room.id;

                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-sm border border-[#ece7dd] shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview & Badges */}
                      <div className="relative h-44 w-full bg-[#FAF9F6]">
                        <Image
                          src={room.image}
                          alt={room.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#367156]/90 text-white px-2 py-0.5 rounded-xs text-[10px] font-mono">
                          Phòng {room.roomNumber}
                        </div>
                        <div className="absolute top-2 right-2">
                          {room.isAvailable ? (
                            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-xs text-[10px] font-semibold">
                              Đang mở bán
                            </span>
                          ) : (
                            <span className="bg-rose-600 text-white px-2 py-0.5 rounded-xs text-[10px] font-semibold">
                              Đang tạm khóa
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Room Specs */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-lg font-bold text-[#367156]">{room.name}</h4>
                          <button
                            type="button"
                            onClick={() => setEditingRoom(room)}
                            className="text-xs text-[#367156] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" /> Sửa
                          </button>
                        </div>

                        <p className="text-xs text-[#666666]">
                          {room.area}m² • {room.viewType} • {room.bedType}
                        </p>
                        <p className="text-[11px] text-[#777777]">
                          Sức chứa: {room.maxAdults} người lớn, {room.maxChildren} trẻ em
                        </p>

                        {/* Inline Price Edit */}
                        <div className="pt-2 border-t border-[#ece7dd] flex items-center justify-between">
                          <span className="text-xs text-[#777777]">Giá / đêm:</span>
                          {isPriceEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editingPriceValue}
                                onChange={(e) => setEditingPriceValue(Number(e.target.value))}
                                className="w-28 bg-[#FAF9F6] border border-[#367156] px-2 py-1 text-xs rounded-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateRoom.mutate({ id: room.id, pricePerNight: editingPriceValue })
                                }
                                className="bg-[#367156] text-white p-1 rounded-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceId(null)}
                                className="text-[#888888] p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#f27052] text-sm">
                                {formatPrice(room.pricePerNight)}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPriceId(room.id);
                                  setEditingPriceValue(room.pricePerNight);
                                }}
                                className="text-xs text-[#367156] hover:underline cursor-pointer"
                              >
                                Đổi giá
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleRoomAvailability.mutate({ id: room.id })}
                          className={`flex-1 py-1.5 px-2 rounded-xs text-xs font-semibold transition-colors cursor-pointer text-center ${
                            room.isAvailable
                              ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {room.isAvailable ? "Khóa phòng" : "Mở đón khách"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa phòng "${room.name}"?`)) {
                              deleteRoom.mutate({ id: room.id });
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xs transition-colors cursor-pointer"
                          title="Xóa phòng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS CRM (AGODA LOYALTY & ROLES) */}
        {activeTab === "customers" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Customer Search & Tier Filters */}
            <div className="bg-white p-4 rounded-sm border border-[#ece7dd] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#888888]" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Tìm tên khách, số điện thoại, email..."
                  className="w-full bg-[#FAF9F6] border border-[#d6cebf] pl-9 pr-3 py-1.5 text-xs rounded-xs focus:outline-hidden focus:border-[#367156]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
                {["all", "VIP Kim Cương", "VIP Vàng", "Khách Thân Thiết", "Khách Mới"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setCustomerTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-xs font-medium uppercase tracking-wider text-[11px] transition-colors cursor-pointer ${
                      customerTierFilter === tier
                        ? "bg-[#367156] text-white"
                        : "bg-[#FAF9F6] text-[#666666] hover:bg-[#ece7dd]"
                    }`}
                  >
                    {tier === "all" ? "Tất cả hạng" : tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-sm border border-[#ece7dd] shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#ece7dd] text-[#666666] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-semibold">Khách hàng</th>
                    <th className="py-3 px-4 font-semibold">Liên hệ</th>
                    <th className="py-3 px-4 font-semibold">Hạng VIP Agoda</th>
                    <th className="py-3 px-4 font-semibold">Phân quyền Role</th>
                    <th className="py-3 px-4 font-semibold">Lịch sử đặt phòng</th>
                    <th className="py-3 px-4 font-semibold">Tổng chi tiêu</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece7dd]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#888888]">
                        Không tìm thấy khách hàng nào.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#367156] text-white flex items-center justify-center font-bold text-xs uppercase">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-[#222222] flex items-center gap-1.5">
                                <span>{c.name}</span>
                                {c.isRegistered && (
                                  <span className="text-[9px] bg-blue-50 text-blue-700 px-1 py-0.2 rounded-xs">
                                    Đã đăng ký
                                  </span>
                                )}
                              </div>
                              {c.banned && (
                                <span className="text-[10px] text-red-600 font-bold block">Đang bị khóa</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-[#222222] font-medium">{c.phone || "Chưa có SĐT"}</div>
                          <div className="text-[11px] text-[#777777]">{c.email}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{getVipBadge(c.vipTier)}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {c.isRegistered ? (
                            <select
                              value={c.role}
                              onChange={(e) => {
                                updateCustomerRole.mutate({
                                  userId: c.id,
                                  role: e.target.value as "admin" | "staff" | "user",
                                });
                              }}
                              className="bg-[#FAF9F6] border border-[#d6cebf] px-2 py-1 rounded-xs text-[11px] font-semibold text-[#367156] focus:outline-hidden"
                            >
                              <option value="user">Khách hàng (user)</option>
                              <option value="staff">Lễ tân (staff)</option>
                              <option value="admin">Quản trị viên (admin)</option>
                            </select>
                          ) : (
                            <span className="text-[11px] text-[#888888]">Khách vãng lai</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-[#367156]">{c.totalBookings} lần đặt</span>
                          {c.lastBookingDate && (
                            <span className="text-[11px] text-[#777777] block">Gần nhất: {c.lastBookingDate}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#f27052] whitespace-nowrap">
                          {formatPrice(c.totalSpent)}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedCustomer(c)}
                              className="bg-[#367156]/10 hover:bg-[#367156] text-[#367156] hover:text-white p-1.5 rounded-xs transition-colors cursor-pointer"
                              title="Xem chi tiết & đơn đặt"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {c.isRegistered && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCustomerBan.mutate({
                                    userId: c.id,
                                    banned: !c.banned,
                                  })
                                }
                                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                                  c.banned
                                    ? "bg-rose-600 text-white"
                                    : "text-stone-500 hover:bg-stone-100 hover:text-rose-600"
                                }`}
                                title={c.banned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT INQUIRIES */}
        {activeTab === "messages" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-[#367156] font-semibold">
                  Tin nhắn khách hàng gửi từ Website
                </h3>
                <p className="text-xs text-[#777777]">
                  Các yêu cầu đặt tiệc, tư vấn phòng, phản hồi dịch vụ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.length === 0 ? (
                <div className="col-span-2 bg-white p-8 rounded-sm text-center text-[#888888] text-sm border border-[#ece7dd]">
                  Chưa có tin nhắn liên hệ nào.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white p-5 rounded-sm border border-[#ece7dd] shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#367156] text-sm">{msg.name}</span>
                        <span className="text-[#888888] text-[11px]">
                          {new Date(msg.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="text-xs text-[#666666] mb-3 space-y-0.5">
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#367156]" /> {msg.email}
                        </p>
                        {msg.phone && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#367156]" /> {msg.phone}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-[#333333] bg-[#FAF9F6] p-3 rounded-xs border border-[#ece7dd] whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ece7dd]">
                      <a
                        href={`mailto:${msg.email}?subject=Phản hồi từ M_Dalats Boutique Villa`}
                        className="bg-[#367156] hover:bg-[#244b39] text-white text-xs px-3 py-1.5 rounded-xs transition-colors"
                      >
                        Gửi Email trả lời
                      </a>
                      <button
                        type="button"
                        onClick={() => deleteMessage.mutate({ id: msg.id })}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW ROOM */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-[#ece7dd] max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ece7dd] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#367156]">
                Thêm phòng nghỉ mới vào M_Dalats Villa
              </h3>
              <button
                type="button"
                onClick={() => setIsAddRoomOpen(false)}
                className="text-[#888888] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);

                createRoom.mutate({
                  name: fd.get("name") as string,
                  roomNumber: fd.get("roomNumber") as string,
                  area: Number(fd.get("area")),
                  maxAdults: Number(fd.get("maxAdults")),
                  maxChildren: Number(fd.get("maxChildren")),
                  bedType: fd.get("bedType") as string,
                  viewType: fd.get("viewType") as string,
                  pricePerNight: Number(fd.get("pricePerNight")),
                  originalPrice: Number(fd.get("originalPrice")) || undefined,
                  image: fd.get("image") as string,
                  shortDescription: fd.get("shortDescription") as string,
                  description: fd.get("description") as string,
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Tên phòng *</label>
                  <input
                    name="name"
                    required
                    defaultValue="M_Dalats Suite"
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Số phòng (Mã số) *</label>
                  <input
                    name="roomNumber"
                    required
                    defaultValue="205"
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Diện tích (m²) *</label>
                  <input
                    type="number"
                    name="area"
                    required
                    defaultValue={25}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Người lớn tối đa *</label>
                  <input
                    type="number"
                    name="maxAdults"
                    required
                    defaultValue={2}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Trẻ em tối đa</label>
                  <input
                    type="number"
                    name="maxChildren"
                    defaultValue={2}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Loại giường *</label>
                  <input
                    name="bedType"
                    required
                    defaultValue="1 Giường King Lớn"
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Loại View *</label>
                  <input
                    name="viewType"
                    required
                    defaultValue="View rừng thông & thung lũng"
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Giá bán mỗi đêm (VNĐ) *</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    required
                    defaultValue={1200000}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs font-bold text-[#f27052]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Giá gốc niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    defaultValue={1500000}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs text-[#888888]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#555555] block mb-1">Đường dẫn ảnh đại diện *</label>
                <input
                  name="image"
                  required
                  defaultValue="/images/DH_01791-HDR-Edit-700x466.jpg"
                  className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#555555] block mb-1">Mô tả ngắn</label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue="Phòng nghỉ cao cấp với ban công view trọn cảnh đồi thông, nội thất gỗ mộc mạc."
                  className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#ece7dd]">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 border border-[#d6cebf] text-[#666666] rounded-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createRoom.isPending}
                  className="px-5 py-2 bg-[#367156] text-white rounded-xs font-semibold shadow-xs"
                >
                  {createRoom.isPending ? "Đang lưu..." : "Lưu phòng mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROOM DETAILS */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-[#ece7dd] max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ece7dd] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#367156]">
                Chỉnh sửa phòng: {editingRoom.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="text-[#888888] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);

                updateRoom.mutate({
                  id: editingRoom.id,
                  name: fd.get("name") as string,
                  roomNumber: fd.get("roomNumber") as string,
                  area: Number(fd.get("area")),
                  maxAdults: Number(fd.get("maxAdults")),
                  maxChildren: Number(fd.get("maxChildren")),
                  bedType: fd.get("bedType") as string,
                  viewType: fd.get("viewType") as string,
                  pricePerNight: Number(fd.get("pricePerNight")),
                  originalPrice: Number(fd.get("originalPrice")) || undefined,
                  image: fd.get("image") as string,
                  shortDescription: fd.get("shortDescription") as string,
                  description: fd.get("description") as string,
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Tên phòng *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingRoom.name}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Số phòng (Mã số) *</label>
                  <input
                    name="roomNumber"
                    required
                    defaultValue={editingRoom.roomNumber}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Diện tích (m²) *</label>
                  <input
                    type="number"
                    name="area"
                    required
                    defaultValue={editingRoom.area}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Người lớn tối đa *</label>
                  <input
                    type="number"
                    name="maxAdults"
                    required
                    defaultValue={editingRoom.maxAdults}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Trẻ em tối đa</label>
                  <input
                    type="number"
                    name="maxChildren"
                    defaultValue={editingRoom.maxChildren}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Loại giường *</label>
                  <input
                    name="bedType"
                    required
                    defaultValue={editingRoom.bedType}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Loại View *</label>
                  <input
                    name="viewType"
                    required
                    defaultValue={editingRoom.viewType}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Giá bán mỗi đêm (VNĐ) *</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    required
                    defaultValue={editingRoom.pricePerNight}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs font-bold text-[#f27052]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#555555] block mb-1">Giá gốc niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    defaultValue={editingRoom.originalPrice || Math.round(editingRoom.pricePerNight * 1.25)}
                    className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs text-[#888888]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#555555] block mb-1">Đường dẫn ảnh chính *</label>
                <input
                  name="image"
                  required
                  defaultValue={editingRoom.image}
                  className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#555555] block mb-1">Mô tả ngắn</label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={editingRoom.shortDescription || ""}
                  className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#ece7dd]">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 border border-[#d6cebf] text-[#666666] rounded-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updateRoom.isPending}
                  className="px-5 py-2 bg-[#367156] text-white rounded-xs font-semibold shadow-xs"
                >
                  {updateRoom.isPending ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CUSTOMER DETAIL & BOOKING HISTORY */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-[#ece7dd] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ece7dd] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#367156] font-bold block">
                  Hồ sơ khách hàng • M_Dalats CRM
                </span>
                <h3 className="font-serif text-xl font-bold text-[#367156]">
                  {selectedCustomer.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-[#888888] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#FAF9F6] p-4 rounded-xs border border-[#ece7dd] text-xs">
              <div>
                <span className="text-[#777777] block text-[11px]">Hạng hội viên:</span>
                <span className="mt-0.5 inline-block">{getVipBadge(selectedCustomer.vipTier)}</span>
              </div>
              <div>
                <span className="text-[#777777] block text-[11px]">Phân quyền Role:</span>
                <span className="mt-0.5 inline-block">{getRoleBadge(selectedCustomer.role)}</span>
              </div>
              <div>
                <span className="text-[#777777] block text-[11px]">Email:</span>
                <span className="font-semibold text-[#222222]">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-[#777777] block text-[11px]">Số điện thoại:</span>
                <span className="font-semibold text-[#222222]">{selectedCustomer.phone || "Chưa cung cấp"}</span>
              </div>
              <div>
                <span className="text-[#777777] block text-[11px]">Tổng số đơn đã đặt:</span>
                <span className="font-bold text-[#367156] text-sm">{selectedCustomer.totalBookings} lần</span>
              </div>
              <div>
                <span className="text-[#777777] block text-[11px]">Tổng chi tiêu tích lũy:</span>
                <span className="font-bold text-[#f27052] text-sm">{formatPrice(selectedCustomer.totalSpent)}</span>
              </div>
            </div>

            {/* List of customer's bookings */}
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-semibold text-[#367156]">
                Lịch sử đặt phòng của khách ({selectedCustomer.bookingCodes.length} đơn)
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {bookings
                  .filter((b) => selectedCustomer.bookingCodes.includes(b.bookingCode))
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-white border border-[#ece7dd] rounded-xs text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#367156]">{b.bookingCode}</span>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="text-[#555555] mt-0.5">
                          {b.room?.name || `#${b.roomId}`} • {b.checkIn} → {b.checkOut}
                        </p>
                      </div>
                      <span className="font-bold text-[#f27052]">{formatPrice(b.totalPrice)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#ece7dd]">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="bg-[#367156] text-white px-5 py-2 rounded-xs text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
