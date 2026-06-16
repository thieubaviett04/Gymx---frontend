"use client";

import React, { useEffect } from "react";
import { useSchedule } from "@/context/ScheduleContext";
// CHỖ SỬA 1: Thêm XCircle vào đoạn import từ lucide-react
import { X, Check, XCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { toast, hideToast } = useSchedule();

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return (
    <AnimatePresence>
      {toast?.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="bg-white rounded-full shadow-xl border border-neutral-200 px-6 py-3.5 flex items-center justify-between gap-4 w-full"
          >
            {/* Left side: Icon + Message */}
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                </div>
              )}

              {/* CHỖ SỬA 2: Thay đổi AlertCircle thành XCircle để hiển thị dấu X trắng trên nền đỏ */}
              {toast.type === "error" && (
                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                  <XCircle className="w-3.5 h-3.5 text-white stroke-[3px]" />
                </div>
              )}

              {toast.type === "warning" && (
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-white stroke-[3px]" />
                </div>
              )}
              <span className="text-xs font-bold text-neutral-700 tracking-wide">
                {toast.message}
              </span>
            </div>

            {/* Right side: Dismiss Button */}
            <button
              onClick={hideToast}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 rounded-full hover:bg-neutral-50 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}