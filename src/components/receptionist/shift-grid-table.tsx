"use client";

import React from "react";
import { useSchedule, SHIFTS, DAYS } from "@/context/ScheduleContext";
import { Check } from "lucide-react";

export default function ShiftGridTable() {
  const {
    getWeeksForMonth,
    selectedMonth,
    selectedWeekIndex,
    selectedShifts,
    registeredShifts,
    toggleShiftSelection,
    isPastWeek,
    isPastDeadline,
    registerSelectedShifts,
    cancelRegisteredShifts,
    setIsConfirmCancelOpen,
    showToast,
  } = useSchedule();

  const weeks = getWeeksForMonth(selectedMonth);
  const activeWeek = weeks[selectedWeekIndex] || weeks[0];

  const weekKey = activeWeek.startDate.toISOString().split("T")[0];
  const isPast = isPastWeek(activeWeek);
  const isExpired = isPastDeadline(activeWeek);
  const isReadOnly = isPast || isExpired;

  // Check if there are already registered shifts for this week
  const hasRegistered = Object.keys(registeredShifts).some(
    (key) => key.startsWith(weekKey) && registeredShifts[key]
  );

  // Grid editing is disabled if it's read-only or already registered
  const isGridDisabled = isReadOnly || hasRegistered;

  // Render cell helper
  const renderCell = (dayIndex: number, shiftId: string) => {
    const cellKey = `${weekKey}_${dayIndex}_${shiftId}`;
    const isRegistered = !!registeredShifts[cellKey];
    const isSelected = !!selectedShifts[cellKey];

    // Determine state styling
    let cellClasses = "hover:bg-neutral-50 cursor-pointer";
    let content = null;

    if (isGridDisabled) {
      if (isRegistered) {
        cellClasses =
          "bg-neutral-100 text-neutral-500 font-semibold text-xs border-neutral-200 cursor-pointer hover:bg-neutral-200";
        content = (
          <div className="flex items-center justify-center gap-1">
            <Check className="w-4 h-4 text-neutral-500" />
            <span>Đã đăng ký</span>
          </div>
        );
      } else {
        cellClasses =
          "bg-neutral-50/50 opacity-60 cursor-pointer hover:bg-neutral-100";
        content = (
          <div className="w-5 h-5 rounded-md border border-neutral-200 bg-neutral-100 flex items-center justify-center mx-auto" />
        );
      }
    } else {
      // Editable week
      if (isSelected) {
        // Selected shifts (pending registration)
        cellClasses = "bg-[#FFF0E5] border-[#FF6B00]/50 text-[#FF6B00] active:scale-98 transition-all";
        content = (
          <div className="w-5 h-5 rounded-md border-2 border-[#FF6B00] bg-[#FF6B00] flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
          </div>
        );
      } else {
        // Available and empty
        cellClasses = "hover:bg-neutral-50 hover:border-neutral-350 active:bg-neutral-100/50 transition-all";
        content = (
          <div className="w-5 h-5 rounded-md border border-neutral-300 bg-white flex items-center justify-center mx-auto" />
        );
      }
    }

    return (
      <td
        key={dayIndex}
        onClick={() => {
          toggleShiftSelection(dayIndex, shiftId);
        }}
        className={`border border-neutral-200 p-4 text-center select-none ${cellClasses}`}
      >
        {content}
      </td>
    );
  };

  const handleRegisterClick = () => {
    // Nếu đã hết hạn/quá khứ thì hiển thị thông báo lỗi thay vì chạy logic đăng ký
    if (isReadOnly) {
      showToast("Đã hết thời gian đăng ký ca làm", "error");
      return;
    }

    // Nếu không khả dụng do lý do khác (đã đăng ký rồi chẳng hạn)
    if (isGridDisabled) {
      return;
    }

    registerSelectedShifts();
  };

  const handleCancelClick = () => {
    if (isReadOnly) {
      showToast("Đã hết thời gian hủy lịch làm", "error");
      return;
    }

    if (hasRegistered) {
      setIsConfirmCancelOpen(true);
    } else {
      cancelRegisteredShifts();
    }
  };

  // Format active week labels for status alert
  const formatDateLabel = (d: Date) => {
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 space-y-6">
      {/* Panel Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#FF6B00] pl-3">
        <div>
          <h3 className="text-lg font-bold text-neutral-800">
            Chọn ca làm việc
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Lịch làm việc tuần: {formatDateLabel(activeWeek.startDate)} - {formatDateLabel(activeWeek.endDate)}
          </p>
        </div>
      </div>

      {/* Shifts Table */}
      <div className="overflow-x-auto border border-neutral-200 rounded-xl">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <th className="p-4 border-r border-neutral-200 text-center w-40 font-bold">Ca làm</th>
              {DAYS.map((day) => (
                <th key={day.index} className="p-4 text-center font-bold">
                  {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {SHIFTS.map((shift) => (
              <tr key={shift.id} className="hover:bg-neutral-50/30 transition-colors">
                {/* Shift Info */}
                <td className="p-4 bg-neutral-50/50 border-r border-neutral-200 font-medium text-neutral-700 text-center">
                  <div className="font-bold text-neutral-800">{shift.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{shift.time}</div>
                </td>
                {/* Days Cells */}
                {DAYS.map((day) => renderCell(day.index, shift.id))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border border-neutral-350 bg-white" />
            <span>Chưa chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#FF6B00]" />
            <span>Đã chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-neutral-100 border border-neutral-200" />
            <span>Không khả dụng</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleCancelClick}
            className={`
              flex-1 sm:flex-initial
              border
              font-bold
              text-sm
              px-6 py-2.5
              rounded-xl
              transition-all
              cursor-pointer
              ${isReadOnly
                ? "bg-neutral-100 text-neutral-400 border-neutral-200 opacity-70"
                : "border-neutral-300 text-neutral-600 bg-white hover:border-neutral-450 hover:bg-neutral-50 active:bg-neutral-100"
              }
            `}
          >
            Hủy
          </button>

          <button
            onClick={handleRegisterClick}
            className={`
    flex-1 sm:flex-initial
    text-white
    font-bold
    text-sm
    px-8 py-2.5
    rounded-xl
    transition-all
    shadow-md
    cursor-pointer
    ${isReadOnly
                ? "bg-[#FF6B00]/40 cursor-pointer shadow-none text-white/80"
                : isGridDisabled
                  ? "bg-[#FF6B00] cursor-not-allowed opacity-50 shadow-none text-neutral-500"
                  : "bg-[#FF6B00] hover:bg-[#E56000] active:scale-98"
              }
  `}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}