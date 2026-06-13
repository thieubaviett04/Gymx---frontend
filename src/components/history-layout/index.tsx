import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { GymDB, Booking } from "@/lib/mock-db";
import MonthNavigation from "./month-navigation";
import FilterPanel from "./filter-panel";
import HistoryTable from "./history-table";
import DetailsPanel from "./details-panel";

export default function HistoryLayout() {
  const [userId, setUserId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Trạng thái tìm kiếm & phân trang
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(5); // Mặc định Tháng 5
  const [currentYear, setCurrentYear] = useState(2026); // Mặc định Năm 2026
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setCurrentPage(1);
  };

  // Trạng thái chọn tháng (Month Picker Popover)
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  // Trạng thái Side Panel Bộ Lọc
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterService, setFilterService] = useState<string>("");
  const [filterRatingStatus, setFilterRatingStatus] = useState<string>("Tất cả");
  const [filterPT, setFilterPT] = useState<string>("Tất cả HLV");
  const [filterStatusAttended, setFilterStatusAttended] = useState(true);
  const [filterStatusMissed, setFilterStatusMissed] = useState(true);
  const [filterStatusCancelled, setFilterStatusCancelled] = useState(true);

  // Bộ lọc tạm thời (chờ bấm Áp Dụng)
  const [tempFilterService, setTempFilterService] = useState<string>("");
  const [tempFilterRatingStatus, setTempFilterRatingStatus] = useState<string>("Tất cả");
  const [tempFilterPT, setTempFilterPT] = useState<string>("Tất cả HLV");
  const [tempFilterStatusAttended, setTempFilterStatusAttended] = useState(true);
  const [tempFilterStatusMissed, setTempFilterStatusMissed] = useState(true);
  const [tempFilterStatusCancelled, setTempFilterStatusCancelled] = useState(true);

  // Trạng thái Side Panel Chi Tiết Buổi Tập
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Trạng thái chỉnh sửa đánh giá
  const [isFormMode, setIsFormMode] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [hoverRatingVal, setHoverRatingVal] = useState(0);
  const [commentVal, setCommentVal] = useState("");
  const [formValidationError, setFormValidationError] = useState("");

  // Trạng thái Toast thông báo
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
    isExiting?: boolean;
  }>({ show: false, type: "success", message: "", isExiting: false });

  // Load danh sách buổi tập
  const loadBookingsData = (loggedInId: string) => {
    const allBookings = GymDB.getBookings();
    const filtered = allBookings.filter(
      (b) => b.userId === loggedInId && b.status !== "CONFIRMED"
    );
    // Sắp xếp theo ngày tập mới nhất (giảm dần)
    const sorted = [...filtered].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.timeSlot.localeCompare(a.timeSlot);
    });
    setBookings(sorted);
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    let loggedInId = getCookie("gym_user_id");
    if (!loggedInId) {
      // Set a default user ID cookie for testing if none is set
      document.cookie = "gym_user_id=M001; path=/";
      loggedInId = "M001";
    }

    setTimeout(() => {
      setUserId(loggedInId);
      loadBookingsData(loggedInId);
    }, 0);
  }, []);

  // Tự động đóng Month Picker khi bấm ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthPickerRef.current &&
        !monthPickerRef.current.contains(event.target as Node)
      ) {
        setShowMonthPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đặt tiêu đề trang
  useEffect(() => {
    document.title = "Lịch sử tập";
  }, []);

  // Quản lý tự động ẩn toast với hiệu ứng float-up
  useEffect(() => {
    if (!toast.show || toast.isExiting) return;

    const exitTimer = setTimeout(() => {
      setToast((prev) => ({ ...prev, isExiting: true }));
    }, 4600); // 4.6 giây bắt đầu chạy animation float-up

    const hideTimer = setTimeout(() => {
      setToast({ show: false, type: "success", message: "", isExiting: false });
    }, 5000); // 5 giây đóng hẳn

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.show, toast.isExiting]);

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isExiting: true }));
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "", isExiting: false });
    }, 300); // Đợi 300ms chạy xong animation float-up
  };

  // Kiểm tra buổi tập có bị quá hạn đánh giá không (Giới hạn 3 ngày từ mốc hôm nay là 2026-05-28)
  const isSessionExpired = (dateStr: string) => {
    const today = new Date("2026-05-28");
    const sessionDate = new Date(dateStr);
    const diffTime = today.getTime() - sessionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3; // Quá hạn nếu quá 3 ngày
  };

  // Kích hoạt panel chi tiết
  const handleSelectRow = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormMode(false);
    setFormValidationError("");
    setIsDetailsOpen(true);
  };

  // Mở Form Đánh Giá (Mới hoặc Sửa)
  const handleOpenRatingForm = () => {
    if (!selectedBooking) return;
    setRatingVal(selectedBooking.rating || 5);
    setCommentVal(selectedBooking.comment || "");
    setIsFormMode(true);
    setFormValidationError("");
  };

  // Gửi hoặc Cập nhật đánh giá
  const handleSaveReview = () => {
    if (!userId || !selectedBooking) return;

    // Validate 1: Độ dài tối thiểu 10 ký tự
    if (commentVal.trim().length < 10) {
      setFormValidationError("Vui lòng nhập tối thiểu 10 ký tự");
      return;
    }

    // Mô phỏng lỗi hệ thống: Nếu nhận xét có chứa chữ "lỗi" hoặc "lỗi hệ thống"
    if (commentVal.toLowerCase().includes("lỗi")) {
      setToast({
        show: true,
        type: "error",
        message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        isExiting: false,
      });
      return;
    }

    // Tiến hành cập nhật Mock DB
    const allBookings = GymDB.getBookings();
    const isEditingMode = selectedBooking.rating !== undefined;

    const updatedBookings = allBookings.map((b) => {
      if (b.id === selectedBooking.id) {
        return {
          ...b,
          rating: ratingVal,
          comment: commentVal,
          ratedAt: `${new Date().toLocaleDateString("vi-VN")} • ${String(
            new Date().getHours()
          ).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(
            2,
            "0"
          )}`,
          isEditedRating: isEditingMode ? true : false,
        };
      }
      return b;
    });

    GymDB.setBookings(updatedBookings);
    loadBookingsData(userId);

    // Cập nhật lại thông tin hiển thị trên Side Panel
    const updatedSelected =
      updatedBookings.find((b) => b.id === selectedBooking.id) || null;
    setSelectedBooking(updatedSelected);

    // Quay lại màn hình chi tiết buổi tập
    setIsFormMode(false);

    // Hiển thị toast thành công
    setToast({
      show: true,
      type: "success",
      message: isEditingMode
        ? "Cập nhật đánh giá thành công"
        : "Gửi đánh giá thành công",
      isExiting: false,
    });
  };

  // Mở bộ lọc tạm thời
  const handleOpenFilter = () => {
    setTempFilterService(filterService);
    setTempFilterRatingStatus(filterRatingStatus);
    setTempFilterPT(filterPT);
    setTempFilterStatusAttended(filterStatusAttended);
    setTempFilterStatusMissed(filterStatusMissed);
    setTempFilterStatusCancelled(filterStatusCancelled);
    setIsFilterOpen(true);
  };

  // Áp dụng bộ lọc
  const handleApplyFilter = () => {
    setFilterService(tempFilterService);
    setFilterRatingStatus(tempFilterRatingStatus);
    setFilterPT(tempFilterPT);
    setFilterStatusAttended(tempFilterStatusAttended);
    setFilterStatusMissed(tempFilterStatusMissed);
    setFilterStatusCancelled(tempFilterStatusCancelled);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  // Reset bộ lọc về mặc định và áp dụng ngay lập tức
  const handleResetFilter = () => {
    setFilterService("");
    setFilterRatingStatus("Tất cả");
    setFilterPT("Tất cả HLV");
    setFilterStatusAttended(true);
    setFilterStatusMissed(true);
    setFilterStatusCancelled(true);

    setTempFilterService("");
    setTempFilterRatingStatus("Tất cả");
    setTempFilterPT("Tất cả HLV");
    setTempFilterStatusAttended(true);
    setTempFilterStatusMissed(true);
    setTempFilterStatusCancelled(true);

    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  // Reset toàn bộ lọc bên ngoài (Empty State button)
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setFilterService("");
    setFilterRatingStatus("Tất cả");
    setFilterPT("Tất cả HLV");
    setFilterStatusAttended(true);
    setFilterStatusMissed(true);
    setFilterStatusCancelled(true);
    setCurrentPage(1);
  };

  // Lọc danh sách buổi tập
  const filteredBookings = bookings.filter((b) => {
    // 1. Kiểm tra Lọc theo tháng và năm
    const dateObj = new Date(b.date);
    const matchesDate =
      dateObj.getMonth() + 1 === currentMonth &&
      dateObj.getFullYear() === currentYear;
    if (!matchesDate) return false;

    // 2. Tìm kiếm theo tên HLV hoặc Dịch vụ
    const matchesSearch =
      b.ptName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.serviceName &&
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    // 3. Lọc theo Dịch vụ (Bộ lọc nâng cao)
    if (filterService && b.serviceName !== filterService) return false;

    // 4. Lọc theo Đánh giá
    if (filterRatingStatus === "Chưa đánh giá") {
      const isExpired = isSessionExpired(b.date);
      if (b.status !== "ATTENDED" || b.rating !== undefined || isExpired)
        return false;
    }
    if (filterRatingStatus === "Đã đánh giá") {
      if (b.rating === undefined) return false;
    }
    if (filterRatingStatus === "Quá hạn đánh giá") {
      const isExpired = isSessionExpired(b.date);
      if (b.status !== "ATTENDED" || b.rating !== undefined || !isExpired)
        return false;
    }
    if (filterRatingStatus === "Không áp dụng") {
      if (b.status === "ATTENDED") return false;
    }

    // 5. Lọc theo Huấn luyện viên
    if (filterPT !== "Tất cả HLV" && b.ptName !== filterPT) return false;

    // 6. Lọc theo Trạng thái
    if (b.status === "ATTENDED" && !filterStatusAttended) return false;
    if (b.status === "MISSED" && !filterStatusMissed) return false;
    if (b.status === "CANCELLED" && !filterStatusCancelled) return false;

    return true;
  });

  // Phân trang danh sách đã lọc
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Tính số lượng bộ lọc đang được áp dụng
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterService !== "") count++;
    if (filterRatingStatus !== "Tất cả") count++;
    if (filterPT !== "Tất cả HLV") count++;
    if (!filterStatusAttended) count++;
    if (!filterStatusMissed) count++;
    if (!filterStatusCancelled) count++;
    return count;
  };
  const activeFiltersCount = getActiveFiltersCount();

  // Kiểm tra xem Form gửi đánh giá có thực sự thay đổi gì không (để enable nút update)
  const isFormChanged = () => {
    if (!selectedBooking) return false;
    const originalRating = selectedBooking.rating || 5;
    const originalComment = selectedBooking.comment || "";
    return ratingVal !== originalRating || commentVal !== originalComment;
  };

  return (
    <div className="space-y-5 flex-1 flex flex-col min-h-0 relative">
      <style>{`
        @keyframes float-in {
          from {
            transform: translateY(-150%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes float-out {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-150%);
            opacity: 0;
          }
        }
        .animate-float-in {
          animation: float-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-out {
          animation: float-out 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Alert Thông Báo - Căn giữa, phía trên, sát thiết kế */}
      {toast.show && (
        <div className="fixed top-6 left-0 right-0 flex justify-center pointer-events-none z-[9999]">
          <div
            className={`pointer-events-auto bg-white border border-neutral-border rounded-full shadow-lg pl-3 pr-6 py-2 flex items-center gap-3 min-w-[380px] max-w-lg ${
              toast.isExiting ? "animate-float-out" : "animate-float-in"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${
                toast.type === "success" ? "bg-[#45c270]" : "bg-[#e14d43]"
              }`}
            >
              {toast.type === "success" ? (
                <Check className="w-5 h-5 stroke-[3]" />
              ) : (
                <X className="w-5 h-5 stroke-[3]" />
              )}
            </div>
            <span className="text-sm font-semibold text-[#2d2d2d] flex-1 select-none leading-relaxed">
              {toast.message}
            </span>
            <button
              onClick={closeToast}
              className="text-neutral-mutedforeground hover:text-neutral-foreground cursor-pointer transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Control Navigation Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        {/* Month Selection Navigation with Picker */}
        <MonthNavigation
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          showMonthPicker={showMonthPicker}
          setShowMonthPicker={setShowMonthPicker}
          setCurrentMonth={(m) => {
            setCurrentMonth(m);
            setCurrentPage(1);
          }}
          setCurrentYear={setCurrentYear}
          monthPickerRef={monthPickerRef}
        />

        {/* Filter Trigger and Search Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:flex-none justify-end">
          <button
            onClick={handleOpenFilter}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              Bộ lọc {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
            </span>
          </button>

          <div className="relative flex-1 md:w-80 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mutedforeground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên huấn luyện viên, dịch vụ..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-neutral-border rounded-lg text-xs bg-neutral-background focus:outline-none focus:ring-1 focus:ring-primary text-neutral-foreground font-medium shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Main card white layout containing table or Empty State */}
      <HistoryTable
        filteredBookingsCount={filteredBookings.length}
        paginatedBookings={paginatedBookings}
        selectedBooking={selectedBooking}
        isDetailsOpen={isDetailsOpen}
        startIndex={startIndex}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onSelectRow={handleSelectRow}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        onPageChange={(page) => setCurrentPage(page)}
        onClearFilters={handleClearAllFilters}
      />

      {/* FILTER PANEL: Slide-over filter */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        tempFilterService={tempFilterService}
        setTempFilterService={setTempFilterService}
        tempFilterRatingStatus={tempFilterRatingStatus}
        setTempFilterRatingStatus={setTempFilterRatingStatus}
        tempFilterPT={tempFilterPT}
        setTempFilterPT={setTempFilterPT}
        tempFilterStatusAttended={tempFilterStatusAttended}
        setTempFilterStatusAttended={setTempFilterStatusAttended}
        tempFilterStatusMissed={tempFilterStatusMissed}
        setTempFilterStatusMissed={setTempFilterStatusMissed}
        tempFilterStatusCancelled={tempFilterStatusCancelled}
        setTempFilterStatusCancelled={setTempFilterStatusCancelled}
        onReset={handleResetFilter}
        onApply={handleApplyFilter}
      />

      {/* DETAIL & RATING PANEL: Slide-over details view & Rating forms */}
      {selectedBooking && (
        <DetailsPanel
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          selectedBooking={selectedBooking}
          isFormMode={isFormMode}
          setIsFormMode={setIsFormMode}
          ratingVal={ratingVal}
          setRatingVal={setRatingVal}
          hoverRatingVal={hoverRatingVal}
          setHoverRatingVal={setHoverRatingVal}
          commentVal={commentVal}
          setCommentVal={setCommentVal}
          formValidationError={formValidationError}
          setFormValidationError={setFormValidationError}
          onOpenRatingForm={handleOpenRatingForm}
          onSaveReview={handleSaveReview}
          isFormChanged={isFormChanged()}
        />
      )}

      <style jsx global>{`
        /* Removed slideDown styles */
      `}</style>
    </div>
  );
}
