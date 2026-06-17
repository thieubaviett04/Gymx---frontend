import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import { GymDB, Booking } from "@/lib/mock-db";
import MonthNavigation from "./month-navigation";
import HistoryTable, { getVisiblePages } from "./history-table";
import DetailsPanel from "./details-panel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import CustomToast from "@/components/ui/custom-toast";

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
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const ptRef = useRef<HTMLDivElement>(null);
  const [isPTDropdownOpen, setIsPTDropdownOpen] = useState(false);
  const [ptSearchQuery, setPtSearchQuery] = useState("");
  
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
    type: "success" | "error" | "warning";
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

  // Tự động đóng Month Picker và Bộ lọc khi bấm ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthPickerRef.current &&
        !monthPickerRef.current.contains(event.target as Node)
      ) {
        setShowMonthPicker(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (
        ptRef.current &&
        !ptRef.current.contains(event.target as Node)
      ) {
        setIsPTDropdownOpen(false);
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
        message: "Đã có lỗi xảy ra, vui lòng thử lại",
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

  // Toggle bộ lọc
  const handleToggleFilter = () => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
    } else {
      setTempFilterService(filterService);
      setTempFilterRatingStatus(filterRatingStatus);
      setTempFilterPT(filterPT);
      setTempFilterStatusAttended(filterStatusAttended);
      setTempFilterStatusMissed(filterStatusMissed);
      setTempFilterStatusCancelled(filterStatusCancelled);
      setIsFilterOpen(true);
    }
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

  const ptOptions = ["Tất cả HLV", "Nguyễn Văn A", "Lê Thị B"];
  const filteredPTs = ptOptions.filter((pt) =>
    pt.toLowerCase().includes(ptSearchQuery.toLowerCase())
  );

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
      (b.serviceName || "Không").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Lọc theo Dịch vụ (Bộ lọc nâng cao)
    if (filterService) {
      const bService = b.serviceName || "Không";
      if (bService !== filterService) return false;
    }

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

      <CustomToast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

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
          {/* Dropdown Lọc */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={handleToggleFilter}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 shadow-2xs cursor-pointer select-none"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#FF6B00]" />
              <span>Lọc</span>
              <ChevronDown className={cn("h-4 w-4 text-[#FF6B00] transition-transform", isFilterOpen && "rotate-180")} />
            </button>

            {isFilterOpen && (
              <div className="absolute left-0 mt-2 z-35 w-[380px] sm:w-[420px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl text-neutral-800 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="space-y-5">
                  {/* Title with left orange line */}
                  <div className="flex items-center mb-1">
                    <div className="h-5 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                    <span className="text-base font-bold text-neutral-900">Bộ lọc buổi tập</span>
                  </div>

                  {/* Dịch vụ */}
                  <div className="space-y-3">
                    <span className="block text-sm font-bold text-neutral-800">Dịch vụ</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Tất cả", value: "" },
                        { label: "Không", value: "Không" },
                        { label: "Gói cơ bản", value: "Gói cơ bản" },
                        { label: "Gói nâng cao", value: "Gói nâng cao" }
                      ].map((opt) => {
                        const isChecked = tempFilterService === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={cn(
                              "flex items-center justify-start gap-2.5 h-9 rounded-lg text-xs font-bold border transition cursor-pointer select-none px-3",
                              isChecked
                                ? "bg-[#FFF0E5] border-[#FF6B00] text-[#FF6B00]"
                                : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                            )}
                          >
                            <input
                              type="radio"
                              name="service-filter"
                              checked={isChecked}
                              onChange={() => setTempFilterService(opt.value)}
                              className="sr-only"
                            />
                            <div
                              className={cn(
                                "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition",
                                isChecked ? "border-[#FF6B00] border-2" : "border-neutral-300"
                              )}
                            >
                              {isChecked && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                              )}
                            </div>
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Đánh giá */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800">Đánh giá</label>
                    <Select
                      value={tempFilterRatingStatus}
                      onValueChange={(val) => setTempFilterRatingStatus(val || "Tất cả")}
                    >
                      <SelectTrigger className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 h-10 text-xs text-neutral-800 font-semibold outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]">
                        <SelectValue placeholder="Chọn trạng thái đánh giá" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-neutral-200 rounded-xl shadow-xl p-1 z-55">
                        <SelectItem value="Tất cả">Tất cả</SelectItem>
                        <SelectItem value="Chưa đánh giá">Chưa đánh giá</SelectItem>
                        <SelectItem value="Đã đánh giá">Đã đánh giá</SelectItem>
                        <SelectItem value="Quá hạn đánh giá">Quá hạn đánh giá</SelectItem>
                        <SelectItem value="Không áp dụng">Không áp dụng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Huấn luyện viên: Combobox */}
                  <div className="space-y-1.5 relative" ref={ptRef}>
                    <label className="text-xs font-bold text-neutral-800">Huấn luyện viên</label>
                    <button
                      type="button"
                      onClick={() => setIsPTDropdownOpen(!isPTDropdownOpen)}
                      className="flex w-full items-center justify-between gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 h-10 text-xs text-neutral-800 font-semibold outline-none transition-colors focus:border-[#FF6B00] text-left cursor-pointer"
                    >
                      <span>{tempFilterPT}</span>
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    </button>
                    
                    {isPTDropdownOpen && (
                      <div className="absolute z-55 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-xl p-1 max-h-48 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Tìm kiếm HLV..."
                          value={ptSearchQuery}
                          onChange={(e) => setPtSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 text-xs border-b border-neutral-100 focus:outline-none focus:border-[#FF6B00] mb-1 font-semibold text-[#0A0A0A] bg-white outline-none"
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
                                className={cn(
                                  "flex w-full cursor-pointer items-center justify-between rounded-[6px] py-1.5 px-3 text-xs font-semibold outline-none select-none transition-colors text-left",
                                  isSelected
                                    ? "bg-[#FFF0E5] text-[#FF6B00]"
                                    : "text-[#0A0A0A] hover:bg-[#F5F5F5] hover:text-[#FF6B00]"
                                )}
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

                  {/* Trạng thái */}
                  <div className="space-y-3">
                    <span className="block text-sm font-bold text-neutral-800">Trạng thái</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "attended", label: "Hoàn thành", checked: tempFilterStatusAttended, onChange: () => setTempFilterStatusAttended(!tempFilterStatusAttended) },
                        { id: "missed", label: "Vắng mặt", checked: tempFilterStatusMissed, onChange: () => setTempFilterStatusMissed(!tempFilterStatusMissed) },
                        { id: "cancelled", label: "Đã hủy", checked: tempFilterStatusCancelled, onChange: () => setTempFilterStatusCancelled(!tempFilterStatusCancelled) }
                      ].map((opt) => {
                        return (
                          <div
                            key={opt.id}
                            onClick={opt.onChange}
                            className={cn(
                              "flex cursor-pointer items-center gap-2 rounded-lg border p-2 h-9 transition-all duration-200 select-none",
                              opt.checked
                                ? "border-[#FF6B00] bg-[#FFF0E5]/30 shadow-2xs"
                                : "border-neutral-200 bg-white hover:bg-neutral-50"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border transition-all duration-200 shrink-0",
                                opt.checked
                                  ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                                  : "border-neutral-300 bg-white"
                              )}
                            >
                              {opt.checked && <Check size={10} className="stroke-[3]" />}
                            </div>
                            <span className="text-[11px] font-bold text-neutral-700 leading-none">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-neutral-100 pt-4 grid grid-cols-2 gap-3 w-full">
                    <button
                      type="button"
                      onClick={handleResetFilter}
                      className="flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Đặt lại
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyFilter}
                      className="flex h-10 items-center justify-center rounded-xl bg-[#FF6B00] text-sm font-bold text-white hover:bg-[#E05E00] transition cursor-pointer shadow-xs"
                    >
                      Áp dụng
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[320px] md:min-w-[480px] flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-[#FF6B00]" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên huấn luyện viên, dịch vụ..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-855 placeholder-neutral-400 outline-none transition focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] shadow-2xs font-medium"
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
        onSelectRow={handleSelectRow}
        onClearFilters={handleClearAllFilters}
        onOpenRating={(booking) => {
          setSelectedBooking(booking);
          setRatingVal(5);
          setCommentVal("");
          setIsFormMode(true);
          setFormValidationError("");
          setIsDetailsOpen(true);
        }}
      />

      {/* Footer pagination outside table card */}
      {filteredBookings.length > 0 && (
        <div className="mt-6 flex flex-col gap-4 font-sans text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-neutral-200">
            <span>Hiển thị</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[74px] rounded-md border-0 bg-white px-3 py-0 text-xs font-semibold text-neutral-800 shadow-sm [&_svg]:text-[#FF6B00]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-xl">
                <SelectItem value="8">08</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <span>trong tổng {filteredBookings.length} buổi tập</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="h-7 rounded-md px-1.5 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              ‹ Trước
            </Button>

            {getVisiblePages(currentPage, totalPages).map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-1 text-[11px] font-semibold text-white/70">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;

              return (
                <Button
                  key={pageNum}
                  type="button"
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "h-7 w-7 rounded-md text-[11px] font-semibold",
                    currentPage === pageNum
                      ? "bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
                      : "bg-transparent text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="h-7 rounded-md px-1.5 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              Tiếp ›
            </Button>
          </div>
        </div>
      )}

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
