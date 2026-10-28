"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Navigation,
  MessageCircle,
} from "lucide-react";
import { api } from "~/trpc/react";
import { FadeIn, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

export function LocationSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const contactMutation = api.contact.submitMessage.useMutation({
    onSuccess: () => {
      setSentSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      name,
      email,
      phone: phone || undefined,
      message,
    });
  };

  return (
    <SectionStack
      id="location"
      index={110}
      fullHeight={true}
      sticky={true}
      dark
      className="py-12 xs:py-16 md:py-0 pt-16 xs:pt-20 md:pt-24 md:pb-8 bg-[#000000] text-white border-b border-white/10 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <FadeIn direction="up">
            <span className="text-[11px] sm:text-xs uppercase tracking-[2px] text-[#53b1ff] font-bold block mb-2">
              Location & Concierge • Vị Trí & Chỉ Đường
            </span>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight mb-2 sm:mb-3">
              Đến Với M_Dalats Boutique Villa
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-normal leading-relaxed">
              Tọa lạc tại triền dốc Khe Sanh yên tĩnh, thuận tiện di chuyển tới Quảng trường Lâm Viên, Hồ Xuân Hương và các điểm tham quan nổi tiếng.
            </p>
          </FadeIn>
        </div>

        {/* 1-Tap Mobile Quick Action Pills Strip */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 mb-6 sm:mb-8">
          <a
            href="tel:0939014234"
            className="flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#222222] border border-white/15 text-white rounded-full py-2.5 px-4 text-xs font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#53b1ff]" />
            <span>Gọi 0939 014 234</span>
          </a>
          <a
            href="https://zalo.me/0939014234"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#222222] border border-white/15 text-white rounded-full py-2.5 px-4 text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#0070d1]" />
            <span>Nhắn Zalo</span>
          </a>
          <a
            href="https://maps.google.com/?q=14B+Khe+Sanh+Phuong+10+Da+Lat"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#222222] border border-white/15 text-white rounded-full py-2.5 px-4 text-xs font-bold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chỉ đường Maps</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Contact Details & Form */}
          <div className="lg:col-span-5">
            <FadeIn direction="right" duration={0.7}>
              <div className="bg-[#181818] p-5 sm:p-8 rounded-[12px] sm:rounded-[8px] border border-white/10">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-3 sm:mb-4 tracking-tight">
                  Thông tin liên hệ
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-neutral-300 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-white/10">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#53b1ff] shrink-0 mt-0.5" />
                    <span>14B Khe Sanh, Phường 10, TP. Đà Lạt, Lâm Đồng</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#53b1ff] shrink-0" />
                    <a href="tel:0939014234" className="text-white hover:text-[#53b1ff] font-semibold transition-colors">
                      Hotline: 0939 014 234
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#53b1ff] shrink-0" />
                    <a href="mailto:dalat@mdalatsvilla.com" className="text-white hover:text-[#53b1ff] transition-colors">
                      dalat@mdalatsvilla.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#53b1ff] shrink-0" />
                    <span>Nhận phòng: 14:00 • Trả phòng: 12:00</span>
                  </div>
                </div>

                {/* Quick Contact Form */}
                <div id="contact" className="scroll-mt-24">
                  <h4 className="font-serif text-base text-white font-normal mb-3">
                    Gửi lời nhắn cho quản gia
                  </h4>

                  {sentSuccess ? (
                    <div className="p-4 bg-[#121314] border border-white/10 text-white text-xs rounded-[8px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0070d1] shrink-0" />
                      <span>Cảm ơn quý khách! M_Dalats Villa đã nhận được lời nhắn và sẽ phản hồi sớm nhất.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {contactMutation.isError && (
                        <div className="p-2.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-[4px] flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                          <span>{contactMutation.error.message || "Đã xảy ra lỗi, vui lòng thử lại."}</span>
                        </div>
                      )}

                      <div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Họ và tên của bạn *"
                          className="w-full bg-[#121314] border border-white/20 px-3.5 py-2.5 text-base sm:text-xs text-white rounded-[6px] sm:rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Địa chỉ Email *"
                          className="w-full bg-[#121314] border border-white/20 px-3.5 py-2.5 text-base sm:text-xs text-white rounded-[6px] sm:rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Số điện thoại"
                          className="w-full bg-[#121314] border border-white/20 px-3.5 py-2.5 text-base sm:text-xs text-white rounded-[6px] sm:rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                        />
                      </div>

                      <div>
                        <textarea
                          required
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Lời nhắn hoặc yêu cầu hỗ trợ đặc biệt..."
                          className="w-full bg-[#121314] border border-white/20 px-3.5 py-2.5 text-base sm:text-xs text-white rounded-[6px] sm:rounded-[4px] focus:outline-none focus:border-[#0070d1] resize-none min-h-[80px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full bg-[#0070d1] hover:bg-[#0064b7] text-white rounded-full font-bold text-xs h-11 transition-all cursor-pointer shadow-none"
                      >
                        {contactMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <span className="flex items-center justify-center gap-1.5">
                            <Send className="w-3.5 h-3.5" /> Gửi thông điệp
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Google Maps Embed */}
          <div className="lg:col-span-7">
            <FadeIn direction="left" duration={0.7}>
              <div className="h-[280px] xs:h-[340px] sm:h-[480px] w-full rounded-[12px] sm:rounded-[8px] overflow-hidden border border-white/10 bg-[#181818] relative">
                <iframe
                  title="Bản đồ M_Dalats Villa"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.498424072895!2d108.4552!3d11.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU1JzUyLjMiTiAxMDjCsDI3JzE4LjciRQ!5e0!3m2!1svi!2s!4v1634567890123!5m2!1svi!2s"
                  className="w-full h-full border-0 grayscale invert contrast-125"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </SectionStack>
  );
}
