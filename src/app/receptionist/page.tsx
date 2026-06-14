"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Users, CalendarDays, FileText } from "lucide-react";

export default function ReceptionistHome() {
  const router = useRouter();

  const featureUnavailable = (name: string) => {
    alert(`${name} sẽ được cập nhật sau!`);
  };

  return (
    <div className="animate-in fade-in select-none duration-300">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Đăng ký gói tập */}
        <div
          onClick={() => featureUnavailable("Đăng ký gói tập")}
          className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#FF6B00] transition-transform duration-300 group-hover:scale-105">
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-bold text-neutral-800">
              Đăng ký gói tập
            </h3>
            <p className="text-xs font-medium text-neutral-400">
              Lựa chọn gói tập phù hợp cho khách hàng
            </p>
          </div>
        </div>

        {/* Quản lý hội viên */}
        <div
          onClick={() => featureUnavailable("Quản lý hội viên")}
          className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105">
            <Users className="h-6 w-6" />
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-bold text-neutral-800">
              Quản lý hội viên
            </h3>
            <p className="text-xs font-medium text-neutral-400">
              Thao tác với danh sách hội viên dễ dàng
            </p>
          </div>
        </div>

        {/* Lịch làm việc */}
        <div
          onClick={() => featureUnavailable("Lịch làm việc")}
          className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-650 transition-transform duration-300 group-hover:scale-105">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-bold text-neutral-800">
              Lịch làm việc
            </h3>
            <p className="text-xs font-medium text-neutral-400">
              Theo dõi lịch, ca làm của bạn
            </p>
          </div>
        </div>

        {/* Đăng ký lịch làm việc */}
        <div
          onClick={() => router.push("/receptionist/schedule")}
          className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-105">
            <FileText className="h-6 w-6" />
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-bold text-neutral-800">
              Đăng ký lịch làm việc
            </h3>
            <p className="text-xs font-medium text-neutral-400">
              Đăng ký ca làm của bạn tại đây
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
