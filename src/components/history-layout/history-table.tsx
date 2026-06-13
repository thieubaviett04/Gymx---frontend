import React from "react";
import { Star } from "lucide-react";
import { Booking } from "@/lib/mock-db";

export const getPTAvatar = (ptName: string) => {
  if (ptName.includes("Nguyễn Văn A")) {
    return "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=200&auto=format&fit=crop";
  }
  if (ptName.includes("Lê Thị B")) {
    return "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"; // default fallback
};

interface HistoryTableProps {
  filteredBookingsCount: number;
  paginatedBookings: Booking[];
  selectedBooking: Booking | null;
  isDetailsOpen: boolean;
  startIndex: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onSelectRow: (booking: Booking) => void;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export default function HistoryTable({
  filteredBookingsCount,
  paginatedBookings,
  selectedBooking,
  isDetailsOpen,
  startIndex,
  pageSize,
  currentPage,
  totalPages,
  onSelectRow,
  onPageSizeChange,
  onPageChange,
  onClearFilters,
}: HistoryTableProps) {
  // Kiểm tra buổi tập có bị quá hạn đánh giá không (Giới hạn 3 ngày từ mốc hôm nay là 2026-05-28)
  const isSessionExpired = (dateStr: string) => {
    const today = new Date("2026-05-28");
    const sessionDate = new Date(dateStr);
    const diffTime = today.getTime() - sessionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3; // Quá hạn nếu quá 3 ngày
  };

  return (
    <div className="bg-neutral-background rounded-xl border border-neutral-border shadow-md flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* If filtered list is empty -> Show exact Mockup Empty State */}
      {filteredBookingsCount === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-5 text-center my-10 animate-slide-in">
          {/* Empty State Illustration matches 4th screenshot */}
          <div className="relative p-4 rounded-full bg-neutral-muted/50 border border-neutral-border/60">
            <div className="w-20 h-20 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-primary/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <span className="absolute bottom-3 right-3 text-primary font-bold">
              ✎
            </span>
          </div>

          <div className="space-y-1 max-w-sm">
            <p className="text-xs font-semibold text-neutral-mutedforeground leading-relaxed">
              Vui lòng thử tìm kiếm lại hoặc điều chỉnh bộ lọc
            </p>
          </div>

          <button
            onClick={onClearFilters}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-6 py-2.5 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        /* Table Area */
        <div className="flex-1 overflow-y-auto">
          <table className="w-full table-fixed text-left text-xs border-collapse">
            <colgroup>
              <col style={{ width: "50px" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-neutral-border text-neutral-mutedforeground font-bold bg-neutral-muted/50 sticky top-0 z-10">
                <th className="py-4 px-4 text-center">#</th>
                <th className="py-4 px-4">Huấn luyện viên</th>
                <th className="py-4 px-4">Dịch vụ</th>
                <th className="py-4 px-4">Ngày tập</th>
                <th className="py-4 px-4">Giờ tập</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-4">Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((b, index) => {
                const parts = b.date.split("-");
                const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

                // Kiểm tra xem dòng này có đang được chọn/mở panel để focus xám hay không
                const isSelected = selectedBooking?.id === b.id && isDetailsOpen;

                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelectRow(b)}
                    className={`border-b border-neutral-border hover:bg-neutral-muted/20 transition-colors cursor-pointer font-medium text-neutral-foreground ${
                      isSelected ? "bg-neutral-muted" : ""
                    }`}
                  >
                    <td
                      className={`py-4 px-4 text-center font-bold text-neutral-mutedforeground transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      {startIndex + index + 1}
                    </td>
                    <td
                      className={`py-4 px-4 transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-neutral-border overflow-hidden shrink-0 relative">
                          <img
                            src={getPTAvatar(b.ptName)}
                            alt={b.ptName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold">{b.ptName}</span>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 text-neutral-foreground font-bold transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      {b.serviceName || "Không"}
                    </td>
                    <td
                      className={`py-4 px-4 text-neutral-mutedforeground transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      {formattedDate}
                    </td>
                    <td
                      className={`py-4 px-4 text-neutral-mutedforeground transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      {b.timeSlot}
                    </td>
                    <td
                      className={`py-4 px-4 transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      {b.status === "ATTENDED" && (
                        <span className="inline-flex px-2 py-0.5 rounded-sm bg-status-success text-white font-bold text-[10px]">
                          Hoàn thành
                        </span>
                      )}
                      {b.status === "MISSED" && (
                        <span className="inline-flex px-2 py-0.5 rounded-sm bg-status-warning text-white font-bold text-[10px]">
                          Vắng mặt
                        </span>
                      )}
                      {b.status === "CANCELLED" && (
                        <span className="inline-flex px-2 py-0.5 rounded-sm bg-status-danger text-white font-bold text-[10px]">
                          Đã hủy
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-4 px-4 transition-colors ${
                        isSelected ? "bg-neutral-muted" : ""
                      }`}
                    >
                      {b.status !== "ATTENDED" ? (
                        <span className="text-neutral-mutedforeground text-[10px]">
                          Không áp dụng
                        </span>
                      ) : b.rating ? (
                        <div className="space-y-0.5">
                          <div className="flex text-accent gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (b.rating || 0)
                                    ? "fill-accent stroke-accent"
                                    : "stroke-neutral-border text-neutral-border"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-neutral-mutedforeground font-semibold">
                            {b.isEditedRating ? "Đã chỉnh sửa" : "Đã gửi"}
                          </span>
                        </div>
                      ) : isSessionExpired(b.date) ? (
                        <span className="text-neutral-mutedforeground text-[10px] font-semibold">
                          Quá hạn đánh giá
                        </span>
                      ) : (
                        <span className="text-neutral-mutedforeground text-[10px]">
                          Chưa có đánh giá
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer pagination */}
      <div className="p-4 border-t border-neutral-border bg-neutral-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 text-xs text-neutral-mutedforeground">
        <div className="flex items-center gap-1.5">
          <span>Hiển thị</span>
          <div className="relative">
            <select
              value={String(pageSize).padStart(2, "0")}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              className="pl-2.5 pr-6 py-1 border border-neutral-border bg-neutral-background rounded-md text-[11px] font-semibold text-neutral-foreground appearance-none cursor-pointer"
            >
              <option value="08">08</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">
              ▼
            </div>
          </div>
          <span>
            trong tổng số {String(filteredBookingsCount).padStart(2, "0")} buổi tập
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className="px-2.5 py-1 border border-neutral-border bg-neutral-background rounded-md hover:bg-neutral-muted transition-all cursor-pointer font-bold text-[10px] disabled:opacity-50 disabled:cursor-not-allowed text-neutral-foreground"
          >
            &lt; Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isCurrent = page === currentPage;
            const isFirstOrLast = page === 1 || page === totalPages;
            const isWithinRange = Math.abs(page - currentPage) <= 1;

            if (isFirstOrLast || isWithinRange) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 font-bold rounded-md cursor-pointer text-[10px] transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-background border border-neutral-border text-neutral-foreground hover:bg-neutral-muted"
                  }`}
                >
                  {page}
                </button>
              );
            }

            if (page === 2 && currentPage > 3) {
              return (
                <span
                  key="ellipsis-start"
                  className="px-1 text-neutral-border font-bold"
                >
                  ...
                </span>
              );
            }
            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return (
                <span
                  key="ellipsis-end"
                  className="px-1 text-neutral-border font-bold"
                >
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="px-2.5 py-1 border border-neutral-border bg-neutral-background rounded-md hover:bg-neutral-muted transition-all cursor-pointer font-bold text-[10px] disabled:opacity-50 disabled:cursor-not-allowed text-neutral-foreground"
          >
            Tiếp &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
