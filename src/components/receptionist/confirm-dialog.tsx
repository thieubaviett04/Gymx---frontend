"use client";

import React from "react";
import { useSchedule } from "@/context/ScheduleContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog() {
  const { isConfirmCancelOpen, setIsConfirmCancelOpen, cancelRegisteredShifts } = useSchedule();

  const handleConfirm = () => {
    cancelRegisteredShifts();
    setIsConfirmCancelOpen(false);
  };

  return (
    <AnimatePresence>
      {isConfirmCancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsConfirmCancelOpen(false)}
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 mx-4 border border-neutral-100 flex flex-col items-center text-center space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsConfirmCancelOpen(false)}
              className="absolute top-4 right-4 text-neutral-450 hover:text-neutral-600 transition-colors p-1.5 rounded-full hover:bg-neutral-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon - Red Circle with Question Mark */}
            <div className="w-16 h-16 rounded-full border-2 border-rose-500 flex items-center justify-center bg-rose-50 animate-bounce">
              <span className="text-3xl font-extrabold text-rose-500 font-sans leading-none">?</span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-neutral-800">
                Xác nhận hủy đăng ký ca làm
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                Bạn có chắc chắn muốn hủy các ca làm đã chọn không?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm py-3 rounded-xl active:scale-98 transition-all shadow-md shadow-rose-500/10 cursor-pointer"
              >
                Có, tôi đồng ý
              </button>
              <button
                onClick={() => setIsConfirmCancelOpen(false)}
                className="flex-1 border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-bold text-sm py-3 rounded-xl active:bg-neutral-100 transition-all cursor-pointer"
              >
                Không
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
