"use client";

import React, { useState, useEffect } from "react";
import { useSchedule } from "@/context/ScheduleContext";
import { Clock, Sliders, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MockTimeController() {
  const { mockTime, setMockTime } = useSchedule();
  const [isOpen, setIsOpen] = useState(false);

  // Custom picker state
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [typedTime, setTypedTime] = useState("");
  const [isValid, setIsValid] = useState(true);

  // format date as DD/MM/YYYY HH:mm
  const formatVietnameseDateTime = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const parseVietnameseDateTime = (str: string): Date | null => {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})$/;
    const match = str.trim().match(regex);
    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (hours < 0 || hours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;

    const date = new Date(year, month - 1, day, hours, minutes, 0);
    if (isNaN(date.getTime())) return null;
    return date;
  };

  // Sync inputs with mockTime
  useEffect(() => {
    const formatted = formatVietnameseDateTime(mockTime);
    const parsedCurrent = parseVietnameseDateTime(typedTime);
    if (!parsedCurrent || parsedCurrent.getTime() !== mockTime.getTime()) {
      setTypedTime(formatted);
      setIsValid(true);
    }

    const year = mockTime.getFullYear();
    const month = String(mockTime.getMonth() + 1).padStart(2, "0");
    const day = String(mockTime.getDate()).padStart(2, "0");

    const hours = String(mockTime.getHours()).padStart(2, "0");
    const minutes = String(mockTime.getMinutes()).padStart(2, "0");

    setCustomDate(`${year}-${month}-${day}`);
    setCustomTime(`${hours}:${minutes}`);
  }, [mockTime]);

  const handleTypedTimeChange = (val: string) => {
    setTypedTime(val);
    const parsedDate = parseVietnameseDateTime(val);
    if (parsedDate) {
      setIsValid(true);
      setMockTime(parsedDate);
    } else {
      setIsValid(false);
    }
  };

  // Handle live date change
  const handleDateChange = (dateStr: string) => {
    if (!dateStr) return;
    const [year, month, day] = dateStr.split("-").map(Number);
    const newDate = new Date(
      year,
      month - 1,
      day,
      mockTime.getHours(),
      mockTime.getMinutes(),
      0
    );
    setMockTime(newDate);
  };

  // Handle live time change
  const handleTimeChange = (timeStr: string) => {
    if (!timeStr) return;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = new Date(
      mockTime.getFullYear(),
      mockTime.getMonth(),
      mockTime.getDate(),
      hours,
      minutes,
      0
    );
    setMockTime(newDate);
  };

  // Quick preset triggers
  const setPreset = (presetType: "before" | "after" | "past") => {
    if (presetType === "before") {
      setMockTime(new Date("2026-06-12T23:49:00+07:00"));
    } else if (presetType === "after") {
      setMockTime(new Date("2026-06-14T09:00:00+07:00"));
    } else if (presetType === "past") {
      setMockTime(new Date("2026-07-05T12:00:00+07:00"));
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    const daysVN = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const dayName = daysVN[d.getDay()];

    return `${dayName}, ${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-neutral-800 transition-all border border-neutral-700 font-bold text-sm cursor-pointer"
      >
        <Sliders className="w-4 h-4 text-[#FF6B00] animate-pulse" />
        <span>Giả lập thời gian (Demo)</span>
      </button>

      {/* Floating Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-96 bg-neutral-900 text-neutral-200 rounded-2xl shadow-3xl p-6 border border-neutral-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-base text-neutral-100">Thời gian hệ thống</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-200 text-sm cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {/* Current Time Display */}
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-450 uppercase tracking-wider block font-bold">
                Thời gian giả lập hiện tại
              </span>
              <span className="font-mono text-xs font-bold text-[#FF6B00]">
                {formatDate(mockTime)}
              </span>
            </div>

            {/* Live Custom Picker */}
            <div className="space-y-3 bg-neutral-950/40 p-4 rounded-xl border border-neutral-800">
              <span className="text-xs font-bold text-neutral-450 block">Tự chỉnh thời gian (Thay đổi sẽ tự validate):</span>

              {/* Text input for manual typing */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-450 font-bold block">Nhập tay thời gian (DD/MM/YYYY HH:mm)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={typedTime}
                    onChange={(e) => handleTypedTimeChange(e.target.value)}
                    placeholder="VD: 13/06/2026 08:30"
                    className={`w-full bg-neutral-800 border rounded-lg pl-3 pr-20 py-1.5 text-xs text-white focus:outline-none font-mono ${isValid ? "border-neutral-700 focus:border-[#FF6B00]" : "border-rose-500 focus:border-rose-500"
                      }`}
                  />
                  <span className={`absolute right-2 top-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${isValid ? "text-emerald-400 bg-emerald-950/50" : "text-rose-400 bg-rose-950/50"
                    }`}>
                    {isValid ? "Hợp lệ" : "Lỗi định dạng"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-450 font-bold block">Chọn Ngày nhanh</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-450 font-bold block">Chọn Giờ nhanh</label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono cursor-pointer"
                  />
                </div>
              </div>
            </div>


            <div className="flex items-center gap-1.5 bg-neutral-950 p-2 rounded text-[10px] text-neutral-400 border border-neutral-950">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>Giao diện tự động cập nhật ngay lập tức khi bạn chỉnh.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
