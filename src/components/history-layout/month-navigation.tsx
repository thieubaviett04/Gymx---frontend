import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showMonthPicker: boolean;
  setShowMonthPicker: (show: boolean) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  monthPickerRef: React.RefObject<HTMLDivElement | null>;
}

export default function MonthNavigation({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  showMonthPicker,
  setShowMonthPicker,
  setCurrentMonth,
  setCurrentYear,
  monthPickerRef,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center bg-neutral-background border border-neutral-border rounded-lg shadow-2xs relative">
      <button
        onClick={onPrevMonth}
        className="p-3 hover:bg-neutral-muted text-neutral-mutedforeground hover:text-neutral-foreground transition-colors cursor-pointer"
        title="Tháng trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Middle text click to open Month Picker */}
      <div ref={monthPickerRef} className="relative">
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="px-5 py-2 text-xs font-bold text-neutral-foreground hover:bg-neutral-muted transition-colors cursor-pointer select-none"
        >
          Tháng {currentMonth} / {currentYear}
        </button>

        {showMonthPicker && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-neutral-background border border-neutral-border rounded-xl shadow-xl z-30 p-3.5 space-y-3 text-neutral-foreground">
            <div className="flex justify-center items-center border-b border-neutral-border pb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentYear((y) => y - 1)}
                  className="p-1 hover:bg-neutral-muted rounded cursor-pointer text-xs font-bold"
                >
                  ◀
                </button>
                <span className="text-sm font-bold text-neutral-foreground">
                  {currentYear}
                </span>
                <button
                  onClick={() => setCurrentYear((y) => y + 1)}
                  className="p-1 hover:bg-neutral-muted rounded cursor-pointer text-xs font-bold"
                >
                  ▶
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                const isSelectedMonth = m === currentMonth;
                const isSystemCurrentMonth = m === 5 && currentYear === 2026;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      setCurrentMonth(m);
                      setShowMonthPicker(false);
                    }}
                    className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      isSelectedMonth
                        ? "bg-primary text-primary-foreground"
                        : isSystemCurrentMonth
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "hover:bg-neutral-muted text-neutral-foreground"
                    }`}
                  >
                    T{m}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-2 border-t border-neutral-border">
              <button
                onClick={() => {
                  setCurrentMonth(5);
                  setCurrentYear(2026);
                  setShowMonthPicker(false);
                }}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Đặt lại
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNextMonth}
        className="p-3 hover:bg-neutral-muted text-neutral-mutedforeground hover:text-neutral-foreground transition-colors cursor-pointer"
        title="Tháng sau"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
