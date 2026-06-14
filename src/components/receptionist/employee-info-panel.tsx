"use client";

import React from "react";
import { useSchedule } from "@/context/ScheduleContext";

export default function EmployeeInfoPanel() {
  const { employeeInfo } = useSchedule();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 space-y-4">
      {/* Panel Header Accent */}
      <div className="flex items-center gap-2 border-l-4 border-[#FF6B00] pl-3">
        <h3 className="font-bold text-neutral-800 text-sm tracking-wide uppercase">
          Thông tin nhân viên
        </h3>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400">Họ tên</label>
          <input
            type="text"
            readOnly
            value={employeeInfo.name}
            className="w-full bg-neutral-50 border border-neutral-150 text-neutral-700 text-sm px-4 py-3 rounded-xl cursor-not-allowed focus:outline-none"
            placeholder="Họ tên nhân viên"
          />
        </div>

        {/* Employee Code */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400">Mã nhân viên</label>
          <input
            type="text"
            readOnly
            value={employeeInfo.code}
            className="w-full bg-neutral-50 border border-neutral-150 text-neutral-700 text-sm px-4 py-3 rounded-xl cursor-not-allowed focus:outline-none"
            placeholder="Mã nhân viên"
          />
        </div>

        {/* Job Title / Role */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400">Chức vụ</label>
          <input
            type="text"
            readOnly
            value={employeeInfo.role}
            className="w-full bg-neutral-50 border border-neutral-150 text-neutral-700 text-sm px-4 py-3 rounded-xl cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
