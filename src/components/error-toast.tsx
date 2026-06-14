"use client";

import { X } from "lucide-react";

type Props = {
  show: boolean;
};

export default function ErrorToast({ show }: Props) {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          z-40
          bg-black/50
        "
      />

      {/* Toast */}
      <div
        className="
          fixed
          left-1/2
          top-5
          z-[60]
          flex
          w-[360px]
          -translate-x-1/2
          items-center
          gap-3
          rounded-full
          bg-white
          px-4
          py-2.5
          shadow-xl
          border
          border-red-100
          font-sans
          animate-in
          fade-in
          slide-in-from-top-4
          duration-300
        "
      >
        {/* Red circle with white circle and red X */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-xs">
          <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[#EF4444]">
            <X className="h-2.5 w-2.5 stroke-[3]" />
          </div>
        </div>

        <span className="text-sm font-normal text-neutral-800">
          Có lỗi xảy ra! Vui lòng thử lại
        </span>

        <button className="flex items-center justify-center ml-auto text-neutral-400 hover:text-neutral-600 cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}