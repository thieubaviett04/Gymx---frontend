"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Shift definition
// Sáng: 5:00 - 11:00, Chiều: 11:00 - 17:00, Tối: 17:00 - 23:00
export interface Shift {
  id: string; // e.g. "morning", "afternoon", "evening"
  name: string;
  time: string;
}

export const SHIFTS: Shift[] = [
  { id: "morning", name: "Sáng", time: "05:00 - 11:00" },
  { id: "afternoon", name: "Chiều", time: "11:00 - 17:00" },
  { id: "evening", name: "Tối", time: "17:00 - 23:00" },
];

export const DAYS = [
  { name: "Thứ 2", index: 1 },
  { name: "Thứ 3", index: 2 },
  { name: "Thứ 4", index: 3 },
  { name: "Thứ 5", index: 4 },
  { name: "Thứ 6", index: 5 },
  { name: "Thứ 7", index: 6 },
  { name: "Chủ nhật", index: 0 }, // 0 is Sunday in JS
];

export interface Week {
  index: number; // 1 to 4
  label: string;
  startDate: Date;
  endDate: Date;
}
const getWeekKey = (week: Week) => {
  return week.startDate.toISOString().split("T")[0];
};

interface EmployeeInfo {
  name: string;
  code: string;
  role: string;
}

// Key is `weekStartDateString_dayIndex_shiftId`
export type ShiftRegisterMap = Record<string, boolean>;

interface ScheduleContextType {
  mockTime: Date;
  setMockTime: (date: Date) => void;
  employeeInfo: EmployeeInfo;
  setEmployeeInfo: (info: EmployeeInfo) => void;
  selectedMonth: Date; // represents month view (e.g. Month starting 1st)
  setSelectedMonth: (date: Date) => void;
  selectedWeekIndex: number; // 0 to 3
  setSelectedWeekIndex: (index: number) => void;

  // Shift operations
  selectedShifts: ShiftRegisterMap; // currently clicked but not registered yet
  toggleShiftSelection: (dayIndex: number, shiftId: string) => void;
  clearSelection: () => void;

  registeredShifts: ShiftRegisterMap; // actually registered shifts
  registerSelectedShifts: () => { success: boolean; message: string };
  cancelRegisteredShifts: () => { success: boolean; message: string };

  // Dialog and toast states
  isConfirmCancelOpen: boolean;
  setIsConfirmCancelOpen: (open: boolean) => void;
  toast: { show: boolean; type: "success" | "error" | "warning"; message: string } | null;
  showToast: (message: string, type: "success" | "error" | "warning") => void;
  hideToast: () => void;

  currentView: "home" | "schedule";
  setCurrentView: (view: "home" | "schedule") => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;

  // Helpers
  getWeeksForMonth: (month: Date) => Week[];
  getCurrentWeek: () => Week;
  isPastWeek: (week: Week) => boolean;
  isPastDeadline: (week: Week) => boolean;
  getDeadlineTime: (week: Week) => Date;
  isWeekDisabled: (week: Week) => boolean;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  // Current mock time, default is 2026-06-11 23:49:41
  const [mockTime, setMockTimeState] = useState<Date>(() => {
    return new Date("2026-06-11T23:49:41+07:00");
  });

  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: "Nguyễn Văn A",
    code: "NV2026",
    role: "Lễ tân",
  });

  // Selected Month, default matching June 2026 (based on mockTime)
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const d = new Date("2026-06-01T00:00:00+07:00");
    return d;
  });

  // Selected Week index (0, 1, 2, 3)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(1); // default is Tuần 2 (June 8 - June 14)

  // Currently pending selected shifts in the UI
  const [selectedShifts, setSelectedShifts] = useState<ShiftRegisterMap>({});

  // Registered shifts stored in local state (loaded from localStorage on mount)
  const [registeredShifts, setRegisteredShifts] = useState<ShiftRegisterMap>({});

  // Confirm cancel dialog
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  // Layout views state
  const [currentView, setCurrentView] = useState<"home" | "schedule">("schedule");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error" | "warning"; message: string } | null>(null);

  // Load registered shifts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gym_max_registered_shifts");
    if (saved) {
      try {
        setRegisteredShifts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to localStorage whenever registeredShifts changes
  const saveRegisteredShifts = (newShifts: ShiftRegisterMap) => {
    setRegisteredShifts(newShifts);
    localStorage.setItem("gym_max_registered_shifts", JSON.stringify(newShifts));
  };

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Helper to update mock time
  const setMockTime = (date: Date) => {
    setMockTimeState(date);
  };

  // Generate 4 weeks for a given month
  const getWeeksForMonth = (monthDate: Date): Week[] => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const weeks: Week[] = [];

    for (let i = 0; i < 4; i++) {
      const startDate = new Date(year, month, i * 7 + 1, 0, 0, 0);
      const endDate = new Date(year, month, (i + 1) * 7, 23, 59, 59);

      weeks.push({
        index: i + 1,
        label: `Tuần ${i + 1}`,
        startDate,
        endDate,
      });
    }
    return weeks;
  };

  // Synchronize selectedMonth and selectedWeekIndex when mockTime changes
  useEffect(() => {
    const year = mockTime.getFullYear();
    const month = mockTime.getMonth();
    const newMonth = new Date(year, month, 1, 0, 0, 0);
    setSelectedMonth(newMonth);

    const weeks = getWeeksForMonth(newMonth);

    // Check if there is an open week
    let openWeekIdx = -1;
    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i];

      const monday = new Date(week.startDate);
      const day = monday.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      monday.setDate(monday.getDate() + diff);
      monday.setHours(0, 0, 0, 0);

      const openTime = new Date(monday);
      openTime.setDate(monday.getDate() - 2); // Saturday of previous week
      openTime.setHours(6, 0, 0, 0);

      const deadline = new Date(openTime);
      deadline.setHours(23, 0, 0, 0);

      if (mockTime >= openTime && mockTime <= deadline) {
        openWeekIdx = i;
        break;
      }
    }

    if (openWeekIdx !== -1) {
      setSelectedWeekIndex(openWeekIdx);
    } else {
      // If no week is currently in its open window, default to the week containing mockTime
      let containingWeekIdx = 1; // Default to Week 2
      for (let i = 0; i < weeks.length; i++) {
        if (mockTime >= weeks[i].startDate && mockTime <= weeks[i].endDate) {
          containingWeekIdx = i;
          break;
        }
      }
      setSelectedWeekIndex(containingWeekIdx);
    }
  }, [mockTime]);

  const currentWeeks = getWeeksForMonth(selectedMonth);
  const activeWeek = currentWeeks[selectedWeekIndex] || currentWeeks[0];

  // Get current week in terms of mock time
  const getCurrentWeek = (): Week => {
    const weeks = getWeeksForMonth(mockTime);
    for (const w of weeks) {
      if (mockTime >= w.startDate && mockTime <= w.endDate) {
        return w;
      }
    }
    return weeks[1];
  };

  // Check if a week is entirely in the past relative to mockTime
  const isPastWeek = (week: Week): boolean => {
    return mockTime > week.endDate;
  };

  // Get the registration/cancellation deadline for a week
  const getDeadlineTime = (week: Week): Date => {
    const monday = new Date(week.startDate);
    const day = monday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const deadline = new Date(monday);
    deadline.setDate(monday.getDate() - 2);
    deadline.setHours(23, 0, 0, 0);
    return deadline;
  };

  // Check if mockTime has passed the deadline for a week
  const isPastDeadline = (week: Week): boolean => {
    const deadline = getDeadlineTime(week);
    return mockTime > deadline;
  };

  // A week is disabled (future) if mockTime is before Saturday 06:00 of the previous week
  const isWeekDisabled = (week: Week): boolean => {
    const monday = new Date(week.startDate);
    const day = monday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const openTime = new Date(monday);
    openTime.setDate(monday.getDate() - 2);
    openTime.setHours(6, 0, 0, 0);

    return mockTime < openTime;
  };

  // Selection toggle
  const toggleShiftSelection = (dayIndex: number, shiftId: string) => {
    if (isPastWeek(activeWeek)) return;
    if (isPastDeadline(activeWeek)) return;

    const weekKey = activeWeek.startDate.toISOString().split("T")[0];
    const cellKey = `${weekKey}_${dayIndex}_${shiftId}`;

    setSelectedShifts((prev) => {
      const copy = { ...prev };
      if (copy[cellKey]) {
        delete copy[cellKey];
      } else {
        copy[cellKey] = true;
      }
      return copy;
    });
  };

  const clearSelection = () => {
    setSelectedShifts({});
  };

  // Action: Register Selected Shifts
  const registerSelectedShifts = () => {
    if (isPastDeadline(activeWeek)) {
      showToast("Đã hết thời gian đăng ký lịch làm", "error");
      return { success: false, message: "Đã hết thời gian đăng ký lịch làm" };
    }

    const weekKey = activeWeek.startDate.toISOString().split("T")[0];
    const currentWeekSelections = Object.keys(selectedShifts).filter((key) =>
      key.startsWith(weekKey)
    );

    if (currentWeekSelections.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 ca làm", "error");
      return { success: false, message: "Vui lòng chọn ít nhất 1 ca làm" };
    }

    const newRegistered = { ...registeredShifts };
    currentWeekSelections.forEach((key) => {
      newRegistered[key] = true;
    });

    saveRegisteredShifts(newRegistered);
    setSelectedShifts({});
    showToast("Đăng ký lịch làm việc thành công", "success");
    return { success: true, message: "Đăng ký lịch làm việc thành công" };
  };

  // Action: Cancel Registered Shifts
  const cancelRegisteredShifts = () => {
    if (isPastDeadline(activeWeek)) {
      showToast("Đã hết thời gian không thể hủy", "error");
      return { success: false, message: "Đã hết thời gian không thể hủy" };
    }

    const weekKey = getWeekKey(activeWeek);
    const hasRegistered = Object.keys(registeredShifts).some(
      (key) => key.startsWith(weekKey) && registeredShifts[key]
    );

    if (!hasRegistered) {
      setSelectedShifts((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((key) => {
          if (key.startsWith(weekKey)) {
            delete copy[key];
          }
        });
        return copy;
      });
      showToast("Đã xóa các ca làm đang chọn", "success");
      return { success: true, message: "Đã xóa các ca làm đang chọn" };
    }

    const newRegistered = { ...registeredShifts };
    Object.keys(newRegistered).forEach((key) => {
      if (key.startsWith(weekKey)) {
        delete newRegistered[key];
      }
    });

    saveRegisteredShifts(newRegistered);
    showToast("Hủy đăng ký ca làm thành công", "success");
    return { success: true, message: "Hủy đăng ký ca làm thành công" };
  };

  return (
    <ScheduleContext.Provider
      value={{
        mockTime,
        setMockTime,
        employeeInfo,
        setEmployeeInfo,
        selectedMonth,
        setSelectedMonth,
        selectedWeekIndex,
        setSelectedWeekIndex,
        selectedShifts,
        toggleShiftSelection,
        clearSelection,
        registeredShifts,
        registerSelectedShifts,
        cancelRegisteredShifts,
        isConfirmCancelOpen,
        setIsConfirmCancelOpen,
        currentView,
        setCurrentView,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toast,
        showToast,
        hideToast,
        getWeeksForMonth,
        getCurrentWeek,
        isPastWeek,
        isPastDeadline,
        getDeadlineTime,
        isWeekDisabled,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
}
