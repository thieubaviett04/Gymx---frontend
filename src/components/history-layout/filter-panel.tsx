import React, { useState, useEffect, useRef } from "react";
import SidePanel from "@/components/shared/side-panel";
import { ChevronDown, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilterService: string;
  setTempFilterService: (v: string) => void;
  tempFilterRatingStatus: string;
  setTempFilterRatingStatus: (v: string) => void;
  tempFilterPT: string;
  setTempFilterPT: (v: string) => void;
  tempFilterStatusAttended: boolean;
  setTempFilterStatusAttended: (v: boolean) => void;
  tempFilterStatusMissed: boolean;
  setTempFilterStatusMissed: (v: boolean) => void;
  tempFilterStatusCancelled: boolean;
  setTempFilterStatusCancelled: (v: boolean) => void;
  onReset: () => void;
  onApply: () => void;
}

export default function FilterPanel({
  isOpen,
  onClose,
  tempFilterService,
  setTempFilterService,
  tempFilterRatingStatus,
  setTempFilterRatingStatus,
  tempFilterPT,
  setTempFilterPT,
  tempFilterStatusAttended,
  setTempFilterStatusAttended,
  tempFilterStatusMissed,
  setTempFilterStatusMissed,
  tempFilterStatusCancelled,
  setTempFilterStatusCancelled,
  onReset,
  onApply,
}: FilterPanelProps) {
  const [isPTDropdownOpen, setIsPTDropdownOpen] = useState(false);
  const [ptSearchQuery, setPtSearchQuery] = useState("");
  const ptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPTDropdownOpen(false);
      setPtSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ptRef.current && !ptRef.current.contains(event.target as Node)) {
        setIsPTDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ptOptions = ["Tất cả HLV", "Nguyễn Văn A", "Lê Thị B"];
  const filteredPTs = ptOptions.filter((pt) =>
    pt.toLowerCase().includes(ptSearchQuery.toLowerCase())
  );

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Bộ lọc buổi tập">
      <div className="space-y-6 text-sm pb-8">
        {/* Dịch vụ: Radios */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-foreground">
            Dịch vụ
          </label>
          <div className="flex gap-4 pt-1 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground font-semibold text-xs">
              <input
                type="radio"
                name="filter-service"
                checked={tempFilterService === "Không"}
                onChange={() => setTempFilterService("Không")}
                className="accent-primary"
              />
              <span>Không</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground font-semibold text-xs">
              <input
                type="radio"
                name="filter-service"
                checked={tempFilterService === "Gói cơ bản"}
                onChange={() => setTempFilterService("Gói cơ bản")}
                className="accent-primary"
              />
              <span>Gói cơ bản</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground font-semibold text-xs">
              <input
                type="radio"
                name="filter-service"
                checked={tempFilterService === "Gói nâng cao"}
                onChange={() => setTempFilterService("Gói nâng cao")}
                className="accent-primary"
              />
              <span>Gói nâng cao</span>
            </label>
          </div>
        </div>

        {/* Đánh giá: Dropdown Shadcn / Base UI */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-foreground">
            Đánh giá
          </label>
          <Select
            value={tempFilterRatingStatus}
            onValueChange={(val) => setTempFilterRatingStatus(val || "Tất cả")}
          >
            <SelectTrigger className="w-full bg-neutral-background border border-neutral-border rounded-lg px-4 py-2.5 text-xs text-neutral-foreground font-semibold">
              <SelectValue placeholder="Chọn trạng thái đánh giá" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-border rounded-lg shadow-xl p-1 z-55">
              <SelectItem value="Tất cả">Tất cả</SelectItem>
              <SelectItem value="Chưa đánh giá">Chưa đánh giá</SelectItem>
              <SelectItem value="Đã đánh giá">Đã đánh giá</SelectItem>
              <SelectItem value="Quá hạn đánh giá">Quá hạn đánh giá</SelectItem>
              <SelectItem value="Không áp dụng">Không áp dụng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Huấn luyện viên: Combobox */}
        <div className="space-y-2 relative" ref={ptRef}>
          <label className="text-sm font-bold text-neutral-foreground">
            Huấn luyện viên
          </label>
          <button
            type="button"
            onClick={() => setIsPTDropdownOpen(!isPTDropdownOpen)}
            className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-neutral-border bg-neutral-background px-4 py-2.5 text-xs text-neutral-foreground font-semibold outline-none select-none transition-colors focus:border-primary text-left cursor-pointer"
          >
            <span>{tempFilterPT}</span>
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          </button>
          
          {isPTDropdownOpen && (
            <div className="absolute z-55 mt-1 w-full bg-white border border-neutral-border rounded-lg shadow-xl p-1 max-h-60 overflow-y-auto">
              <input
                type="text"
                placeholder="Tìm kiếm HLV..."
                value={ptSearchQuery}
                onChange={(e) => setPtSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs border-b border-neutral-border focus:outline-none focus:border-primary mb-1 font-semibold text-[#0A0A0A] bg-white outline-none"
              />
              <div className="flex flex-col gap-0.5">
                {filteredPTs.map((pt) => {
                  const isSelected = tempFilterPT === pt;
                  return (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => {
                        setTempFilterPT(pt);
                        setIsPTDropdownOpen(false);
                        setPtSearchQuery("");
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-[6px] py-1.5 px-3 text-xs font-semibold outline-none select-none transition-colors text-left ${
                        isSelected
                          ? "bg-[#FFF0E5] text-[#FF6B00]"
                          : "text-[#0A0A0A] hover:bg-[#F5F5F5] hover:text-[#FF6B00]"
                      }`}
                    >
                      <span>{pt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B00]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Trạng thái: Checkboxes */}
        <div className="space-y-2.5">
          <label className="text-sm font-bold text-neutral-foreground">
            Trạng thái
          </label>
          <div className="space-y-2 text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground">
              <input
                type="checkbox"
                checked={tempFilterStatusAttended}
                onChange={() =>
                  setTempFilterStatusAttended(!tempFilterStatusAttended)
                }
                className="accent-primary w-4 h-4"
              />
              <span>Hoàn thành</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground">
              <input
                type="checkbox"
                checked={tempFilterStatusMissed}
                onChange={() => setTempFilterStatusMissed(!tempFilterStatusMissed)}
                className="accent-primary w-4 h-4"
              />
              <span>Vắng mặt</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground">
              <input
                type="checkbox"
                checked={tempFilterStatusCancelled}
                onChange={() =>
                  setTempFilterStatusCancelled(!tempFilterStatusCancelled)
                }
                className="accent-primary w-4 h-4"
              />
              <span>Đã hủy</span>
            </label>
          </div>
        </div>

        {/* Action buttons matching mockup layout */}
        <div className="flex gap-3 pt-6 border-t border-neutral-border justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 border border-neutral-border hover:bg-neutral-muted text-neutral-mutedforeground font-bold rounded-lg text-xs cursor-pointer transition-colors text-center"
          >
            Đặt lại
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-primary-foreground font-bold rounded-lg text-xs cursor-pointer transition-colors text-center"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </SidePanel>
  );
}
