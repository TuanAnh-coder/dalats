"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { AuthForm } from "~/components/AuthForm";
import { isStaffRole } from "~/lib/roles";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#121212] text-white border border-[#2a2a2a] rounded-[12px] p-6 sm:p-8 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-none">
        <DialogHeader className="text-center sm:text-center mb-4">
          <div className="relative w-10 h-10 mx-auto mb-2 invert brightness-200">
            <Image
              src="/images/LE_LogoIcon.svg"
              alt="M_Dalats"
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <DialogTitle className="text-base font-bold text-white tracking-[1.5px] uppercase">
            M_Dalats Boutique Villa
          </DialogTitle>
          <DialogDescription className="text-xs text-[#888888]">
            Đăng nhập để xem lịch sử đơn đặt phòng và nhận ưu đãi độc quyền
          </DialogDescription>
        </DialogHeader>

        <AuthForm
          showHeader={false}
          onSuccess={({ role }) => {
            onClose();
            if (isStaffRole(role)) {
              router.push("/admin");
            }
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
