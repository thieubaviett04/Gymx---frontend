"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  Menu,
  Bookmark,
  Users,
  CalendarDays,
  FileText,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceptionistLayoutProps {
  children: React.ReactNode;
  pageTitle?: React.ReactNode;
  pageSubtitle?: React.ReactNode;
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
};

export function ReceptionistLayout({ children, pageTitle, pageSubtitle }: ReceptionistLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.push("/login");
    } else if (role !== "letan") {
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const featureUnavailable = (name: string) => {
    alert(`${name} sẽ được cập nhật sau!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const menuItems: MenuItem[] = [
    {
      id: "home",
      label: "Trang chủ",
      icon: LayoutGrid,
      onClick: () => router.push("/receptionist"),
    },
    {
      id: "register-package",
      label: "Đăng ký gói tập",
      icon: Bookmark,
      onClick: () => featureUnavailable("Đăng ký gói tập"),
    },
    {
      id: "manage-members",
      label: "Quản lý hội viên",
      icon: Users,
      onClick: () => featureUnavailable("Quản lý hội viên"),
    },
    {
      id: "workout-schedule",
      label: "Lịch làm việc",
      icon: CalendarDays,
      onClick: () => featureUnavailable("Lịch làm việc"),
    },
    {
      id: "register-schedule",
      label: "Đăng ký lịch làm việc",
      icon: FileText,
      onClick: () => router.push("/receptionist/schedule"),
    },
  ];

  const renderNav = (closeMobile = false) => (
    <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.id === "home"
            ? pathname === "/receptionist"
            : item.id === "register-schedule"
            ? pathname === "/receptionist/schedule"
            : false;

        return (
          <button
            key={item.id}
            onClick={() => {
              item.onClick();
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
              isActive
                ? "bg-[#FFF0E5] text-[#FF6B00]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-[#FF6B00]" : "text-neutral-600")} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-900 text-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-450">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 font-sans text-neutral-900">
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-[295px] shrink-0 select-none flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="flex items-center justify-center gap-2 border-b border-neutral-100 p-6 text-center">
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            Gym <span className="text-[#FF6B00]">Max</span>
          </span>
        </div>
        {renderNav()}
      </aside>

      {/* Mobile Sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/55 md:hidden"
        />
      )}

      {/* Mobile Sidebar drawer */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-50 flex w-[295px] flex-col border-r border-neutral-200 bg-white transition-transform duration-300 md:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="w-full border-b border-neutral-100 p-6 text-center">
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            Gym <span className="text-[#FF6B00]">Max</span>
          </span>
        </div>
        {renderNav(true)}
      </aside>

      {/* Main Content Area */}
      <main
        className="relative flex h-full flex-1 flex-col overflow-hidden"
        style={{
          backgroundImage: 'url("/gym_hero_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 z-0 bg-neutral-950/75" />

        <header className="relative z-20 shrink-0 select-none border-b border-white/5 px-6 py-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="cursor-pointer rounded-lg p-1.5 text-white hover:bg-white/10 md:hidden"
                aria-label="Mở menu"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="4" x2="12" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
              <div className="min-w-0 space-y-0.5 text-white">
                <h4 className="truncate text-xl font-bold leading-7">
                  {pageTitle || "Xin chào Lễ tân!"}
                </h4>
                {((!pageTitle && !pageSubtitle) || pageSubtitle) && (
                  <div className="truncate text-sm font-medium text-neutral-300">
                    {pageSubtitle || "Chọn một thao tác bên dưới để bắt đầu."}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <button
                className="relative cursor-pointer rounded-full p-2 text-neutral-350 hover:bg-white/5 hover:text-white"
                aria-label="Thông báo"
                onClick={() => alert("Chức năng thông báo sẽ được cập nhật sau!")}
              >
                <Bell className="h-5 w-5 text-white" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
              </button>

              {/* Avatar profile area with Dropdown logout */}
              <div className="relative flex items-center gap-3 border-l border-white/10 pl-2">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00] cursor-pointer shrink-0"
                  aria-label="User menu"
                >
                  <Image
                    src="/avatar.png"
                    alt="Receptionist profile avatar"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <div className="absolute right-0 top-11 z-50 mt-1 w-48 rounded-xl border border-neutral-250 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-[10px] font-semibold text-neutral-400 uppercase">Vai trò</p>
                        <p className="text-sm font-bold text-neutral-800">Lễ Tân</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="relative flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
