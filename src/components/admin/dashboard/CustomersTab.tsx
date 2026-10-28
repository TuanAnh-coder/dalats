"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  Award,
  Crown,
  Sparkles,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Eye,
  Phone,
  Mail,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { AdminCustomer } from "./types";

interface CustomersTabProps {
  customers: AdminCustomer[];
  currentUserId?: string;
  onSelectCustomer: (customer: AdminCustomer) => void;
  onUpdateRole: (userId: string, role: string) => void;
  onToggleBan: (userId: string, currentBanned: boolean) => void;
  formatPrice: (price: number) => string;
}

export function CustomersTab({
  customers,
  currentUserId,
  onSelectCustomer,
  onUpdateRole,
  onToggleBan,
  formatPrice,
}: CustomersTabProps) {
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((c) => {
    const matchesTier =
      tierFilter === "all" || c.vipTier.toLowerCase() === tierFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q));
    return matchesTier && matchesSearch;
  });

  const getVipBadge = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "diamond":
        return (
          <Badge variant="outline" className="border-stone-900 bg-stone-900 text-white text-[10px] gap-1 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Kim Cương</span>
          </Badge>
        );
      case "gold":
        return (
          <Badge variant="outline" className="border-stone-300 text-stone-800 text-[10px] gap-1 font-medium">
            <Crown className="w-3 h-3 text-stone-600" />
            <span>Hạng Vàng</span>
          </Badge>
        );
      case "silver":
        return (
          <Badge variant="outline" className="border-stone-200 text-stone-600 text-[10px] gap-1 font-normal">
            <Award className="w-3 h-3 text-stone-400" />
            <span>Hạng Bạc</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-stone-200 text-stone-500 text-[10px] font-normal">
            <span>Tiêu chuẩn</span>
          </Badge>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="text-[10px] px-2 py-0.5 bg-stone-900 text-white">
            Admin
          </Badge>
        );
      case "staff":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-stone-300 text-stone-700">
            Lễ tân
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 text-stone-600">
            Khách hàng
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
            Khách hàng & CRM Extranet
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tổng cộng {customers.length} khách hàng • Theo dõi hạng thành viên, chi tiêu và phân quyền nhân sự
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-stone-200 bg-white shadow-none">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "Tất cả", count: customers.length },
              {
                id: "diamond",
                label: "Kim Cương",
                count: customers.filter((c) => c.vipTier === "diamond").length,
              },
              {
                id: "gold",
                label: "Hạng Vàng",
                count: customers.filter((c) => c.vipTier === "gold").length,
              },
              {
                id: "silver",
                label: "Hạng Bạc",
                count: customers.filter((c) => c.vipTier === "silver").length,
              },
              {
                id: "standard",
                label: "Tiêu chuẩn",
                count: customers.filter((c) => c.vipTier === "standard").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTierFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  tierFilter === tab.id
                    ? "bg-stone-900 text-white shadow-none"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    tierFilter === tab.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 rounded-md outline-none transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Customers Table */}
      <Card className="hidden md:block border-stone-200 bg-white shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-stone-200">
                  <TableHead className="text-xs font-medium text-stone-500">Khách hàng</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Hạng hội viên</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Phân quyền</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Tài khoản</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Số đơn</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Tổng chi tiêu</TableHead>
                  <TableHead className="text-right text-xs font-medium text-stone-500">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-stone-400 text-xs">
                      Không tìm thấy khách hàng nào phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const isSelf = Boolean(currentUserId && customer.id === currentUserId);
                    return (
                      <TableRow key={customer.id} className="text-xs border-stone-100 hover:bg-stone-50/80 transition-colors">
                        {/* Customer Info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
                              <AvatarFallback className="font-semibold text-xs text-stone-700">
                                {customer.name ? customer.name.charAt(0).toUpperCase() : "K"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-stone-900">{customer.name}</div>
                              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-stone-400" />
                                <span>{customer.email}</span>
                              </div>
                              {customer.phone && (
                                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-stone-400" />
                                  <span>{customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* VIP Tier */}
                        <TableCell>{getVipBadge(customer.vipTier)}</TableCell>

                        {/* Role Selector */}
                        <TableCell>
                          {customer.isRegistered ? (
                            <select
                              value={customer.role}
                              disabled={isSelf}
                              onChange={(e) => onUpdateRole(customer.id, e.target.value)}
                              className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 outline-none font-medium text-stone-800 disabled:opacity-50"
                            >
                              <option value="user">Khách hàng</option>
                              <option value="staff">Lễ tân</option>
                              <option value="admin">Quản trị viên</option>
                            </select>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">Khách vãng lai</span>
                          )}
                        </TableCell>

                        {/* Ban / Status */}
                        <TableCell>
                          {customer.isRegistered ? (
                            customer.banned ? (
                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => onToggleBan(customer.id, true)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-medium hover:bg-rose-100 cursor-pointer disabled:opacity-50"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Đang khóa</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => onToggleBan(customer.id, false)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-600/30 bg-emerald-50/40 text-emerald-700 text-[10px] font-medium hover:bg-emerald-100/50 cursor-pointer disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Hoạt động</span>
                              </button>
                            )
                          ) : (
                            <span className="text-[11px] text-stone-400">-</span>
                          )}
                        </TableCell>

                        {/* Bookings Count */}
                        <TableCell className="font-semibold text-stone-800">
                          {customer.totalBookings} lần
                        </TableCell>

                        {/* Total Spent */}
                        <TableCell className="font-semibold text-stone-900 whitespace-nowrap">
                          {formatPrice(customer.totalSpent)}
                        </TableCell>

                        {/* Action */}
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectCustomer(customer)}
                            className="h-8 px-2.5 text-xs text-stone-700 hover:text-stone-900 border-stone-200"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-stone-500" />
                            <span>Hồ sơ</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            Không tìm thấy khách hàng nào
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="border-stone-200 bg-white p-4 space-y-3 text-xs shadow-none">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">{customer.name}</span>
                {getVipBadge(customer.vipTier)}
              </div>
              <div className="text-[11px] text-stone-500">
                <p>{customer.email}</p>
                <p>{customer.phone || "Chưa có SĐT"}</p>
              </div>
              <div className="flex items-center justify-between border-t border-b border-stone-100 py-2">
                <span>{customer.totalBookings} lần đặt phòng</span>
                <span className="font-semibold text-stone-900">{formatPrice(customer.totalSpent)}</span>
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectCustomer(customer)}
                  className="h-7 px-3 text-[11px] border-stone-200 text-stone-700"
                >
                  Xem lịch sử đơn
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
