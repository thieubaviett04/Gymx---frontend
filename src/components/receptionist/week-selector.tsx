"use client";

import React from "react";
import { useSchedule } from "@/context/ScheduleContext";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function WeekSelector() {
  const {
    selectedMonth,
    setSelectedMonth,
    selectedWeekIndex,
    setSelectedWeekIndex,
    getWeeksForMonth,
    isWeekDisabled,
  } = useSchedule();

  const weeks = getWeeksForMonth(selectedMonth);

  const handlePrevMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() - 1);
    setSelectedMonth(newMonth);
    setSelectedWeekIndex(0); // reset to first week
  };

  const handleNextMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + 1);
    setSelectedMonth(newMonth);
    setSelectedWeekIndex(0); // reset to first week
  };

  const formatMonth = (date: Date) => {
    return `Tháng ${date.getMonth() + 1} / ${date.getFullYear()}`;
  };

  const formatDateRange = (start: Date, end: Date) => {
    const format = (d: Date) => {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };
    return `${format(start)} - ${format(end)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 space-y-4">
      {/* Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#FF6B00] pl-3">
        <h3 className="text-lg font-bold text-neutral-800">
          Chọn tuần làm việc
        </h3>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-600 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="bg-neutral-50 border border-neutral-200 px-4 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 min-w-[120px] text-center">
            {formatMonth(selectedMonth)}
          </div>

          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-600 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeks.map((week, idx) => {
          const isSelected = idx === selectedWeekIndex;
          const disabled = isWeekDisabled(week);

          let cardClasses = "";
          let icon = null;

          if (disabled) {
            // Future week: Disabled card (grey background, unclickable)
            cardClasses = "bg-neutral-100 border-neutral-200 text-neutral-450 cursor-not-allowed opacity-60";
          } else if (isSelected) {
            // Selected week: Orange border and orange checkmark badge positioned absolute top-right
            cardClasses = "bg-white border-[#FF6B00] ring-2 ring-[#FF6B00]/10 text-neutral-800 cursor-pointer shadow-md";
            icon = (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-md shrink-0">
                <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
              </div>
            );
          } else {
            // Clickable available week or past week
            cardClasses = "bg-white border-neutral-200 hover:border-neutral-350 text-neutral-600 cursor-pointer hover:shadow-md";
          }

          return (
            <div
              key={idx}
              onClick={() => {
                if (!disabled) {
                  setSelectedWeekIndex(idx);
                }
              }}
              className={`border rounded-xl p-5 flex flex-col justify-center h-28 transition-all duration-200 relative ${cardClasses}`}
            >
              <div>
                <h4 className="font-bold text-sm tracking-wide">{week.label}</h4>
                <p className="text-xs mt-1 opacity-80 font-medium">
                  {formatDateRange(week.startDate, week.endDate)}
                </p>
              </div>
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
