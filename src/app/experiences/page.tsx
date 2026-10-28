import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import {
  Flame,
  BookOpen,
  Trees,
  Compass,
  Bike,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Phone,
  ArrowRight,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Trải nghiệm & Hoạt động nghỉ dưỡng | M_Dalats Villa Đà Lạt",
  description:
    "Khám phá các hoạt động đặc sắc tại M_Dalats Villa: lửa trại đêm sương, tiệc nướng sân vườn, không gian đọc sách nghệ thuật và gợi ý lịch trình khám phá Đà Lạt.",
};

export default function ExperiencesPage() {
  const experiences = [
    {
      title: "Lửa Trại & Nướng Khoai Bắp Đêm Lạnh",
      category: "Hoạt động ngoài trời",
      time: "19:00 – 22:00 hàng tối",
      tagline: "Sưởi ấm đêm sương 15°C bên bếp lửa bập bùng",
      desc: "Trải nghiệm không thể bỏ lỡ khi ghé thăm M_Dalats Villa. Trong cái rét ngọt ngào của đêm cao nguyên, đống lửa trại rực sáng giữa sân vườn thông xua tan cái lạnh. Quý khách cùng bạn bè quây quần bên tiếng củi lách tách, tự tay nướng những củ khoai lang mật vàng ươm, bắp nếp nướng mỡ hành thơm nức mũi và thưởng thức tách trà gừng nóng.",
      image: "/images/BBQ.jpg",
      highlights: [
        "Củi thông thơm tự nhiên đốt lửa trại ngoài trời",
        "Miễn phí set khoai lang mật & bắp nếp nướng than",
        "Không gian âm nhạc acoustic mộc mạc thư thái",
        "Tách trà gừng ấm nóng phục vụ tận nơi",
      ],
      icon: Flame,
    },
    {
      title: "Phòng Tranh & Không Gian Đọc Sách Art Lounge",
      category: "Thư giãn & Nghệ thuật",
      time: "Phục vụ cả ngày (24/7)",
      tagline: "Lặng nhìn thời gian trôi bên từng trang sách",
      desc: "Được bố trí tại khu vực sảnh trung tâm với ánh sáng tự nhiên chan hòa, góc Art Lounge là nơi lưu giữ những cuốn sách hay về văn hóa, kiến trúc, nghệ thuật sống và văn học. Từng góc ngồi với chiếc ghế bành bọc vải nhung êm ái, hương tinh dầu gỗ thông thoang thoảng và những tác phẩm hội họa màu nước về cảnh sắc Đà Lạt xưa và nay.",
      image: "/images/DH_01382-HDR-Edit-700x466.jpg",
      highlights: [
        "Tủ sách tuyển chọn hơn 200 đầu sách nghệ thuật & văn học",
        "Bộ sưu tập tranh màu nước và ký họa Đà Lạt",
        "Góc làm việc yên tĩnh với wifi tốc độ cao",
        "Phục vụ trà hoa cúc và cà phê tại chỗ",
      ],
      icon: BookOpen,
    },
    {
      title: "Vườn Cỏ Thông Xanh & Sân Chơi Cho Bé",
      category: "Gia đình & Thiên nhiên",
      time: "06:00 – 18:30 hàng ngày",
      tagline: "Nơi các bạn nhỏ chạm vào thiên nhiên trong lành",
      desc: "Khuôn viên villa sở hữu bãi cỏ nhung mềm mại bao bọc bởi những gốc thông cổ thụ cao vút. Đây là không gian lý tưởng cho trẻ nhỏ thỏa sức chạy nhảy, tham gia các trò chơi thể chất an toàn ngoài trời, hay cả gia đình cùng trải thảm picnic chụp những bức hình kỷ niệm đậm chất thơ.",
      image: "/images/DSCF1106-1024x683.jpg",
      highlights: [
        "Thảm cỏ tự nhiên rộng rãi, được chăm sóc an toàn mỗi ngày",
        "Lều teepee phong cách bohemian cho bé chụp ảnh & vui chơi",
        "Không khí trong lành với lượng ion âm dồi dào từ đồi thông",
        "Đầy đủ thảm picnic và giỏ hoa chụp ảnh check-in",
      ],
      icon: Trees,
    },
    {
      title: "Dịch Vụ Xe Máy Phượt & Đưa Đón Sân Bay",
      category: "Tiện ích di chuyển",
      time: "Hỗ trợ 24/7 theo yêu cầu",
      tagline: "Khám phá từng con dốc quanh co tự do và dễ dàng",
      desc: "Để chuyến hành trình du ngoạn Đà Lạt của bạn thuận lợi nhất, M_Dalats Villa cung cấp dịch vụ thuê xe máy đời mới (xe ga cao cấp & xe số khỏe khoắn) giao nhận trực tiếp tại villa với giá ưu đãi. Ngoài ra, chúng tôi có đội xe ô tô 4 - 7 - 16 chỗ đưa đón sân bay Liên Khương và theo tour riêng trọn gói.",
      image: "/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg",
      highlights: [
        "Đội xe máy Vision, AirBlade, Wave mới bảo dưỡng thường xuyên",
        "Trang bị sẵn 2 mũ bảo hiểm đạt chuẩn, áo mưa và bản đồ du lịch",
        "Dịch vụ đưa đón sân bay Liên Khương đúng giờ, tài xế bản địa thân thiện",
        "Hỗ trợ tư vấn cung đường đèo đẹp và an toàn nhất",
      ],
      icon: Bike,
    },
  ];

  const travelItineraries = [
    {
      badge: "Lịch Trình 2N1Đ",
      title: "Thở Cùng Cao Nguyên & Sương Mù",
      desc: "Dành cho chuyến nghỉ ngơi cuối tuần nhẹ nhàng, tái tạo năng lượng.",
      days: [
        {
          day: "Ngày 1: Chạm ngõ Đà Lạt & Lửa trại đêm",
          activities: [
            "12:00 – 14:00: Check-in M_Dalats Villa, thưởng thức tách trà hoa chào đón và nghỉ ngơi trong phòng ngập nắng.",
            "15:00: Thư thả dạo bộ ngắm rừng thông quanh villa, chụp ảnh góc kiến trúc Địa Trung Hải.",
            "17:30: Thưởng thức bữa tiệc BBQ nướng than hoa ngoài sân vườn với vang đỏ ấm cúng.",
            "20:00: Đốt lửa trại, nướng bắp khoai thơm lừng và ngắm Đà Lạt lung linh ánh đèn đêm.",
          ],
        },
        {
          day: "Ngày 2: Bình minh sương sớm & Trải nghiệm cà phê",
          activities: [
            "06:30: Đón bình minh se lạnh, hít thở không khí đồi thông và dùng bữa sáng nóng hổi.",
            "08:30: Thưởng thức ly Cold Brew Cầu Đất ủ lạnh tại quầy cà phê Ngày 4 Mùa.",
            "10:00: Ghé thăm Dinh III Bảo Đại hoặc dạo quanh Hồ Xuân Hương cách villa chỉ 7 phút.",
            "12:00: Trả phòng, villa hỗ trợ giữ hành lý và sắp xếp xe ra sân bay Liên Khương.",
          ],
        },
      ],
    },
    {
      badge: "Lịch Trình 3N2Đ",
      title: "Chậm Rãi Sống Trọn Từng Khoảnh Khắc",
      desc: "Hành trình trọn vẹn khám phá thiên nhiên, ẩm thực và văn hóa Đà Lạt.",
      days: [
        {
          day: "Ngày 1: Check-in, hoàng hôn đồi thông & BBQ sân vườn",
          activities: [
            "14:00: Đến villa, nhận phòng ngắm view thung lũng thông xanh.",
            "16:00: Trải nghiệm set trà chiều ngắm hoàng hôn buông trên ban công riêng.",
            "18:30: Tiệc nướng ngoài trời & giao lưu ấm cúng quanh bếp lửa.",
          ],
        },
        {
          day: "Ngày 2: Săn mây Cầu Đất & Khám phá nét đẹp hoang sơ",
          activities: [
            "05:00: Khởi hành săn biển mây bồng bềnh tại đồi chè Cầu Đất (Villa hỗ trợ xe đưa đón).",
            "08:30: Trở về dùng bữa điểm tâm đặc sản tại villa.",
            "14:00: Ghé thăm vườn dâu công nghệ cao và rừng thông Hồ Tuyền Lâm thơ mộng.",
            "19:00: Thưởng thức lẩu gà lá é hoặc lẩu bò Ba Toa rồi ghé Chợ Đêm Đà Lạt.",
          ],
        },
        {
          day: "Ngày 3: Bình yên đọc sách & Mua quà cao nguyên",
          activities: [
            "08:00: Thảnh thơi đọc sách tại Art Lounge, nhâm nhi cà phê rang mộc.",
            "10:00: Mua sắm đặc sản mứt, atiso và hoa quả sấy làm quà cho người thân.",
            "12:00: Check-out với những kỷ niệm đong đầy tại M_Dalats Villa.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0">
      <Navbar />

      {/* Hero Header: PlayStation Dark Band */}
      <section className="relative h-[50vh] min-h-[380px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/DSCF1106-1024x683.jpg"
          alt="Trải nghiệm nghỉ dưỡng tại M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.70]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/40" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#53b1ff] text-[11px] uppercase tracking-[1.5px] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kỳ Nghỉ Trọn Vẹn Cảm Xúc</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight">
            Trải Nghiệm & Tiện Ích
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[2px] text-white/80 font-bold mt-2">
            LẮNG NGHE NHỊP ĐIỆU BÌNH YÊN
          </p>
          <p className="text-sm sm:text-base text-neutral-300 mt-2 font-normal max-w-xl mx-auto">
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu cùng những khoảnh khắc gắn kết thiêng liêng bên người thương yêu.”
          </p>
        </div>
      </section>

      {/* Chapter 2: True White Canvas for Intro */}
      <section className="bg-[#ffffff] text-[#000000] py-16 sm:py-24 border-b border-[#f3f3f3]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-[12px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
            Hành trình trải nghiệm
          </span>
          <h2 className="text-3xl sm:text-5xl text-[#000000] font-light leading-tight max-w-2xl mx-auto tracking-tight">
            Không chỉ là nơi lưu trú, M_Dalats là một phong cách sống
          </h2>
          <p className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed max-w-3xl mx-auto mt-4">
            Mỗi dịch vụ tại <strong className="font-semibold text-[#000000]">M_Dalats Villa</strong> được kiến tạo để mang lại cảm giác an yên tuyệt đối. Rời xa những ồn ào và tất bật của phố thị, nơi đây bạn có thể thong thả tận hưởng từng khoảnh khắc giản dị mà đong đầy cảm xúc.
          </p>
        </div>
      </section>

      {/* Chapter 3: Dark Canvas Mode for Detailed Experiences */}
      <section className="bg-[#000000] text-white py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-20">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={exp.title}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Visual Image */}
                <div
                  className={`lg:col-span-6 relative h-80 sm:h-[400px] rounded-[8px] overflow-hidden border border-white/10 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 text-xs font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-[#53b1ff]" />
                    <span>{exp.time}</span>
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
                    <span>{exp.category}</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl text-white font-light leading-tight tracking-tight">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#53b1ff] font-medium">
                    “{exp.tagline}”
                  </p>
                  <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
                    {exp.desc}
                  </p>

                  <div className="pt-2">
                    <ul className="space-y-2">
                      {exp.highlights.map((item, hIdx) => (
                        <li key={hIdx} className="text-xs sm:text-sm text-neutral-300 flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#53b1ff] shrink-0" />
                          <span>{item}</span>
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
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Nhận tư vấn hoạt động</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapter 4: True White Canvas for Suggested Travel Itineraries */}
      <section className="bg-[#ffffff] text-[#000000] py-16 sm:py-24 border-b border-[#f3f3f3]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
              Gợi ý hành trình
            </span>
            <h3 className="text-3xl sm:text-4xl font-light text-[#000000] tracking-tight">
              Lịch trình khám phá do M_Dalats tuyển chọn
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal">
              Được thiết kế tinh gọn giúp quý khách cảm nhận trọn vẹn vẻ đẹp phố sương mà không bị mệt mỏi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {travelItineraries.map((itin, idx) => (
              <div
                key={idx}
                className="bg-[#f5f7fa] rounded-[8px] border border-[#f3f3f3] p-7 shadow-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="inline-block bg-[#0070d1] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                      {itin.badge}
                    </span>
                    <Compass className="w-4 h-4 text-[#0070d1]" />
                  </div>

                  <h4 className="text-xl font-medium text-neutral-900 mb-1">
                    {itin.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 font-normal mb-6">
                    {itin.desc}
                  </p>

                  <div className="space-y-6">
                    {itin.days.map((dayItem, dIdx) => (
                      <div key={dIdx} className="border-l-2 border-[#0070d1] pl-4 space-y-2">
                        <h5 className="font-bold text-xs sm:text-sm text-neutral-900">
                          {dayItem.day}
                        </h5>
                        <ul className="space-y-1.5">
                          {dayItem.activities.map((act, actIdx) => (
                            <li key={actIdx} className="text-xs text-neutral-700 font-normal leading-relaxed">
                              • {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    Hỗ trợ đặt xe & tour riêng theo yêu cầu
                  </span>
                  <a
                    href="tel:0939014234"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0070d1] hover:underline"
                  >
                    <span>Liên hệ lễ tân</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner: PlayStation Blue */}
      <section className="bg-[#0070d1] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h3 className="text-3xl sm:text-5xl font-light leading-tight tracking-tight">
            Sẵn sàng cho một kỳ nghỉ đáng nhớ tại Đà Lạt?
          </h3>
          <p className="text-xs sm:text-sm text-white/85 max-w-2xl mx-auto font-normal leading-relaxed">
            Chọn căn phòng yêu thích và chuẩn bị hành lý, mọi tiện ích và trải nghiệm ấm áp nhất đang chờ đón bạn tại M_Dalats Villa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#0070d1] text-xs sm:text-sm font-bold px-8 h-12 rounded-full transition-all"
            >
              <span>Xem danh sách phòng & giá</span>
            </Link>
            <a
              href="tel:0939014234"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs sm:text-sm font-bold px-8 h-12 rounded-full transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Hotline 0939 014 234</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
