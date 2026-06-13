"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [openMembership, setOpenMembership] = useState(true);

  return (
    <div className="h-full bg-white px-4 py-6">
      <h1 className="mb-10 text-3xl font-bold">
        Gym Max
      </h1>

      <div className="space-y-2">

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-100">
          Trang chủ
        </div>

        {/* Menu cha */}
        <div>
          <button
            onClick={() =>
              setOpenMembership(!openMembership)
            }
            className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-100"
          >
            <span>Đăng ký & Gia hạn</span>

            <span>
              {openMembership ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </span>
          </button>

          {/* Menu con */}
          {openMembership && (
            <div className="ml-4 mt-2 space-y-2">

              <div className="rounded-lg p-3 hover:bg-gray-100">
                Đăng ký
              </div>

              <div className="rounded-lg p-3 hover:bg-gray-100">
                Gia hạn
              </div>

            </div>
          )}
        </div>

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-100">
          Đăng ký huấn luyện viên
        </div>

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-100">
          Lịch tập
        </div>

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-100">
          Lịch sử tập
        </div>

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-100">
          Lịch sử thanh toán
        </div>

      </div>
    </div>
  );
}