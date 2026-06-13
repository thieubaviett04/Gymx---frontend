import React from "react";
import SidePanel from "@/components/shared/side-panel";

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
  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Bộ lọc buổi tập">
      <div className="space-y-6 text-sm pb-8">
        {/* Dịch vụ: Radios */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-foreground">
            Dịch vụ
          </label>
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground font-semibold text-xs">
              <input
                type="radio"
                name="filter-service"
                checked={tempFilterService === "Tăng cơ cơ bản"}
                onChange={() => setTempFilterService("Tăng cơ cơ bản")}
                className="accent-primary"
              />
              <span>Tăng cơ cơ bản</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-neutral-foreground font-semibold text-xs">
              <input
                type="radio"
                name="filter-service"
                checked={tempFilterService === "Tăng cơ chuyên sâu"}
                onChange={() => setTempFilterService("Tăng cơ chuyên sâu")}
                className="accent-primary"
              />
              <span>Tăng cơ chuyên sâu</span>
            </label>
          </div>
        </div>

        {/* Đánh giá: Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-foreground">
            Đánh giá
          </label>
          <select
            value={tempFilterRatingStatus}
            onChange={(e) => setTempFilterRatingStatus(e.target.value)}
            className="w-full bg-neutral-background border border-neutral-border rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-neutral-foreground font-semibold text-xs"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Chưa đánh giá">Chưa đánh giá</option>
            <option value="Đã đánh giá">Đã đánh giá</option>
            <option value="Quá hạn đánh giá">Quá hạn đánh giá</option>
            <option value="Không áp dụng">Không áp dụng</option>
          </select>
        </div>

        {/* Huấn luyện viên: Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-foreground">
            Huấn luyện viên
          </label>
          <select
            value={tempFilterPT}
            onChange={(e) => setTempFilterPT(e.target.value)}
            className="w-full bg-neutral-background border border-neutral-border rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-neutral-foreground font-semibold text-xs"
          >
            <option value="Tất cả HLV">Tất cả HLV</option>
            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
            <option value="Lê Thị B">Lê Thị B</option>
          </select>
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
              <span>Đã hoàn thành</span>
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
