"use client";

import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Bell, MapPin, Sliders, Check, X, Sparkles, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  notifications: boolean;
  geolocation: boolean;
  updatedAt: string;
}

const STORAGE_KEY = "mdalats_cookie_consent_v1";

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference switches
  const [analytics, setAnalytics] = useState(true);
  const [personalization, setPersonalization] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [geolocation, setGeolocation] = useState(false);

  // Status badges for browser APIs
  const [notifStatus, setNotifStatus] = useState<string>("default");
  const [geoStatus, setGeoStatus] = useState<string>("default");

  useEffect(() => {
    setMounted(true);

    // Check existing stored consent
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalytics(parsed.analytics ?? true);
        setPersonalization(parsed.personalization ?? true);
        setNotifications(parsed.notifications ?? false);
        setGeolocation(parsed.geolocation ?? false);
      } catch {
        setShowBanner(true);
      }
    } else {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1600);
      return () => clearTimeout(timer);
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifStatus(Notification.permission);
    }

    const handleReopen = () => {
      setShowModal(true);
    };
    window.addEventListener("mdalats:open_cookie_preferences", handleReopen);
    return () => window.removeEventListener("mdalats:open_cookie_preferences", handleReopen);
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      analytics: true,
      personalization: true,
      notifications: true,
      geolocation: true,
      updatedAt: new Date().toISOString(),
    };
    saveConsent(allEnabled);
  };

  const handleAcceptEssentialOnly = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      personalization: false,
      notifications: false,
      geolocation: false,
      updatedAt: new Date().toISOString(),
    };
    saveConsent(essentialOnly);
  };

  const handleSaveCustom = () => {
    const custom: CookiePreferences = {
      essential: true,
      analytics,
      personalization,
      notifications,
      geolocation,
      updatedAt: new Date().toISOString(),
    };
    saveConsent(custom);
  };

  const handleRequestNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ thông báo đẩy.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission === "granted") {
        setNotifications(true);
        new Notification("M_Dalats Boutique Villa", {
          body: "Quý khách đã bật nhận thông báo ưu đãi Flash Sale và phòng trống thành công!",
          icon: "/images/m_dalats_logo_icon.svg",
        });
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const handleRequestGeolocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      () => {
        setGeoStatus("granted");
        setGeolocation(true);
      },
      () => {
        setGeoStatus("denied");
        setGeolocation(false);
      },
      { timeout: 10000 }
    );
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Bottom Cookie & Permission Bar */}
      <AnimatePresence>
        {showBanner && !showModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 sm:left-6 sm:right-auto sm:max-w-xl z-50 bg-[#121314]/95 backdrop-blur-xl border border-white/20 rounded-[8px] p-4 sm:p-5 text-white shadow-none"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#181818] text-[#53b1ff] flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                <Cookie className="w-5 h-5 text-[#0070d1]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm sm:text-base text-white font-light tracking-[0.1px]">
                    Quyền riêng tư & Cookie tại M_Dalats
                  </h4>
                  <span className="text-[9px] uppercase tracking-wider bg-[#0070d1] text-white px-2 py-0.5 rounded-full font-bold">
                    GDPR
                  </span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-light mb-3.5">
                  Chúng tôi sử dụng cookie và các quyền trình duyệt cần thiết để ghi nhớ lịch sử phòng bạn đã xem, tối ưu hóa tốc độ tải và cung cấp dịch vụ đặt phòng trực tiếp tốt nhất.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-xs font-bold tracking-[0.324px] px-5 py-2.5 rounded-full transition-colors cursor-pointer min-h-[38px] shadow-none"
                  >
                    Chấp nhận tất cả
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="border border-white/20 text-white hover:bg-white/10 text-xs font-bold tracking-[0.324px] px-4 py-2.5 rounded-full transition-colors cursor-pointer min-h-[38px] flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#53b1ff]" />
                    <span>Tùy chỉnh</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptEssentialOnly}
                    className="text-xs text-white/60 hover:text-white px-3 py-2 font-medium transition-colors cursor-pointer underline-offset-4 hover:underline"
                  >
                    Chỉ thiết yếu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Cookie & Browser Permissions Preferences Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#121314] rounded-[8px] sm:rounded-[12px] border border-white/20 w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar relative p-6 sm:p-8 text-left text-white shadow-none"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#181818] text-[#53b1ff] flex items-center justify-center shrink-0 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#0070d1]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl text-white font-light tracking-[0.1px]">
                    Tùy chỉnh Cookie & Quyền Trình Duyệt
                  </h3>
                  <p className="text-xs text-white/60">
                    M_Dalats Boutique Villa • Tôn trọng quyền riêng tư của bạn
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 my-6 text-xs text-white/70">
                {/* 1. Essential Cookies */}
                <div className="p-4 bg-[#181818] rounded-[8px] border border-white/10 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">1. Cookie Thiết Yếu</span>
                      <span className="text-[9px] uppercase tracking-wider bg-[#0070d1] text-white px-2 py-0.5 rounded-full font-bold">
                        Bắt buộc
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      Cần thiết để duy trì hoạt động của website, bảo mật phiên đăng nhập, giỏ phòng đang đặt và chống tấn công bảo mật CSRF. Không thể vô hiệu hóa.
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#53b1ff] bg-[#121314] border border-white/20 px-3 py-1 rounded-full">
                      <Check className="w-3.5 h-3.5 text-[#0070d1]" />
                      Luôn bật
                    </span>
                  </div>
                </div>

                {/* 2. Personalization Cookies */}
                <div className="p-4 bg-[#181818] rounded-[8px] border border-white/10 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">2. Cá Nhân Hóa & Ghi Nhớ Lịch Sử Phòng</span>
                      <span className="text-[9px] uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-bold">
                        Khuyên dùng
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      Ghi nhớ ngày nhận/trả phòng, số lượng khách và phòng bạn vừa xem gần nhất để không phải nhập lại mỗi khi mở lại trang.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={personalization}
                      onChange={(e) => setPersonalization(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#121314] border border-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070d1]"></div>
                  </label>
                </div>

                {/* 3. Analytics Cookies */}
                <div className="p-4 bg-[#181818] rounded-[8px] border border-white/10 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-semibold text-white text-sm block">3. Phân Tích & Hiệu Năng</span>
                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      Giúp villa nhận biết các trang được yêu thích, đo lường tốc độ phản hồi của hệ thống để cải thiện trải nghiệm duyệt web. Dữ liệu hoàn toàn ẩn danh.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#121314] border border-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070d1]"></div>
                  </label>
                </div>

                {/* 4. Browser Notification Permission */}
                <div className="p-4 bg-[#181818] rounded-[8px] border border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-white text-sm">
                        <Bell className="w-4 h-4 text-[#ffce21]" />
                        <span>4. Thông Báo Trình Duyệt (Web Push)</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-light">
                        Nhận thông báo khi có chương trình Flash Sale giờ vàng hoặc phòng trống phút chót với giá ưu đãi.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestNotification}
                      className="bg-[#121314] hover:bg-white/10 border border-white/20 text-white px-3.5 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                    >
                      {notifStatus === "granted" ? "✓ Đã cấp quyền" : notifStatus === "denied" ? "Đã bị chặn" : "Cấp quyền"}
                    </button>
                  </div>
                </div>

                {/* 5. Browser Geolocation Permission */}
                <div className="p-4 bg-[#181818] rounded-[8px] border border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-white text-sm">
                        <MapPin className="w-4 h-4 text-[#0070d1]" />
                        <span>5. Vị Trí Địa Lý (Chỉ Đường Nhanh)</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-light">
                        Hỗ trợ xác định khoảng cách và chỉ đường Google Maps nhanh nhất từ vị trí hiện tại đến 14/2 Đường 3 Tháng 4, Phường 3, Đà Lạt.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestGeolocation}
                      className="bg-[#121314] hover:bg-white/10 border border-white/20 text-white px-3.5 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                    >
                      {geoStatus === "granted" ? "✓ Đã chia sẻ" : geoStatus === "requesting" ? "Đang dò..." : "Cấp quyền"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="text-xs text-[#53b1ff] hover:underline font-semibold cursor-pointer"
                >
                  Chấp nhận tất cả
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="bg-[#0070d1] hover:bg-[#0064b7] text-white px-6 py-2 rounded-full text-xs font-bold tracking-[0.324px] transition-colors cursor-pointer shadow-none"
                  >
                    Lưu lựa chọn
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
