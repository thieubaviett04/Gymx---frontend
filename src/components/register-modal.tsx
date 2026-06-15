"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectedPackage = {
  id: string;
  name: string;
  duration: string;
  price: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  selectedPackage?: SelectedPackage | null;
};

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const parseDateValue = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (dateValue: string) =>
  dateValue ? dateValue.split("-").reverse().join("/") : "--/--/----";

const formatMonthLabel = (date: Date) =>
  `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

const getCalendarDays = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  return Array.from({ length: startOffset + daysInMonth }, (_, index) => {
    if (index < startOffset) return null;
    return new Date(year, month, index - startOffset + 1);
  });
};

export default function RegisterModal({
  open,
  onClose,
  selectedPackage,
}: Props) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [showDateError, setShowDateError] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [minStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  // Calendar states
const [calendarMonth, setCalendarMonth] = useState(() => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const resetId = window.setTimeout(() => {
      setStartDate("");
      setShowDateError(false);
      setDateErrorMessage("");
      setShowWarning(false);
      setBenefits([]);
      setIsSuccess(false);
      setIsCalendarOpen(false);
     const today = new Date();
setCalendarMonth(
  new Date(today.getFullYear(), today.getMonth(), 1)
);
    }, 0);

    return () => window.clearTimeout(resetId);
  }, [open, selectedPackage]);

  // Handle click outside to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setStartDate("");
    setShowDateError(false);
    setDateErrorMessage("");
    setShowWarning(false);
    setBenefits([]);
    setIsSuccess(false);
    onClose();
  };

  const parsePrice = (priceStr?: string) => {
    if (!priceStr) return 0;
    const numericStr = priceStr.replace(/[^0-9]/g, "");
    return parseInt(numericStr, 10) || 0;
  };

  const basePrice = parsePrice(selectedPackage?.price);
  const totalPrice = basePrice + benefits.length * 50000;

  const getDurationMonths = (durationStr?: string) => {
    if (!durationStr) return 1;
    const match = durationStr.match(/(\d+)\s*tháng/);
    if (match) return parseInt(match[1], 10);
    return 1;
  };

  let endDate = "";
  if (startDate) {
    const date = parseDateValue(startDate);
    const months = getDurationMonths(selectedPackage?.duration);
    date.setMonth(date.getMonth() + months);
    endDate = formatDateDisplay(toDateValue(date));
  }

  const toggleBenefit = (id: string) => {
    setBenefits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!startDate) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    }

    const selectedDate = parseDateValue(startDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

if (selectedDate <= todayDate) {
  setDateErrorMessage(
    "Ngày bắt đầu phải sau ngày hết hạn của gói cũ."
  );
  setShowDateError(true);
  return;
}

    handleGoToPayment();
  };

  const handleGoToPayment = () => {
    if (!selectedPackage) return;

    const benefitOptions = [
      { id: "nutrition", name: "Tư vấn dinh dưỡng cá nhân", price: 50000 },
      { id: "pt", name: "HLV Cá nhân kèm sát", price: 50000 },
      { id: "sauna", name: "Xông hơi VIP", price: 50000 },
      { id: "towel", name: "Mượn khăn miễn phí", price: 50000 },
    ];

    const checkout = {
      id: `INV-${Date.now()}`,
      source: "membership",
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      duration: selectedPackage.duration,
      startDate,
      selectedAddons: benefitOptions.filter((benefit) => benefits.includes(benefit.id)),
      amount: totalPrice,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("gym_pending_payment", JSON.stringify(checkout));
    handleClose();
    router.push("/payment");
  };

  const calendarDays = getCalendarDays(calendarMonth);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-45 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed left-1/2 top-5 z-55 flex w-[320px] -translate-x-1/2 items-center gap-3 rounded-full bg-white px-4 py-2 shadow-xl border border-amber-100 font-sans animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
            !
          </div>
          <span className="text-xs font-bold text-neutral-855">
            Vui lòng chọn ngày bắt đầu tập!
          </span>
          <button
            onClick={() => setShowWarning(false)}
            className="ml-auto text-neutral-400 hover:text-neutral-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      <div className="fixed left-1/2 top-[53%] z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4 font-sans select-none animate-in zoom-in-95 duration-250">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl relative text-neutral-800">
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="pr-6 mb-3">
                <h2 className="text-xl font-bold text-neutral-900">
                  Đăng ký gói tập
                </h2>
               <p className="text-xs text-neutral-450 mt-0.5">
                  Kiểm tra lại thông tin trước khi hoàn tất đăng ký
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Package Card Highlight */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-150 mb-3">
                  <h3 className="font-extrabold text-neutral-900 text-base">
                    {selectedPackage?.name}
                  </h3>
                  <span className="rounded-lg bg-neutral-100 border border-neutral-200/50 px-2.5 py-1 text-xs text-neutral-600 font-mono font-bold">
                    {selectedPackage?.id}
                  </span>
                </div>

                {/* Duration & Price Fields */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-750">
                      Thời hạn
                    </label>
                    <input
                      disabled
                      value={selectedPackage?.duration || ""}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold text-sm px-4 py-2 outline-none select-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-755">
                      Giá gói
                    </label>
                    <input
                      disabled
                      value={selectedPackage?.price ? selectedPackage.price.replace(" VNĐ", "") : ""}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold text-sm px-4 py-2 outline-none select-none"
                    />
                  </div>
                </div>

                {/* Dates Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={cn(
                      "text-xs font-bold",
                      showDateError ? "text-red-500" : "text-neutral-750"
                    )}>
                      Ngày bắt đầu <span className="text-[#FF6B00]">*</span>
                    </label>
                    <div className="relative" ref={calendarRef}>
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen((open) => !open)}
                        className={cn(
                          "h-10 w-full flex items-center justify-between rounded-xl border bg-white px-3 text-sm font-semibold hover:bg-neutral-50 transition cursor-pointer outline-none",
                          showDateError
                            ? "border-red-500 ring-1 ring-red-200 text-red-500"
                            : "border-neutral-200 text-neutral-800",
                        )}
                      >
                        <span>{formatDateDisplay(startDate)}</span>
                        <CalendarDays className={cn("h-4 w-4", showDateError ? "text-red-500" : "text-[#FF6B00]")} />
                      </button>

                      {isCalendarOpen && (
                        <div className="absolute left-0 top-[calc(100%+8px)] z-60 w-[276px] rounded-lg border border-neutral-200 bg-white p-3 shadow-lg font-sans">
                          {/* Calendar Header */}
                          <div className="relative flex items-center justify-center pt-1.5 pb-3">
                            <button
                              type="button"
                              onClick={() =>
                                setCalendarMonth(
                                  (month) => new Date(month.getFullYear(), month.getMonth() - 1, 1),
                                )
                              }
                              className="absolute left-1 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition cursor-pointer"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium text-neutral-800">
                              {formatMonthLabel(calendarMonth)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCalendarMonth(
                                  (month) => new Date(month.getFullYear(), month.getMonth() + 1, 1),
                                )
                              }
                              className="absolute right-1 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition cursor-pointer"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Weekdays Row */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {WEEK_DAYS.map((day) => (
                              <div key={day} className="h-8 w-8 flex items-center justify-center text-[10px] font-normal text-neutral-400">
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {calendarDays.map((day, index) => {
                              if (!day) {
                                return <div key={`empty-${index}`} className="h-8 w-8" />;
                              }

                              const dateValue = toDateValue(day);
                              const isSelected = dateValue === startDate;
                              const isDisabled = day < minStartDate;

                              return (
                                <button
                                  key={dateValue}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => {
                                    setStartDate(dateValue);
                                    setCalendarMonth(day);
                                    setIsCalendarOpen(false);
                                    setShowDateError(false);
                                    setDateErrorMessage("");
                                  }}
                                  className={cn(
                                    "h-8 w-8 rounded-md text-xs font-normal transition-colors flex items-center justify-center cursor-pointer",
                                    isSelected
                                      ? "bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90 font-medium"
                                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                                    isDisabled && "text-neutral-300 opacity-40 cursor-not-allowed pointer-events-none",
                                  )}
                                >
                                  {day.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {showDateError && (
                      <p className="text-[10px] text-red-500 font-semibold leading-tight mt-0.5">
                        {dateErrorMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-750">
                      Ngày kết thúc
                    </label>
                    <input
                      disabled
                      value={endDate || "Chờ ngày bắt đầu"}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-400 font-normal text-sm px-4 py-2 h-10 outline-none select-none"
                    />
                  </div>
                </div>

                {/* Add-on Benefits */}
                <div className="space-y-2 pt-0">
                  <label className="text-xs font-bold text-neutral-750">
                    Quyền lợi
                  </label>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[
                      { id: "nutrition", label: "Tư vấn dinh dưỡng cá nhân", price: "+50.000 VNĐ" },
                      { id: "pt", label: "HLV Cá nhân kèm sát", price: "+50.000 VNĐ" },
                      { id: "sauna", label: "Xông hơi VIP", price: "+50.000 VNĐ" },
                      { id: "towel", label: "Mượn khăn miễn phí", price: "+50.000 VNĐ" },
                    ].map((opt) => {
                      const isChecked = benefits.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleBenefit(opt.id)}
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition-all duration-200 select-none",
                            isChecked
                              ? "border-[#FF6B00] bg-[#FFF0E5]/30 shadow-2xs"
                              : "border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-355"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-4.5 w-4.5 items-center justify-center rounded border transition-all duration-200 shrink-0",
                              isChecked
                                ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                                : "border-neutral-300 bg-white"
                            )}
                          >
                            {isChecked && <Check size={11} className="stroke-[3]" />}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-neutral-800 leading-tight">{opt.label}</p>
                            <p className="text-[10px] font-bold text-[#FF6B00]">{opt.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total pricing and actions */}
                <div className="border-t border-neutral-150 pt-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-neutral-600">Tổng thanh toán</span>
                    <span className="text-2xl font-extrabold text-[#FF6B00]">
                      {totalPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-xl border border-neutral-200 bg-white px-10 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 cursor-pointer select-none"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="rounded-xl bg-[#FF6B00] px-10 py-2.5 text-sm font-semibold text-white transition hover:bg-[#CC5500] hover:shadow-lg hover:shadow-[#FF6B00]/10 cursor-pointer select-none"
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Success Modal View
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/15 animate-bounce">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-neutral-900">Đăng ký thành công!</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light px-4">
                  Hệ thống đã ghi nhận đăng ký gói hội viên của bạn. Hoàn thành bước thanh toán tiếp theo để kích hoạt gói tập.
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4 space-y-2 text-xs text-left text-neutral-600">
                <div className="flex justify-between">
                  <span>Mã gói tập:</span>
                  <span className="font-bold text-neutral-800">{selectedPackage?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gói đã chọn:</span>
                  <span className="font-bold text-neutral-800">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày bắt đầu:</span>
                  <span className="font-semibold text-neutral-800">
                    {formatDateDisplay(startDate)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dashed border-neutral-200 pt-2 mt-2">
                  <span className="font-bold">Tổng thanh toán:</span>
                  <span className="font-extrabold text-[#FF6B00]">
                    {totalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-3">
                <button
                  onClick={handleGoToPayment}
                  className="w-full rounded-xl bg-[#FF6B00] py-2.5 text-xs font-bold text-white transition hover:bg-[#CC5500] shadow-md shadow-[#FF6B00]/10 cursor-pointer select-none bg-gradient-to-r from-[#FF6B00] to-[#FF8833] hover:from-[#CC5500] hover:to-[#FF6B00]"
                >
                  Xong (Đi tới thanh toán)
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
