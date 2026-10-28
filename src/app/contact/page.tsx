"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { api } from "~/trpc/react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Car,
  Plane,
  ChevronDown,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Tư vấn đặt phòng",
    message: "",
  });

  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contactMutation = api.contact.submitMessage.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(data.message || "Tin nhắn của bạn đã được gửi thành công!");
      setErrorMessage(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Tư vấn đặt phòng",
        message: "",
      });
    },
    onError: (err) => {
      setErrorMessage(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
      setSuccessMessage(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const fullMessage = `[Mục đích: ${formData.subject}] ${formData.message}`;

    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: fullMessage,
    });
  };

  const faqs = [
    {
      q: "Giờ nhận phòng (Check-in) và trả phòng (Check-out) là mấy giờ?",
      a: "Giờ nhận phòng tiêu chuẩn là từ 14:00 và giờ trả phòng là trước 12:00 trưa hôm sau. Trong trường hợp có phòng trống sớm, M_Dalats Villa luôn sẵn lòng hỗ trợ quý khách nhận phòng sớm mà không tính thêm phụ phí.",
    },
    {
      q: "Giá phòng đã bao gồm bữa sáng và các tiện ích chưa?",
      a: "Tất cả các hạng phòng tại M_Dalats Villa đều đã bao gồm bữa sáng hàng ngày (phục vụ từ 06:30 - 10:00), trà/cà phê chào đón khi check-in, set nước suối, wifi tốc độ cao và sử dụng không gian sân vườn ngắm đồi thông.",
    },
    {
      q: "Villa có bãi đỗ xe ô tô không? Xe bao nhiêu chỗ vào được?",
      a: "Khu khuôn viên M_Dalats Villa có bãi đỗ xe rộng rãi, có camera giám sát và bảo vệ 24/7. Đường vào rộng rãi phù hợp cho xe máy, ô tô từ 4 chỗ, 7 chỗ đến xe 16 chỗ vào thẳng sân villa.",
    },
    {
      q: "Tôi muốn đặt tiệc nướng BBQ ngoài trời vào buổi tối thì cần thông báo trước bao lâu?",
      a: "Để bếp và nhân viên chuẩn bị than hoa, vỉ nướng chuyên dụng và nguyên liệu tươi ngon nhất trong ngày, quý khách vui lòng thông báo trước ít nhất 4 tiếng hoặc đăng ký ngay lúc nhận phòng.",
    },
    {
      q: "Chính sách hủy hoặc thay đổi ngày nhận phòng được quy định thế nào?",
      a: "Quý khách được đổi ngày hoặc hủy phòng miễn phí trước ngày check-in 7 ngày. Trong các trường hợp đột xuất bất khả kháng, chúng tôi luôn ưu tiên hỗ trợ bảo lưu tiền phòng linh hoạt lên đến 6 tháng.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0 selection:bg-[#0070d1] selection:text-white">
      <Navbar />

      {/* Chapter 1: Dark Cinematic Hero */}
      <section className="relative h-[48vh] min-h-[380px] w-full flex items-center justify-center text-center overflow-hidden bg-[#000000]">
        <Image
          src="/images/DSCF1106-1024x683.jpg"
          alt="Liên hệ M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/30" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#53b1ff] text-[11px] uppercase tracking-[1.5px] font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#0070d1]" />
            <span>Kết Nối Trực Tiếp</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[-0.1px] leading-[1.15]">
            Vị Trí & Liên Hệ
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#53b1ff] font-medium mt-3">
            CHÚNG TÔI LUÔN SẴN SÀNG LẮNG NGHE BẠN
          </p>
          <p className="text-sm sm:text-base text-white/70 mt-3 font-normal max-w-xl mx-auto leading-relaxed">
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu. Hãy để chúng tôi đồng hành cùng kỳ nghỉ an yên của bạn.”
          </p>
        </div>
      </section>

      {/* Chapter 2: Pure Black Editorial Canvas */}
      <section className="bg-[#000000] py-16 sm:py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-16">
          {/* 3 Contact Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#181818] p-7 rounded-[8px] border border-white/10 hover:border-white/20 transition-colors space-y-4 shadow-none">
              <div className="w-12 h-12 rounded-full bg-[#121314] flex items-center justify-center text-[#53b1ff] border border-white/10">
                <MapPin className="w-5 h-5 text-[#0070d1]" />
              </div>
              <h3 className="text-lg font-light tracking-[0.1px] text-white">
                Địa Chỉ Villa
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                14/2 Đường 3 tháng 4, Phường 3, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam
              </p>
              <p className="text-[11px] text-white/50 font-normal">
                Nằm trên con dốc thơ mộng ngắm rừng thông, cách Chợ Đà Lạt chỉ 7 phút di chuyển.
              </p>
            </div>

            <div className="bg-[#181818] p-7 rounded-[8px] border border-white/10 hover:border-white/20 transition-colors space-y-4 shadow-none">
              <div className="w-12 h-12 rounded-full bg-[#121314] flex items-center justify-center text-[#53b1ff] border border-white/10">
                <Phone className="w-5 h-5 text-[#0070d1]" />
              </div>
              <h3 className="text-lg font-light tracking-[0.1px] text-white">
                Hotline & Hỗ Trợ 24/7
              </h3>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p>
                  <strong className="text-white/50 font-normal">Đặt phòng:</strong>{" "}
                  <a href="tel:0939014234" className="text-[#53b1ff] font-semibold hover:underline">
                    0939 014 234
                  </a>
                </p>
                <p>
                  <strong className="text-white/50 font-normal">Lễ tân 24/7:</strong>{" "}
                  <a href="tel:0908123456" className="text-white font-medium hover:underline">
                    0908 123 456
                  </a>
                </p>
              </div>
              <p className="text-[11px] text-white/50 font-normal">
                Hỗ trợ tư vấn đặt phòng, xe đưa đón và gợi ý lịch trình du lịch miễn phí.
              </p>
            </div>

            <div className="bg-[#181818] p-7 rounded-[8px] border border-white/10 hover:border-white/20 transition-colors space-y-4 shadow-none">
              <div className="w-12 h-12 rounded-full bg-[#121314] flex items-center justify-center text-[#53b1ff] border border-white/10">
                <Mail className="w-5 h-5 text-[#0070d1]" />
              </div>
              <h3 className="text-lg font-light tracking-[0.1px] text-white">
                Thư Điện Tử
              </h3>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p>
                  <a href="mailto:dalat@mdalatsvilla.com" className="text-white/80 hover:text-[#53b1ff] transition-colors">
                    dalat@mdalatsvilla.com
                  </a>
                </p>
                <p>
                  <a href="mailto:booking@mdalatsvilla.com" className="text-white/80 hover:text-[#53b1ff] transition-colors">
                    booking@mdalatsvilla.com
                  </a>
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="https://zalo.me/0939014234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#53b1ff] font-semibold hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Nhắn tin qua Zalo Official</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form & Direction Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Form */}
            <div className="lg:col-span-7 bg-[#181818] p-8 sm:p-10 rounded-[8px] border border-white/10 shadow-none">
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-[1.5px] text-[#53b1ff] font-semibold block mb-1">
                  Gửi lời nhắn đến chúng tôi
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1px]">
                  Liên hệ tư vấn & đặt phòng
                </h3>
                <p className="text-xs text-white/60 font-normal mt-1.5">
                  Điền thông tin bên dưới, nhân viên chăm sóc khách hàng của M_Dalats Villa sẽ liên hệ lại với bạn trong vòng 15 phút.
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-[#121314] border border-[#0070d1]/40 text-white rounded-[4px] flex items-start gap-3 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#53b1ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{successMessage}</p>
                    <p className="text-white/60 mt-0.5 text-xs">
                      Chúng tôi đã ghi nhận và sẽ liên hệ quý khách qua số điện thoại/email sớm nhất.
                    </p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-[4px] flex items-start gap-3 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Không thể gửi tin nhắn</p>
                    <p className="text-red-300 mt-0.5 text-xs">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      Họ và tên <span className="text-[#d53b00]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      Số điện thoại <span className="text-[#d53b00]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      Địa chỉ Email <span className="text-[#d53b00]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      Nhu cầu cần hỗ trợ
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white min-h-[44px]"
                    >
                      <option value="Tư vấn đặt phòng" className="bg-[#181818] text-white">Tư vấn đặt phòng & giá ưu đãi</option>
                      <option value="Đặt tiệc BBQ ngoài trời" className="bg-[#181818] text-white">Đặt tiệc BBQ sân vườn & Lửa trại</option>
                      <option value="Đưa đón sân bay Liên Khương" className="bg-[#181818] text-white">Dịch vụ xe đưa đón sân bay Liên Khương</option>
                      <option value="Thuê xe máy du lịch" className="bg-[#181818] text-white">Thuê xe máy phượt đèo Đà Lạt</option>
                      <option value="Khác" className="bg-[#181818] text-white">Khác / Góp ý dịch vụ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Nội dung chi tiết <span className="text-[#d53b00]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Vui lòng để lại ngày dự kiến đến, số lượng khách hoặc các yêu cầu đặc biệt..."
                    className="w-full px-3.5 py-2.5 text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-sm font-bold tracking-[0.324px] px-8 py-3 rounded-full transition-colors disabled:opacity-50 cursor-pointer shadow-none"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {contactMutation.isPending ? "Đang gửi thông tin..." : "Gửi yêu cầu tư vấn"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Direction Guide & Location Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#181818] p-7 rounded-[8px] border border-white/10 space-y-4 shadow-none">
                <h4 className="text-lg font-light tracking-[0.1px] text-white">
                  Hướng Dẫn Đường Đi
                </h4>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#121314] flex items-center justify-center text-[#53b1ff] flex-shrink-0 mt-0.5 border border-white/10">
                      <Plane className="w-4 h-4 text-[#0070d1]" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">Từ Sân bay Liên Khương (30km, ~35-40 phút)</h5>
                      <p className="text-white/60 font-normal mt-0.5 text-xs leading-relaxed">
                        Chạy thẳng theo Quốc lộ 20 qua đèo Prenn, vào đầu đường 3 tháng 4, rẽ vào hẻm 14 (đối diện bến xe liên tỉnh 300m). Villa có dịch vụ xe riêng đón tận cổng ga.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#121314] flex items-center justify-center text-[#53b1ff] flex-shrink-0 mt-0.5 border border-white/10">
                      <Car className="w-4 h-4 text-[#0070d1]" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">Từ Chợ Đêm & Hồ Xuân Hương (2.5km, ~7 phút)</h5>
                      <p className="text-white/60 font-normal mt-0.5 text-xs leading-relaxed">
                        Từ vòng xoay Kim Cúc, đi thẳng đường 3 tháng 4 hướng xuống đèo khoảng 1.8km, rẽ vào hẻm 14/2 thoai thoải là tới khuôn viên ngập tràn cây xanh của M_Dalats Villa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[11px] text-white/50">
                    * Bãi đỗ xe ô tô 4 – 16 chỗ miễn phí, có cổng an ninh nội bộ.
                  </p>
                </div>
              </div>

              {/* Quick Map Placeholder Card with Link to Google Maps */}
              <div className="relative h-60 rounded-[8px] overflow-hidden border border-white/10 group shadow-none">
                <Image
                  src="/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
                  alt="Bản đồ M_Dalats Villa"
                  fill
                  className="object-cover filter brightness-[0.5] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#000000]/60 flex flex-col items-center justify-center text-center p-6 text-white">
                  <MapPin className="w-8 h-8 text-[#0070d1] mb-2 animate-bounce" />
                  <h5 className="text-base sm:text-lg font-light tracking-[0.1px]">14/2 Đường 3 tháng 4, Phường 3, Đà Lạt</h5>
                  <p className="text-xs text-white/70 mt-1 max-w-xs font-normal">
                    Nhấn để mở định vị dẫn đường trực tiếp trên Google Maps
                  </p>
                  <a
                    href="https://maps.google.com/?q=14/2+Đường+3+tháng+4+Phường+3+Đà+Lạt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-[#0070d1] text-white hover:bg-[#0064b7] text-xs font-bold px-6 py-2.5 rounded-full transition-colors shadow-none"
                  >
                    <span>Mở Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: True White Canvas FAQ Section */}
      <section className="bg-[#ffffff] text-[#000000] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
              Câu hỏi thường gặp (FAQ)
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-[#000000] tracking-[-0.1px]">
              Những điều khách hàng thường quan tâm
            </h2>
            <p className="text-xs sm:text-sm text-[#000000]/60 mt-2 font-normal">
              Giải đáp chi tiết các thắc mắc về nhận phòng, dịch vụ và chính sách lưu trú.
            </p>
          </div>

          <div className="divide-y divide-[#e5e5e5] bg-[#f5f7fa] rounded-[8px] border border-[#e5e5e5] p-6 sm:p-8 shadow-none">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#000000] group-hover:text-[#0070d1] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6b6b6b] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#0070d1]" : "group-hover:text-[#0070d1]"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 pr-6 text-xs sm:text-sm text-[#000000]/70 font-normal leading-relaxed animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter 4: Signature PlayStation Blue Footer */}
      <Footer />
    </div>
  );
}
