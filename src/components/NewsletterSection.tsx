"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { FadeIn } from "./MotionWrapper";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = api.contact.subscribeNewsletter.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email });
  };

  return (
    <section className="py-14 sm:py-16 bg-[#faf7f1] border-b border-[#ece7dd] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="max-w-xl mx-auto text-center">
          <FadeIn direction="up">
          <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[#367156] mx-auto mb-2.5 sm:mb-3" />
          <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-normal mb-1.5">
            Nhận thông tin mới từ M_Dalats
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#666666] font-light max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed">
            Đăng ký để nhận sớm các chương trình ưu đãi theo mùa và cẩm nang du lịch Đà Lạt đặc sắc.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3 bg-white border border-green-300 text-green-800 text-xs rounded-sm shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Cảm ơn bạn đã đăng ký nhận thông tin từ M_Dalats!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="flex-1 bg-white border border-[#d6cebf] px-3.5 py-2 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                required
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="bg-[#367156] hover:bg-[#113123] text-white px-5 py-2.5 min-h-[42px] rounded-sm text-xs uppercase tracking-wider font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Đăng ký</span>
                )}
              </button>
            </form>
          )}
        </FadeIn>
        </div>
      </div>
    </section>
  );
}
