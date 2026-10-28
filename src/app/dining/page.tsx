import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import {
  Utensils,
  Coffee,
  Flame,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  ChevronRight,
  Sun,
} from "lucide-react";

export const metadata = {
  title: "Ẩm thực & Cà phê Ngày 4 Mùa | M_Dalats Villa Đà Lạt",
  description:
    "Trải nghiệm phong vị ẩm thực tinh tế, cà phê Cầu Đất nguyên bản, tiệc trà chiều ngắm sương mù và bữa tiệc nướng BBQ ngoài trời ấm áp tại M_Dalats Villa.",
};

export default function DiningPage() {
  const mealSections = [
    {
      title: "Bữa Sáng Năng Lượng & Tươi Lành",
      time: "06:30 – 10:00 hàng ngày",
      tagline: "Khởi đầu ngày mới giữa làn sương mai phố núi",
      desc: "Thực đơn điểm tâm sáng tại M_Dalats Villa được chế biến từ những nguyên liệu tươi ngon nhất trong ngày của nông trại Đà Lạt kết hợp cùng phong vị ẩm thực Âu tinh tế. Quý khách có thể lựa chọn điểm tâm kiểu Âu với bánh mì nướng bơ tỏi thơm lừng, hoặc thưởng thức tô Phở bò nóng hổi hay Bánh mì xíu mại cay nồng đặc sản Đà Lạt.",
      image: "/images/DSCF1106-1024x683.jpg",
      dishes: [
        "Phở bò cao nguyên thảo mộc thanh ngọt",
        "Bánh mì xíu mại chén cay ấm nồng",
        "Set Continental Breakfast: Bánh sừng bò, bơ mứt dâu Đà Lạt, trứng ốp la",
        "Trái cây nhiệt đới & sữa chua phô mai dẻo tự làm",
      ],
      icon: Sun,
    },
    {
      title: "Cà Phê Ngày 4 Mùa & Cold Brew Cầu Đất",
      time: "07:00 – 21:30 hàng ngày",
      tagline: "Từng giọt cà phê nguyên bản thấm đượm linh hồn cao nguyên",
      desc: "Nằm kề bên vườn thông, quầy cà phê 'Ngày 4 Mùa' phục vụ những mẻ cà phê Arabica Cầu Đất hảo hạng được chọn lọc và rang xay thủ công. Dành cho những ai yêu thích sự tươi mới, món Signature Cold Brew ủ chậm 18 tiếng thoảng hương cam sả hay tách Cappuccino bồng bềnh sẽ là người bạn đồng hành hoàn hảo cùng những trang sách bên hiên villa.",
      image: "/images/how-to-make-cold-brew-coffee-small-5-610x610.jpg",
      dishes: [
        "Signature Cold Brew 18h hương cam sả",
        "Cà phê phin truyền thống & bạc xỉu phố núi",
        "Cappuccino & Latte nghệ thuật tạo bọt mịn",
        "Trà hoa thảo mộc & Atiso mật ong rừng ấm nóng",
      ],
      icon: Coffee,
    },
    {
      title: "Tiệc BBQ & Đốt Lửa Trại Sân Vườn Đêm",
      time: "17:30 – 21:30 hàng ngày (Đặt trước 4 tiếng)",
      tagline: "Ấm nồng tiệc nướng than hoa giữa tiết trời 15°C",
      desc: "Khi màn đêm buông xuống và sương mù bảng lảng quanh đồi thông, khu vườn M_Dalats Villa bừng sáng bởi ánh đèn vàng ấm áp và bếp than hoa hồng rực. Thưởng thức từng xiên thịt bò tảng ướp thảo mộc nướng xèo xèo, bắp ngọt, khoai lang mật cùng ly rượu vang đỏ Đà Lạt sóng sánh bên đống lửa bập bùng.",
      image: "/images/BBQ.jpg",
      dishes: [
        "Bò Úc sốt tiêu đen thảo mộc nướng than hồng",
        "Xiên que rau củ tươi sạch nông trại Đà Lạt",
        "Sườn heo nướng mật ong hoa rừng cao nguyên",
        "Khoai mật nướng than củi & Rượu vang đỏ Chateau",
      ],
      icon: Flame,
    },
  ];

  const menuHighlights = [
    {
      category: "Bữa Sáng & Điểm Tâm",
      items: [
        { name: "Phở Bò Cao Nguyên Thảo Mộc", price: "75.000đ", note: "Nước dùng hầm xương 12h, bò tái mềm, rau thơm Đà Lạt" },
        { name: "Bánh Mì Xíu Mại Nóng Cay", price: "55.000đ", note: "Xíu mại thơm béo, da heo giòn rụm, ớt sa tế ấm nồng" },
        { name: "American / Continental Breakfast", price: "95.000đ", note: "Bánh mì sourdough, xúc xích Đức, trứng ốp la, bơ Pháp" },
        { name: "Salad Rau Củ Trộn Trứng Lòng Đào", price: "75.000đ", note: "Xà lách thủy canh, cà chua bi Đơn Dương, sốt mè rang" },
      ],
    },
    {
      category: "Cà Phê & Thức Uống",
      items: [
        { name: "Signature Cold Brew Cam Quế", price: "65.000đ", note: "Cà phê Cầu Đất ủ 18h, lát cam vàng sấy & thanh quế" },
        { name: "Cà Phê Trứng M_Dalats", price: "60.000đ", note: "Lớp kem trứng đánh bông mịn ngậy trên nền Robusta đậm đà" },
        { name: "Cà Phê Muối Nắng Sớm", price: "55.000đ", note: "Lớp bọt kem mặn mòi cân bằng vị đắng ngọt dịu dàng" },
        { name: "Trà Atiso Mật Ong Rừng", price: "55.000đ", note: "Bông atiso tươi hầm thanh nhiệt, mật ong hoa rừng nguyên chất" },
      ],
    },
    {
      category: "Set Tiệc BBQ Sân Vườn",
      items: [
        { name: "Set BBQ Mộc Miên (2 Khách)", price: "580.000đ", note: "Bò Úc sốt BBQ, gà tre nướng lá chanh, xúc xích Đức, nấm & bắp ngọt" },
        { name: "Set BBQ Đà Lạt Đêm Nhớ (4 - 6 Khách)", price: "1.250.000đ", note: "Dẻ sườn bò Mỹ, tôm càng xanh, sườn heo tảng, salad giấm táo, bánh mì nướng bơ" },
        { name: "Set Lửa Trại Khoai Bắp Nướng & Vang Đỏ", price: "320.000đ", note: "Bắp nếp nướng mỡ hành, khoai lang mật Lạc Dương nướng than củi, trà gừng" },
        { name: "Rượu Vang Đỏ Đà Lạt Chateau", price: "390.000đ/chai", note: "Vang ủ gỗ sồi hảo hạng, vị chát mượt mà cực hợp thời tiết se lạnh" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0">
      <Navbar />

      {/* Hero Header: PlayStation Dark Band */}
      <section className="relative h-[50vh] min-h-[380px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/BBQ.jpg"
          alt="Ẩm thực và tiệc BBQ tại M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.70]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/40" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#53b1ff] text-[11px] uppercase tracking-[1.5px] font-bold mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#53b1ff]" />
            <span>M_Dalats Dining & Lounge</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight">
            Ẩm Thực & Cà Phê
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[2px] text-white/80 font-bold mt-2">
            HƯƠNG VỊ NỒNG NÀN NƠI PHỐ SƯƠNG
          </p>
          <p className="text-sm sm:text-base text-neutral-300 mt-2 font-normal max-w-xl mx-auto">
            “Thưởng thức hương vị ẩm thực mộc mạc bên ánh lửa ấm áp, lắng nghe tiếng thông reo trong sương lạnh Đà Lạt.”
          </p>
        </div>
      </section>

      {/* Chapter 2 of page: True White Canvas Band for Intro & Highlights */}
      <section className="bg-[#ffffff] text-[#000000] py-16 sm:py-24 border-b border-[#f3f3f3]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-[12px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
            Triết lý ẩm thực
          </span>
          <h2 className="text-3xl sm:text-5xl text-[#000000] font-light leading-tight max-w-2xl mx-auto tracking-tight">
            Mỗi bữa ăn là một bản hòa ca giữa đất trời cao nguyên
          </h2>
          <p className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed max-w-3xl mx-auto mt-4">
            Tại <strong className="font-semibold text-[#000000]">M_Dalats Villa</strong>, chúng tôi tin rằng trải nghiệm nghỉ dưỡng chỉ thực sự trọn vẹn khi được đánh thức bởi mùi hương cà phê tươi buổi sớm mai và sưởi ấm tâm hồn bằng bữa tiệc than hồng thơm lừng lúc đêm về.
          </p>

          {/* 3 Highlights Cards: PlayStation surface-card #f5f7fa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-[#f5f7fa] p-6 sm:p-7 rounded-[8px] border border-[#f3f3f3] hover:bg-neutral-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#0070d1]/10 flex items-center justify-center text-[#0070d1] mb-4">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-neutral-900 mb-1">
                Bữa Sáng Năng Lượng
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Phục vụ từ 06:30 đến 10:00 với thực đơn đa dạng từ điểm tâm kiểu Âu thanh nhã đến các món nóng đặc sản địa phương.
              </p>
            </div>

            <div className="bg-[#f5f7fa] p-6 sm:p-7 rounded-[8px] border border-[#f3f3f3] hover:bg-neutral-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#0070d1]/10 flex items-center justify-center text-[#0070d1] mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-neutral-900 mb-1">
                Cà Phê Ngày 4 Mùa
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Thưởng thức Arabica Cầu Đất nguyên chất rang mộc, Cold Brew hoa quả ủ chậm 18 tiếng ngắm trọn thung lũng thông xanh.
              </p>
            </div>

            <div className="bg-[#f5f7fa] p-6 sm:p-7 rounded-[8px] border border-[#f3f3f3] hover:bg-neutral-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#0070d1]/10 flex items-center justify-center text-[#0070d1] mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-neutral-900 mb-1">
                BBQ Bếp Than Hồng
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Không gian sân vườn cỏ xanh với bếp nướng riêng tư, thịt ướp thảo mộc đậm đà, lửa trại và rượu vang nồng nàn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3 of page: Dark Canvas Mode for Detailed Experiences */}
      <section className="bg-[#000000] text-white py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-20">
          {mealSections.map((sec, idx) => {
            const Icon = sec.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={sec.title}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Visual Image */}
                <div
                  className={`lg:col-span-6 relative h-80 sm:h-[420px] rounded-[8px] overflow-hidden border border-white/10 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Image
                    src={sec.image}
                    alt={sec.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 text-xs font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-[#53b1ff]" />
                    <span>{sec.time}</span>
                  </div>
                </div>

                {/* Content: PlayStation SST Light 300 */}
                <div
                  className={`lg:col-span-6 space-y-4 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold">
                    <Icon className="w-4 h-4" />
                    <span>{sec.tagline}</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl text-white font-light leading-tight tracking-tight">
                    {sec.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
                    {sec.desc}
                  </p>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-3">
                      Món nổi bật:
                    </h4>
                    <ul className="space-y-2">
                      {sec.dishes.map((dish, dIdx) => (
                        <li key={dIdx} className="text-xs sm:text-sm text-neutral-300 flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#53b1ff] shrink-0" />
                          <span>{dish}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <a
                      href="https://zalo.me/0939014234"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#0070d1] hover:bg-[#0064b7] text-white text-xs sm:text-sm font-bold px-6 h-12 rounded-full transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Đặt dịch vụ ngay</span>
                    </a>
                    <a
                      href="tel:0939014234"
                      className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-white px-3 py-2 transition-colors"
                    >
                      Hotline: 0939 014 234
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapter 4 of page: True White Canvas for Menu Price Table */}
      <section className="bg-[#ffffff] text-[#000000] py-16 sm:py-24 border-b border-[#f3f3f3]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
              Thực đơn tham khảo
            </span>
            <h3 className="text-3xl sm:text-4xl font-light text-[#000000] tracking-tight">
              Hương vị được yêu thích nhất
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal">
              Các món ăn và đồ uống được chuẩn bị chỉn chu với nguyên liệu tươi mới mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuHighlights.map((group) => (
              <div
                key={group.category}
                className="bg-[#f5f7fa] rounded-[8px] border border-[#f3f3f3] p-6 shadow-none flex flex-col justify-between"
              >
                <div>
                  <div className="border-b border-[#e5e7eb] pb-3 mb-4">
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900">
                      {group.category}
                    </h4>
                  </div>

                  <div className="divide-y divide-[#e5e7eb] space-y-3.5">
                    {group.items.map((item, idx) => (
                      <div key={idx} className={idx > 0 ? "pt-3.5" : ""}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-neutral-900">
                            {item.name}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#0070d1] shrink-0">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-normal mt-0.5 leading-snug">
                          {item.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-center">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                    * Giá đã bao gồm thuế & phí phục vụ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Notice & Reservation Banner: PlayStation Blue Band */}
      <section className="bg-[#0070d1] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-[11px] uppercase tracking-[1.5px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tiệc BBQ & Sự Kiện Riêng Tư</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-light leading-tight tracking-tight">
            Tận hưởng đêm tiệc nướng giữa thung lũng Đà Lạt
          </h3>
          <p className="text-xs sm:text-sm text-white/85 max-w-2xl mx-auto font-normal leading-relaxed">
            Chúng tôi hỗ trợ chuẩn bị bếp nướng, bàn ghế ngoài trời, gia vị tẩm ướp tươi ngon và chuẩn bị củi đốt lửa trại cho gia đình hoặc nhóm bạn. Vui lòng liên hệ lễ tân để được chuẩn bị chu đáo nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <a
              href="tel:0939014234"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#0070d1] text-xs sm:text-sm font-bold px-8 h-12 rounded-full transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi đặt bàn: 0939 014 234</span>
            </a>
            <Link
              href="/rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs sm:text-sm font-bold px-8 h-12 rounded-full transition-colors"
            >
              <span>Xem danh sách phòng nghỉ</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
