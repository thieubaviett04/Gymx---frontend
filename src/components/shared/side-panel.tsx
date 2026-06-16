"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft } from "lucide-react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export default function SidePanel({ isOpen, onClose, title, children, onBack }: SidePanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Đóng panel bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Overlay mờ phía sau */}
      <div
        className="fixed inset-0 bg-neutral-foreground/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Nội dung Side Panel trượt từ phải vào */}
      <div className="relative w-full max-w-md bg-neutral-background h-full shadow-2xl flex flex-col z-10 border-l border-neutral-border transition-transform duration-300 animate-slide-in">
        {/* Header */}
        <div className="p-4 border-b border-neutral-border flex items-center gap-3 bg-neutral-muted/50">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-full hover:bg-neutral-border text-neutral-mutedforeground hover:text-neutral-foreground transition-colors cursor-pointer"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-5.5 h-5.5" />
            </button>
          )}
          <h3 className="font-heading font-bold text-lg text-neutral-foreground flex-1">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1-5 rounded-full hover:bg-neutral-border text-neutral-mutedforeground hover:text-neutral-foreground transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>,
    document.body
  );
}
