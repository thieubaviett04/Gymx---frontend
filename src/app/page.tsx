"use client";

import { HomeLayout } from "@/components/home-layout";
import { Bookmark, CalendarDays, Dumbbell, FileText, Clock3, ReceiptText, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

const featureUnavailable = (name: string) => {
  alert(`${name} sẽ được cập nhật sau!`);
};

export default function Home() {
  const router = useRouter();

  return (
    <HomeLayout pageTitle="">
      <div className="animate-in fade-in select-none duration-300">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            onClick={() => router.push("/memberships")}
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
                Lựa chọn lịch tập phù hợp với bạn
              </p>
            </div>
          </div>

          <div
            onClick={() => router.push("/register-pt")}
            className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-[#FFB800] transition-transform duration-300 group-hover:scale-105">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-neutral-800">
                Đăng ký huấn luyện viên
              </h3>
              <p className="text-xs font-medium text-neutral-400">
                Đặt lịch tập với HLV cá nhân
              </p>
            </div>
          </div>

          <div
            onClick={() => featureUnavailable("Lịch tập")}
            className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 transition-transform duration-300 group-hover:scale-105">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-neutral-800">Lịch tập</h3>
              <p className="text-xs font-medium text-neutral-400">
                Theo dõi lịch tập của bạn
              </p>
            </div>
          </div>

          <div
            onClick={() => featureUnavailable("Gia hạn gói tập")}
            className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-105">
              <FileText className="h-6 w-6" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-neutral-800">
                Gia hạn gói tập
              </h3>
              <p className="text-xs font-medium text-neutral-400">
                Gia hạn lại gói tập hiện tại
              </p>
            </div>
          </div>

          <div
            onClick={() => router.push("/history")}
            className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105">
              <Clock3 className="h-6 w-6" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-neutral-800">
                Lịch sử tập
              </h3>
              <p className="text-xs font-medium text-neutral-400">
                Xem lại lịch sử tập luyện của bạn
              </p>
            </div>
          </div>

          <div
            onClick={() => featureUnavailable("Lịch sử thanh toán")}
            className="group flex h-48 cursor-pointer flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition-transform duration-300 group-hover:scale-105">
              <ReceiptText className="h-6 w-6" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-neutral-800">
                Lịch sử thanh toán
              </h3>
              <p className="text-xs font-medium text-neutral-400">
                Xem lại các hóa đơn thanh toán
              </p>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
