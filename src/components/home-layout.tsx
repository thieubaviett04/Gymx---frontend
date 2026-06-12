"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Clock3,
  CreditCard,
  Dumbbell,
  LayoutGrid,
  Menu,
  ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

type MenuSubItem = {
  id: string;
  label: string;
  onClick: () => void;
};

type MenuItem =
  | {
      id: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      onClick: () => void;
      hasSubmenu?: false;
    }
  | {
      id: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      hasSubmenu: true;
      isOpen: boolean;
      onToggle: () => void;
      submenu: MenuSubItem[];
    };

const featureUnavailable = (name: string) => {
  alert(`${name} sẽ được cập nhật sau!`);
};

export function HomeLayout({ children, pageTitle }: HomeLayoutProps) {
  const router = useRouter();
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "home",
      label: "Trang chủ",
      icon: LayoutGrid,
      onClick: () => router.push("/"),
    },
    {
      id: "register-group",
      label: "Đăng ký & Gia hạn",
      icon: CreditCard,
      hasSubmenu: true,
      isOpen: isRegisterDropdownOpen,
      onToggle: () => setIsRegisterDropdownOpen((open) => !open),
      submenu: [
        {
          id: "register-package",
          label: "Đăng ký",
          onClick: () => featureUnavailable("Đăng ký gói tập"),
        },
        {
          id: "renew-package",
          label: "Gia hạn",
          onClick: () => featureUnavailable("Gia hạn gói tập"),
        },
      ],
    },
    {
      id: "register-pt",
      label: "Đăng ký huấn luyện viên",
      icon: Dumbbell,
      onClick: () => featureUnavailable("Đăng ký huấn luyện viên"),
    },
    {
      id: "schedule",
      label: "Lịch tập",
      icon: CalendarDays,
      onClick: () => featureUnavailable("Lịch tập"),
    },
    {
      id: "history-workout",
      label: "Lịch sử tập",
      icon: Clock3,
      onClick: () => featureUnavailable("Lịch sử tập"),
    },
    {
      id: "history-payment",
      label: "Lịch sử thanh toán",
      icon: ReceiptText,
      onClick: () => featureUnavailable("Lịch sử thanh toán"),
    },
  ];

  const renderNav = (closeMobile = false) => (
    <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === "home";

        if (item.hasSubmenu) {
          return (
            <div key={item.id} className="space-y-2">
              <button
                onClick={item.onToggle}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 -rotate-90 transition-transform" />
                )}
              </button>

              {item.isOpen && (
                <div className="space-y-1 pl-12">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        sub.onClick();
                        if (closeMobile) setIsMobileSidebarOpen(false);
                      }}
                      className="block w-full cursor-pointer rounded-lg px-4 py-2.5 text-left text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              item.onClick();
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#FFF0E5] text-[#FF6B00]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 font-sans text-neutral-900">
      <aside className="hidden h-full w-[260px] shrink-0 select-none flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="flex items-center justify-center gap-2 border-b border-neutral-100 p-6 text-center">
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            Gym <span className="text-[#FF6B00]">Max</span>
          </span>
        </div>

        {renderNav()}
      </aside>

      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/55 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-50 flex w-[260px] flex-col border-r border-neutral-200 bg-white transition-transform duration-300 md:hidden",
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

      <main
        className="relative flex h-full flex-1 flex-col overflow-hidden"
        style={{
          backgroundImage: 'url("/gym_hero_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 z-0 bg-neutral-950/75" />

        <header className="relative z-10 shrink-0 select-none border-b border-white/5 px-6 py-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="cursor-pointer rounded-lg p-1.5 text-white hover:bg-white/10 md:hidden"
                aria-label="Mở menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="min-w-0 space-y-0.5 text-white">
                <h1 className="truncate text-xl font-bold leading-7">
                  {pageTitle || "Xin chào Hội viên!"}
                </h1>
                <p className="truncate text-sm text-neutral-300">
                  Chọn một thao tác bên dưới để bắt đầu.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <button
                className="relative cursor-pointer rounded-full p-2 text-neutral-300 hover:bg-white/5 hover:text-white"
                aria-label="Thông báo"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
              </button>

              <div className="flex items-center gap-3 border-l border-white/10 pl-2">
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/20 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Member profile avatar"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
