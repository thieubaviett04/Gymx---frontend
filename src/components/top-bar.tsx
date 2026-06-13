import { Bell, Menu } from "lucide-react";

export default function Topbar() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Menu className="text-white" size={22} />

        <h1 className="text-2xl font-semibold text-white">
          Đăng ký gói tập
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <Bell
          className="cursor-pointer text-white"
          size={20}
        />

        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="h-10 w-10 rounded-full border-2 border-white"
        />
      </div>
    </div>
  );
}