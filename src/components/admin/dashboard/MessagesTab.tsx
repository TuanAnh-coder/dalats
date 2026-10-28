"use client";

import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { AdminMessage } from "./types";

interface MessagesTabProps {
  messages: AdminMessage[];
  onDeleteMessage: (messageId: number) => void;
}

export function MessagesTab({
  messages,
  onDeleteMessage,
}: MessagesTabProps) {
  const [search, setSearch] = useState("");

  const filteredMessages = messages.filter((m) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.phone && m.phone.includes(q)) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {
      return String(date);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
            Hộp thư liên hệ & Thắc mắc
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tổng cộng {messages.length} thư phản hồi từ khách qua form liên hệ của website
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-stone-200 bg-white shadow-none">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên người gửi, email, nội dung thư..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 rounded-md outline-none transition-all"
            />
          </div>
          <span className="text-xs text-stone-500 shrink-0">
            {filteredMessages.length} kết quả
          </span>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <Card className="border-stone-200 bg-white p-12 text-center text-stone-400 text-xs shadow-none">
            {messages.length === 0
              ? "Hộp thư liên hệ đang trống. Khi khách hàng gửi tin nhắn từ website, nội dung sẽ xuất hiện ở đây."
              : "Không tìm thấy tin nhắn nào phù hợp với từ khóa tìm kiếm."}
          </Card>
        ) : (
          filteredMessages.map((m) => (
            <Card
              key={m.id}
              className="border-stone-200 bg-white hover:border-stone-300 transition-colors shadow-none text-xs"
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{m.name}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{formatDate(m.createdAt)}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-stone-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <a href={`mailto:${m.email}`} className="hover:text-stone-900 underline">
                          {m.email}
                        </a>
                      </span>
                      {m.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <a href={`tel:${m.phone}`} className="hover:text-stone-900">
                            {m.phone}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Bạn chắc chắn muốn xóa thư từ "${m.name}"?`)) {
                        onDeleteMessage(m.id);
                      }
                    }}
                    className="h-8 px-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 self-end sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Xóa</span>
                  </Button>
                </div>

                <div className="pt-3">
                  <p className="text-stone-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {m.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
