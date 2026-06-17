"use client";

import React, { useEffect } from "react";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomToastProps {
  show: boolean;
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function CustomToast({
  show,
  type,
  message,
  onClose,
  duration = 4000,
}: CustomToastProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-6 left-0 right-0 flex justify-center pointer-events-none z-[999999] px-4 font-sans">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="pointer-events-auto bg-white border border-[#E5E7EB] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] pl-3.5 pr-4 py-2.5 flex items-center gap-3 w-[360px] max-w-[90vw]"
          >
            {/* Left concentric status circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                type === "success" && "bg-[#45C16C]",
                type === "error" && "bg-[#E14D43]",
                type === "warning" && "bg-[#F1A300]"
              )}
            >
              {/* White inner circle */}
              <div className="w-[16px] h-[16px] rounded-full bg-white flex items-center justify-center">
                {type === "success" && (
                  <Check className="w-2.5 h-2.5 text-[#45C16C] stroke-[4.5]" />
                )}
                {type === "error" && (
                  <X className="w-2 h-2 text-[#E14D43] stroke-[4.5]" />
                )}
                {type === "warning" && (
                  <span className="text-[10px] font-black text-[#F1A300] leading-none select-none">
                    !
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <span className="text-sm font-semibold text-[#111111] flex-1 select-none leading-normal text-left pr-1">
              {message}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800 cursor-pointer transition-colors p-1.5 shrink-0"
            >
              <X className="w-[18px] h-[18px] stroke-[2]" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
