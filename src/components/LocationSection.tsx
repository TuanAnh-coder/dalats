"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { FadeIn } from "./MotionWrapper";

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
    <section id="location" className="py-16 sm:py-24 bg-white border-b border-[#ece7dd] overflow-hidden scroll-mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <FadeIn direction="up">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-1.5 sm:mb-2">
              Vị trí • Chỉ đường
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#222222] font-normal mb-3 sm:mb-4">
              Đến M_Dalats Boutique Villa
            </h2>
            <div className="flex items-center justify-center gap-2.5 mx-auto mb-4 sm:mb-5">
              <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
              <span className="text-[10px] text-[#367156] select-none">◆</span>
              <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
              Tọa lạc tại con dốc nhỏ yên tĩnh trên đường 3 tháng 4, chỉ cách bến xe liên tỉnh vài phút và thuận tiện di chuyển tới Hồ Xuân Hương, chợ đêm Đà Lạt.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Form */}
          <div className="lg:col-span-5">
            <FadeIn direction="right" duration={0.7}>
              <div className="bg-[#faf7f1] p-5 sm:p-7 rounded-md border border-[#ece7dd]">
                <h3 className="font-serif text-xl sm:text-2xl text-[#367156] font-medium mb-3.5">
                  Thông tin liên hệ
                </h3>

                <div className="space-y-3 text-xs text-[#444444] mb-6 pb-5 border-b border-[#ece7dd]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#367156] flex-shrink-0 mt-0.5" />
                    <span>14/2 Đường 3 tháng 4, Phường 3, TP. Đà Lạt, Lâm Đồng</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#367156] flex-shrink-0" />
                    <a href="tel:0939014234" className="hover:text-[#367156] font-medium">
                      0939 014 234
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#367156] flex-shrink-0" />
                    <a href="mailto:dalat@mdalatsvilla.com" className="hover:text-[#367156]">
                      dalat@mdalatsvilla.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#367156] flex-shrink-0" />
                    <span>Check-in: 14:00 • Check-out: 12:00</span>
                  </div>
                </div>

                {/* Quick Contact Form */}
                <div id="contact" className="scroll-mt-32">
                  <h4 className="font-serif text-lg text-[#222222] font-medium mb-3">
                    Gửi lời nhắn cho M_Dalats Villa
                  </h4>

                  {sentSuccess ? (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Cảm ơn bạn! M_Dalats Villa đã nhận được lời nhắn và sẽ phản hồi sớm nhất.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      {contactMutation.isError && (
                        <div className="p-2 bg-red-50 text-red-700 text-xs rounded-sm flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{contactMutation.error?.message}</span>
                        </div>
                      )}

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Họ tên của bạn *"
                        className="w-full bg-white border border-[#d6cebf] px-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        required
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email *"
                          className="w-full bg-white border border-[#d6cebf] px-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                          required
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Số điện thoại"
                          className="w-full bg-white border border-[#d6cebf] px-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        />
                      </div>

                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Lời nhắn hoặc câu hỏi của bạn *"
                        className="w-full bg-white border border-[#d6cebf] px-3 py-2.5 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        required
                      />

                      <button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full bg-[#367156] hover:bg-[#113123] text-white py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                      >
                        {contactMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Gửi tin nhắn</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7">
            <FadeIn direction="left" duration={0.7}>
              <div className="h-[360px] sm:h-[460px] rounded-md overflow-hidden border border-[#ece7dd] shadow-md relative bg-[#faf7f1]">
                <iframe
                  title="M_Dalats Boutique Villa Bản đồ"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.6264573138377!2d108.4418640748232!3d11.931089988297775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31711317ba9ec05f%3A0xeae06be8995c64bf!2zMTQgxJDGsOG7nW5nIDMgVGjDoW5nIDQsIFBoxrDhu51uZyAzLCBUaMOgbmggcGjhu5EgxJDDoCBM4bqhdCwgTMOibSDEkOG7k25n!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
