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
      a: "Khuôn viên M_Dalats Villa có bãi đỗ xe rộng rãi, có camera giám sát và bảo vệ 24/7. Đường vào rộng rãi phù hợp cho xe máy, ô tô từ 4 chỗ, 7 chỗ đến xe 16 chỗ vào thẳng sân villa.",
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
    <div className="min-h-screen bg-[#faf7f1] text-[#222222] flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative h-[48vh] min-h-[360px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/DSCF1106-1024x683.jpg"
          alt="Liên hệ M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.70]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#367156]/85 via-black/45 to-black/30" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#faf7f1] text-[11px] uppercase tracking-[0.25em] font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#f27052]" />
            <span>Kết Nối Trực Tiếp</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide">
            Vị Trí & Liên Hệ
          </h1>
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#f27052] font-semibold mt-2">
            CHÚNG TÔI LUÔN SẴN SÀNG LẮNG NGHE BẠN
          </p>
          <p className="font-script text-xl sm:text-2xl text-[#F4A261] mt-2 font-normal max-w-xl mx-auto drop-shadow-sm">
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu. Hãy để chúng tôi đồng hành cùng chuyến đi của bạn.”
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-16">
        {/* 3 Contact Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-sm border border-[#ece7dd] shadow-xs hover:border-[#367156]/40 transition-colors space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#367156]">
              Địa Chỉ Villa
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
              14/2 Đường 3 tháng 4, Phường 3, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam
            </p>
            <p className="text-[11px] text-[#888888] font-light">
              Nằm trên con dốc thơ mộng ngắm rừng thông, cách Chợ Đà Lạt chỉ 7 phút di chuyển.
            </p>
          </div>

          <div className="bg-white p-7 rounded-sm border border-[#ece7dd] shadow-xs hover:border-[#367156]/40 transition-colors space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#367156]">
              Hotline & Hỗ Trợ 24/7
            </h3>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <strong className="text-[#333333]">Đặt phòng:</strong>{" "}
                <a href="tel:0939014234" className="text-[#f27052] font-semibold hover:underline">
                  0939 014 234
                </a>
              </p>
              <p>
                <strong className="text-[#333333]">Lễ tân 24/7:</strong>{" "}
                <a href="tel:0908123456" className="text-[#367156] font-medium hover:underline">
                  0908 123 456
                </a>
              </p>
            </div>
            <p className="text-[11px] text-[#888888] font-light">
              Hỗ trợ tư vấn đặt phòng, xe đưa đón và gợi ý lịch trình du lịch miễn phí.
            </p>
          </div>

          <div className="bg-white p-7 rounded-sm border border-[#ece7dd] shadow-xs hover:border-[#367156]/40 transition-colors space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#367156]">
              Thư Điện Tử
            </h3>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <a href="mailto:dalat@mdalatsvilla.com" className="text-[#367156] hover:text-[#f27052] transition-colors">
                  dalat@mdalatsvilla.com
                </a>
              </p>
              <p>
                <a href="mailto:booking@mdalatsvilla.com" className="text-[#367156] hover:text-[#f27052] transition-colors">
                  booking@mdalatsvilla.com
                </a>
              </p>
            </div>
            <div className="pt-1">
              <a
                href="https://zalo.me/0939014234"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#0068ff] font-semibold hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn tin qua Zalo Official</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form & Direction Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Interactive Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-sm border border-[#ece7dd] shadow-sm">
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#367156] font-semibold block mb-1">
                Gửi lời nhắn đến chúng tôi
              </span>
              <h3 className="font-serif text-2xl text-[#222222]">
                Liên hệ tư vấn & đặt phòng
              </h3>
              <p className="text-xs text-[#666666] font-light mt-1">
                Điền thông tin bên dưới, nhân viên chăm sóc khách hàng của M_Dalats Villa sẽ liên hệ lại với bạn trong vòng 15 phút.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm flex items-start gap-3 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{successMessage}</p>
                  <p className="text-emerald-700 mt-0.5 text-xs">
                    Chúng tôi đã ghi nhận và sẽ liên hệ quý khách qua số điện thoại/email sớm nhất.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm flex items-start gap-3 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Không thể gửi tin nhắn</p>
                  <p className="text-red-700 mt-0.5 text-xs">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50 min-h-[44px] sm:min-h-[38px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50 min-h-[44px] sm:min-h-[38px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50 min-h-[44px] sm:min-h-[38px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Nhu cầu cần hỗ trợ
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50 min-h-[44px] sm:min-h-[38px]"
                  >
                    <option value="Tư vấn đặt phòng">Tư vấn đặt phòng & giá ưu đãi</option>
                    <option value="Đặt tiệc BBQ ngoài trời">Đặt tiệc BBQ sân vườn & Lửa trại</option>
                    <option value="Đưa đón sân bay Liên Khương">Dịch vụ xe đưa đón sân bay Liên Khương</option>
                    <option value="Thuê xe máy du lịch">Thuê xe máy phượt đèo Đà Lạt</option>
                    <option value="Khác">Khác / Góp ý dịch vụ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444444] mb-1">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Vui lòng để lại ngày dự kiến đến, số lượng khách hoặc các yêu cầu đặc biệt..."
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#367156] hover:bg-[#133324] text-white text-xs uppercase tracking-wider font-medium px-8 py-3 rounded-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {contactMutation.isPending ? "Đang gửi thông tin..." : "Gửi yêu cầu tư vấn"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Direction Guide & Location Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 rounded-sm border border-[#ece7dd] shadow-xs space-y-4">
              <h4 className="font-serif text-lg font-semibold text-[#367156]">
                Hướng Dẫn Đường Đi
              </h4>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#f27052]/10 flex items-center justify-center text-[#f27052] flex-shrink-0 mt-0.5">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#222222]">Từ Sân bay Liên Khương (30km, ~35-40 phút)</h5>
                    <p className="text-[#666666] font-light mt-0.5 text-xs leading-relaxed">
                      Chạy thẳng theo Quốc lộ 20 qua đèo Prenn, vào đầu đường 3 tháng 4, rẽ vào hẻm 14 (đối diện bến xe liên tỉnh 300m). Villa có dịch vụ xe riêng đón tận cổng ga.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156] flex-shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#222222]">Từ Chợ Đêm & Hồ Xuân Hương (2.5km, ~7 phút)</h5>
                    <p className="text-[#666666] font-light mt-0.5 text-xs leading-relaxed">
                      Từ vòng xoay Kim Cúc, đi thẳng đường 3 tháng 4 hướng xuống đèo khoảng 1.8km, rẽ vào hẻm 14/2 thoai thoải là tới khuôn viên ngập tràn cây xanh của M_Dalats Villa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ece7dd]">
                <p className="text-[11px] text-[#888888]">
                  * Bãi đỗ xe ô tô 4 – 16 chỗ miễn phí, có cổng an ninh nội bộ.
                </p>
              </div>
            </div>

            {/* Quick Map Placeholder Card with Link to Google Maps */}
            <div className="relative h-60 rounded-sm overflow-hidden shadow-sm border border-[#ece7dd] group">
              <Image
                src="/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
                alt="Bản đồ M_Dalats Villa"
                fill
                className="object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#367156]/50 flex flex-col items-center justify-center text-center p-6 text-white">
                <MapPin className="w-8 h-8 text-[#f27052] mb-2 animate-bounce" />
                <h5 className="font-serif text-lg font-medium">14/2 Đường 3 tháng 4, Phường 3, Đà Lạt</h5>
                <p className="text-xs text-white/80 mt-1 max-w-xs">
                  Nhấn để mở định vị dẫn đường trực tiếp trên Google Maps
                </p>
                <a
                  href="https://maps.google.com/?q=14/2+Đường+3+tháng+4+Phường+3+Đà+Lạt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 bg-white text-[#367156] hover:bg-[#faf7f1] text-xs font-semibold px-4 py-2 rounded-sm shadow-sm transition-colors"
                >
                  <span>Mở Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-[#ece7dd]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-2">
              Câu hỏi thường gặp (FAQ)
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#222222]">
              Những điều khách hàng thường quan tâm
            </h3>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-[#ece7dd] bg-white rounded-sm border border-[#ece7dd] p-4 sm:p-6 shadow-xs">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="font-medium text-xs sm:text-sm text-[#222222] hover:text-[#367156] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#888888] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#367156]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-2.5 pr-6 text-xs text-[#666666] font-light leading-relaxed animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
