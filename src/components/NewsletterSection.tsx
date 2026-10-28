"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { FadeIn, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

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
    <SectionStack index={12} dark className="py-16 sm:py-20 bg-[#000000] border-b border-white/10 overflow-hidden text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <FadeIn direction="up">
            <div className="w-12 h-12 rounded-full bg-[#0070d1]/15 text-[#53b1ff] flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block mb-2">
              Privé Newsletter • Bản Tin M_Dalats
            </span>
            <h3 className="text-2xl sm:text-3xl text-white font-light tracking-tight mb-2">
              Nhận thông tin & ưu đãi độc quyền
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal max-w-md mx-auto mb-6 leading-relaxed">
              Đăng ký để nhận sớm các chương trình ưu đãi theo mùa và cẩm nang nghỉ dưỡng tinh tế tại xứ sở sương mù.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 p-4 bg-[#181818] border border-white/15 text-white text-xs rounded-full">
                <CheckCircle2 className="w-4 h-4 text-[#0070d1]" />
                <span>Cảm ơn quý khách đã đăng ký nhận bản tin từ M_Dalats Villa!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của quý khách..."
                  className="flex-1 bg-[#181818] border border-white/20 text-white text-xs px-4 h-12 rounded-full focus:outline-none focus:border-[#0070d1]"
                  required
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="h-12 px-7 font-bold text-xs sm:text-sm bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white rounded-full cursor-pointer shadow-none"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Đăng ký</span>
                  )}
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </SectionStack>
  );
}
