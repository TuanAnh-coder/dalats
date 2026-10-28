import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { Trees, Heart, Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Giới thiệu & Câu chuyện | M_Dalats Villa Đà Lạt",
  description: "Khám phá câu chuyện hình thành và triết lý kiến trúc mộc mạc hòa quyện thiên nhiên tại M_Dalats Villa Đà Lạt.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Gần gũi thiên nhiên (Stay Close to Nature)",
      desc: "Khuôn viên villa được bao bọc bởi những rặng thông già nguyên sinh và thảm cỏ xanh mướt, mang lại bầu không khí trong lành nguyên bản nhất của Đà Lạt.",
      icon: Trees,
    },
    {
      title: "Kiến trúc ấm áp & Tinh tế",
      desc: "Lấy cảm hứng từ nét mộc mạc vùng quê Tuscany nước Ý kết hợp cùng nhà gỗ truyền thống cao nguyên, sử dụng vật liệu đá, gạch nung và gỗ tự nhiên ấm cúng.",
      icon: Sparkles,
    },
    {
      title: "Chăm chút từng khoảnh khắc",
      desc: "Từ tách cà phê Cold Brew buổi sớm đến tiệc nướng BBQ bập bùng lửa trại trong đêm se lạnh, chúng tôi mong muốn lưu giữ trọn vẹn ký ức đẹp nhất của bạn.",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0">
      <Navbar />

      {/* Hero Header: PlayStation Dark Band */}
      <div className="relative h-[50vh] min-h-[380px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/DSCF1106-1024x683.jpg"
          alt="Không gian M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.70]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/40" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#53b1ff] text-[11px] uppercase tracking-[1.5px] font-bold mb-3">
            <span>Câu chuyện thương hiệu</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight">
            Về M_Dalats Villa
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[2px] text-white/80 font-bold mt-2">
            STAY CLOSE TO NATURE
          </p>
          <p className="text-sm sm:text-base text-neutral-300 mt-2 font-normal">
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
          </p>
        </div>
      </div>

      {/* Main Story Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-16">
        {/* Intro Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block">
              Khởi nguồn ý niệm
            </span>
            <h2 className="text-2xl sm:text-4xl text-white font-light leading-tight tracking-tight">
              Câu chuyện về một chốn dừng chân bình yên
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
              Tọa lạc trên một con dốc thoai thoải kề bên rừng thông xanh mát tại đường 3 tháng 4, <strong className="font-semibold text-white">M_Dalats Villa</strong> ra đời từ mong ước tạo nên một không gian nghỉ dưỡng không ồn ào xô bồ, nơi lữ khách có thể thả lỏng tâm hồn và lắng nghe nhịp thở của tự nhiên.
            </p>
            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
              Từng góc nhỏ, chiếc bàn gỗ, khung cửa sổ vòm hay ban công ngắm sương mù đều được chăm chút tỉ mỉ, để mỗi khoảnh khắc bạn lưu lại đây đều trở thành những kỷ niệm êm đềm và khó quên.
            </p>
          </div>

          <div className="md:col-span-6 relative h-80 sm:h-96 rounded-[8px] overflow-hidden border border-white/10">
            <Image
              src="/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
              alt="Kiến trúc M_Dalats Villa"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 3 Core Values Grid: PlayStation product-card-dark 8px */}
        <div className="pt-10 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block mb-2">
              Giá trị cốt lõi
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Trải nghiệm khác biệt tại M_Dalats
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#181818] p-6 rounded-[8px] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#0070d1]/15 text-[#53b1ff] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="pt-10 border-t border-white/10">
          <h3 className="text-2xl sm:text-3xl font-light text-white text-center mb-8 tracking-tight">
            Những góc nhỏ thân thương
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="relative h-48 rounded-[8px] overflow-hidden border border-white/10">
              <Image src="/images/DH_01791-HDR-Edit-700x466.jpg" alt="Góc sân vườn" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative h-48 rounded-[8px] overflow-hidden border border-white/10">
              <Image src="/images/DH_01968-Pano-Edit-700x466.jpg" alt="Ban công đồi thông" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative h-48 rounded-[8px] overflow-hidden border border-white/10">
              <Image src="/images/BBQ.jpg" alt="Khu tiệc nướng BBQ" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative h-48 rounded-[8px] overflow-hidden border border-white/10">
              <Image src="/images/how-to-make-cold-brew-coffee-small-5-610x610.jpg" alt="Cà phê sáng" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* PlayStation Blue CTA Band */}
        <div className="bg-[#0070d1] text-white p-8 sm:p-12 rounded-[8px] text-center flex flex-col items-center">
          <h3 className="text-2xl sm:text-3xl font-light mb-2 tracking-tight">
            Bạn có hẹn với M_Dalats Villa?
          </h3>
          <p className="text-xs sm:text-sm text-white/85 font-normal max-w-md mx-auto mb-6">
            Hãy để chúng tôi đồng hành cùng chuyến du lịch khám phá xứ sở sương mù của bạn và những người thân yêu.
          </p>
          <Link
            href="/rooms"
            className="bg-white hover:bg-neutral-100 text-[#0070d1] text-xs sm:text-sm font-bold px-8 h-12 rounded-full transition-all flex items-center gap-2 shadow-none"
          >
            <span>Khám phá 11 phòng nghỉ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
