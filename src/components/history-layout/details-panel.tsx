import React from "react";
import { Star } from "lucide-react";
import SidePanel from "@/components/shared/side-panel";
import { Booking } from "@/lib/mock-db";
import { getPTAvatar } from "./history-table";

interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: Booking;
  isFormMode: boolean;
  setIsFormMode: (v: boolean) => void;
  ratingVal: number;
  setRatingVal: (v: number) => void;
  hoverRatingVal: number;
  setHoverRatingVal: (v: number) => void;
  commentVal: string;
  setCommentVal: (v: string) => void;
  formValidationError: string;
  setFormValidationError: (v: string) => void;
  onOpenRatingForm: () => void;
  onSaveReview: () => void;
  isFormChanged: boolean;
}

export default function DetailsPanel({
  isOpen,
  onClose,
  selectedBooking,
  isFormMode,
  setIsFormMode,
  ratingVal,
  setRatingVal,
  hoverRatingVal,
  setHoverRatingVal,
  commentVal,
  setCommentVal,
  formValidationError,
  setFormValidationError,
  onOpenRatingForm,
  onSaveReview,
  isFormChanged,
}: DetailsPanelProps) {
  // Kiểm tra buổi tập có bị quá hạn đánh giá không (Giới hạn 3 ngày từ mốc hôm nay là 2026-05-28)
  const isSessionExpired = (dateStr: string) => {
    const today = new Date("2026-05-28");
    const sessionDate = new Date(dateStr);
    const diffTime = today.getTime() - sessionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3; // Quá hạn nếu quá 3 ngày
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={
        isFormMode
          ? selectedBooking.rating !== undefined
            ? "Sửa đánh giá"
            : "Đánh giá buổi tập"
          : "Chi tiết buổi tập"
      }
      onBack={
        isFormMode
          ? () => {
            setIsFormMode(false);
            setFormValidationError("");
          }
          : undefined
      }
    >
      <div className="space-y-6">
        {!isFormMode ? (
          <div className="space-y-7 text-sm font-medium">
            {/* Status bar */}
            <div className="flex justify-between items-center pb-4">
              <span className="text-sm font-bold text-neutral-foreground">
                Trạng thái
              </span>
              {selectedBooking.status === "ATTENDED" && (
                <span className="inline-flex px-2.5 py-1 rounded-sm bg-status-success text-white font-bold text-[10px]">
                  Hoàn thành
                </span>
              )}
              {selectedBooking.status === "MISSED" && (
                <span className="inline-flex px-2.5 py-1 rounded-sm bg-status-warning text-white font-bold text-[10px]">
                  Vắng mặt
                </span>
              )}
              {selectedBooking.status === "CANCELLED" && (
                <span className="inline-flex px-2.5 py-1 rounded-sm bg-status-danger text-white font-bold text-[10px]">
                  Đã hủy
                </span>
              )}
            </div>

            {/* Readonly info fields */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Tên huấn luyện viên
                </label>
                <div className="flex items-center gap-2.5 w-full bg-neutral-muted/50 border border-neutral-border rounded-lg py-2 px-3.5 select-none pointer-events-none">
                  <div className="w-6 h-6 rounded-full border border-neutral-border overflow-hidden shrink-0 relative">
                    <img
                      src={getPTAvatar(selectedBooking.ptName)}
                      alt={selectedBooking.ptName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-neutral-foreground font-semibold">
                    {selectedBooking.ptName}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Dịch vụ
                </label>
                <div className="w-full bg-neutral-muted/50 border border-neutral-border rounded-lg py-2.5 px-3.5 text-xs text-neutral-foreground font-semibold select-none pointer-events-none">
                  {selectedBooking.serviceName || "Lớp tập Gym"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Ngày tập
                </label>
                <div className="w-full bg-neutral-muted/50 border border-neutral-border rounded-lg py-2.5 px-3.5 text-xs text-neutral-foreground font-semibold select-none pointer-events-none">
                  {new Date(selectedBooking.date).toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Giờ tập
                </label>
                <div className="w-full bg-neutral-muted/50 border border-neutral-border rounded-lg py-2.5 px-3.5 text-xs text-neutral-foreground font-semibold select-none pointer-events-none">
                  {selectedBooking.timeSlot}
                </div>
              </div>
            </div>

            {/* Rating Separator Section */}
            <div className="border-t border-neutral-border pt-6 space-y-5">
              {/* Rating Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 group relative">
                  <span className="text-lg font-bold text-neutral-foreground font-heading">
                    Đánh giá
                  </span>
                  <div className="relative flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full border border-neutral-border bg-neutral-muted hover:bg-neutral-border text-[9px] font-bold text-neutral-mutedforeground flex items-center justify-center cursor-help select-none">
                      i
                    </span>
                    {/* Tooltip box */}
                    <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block w-48 bg-neutral-foreground text-neutral-background text-[10px] font-medium p-2 rounded shadow-lg z-50 leading-normal">
                      Bạn có thể gửi và sửa đánh giá trong thời hạn 3 ngày
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-3 border-4 border-transparent border-t-neutral-foreground"></div>
                    </div>
                  </div>
                </div>
                {selectedBooking.ratedAt && (
                  <span className="text-[11px] text-neutral-mutedforeground font-medium">
                    {selectedBooking.ratedAt}
                  </span>
                )}
              </div>

              {/* Rating view logic matching all mockup scenarios */}
              {selectedBooking.status !== "ATTENDED" ? (
                /* Case 1: Cancelled / Missed */
                <div className="p-3 bg-neutral-muted/50 border border-neutral-border/60 rounded-xl text-center text-neutral-mutedforeground italic">
                  Không áp dụng đánh giá cho buổi tập này
                </div>
              ) : selectedBooking.rating ? (
                /* Case 2: Rated */
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < (selectedBooking.rating || 0)
                            ? "fill-accent stroke-accent"
                            : "stroke-neutral-border text-neutral-border"
                          }`}
                      />
                    ))}
                    <span className="text-[11px] text-neutral-mutedforeground ml-2">
                      {selectedBooking.rating === 5
                        ? "Rất tốt"
                        : selectedBooking.rating === 4
                          ? "Tốt"
                          : selectedBooking.rating === 3
                            ? "Ổn"
                            : selectedBooking.rating === 2
                              ? "Không tốt"
                              : "Rất tệ"}
                    </span>
                  </div>

                  {selectedBooking.comment && (
                    <div className="p-3.5 bg-neutral-muted/40 border border-neutral-border/80 rounded-xl text-xs text-neutral-foreground leading-relaxed italic font-semibold">
                      &quot;{selectedBooking.comment}&quot;
                    </div>
                  )}

                  {/* Edit Button if within rating period (otherwise hide or say Expired) */}
                  {!isSessionExpired(selectedBooking.date) ? (
                    <button
                      type="button"
                      onClick={onOpenRatingForm}
                      className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      Sửa đánh giá
                    </button>
                  ) : (
                    <div className="p-3 border border-neutral-border rounded-xl text-center text-neutral-mutedforeground bg-neutral-muted/30">
                      Đã quá hạn đánh giá
                    </div>
                  )}
                </div>
              ) : isSessionExpired(selectedBooking.date) ? (
                /* Case 3: Not Rated & Expired */
                <div className="p-3 border border-neutral-border rounded-xl text-center text-neutral-mutedforeground bg-neutral-muted/30 font-bold">
                  Đã quá hạn đánh giá
                </div>
              ) : (
                /* Case 4: Not Rated & Still within 3 days rating period */
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-muted/50 border border-neutral-border/60 rounded-xl text-center text-neutral-mutedforeground font-medium">
                    Chưa có đánh giá buổi tập này
                  </div>
                  <button
                    type="button"
                    onClick={onOpenRatingForm}
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    Đánh giá ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 2. FORM EDIT/WRITE MODE (isFormMode = true) */
          <div className="space-y-5 text-sm font-medium">
            {/* Form fields */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Tên huấn luyện viên
                </label>
                <div className="flex items-center gap-2.5 w-full bg-neutral-muted/50 border border-neutral-border rounded-lg py-2 px-3.5 select-none pointer-events-none">
                  <div className="w-6 h-6 rounded-full border border-neutral-border overflow-hidden shrink-0 relative">
                    <img
                      src={getPTAvatar(selectedBooking.ptName)}
                      alt={selectedBooking.ptName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-neutral-foreground font-bold">
                    {selectedBooking.ptName}
                  </span>
                </div>
              </div>

              {/* Star rating selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Đánh giá tổng quát *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingVal(star)}
                      onMouseEnter={() => setHoverRatingVal(star)}
                      onMouseLeave={() => setHoverRatingVal(0)}
                      className="p-0.5 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${star <= (hoverRatingVal || ratingVal)
                            ? "fill-accent stroke-accent scale-110"
                            : "stroke-neutral-border text-neutral-border"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-neutral-mutedforeground ml-2">
                    {ratingVal === 5
                      ? "Rất tốt"
                      : ratingVal === 4
                        ? "Tốt"
                        : ratingVal === 3
                          ? "Ổn"
                          : ratingVal === 2
                            ? "Không tốt"
                            : "Rất tệ"}
                  </span>
                </div>
              </div>

              {/* Comment text area */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-foreground">
                  Nội dung đánh giá *
                </label>
                <div className="relative">
                  <textarea
                    value={commentVal}
                    onChange={(e) => setCommentVal(e.target.value.slice(0, 500))}
                    placeholder="Hãy chia sẻ về buổi tập... (Tối thiểu 10 ký tự)"
                    className={`w-full bg-neutral-background border rounded-lg p-3 pb-8 text-xs text-neutral-foreground font-semibold focus:outline-none min-h-[120px] resize-none ${formValidationError
                        ? "border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]"
                        : "border-neutral-border focus:ring-1 focus:ring-primary"
                      }`}
                  />
                  <span className="absolute bottom-3 right-3 text-[9px] text-neutral-mutedforeground bg-neutral-background/80 px-1 rounded-sm select-none">
                    {commentVal.length}/500
                  </span>
                </div>

                {formValidationError && (
                  <p className="text-xs text-[#ef4444] font-semibold mt-1.5">
                    {formValidationError}
                  </p>
                )}
              </div>
            </div>

            {/* Form Controls - Disabled send button unless at least 1 character is typed */}
            <div className="pt-4 flex gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setIsFormMode(false);
                  setFormValidationError("");
                }}
                className="flex-1 py-2.5 border border-neutral-border hover:bg-neutral-muted text-neutral-mutedforeground font-bold rounded-lg text-xs cursor-pointer transition-colors text-center"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={onSaveReview}
                disabled={
                  commentVal.trim().length === 0 ||
                  (!isFormChanged && selectedBooking.rating !== undefined)
                }
                className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2.5 rounded-lg text-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                {selectedBooking.rating !== undefined
                  ? "Cập nhật đánh giá"
                  : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
