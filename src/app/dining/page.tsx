import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import {
  Utensils,
  Coffee,
  Flame,
  Wine,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  Calendar,
  Heart,
  ChevronRight,
  Sun,
  Moon,
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
      desc: "Thực đơn điểm tâm sáng tại M_Dalats Villa được chế biến từ những nguyên liệu tươi ngon nhất trong ngày của nông trại Đà Lạt kết hợp cùng phong vị ẩm thực Âu tinh tế. Quý khách có thể lựa chọn điểm tâm kiểu Âu với bánh mì nướng bơ tỏi thơm lừng, trứng Benedict béo ngậy, hoặc thưởng thức tô Phở bò nóng hổi hay Bánh mì xíu mại cay nồng đặc sản Đà Lạt.",
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
        "Signature Cold Brew Cầu Đất hoa quả ủ lạnh 18h",
        "Pour Over Arabica Typica hương mật ong & hoa dã quỳ",
        "Cà phê trứng kem béo ấm nóng phong cách Đà Lạt",
        "Trà hoa cúc atiso mật ong rừng giữ ấm cơ thể",
      ],
      icon: Coffee,
    },
    {
      title: "Tiệc Nướng BBQ Sân Vườn & Lửa Trại Đêm",
      time: "17:30 – 21:30 (Đặt trước tối thiểu 4 tiếng)",
      tagline: "Bếp than hồng rực, vang đỏ thơm nồng trong đêm 15°C",
      desc: "Khi hoàng hôn buông xuống và màn sương lạnh bao phủ thung lũng, khu vườn M_Dalats Villa bừng sáng với ánh đèn vàng ấm áp và bếp nướng than hồng thơm phức. Chúng tôi chuẩn bị sẵn sàng bếp than, vỉ nướng chuyên dụng, set thịt bò tảng tẩm ướp đậm đà, sườn cừu, tôm sú nướng bơ tỏi và rau củ tươi xanh Đà Lạt. Sau bữa tiệc, cùng ngồi quanh đống lửa trại, nhâm nhi ly rượu vang và nướng bắp khoai thơm lừng.",
      image: "/images/BBQ.jpg",
      dishes: [
        "Set BBQ Bò Úc hảo hạng ướp sốt tiêu đen thảo mộc",
        "Sườn heo bản nướng mật ong hoa cà phê",
        "Hải sản nướng xiên: Tôm sú, mực tươi nướng muối ớt xanh",
        "Rau củ nướng organic: Bắp ngọt, ớt chuông, nấm đùi gà và khoai mật nướng tro than",
      ],
      icon: Flame,
    },
  ];

  const menuHighlights = [
    {
      category: "Điểm Tâm Sáng",
      items: [
        { name: "Phở Bò Cao Nguyên Thảo Mộc", price: "85.000đ", note: "Nước dùng hầm xương 12h, rau húng quế tươi" },
        { name: "Bánh Mì Xíu Mại Đà Lạt", price: "65.000đ", note: "Xíu mại thơm mềm, da heo giòn sần sật, chả lụa" },
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
    <div className="min-h-screen bg-[#faf7f1] text-[#222222] flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative h-[50vh] min-h-[380px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/BBQ.jpg"
          alt="Ẩm thực và tiệc BBQ tại M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.70]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#367156]/85 via-black/45 to-black/30" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#faf7f1] text-[11px] uppercase tracking-[0.25em] font-medium mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#f27052]" />
            <span>M_Dalats Dining & Lounge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide">
            Ẩm Thực & Cà Phê
          </h1>
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#f27052] font-semibold mt-2">
            HƯƠNG VỊ NỒNG NÀ NƠI PHỐ SƯƠNG
          </p>
          <p className="font-script text-xl sm:text-2xl text-[#F4A261] mt-2 font-normal max-w-xl mx-auto drop-shadow-sm">
            “Thưởng thức hương vị ẩm thực mộc mạc bên ánh lửa ấm áp, lắng nghe tiếng thông reo trong sương lạnh Đà Lạt.”
          </p>
        </div>
      </section>

      {/* Intro Narrative */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-2">
          Triết lý ẩm thực
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#222222] font-normal leading-tight max-w-2xl mx-auto">
          Mỗi bữa ăn là một bản hòa ca giữa đất trời cao nguyên
        </h2>
        <div className="w-16 h-[2px] bg-[#367156] mx-auto my-5" />
        <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed max-w-3xl mx-auto">
          Tại <strong className="font-medium text-[#367156]">M_Dalats Villa</strong>, chúng tôi tin rằng trải nghiệm nghỉ dưỡng chỉ thực sự trọn vẹn khi được đánh thức bởi mùi hương cà phê tươi buổi sớm mai và sưởi ấm tâm hồn bằng bữa tiệc than hồng thơm lừng lúc đêm về. Nguyên liệu tươi sạch từ nông trại địa phương cùng tấm lòng hiếu khách luôn sẵn sàng phục vụ quý khách.
        </p>

        {/* 3 Highlights Quick Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
          <div className="bg-white p-6 rounded-sm border border-[#ece7dd] shadow-xs hover:border-[#367156]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156] mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#367156] mb-1">
              Bữa Sáng Năng Lượng
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Phục vụ từ 06:30 đến 10:00 với thực đơn đa dạng từ điểm tâm kiểu Âu thanh nhã đến các món nóng đặc sản địa phương.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#ece7dd] shadow-xs hover:border-[#367156]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156] mb-4">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#367156] mb-1">
              Cà Phê Ngày 4 Mùa
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Thưởng thức Arabica Cầu Đất nguyên chất rang mộc, Cold Brew hoa quả ủ chậm 18 tiếng ngắm trọn thung lũng thông xanh.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#ece7dd] shadow-xs hover:border-[#367156]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156] mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#367156] mb-1">
              BBQ Bếp Than Hồng
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Không gian sân vườn cỏ xanh với bếp nướng riêng tư, thịt ướp thảo mộc đậm đà, lửa trại và rượu vang nồng nàn.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Dining Experiences Section */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#ece7dd]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-20">
          {mealSections.map((sec, idx) => {
            const Icon = sec.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={sec.title}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Image */}
                <div
                  className={`lg:col-span-6 relative h-80 sm:h-[420px] rounded-sm overflow-hidden shadow-lg border-4 border-[#faf7f1] ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Image
                    src={sec.image}
                    alt={sec.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-sm shadow-md flex items-center gap-2 text-xs font-medium text-[#367156]">
                    <Clock className="w-3.5 h-3.5 text-[#f27052]" />
                    <span>{sec.time}</span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-6 space-y-4 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#f27052] font-semibold">
                    <Icon className="w-4 h-4" />
                    <span>{sec.tagline}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-normal leading-tight">
                    {sec.title}
                  </h3>
                  <div className="w-12 h-[2px] bg-[#367156]" />
                  <p className="text-sm text-[#555555] font-light leading-relaxed">
                    {sec.desc}
                  </p>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#367156] mb-3">
                      Món nổi bật:
                    </h4>
                    <ul className="space-y-2">
                      {sec.dishes.map((dish, dIdx) => (
                        <li key={dIdx} className="text-xs sm:text-sm text-[#444444] flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#367156] flex-shrink-0" />
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
                      className="inline-flex items-center gap-2 bg-[#367156] hover:bg-[#133324] text-white text-xs uppercase tracking-wider font-medium px-4 py-2.5 rounded-sm transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Đặt dịch vụ ngay</span>
                    </a>
                    <a
                      href="tel:0939014234"
                      className="text-xs font-semibold text-[#367156] hover:text-[#f27052] transition-colors"
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

      {/* Menu Price Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-2">
            Thực đơn tham khảo
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#222222]">
            Hương vị được yêu thích nhất
          </h3>
          <p className="text-xs sm:text-sm text-[#666666] mt-2 font-light">
            Các món ăn và đồ uống được chuẩn bị chỉn chu với nguyên liệu tươi mới mỗi ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuHighlights.map((group) => (
            <div
              key={group.category}
              className="bg-white rounded-sm border border-[#ece7dd] p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="border-b border-[#ece7dd] pb-3 mb-4">
                  <h4 className="font-serif text-lg font-semibold text-[#367156]">
                    {group.category}
                  </h4>
                </div>

                <div className="divide-y divide-[#ece7dd]/60 space-y-3.5">
                  {group.items.map((item, idx) => (
                    <div key={idx} className={idx > 0 ? "pt-3.5" : ""}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-xs sm:text-sm text-[#222222]">
                          {item.name}
                        </span>
                        <span className="font-serif text-xs sm:text-sm font-semibold text-[#f27052] flex-shrink-0">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777777] font-light mt-0.5 leading-snug">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ece7dd] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#888888]">
                  * Giá đã bao gồm thuế & phí phục vụ
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Notice & Reservation Banner */}
      <section className="bg-[#367156] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5 text-[#f27052]" />
            <span>Tiệc BBQ & Sự Kiện Riêng Tư</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-normal leading-tight">
            Tận hưởng đêm tiệc nướng giữa thung lũng Đà Lạt
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Chúng tôi hỗ trợ chuẩn bị bếp nướng, bàn ghế ngoài trời, gia vị tẩm ướp tươi ngon và chuẩn bị củi đốt lửa trại cho gia đình hoặc nhóm bạn. Vui lòng liên hệ lễ tân để được chuẩn bị chu đáo nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <a
              href="tel:0939014234"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f27052] hover:bg-[#e05c3c] text-white text-xs uppercase tracking-wider font-medium px-6 py-3 rounded-sm shadow-md transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi đặt bàn: 0939 014 234</span>
            </a>
            <Link
              href="/rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/40 text-xs uppercase tracking-wider font-medium px-6 py-3 rounded-sm transition-colors"
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
