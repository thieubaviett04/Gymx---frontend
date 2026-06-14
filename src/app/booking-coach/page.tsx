"use client";

import React, { useState, useMemo, useEffect } from "react";
import { HomeLayout } from "@/components/home-layout";
import { GymDB, PT } from "@/lib/mock-db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search, Star, X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Định nghĩa dữ liệu đánh giá của hội viên
interface Review {
  memberName: string;
  comment: string;
  rating: number;
}

// Mở rộng interface PT để phục vụ cho Slide Panel chi tiết
interface ExtendedPT extends PT {
  code: string;
  birthYear: number;
  gender: "Nam" | "Nữ";
  experienceYears: number;
  reviews: Review[];
}

export default function BookingCoachPage() {
  // --- State dữ liệu & Tìm kiếm ---
  const [ptsList, setPtsList] = useState<ExtendedPT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9); 

  // --- State kiểm soát đóng mở Popover Lọc ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- State kiểm soát Slide Panel chi tiết ---
  const [selectedCoach, setSelectedCoach] = useState<ExtendedPT | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // --- State Bộ Lọc ---
  const [tempGender, setTempGender] = useState<string>("Tất cả");
  const [tempRating, setTempRating] = useState<string>("Tất cả");
  const [tempSpecialties, setTempSpecialties] = useState<string[]>([]);

  const [appliedGender, setAppliedGender] = useState<string>("Tất cả");
  const [appliedRating, setAppliedRating] = useState<string>("Tất cả");
  const [appliedSpecialties, setAppliedSpecialties] = useState<string[]>([]);

  const allowedSpecialties = ["Gym tổng hợp", "Tăng cơ", "Giảm cân/giảm mỡ", "Cardio", "Calisthenics"];

  useEffect(() => {
    const namesPool = [
      "Phạm Minh Hải", "Nguyễn Hùng Cường", "Trần Thị Lan Anh", 
      "Lê Hoàng Nam", "Nguyễn Mai Phương", "Đặng Quốc Bảo", 
      "Vũ Thùy Linh", "Phan Văn Đức", "Đỗ Hoàng Yến", "Nguyễn Minh Triết"
    ];

    // Thay đổi toàn bộ giá tiền dưới 200.000đ theo giờ
    const pricesPool = [180000, 150000, 160000, 190000, 175000, 145000, 165000, 185000, 170000, 195000];
    const ratingsPool = [5.0, 4.9, 4.8, 4.2, 4.9, 3.8, 4.5, 5.0, 4.7, 4.9];
    const expPool = [5, 5, 3, 7, 4, 6, 3, 8, 5, 10];
    const birthYears = [1998, 1997, 2000, 1995, 1999, 1996, 2001, 1994, 1998, 1992];
    
    const specsPool = [
      ["Gym tổng hợp", "Cardio"],
      ["Tăng cơ", "Giảm cân/giảm mỡ"],
      ["Gym tổng hợp", "Calisthenics", "Cardio"],
      ["Tăng cơ", "Calisthenics"],
      ["Giảm cân/giảm mỡ", "Cardio"],
      ["Gym tổng hợp", "Tăng cơ"],
      ["Cardio", "Calisthenics"],
      ["Tăng cơ", "Gym tổng hợp", "Cardio"],
      ["Giảm cân/giảm mỡ", "Gym tổng hợp"],
      ["Tăng cơ", "Calisthenics", "Gym tổng hợp"]
    ];

    const mockReviews: Review[] = [
      { memberName: "Trần Văn Hoàng", comment: "HLV hướng dẫn rất nhiệt tình, sửa form tạ kỹ càng.", rating: 5 },
      { memberName: "Lê Thị Mỹ Linh", comment: "Bài tập khoa học, mình thấy cải thiện thể lực rõ rệt.", rating: 5 },
      { memberName: "Nguyễn Minh Quân", comment: "Đúng giờ, chuyên nghiệp và có chuyên môn cao.", rating: 4 }
    ];

    const extendedList: ExtendedPT[] = Array.from({ length: 10 }).map((_, index) => {
      const name = namesPool[index];
      const lowerName = name.toLowerCase();
      const detectedGender = (lowerName.includes("thị") || lowerName.includes("lan") || lowerName.includes("phương") || lowerName.includes("linh") || lowerName.includes("yến")) ? "Nữ" : "Nam";

      return {
        id: `pt-generated-${index + 1}`,
        code: `HLV${String(index + 1).padStart(3, "0")}`,
        name: name,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + index * 100000}?auto=format&fit=crop&w=120&q=80`,
        bio: `${expPool[index]} năm kinh nghiệm thực chiến. Giúp học viên tối ưu thời gian tập, cải thiện vóc dáng nhanh chóng và duy trì lối sống lành mạnh lâu dài.`,
        price: pricesPool[index],
        rating: ratingsPool[index],
        specialty: specsPool[index].join(", "),
        availableTimes: ["08:00", "10:00", "14:00", "16:00"],
        birthYear: birthYears[index],
        gender: detectedGender,
        experienceYears: expPool[index],
        reviews: mockReviews
      };
    });

    setPtsList(extendedList);
  }, []);

  // --- Logic Bộ Lọc ---
  const handleToggleTempSpecialty = (spec: string) => {
    setTempSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleApplyFilters = () => {
    setAppliedGender(tempGender);
    setAppliedRating(tempRating);
    setAppliedSpecialties(tempSpecialties);
    setCurrentPage(1);
    setIsFilterOpen(false); 
  };

  const handleResetFilters = () => {
    setTempGender("Tất cả");
    setTempRating("Tất cả");
    setTempSpecialties([]);
    setAppliedGender("Tất cả");
    setAppliedRating("Tất cả");
    setAppliedSpecialties([]);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleOpenDetails = (coach: ExtendedPT) => {
    setSelectedCoach(coach);
    setIsPanelOpen(true);
  };

  const filteredCoaches = useMemo(() => {
    return ptsList.filter(pt => {
      const specs = pt.specialty.split(", ").map(s => s.trim());
      const matchesSearch = pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            specs.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGender = appliedGender === "Tất cả" || pt.gender === appliedGender;
      let matchesRating = true;
      if (appliedRating !== "Tất cả") {
        matchesRating = pt.rating >= parseInt(appliedRating);
      }
      const matchesSpecialty = appliedSpecialties.length === 0 || 
        appliedSpecialties.some(s => specs.includes(s));

      return matchesSearch && matchesGender && matchesRating && matchesSpecialty;
    }).sort((a, b) => b.rating - a.rating);
  }, [ptsList, searchTerm, appliedGender, appliedRating, appliedSpecialties]);

  // --- Phân trang ---
  const totalItems = filteredCoaches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoaches = filteredCoaches.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <HomeLayout pageTitle="Đăng ký tập với huấn luyện viên">
      <div className="space-y-6 relative min-h-screen pb-16">
        
        {/* THANH CÔNG CỤ TÌM KIẾM & LỌC */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm">
              Danh sách huấn luyện viên ({totalItems})
            </span>
            {(appliedGender !== "Tất cả" || appliedRating !== "Tất cả" || appliedSpecialties.length > 0) && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-orange-400 hover:text-orange-300 font-bold ml-2 flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg border border-white/10"
              >
                Xóa lọc <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
            
            {/* Đã sửa lỗi asChild: Dùng thẳng Button của Shadcn UI làm Trigger gốc */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  className={`flex items-center justify-center gap-2 border rounded-xl shadow-sm h-10 px-4 text-xs font-bold transition-all ${
                    appliedGender !== "Tất cả" || appliedRating !== "Tất cả" || appliedSpecialties.length > 0
                      ? "bg-[#FF6B00] text-white border-[#FF6B00] hover:bg-[#e05e00] hover:text-white"
                      : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Lọc</span>
                  <span className="text-[10px] opacity-60">▼</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5 bg-white rounded-2xl shadow-xl border border-neutral-100 space-y-4" align="end">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-neutral-800 text-xs">Bộ lọc huấn luyện viên</h3>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFilterOpen(false)}
                    className="p-0 h-7 w-7 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Lọc Giới tính */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Giới tính</h4>
                  <div className="flex gap-4">
                    {["Nam", "Nữ", "Tất cả"].map((g) => (
                      <label key={g} className="flex items-center space-x-2 cursor-pointer text-xs font-medium">
                        <input 
                          type="radio" 
                          name="filter-gender"
                          checked={tempGender === g}
                          onChange={() => setTempGender(g)}
                          className="accent-[#FF6B00] h-3.5 w-3.5"
                        />
                        <span className={tempGender === g ? "text-[#FF6B00] font-bold" : "text-neutral-600"}>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lọc Đánh giá */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Đánh giá sao</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Từ 3.0 sao", value: "3" },
                      { label: "Từ 4.0 sao", value: "4" },
                      { label: "Xuất sắc (5.0)", value: "5" },
                      { label: "Tất cả", value: "Tất cả" }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTempRating(item.value)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                          tempRating === item.value 
                            ? "bg-orange-50 text-[#FF6B00] border-orange-200 font-bold"
                            : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        {item.value !== "Tất cả" ? `★ ≥${item.value}.0` : "Tất cả"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lọc Chuyên môn */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Chuyên môn</h4>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1">
                    {allowedSpecialties.map((spec) => {
                      const isChecked = tempSpecialties.includes(spec);
                      return (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => handleToggleTempSpecialty(spec)}
                          className={`flex items-center justify-between p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                            isChecked
                              ? "bg-orange-50 text-[#FF6B00] border-orange-200 font-bold"
                              : "bg-neutral-50 border-neutral-100 text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          <span>{spec}</span>
                          {isChecked && <Check className="h-3 w-3 text-[#FF6B00]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-neutral-400 text-xs h-8">Đặt lại</Button>
                  <Button size="sm" onClick={handleApplyFilters} className="bg-[#FF6B00] text-white hover:bg-[#e05e00] text-xs h-8 px-4 rounded-lg shadow-xs">Áp dụng</Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Ô tìm kiếm */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm tên hoặc chuyên môn HLV..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 bg-white border-neutral-200 rounded-xl h-10 text-xs placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* THÔNG BÁO KHI TRỐNG KẾT QUẢ */}
        {filteredCoaches.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-md border border-white/10 shadow-xs rounded-3xl py-12 text-center">
            <p className="text-white/60 font-medium text-xs">Không tìm thấy huấn luyện viên nào phù hợp với tiêu chí lọc.</p>
          </Card>
        )}

        {/* DANH SÁCH THẺ PT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCoaches.map((pt) => {
            const normalizedSpecs = pt.specialty.split(", ").map(s => s.trim());

            return (
              <Card key={pt.id} className="bg-white border border-neutral-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between w-full transition-all hover:shadow-lg">
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                  
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex gap-3.5 min-w-0">
                        <img 
                          src={pt.avatarUrl} 
                          alt={pt.name} 
                          className="w-12 h-12 rounded-full object-cover border border-neutral-100 shrink-0 shadow-xs"
                        />
                        <div className="min-w-0">
                          {/* Đã đưa hết chuyên môn xuống dưới, tên HLV hiển thị đầy đủ dòng */}
                          <h3 className="font-bold text-neutral-900 text-sm whitespace-nowrap">{pt.name}</h3>
                          <p className="text-[11px] text-neutral-400 font-semibold mt-0.5">
                            {pt.gender} <span className="text-neutral-300 mx-1">•</span> {pt.experienceYears} năm kinh nghiệm
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Đánh giá sao */}
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50/60 w-fit px-2 py-0.5 rounded-lg border border-amber-100 mt-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-[11px] font-bold text-amber-700">{pt.rating.toFixed(1)}</span>
                    </div>

                    {/* Toàn bộ danh sách chuyên môn hiển thị đầy đủ ở phía dưới */}
                    <div className="flex flex-wrap gap-1.5 mt-4 min-h-[28px]">
                      {normalizedSpecs.map((spec, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-lg block whitespace-nowrap"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Giá tiền theo giờ (<200k) và các nút thao tác */}
                  <div className="pt-4 border-t border-neutral-100 mt-auto space-y-4">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-black text-neutral-900">
                        {pt.price.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-[11px] text-neutral-400 font-semibold">/giờ</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDetails(pt)}
                        className="w-full h-9 border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                      >
                        Xem chi tiết
                      </Button>
                      <Button 
                        type="button"
                        size="sm"
                        className="w-full h-9 bg-[#FF6B00] text-white hover:bg-[#e05e00] rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        Chọn
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* PHẦN PHÂN TRANG (PAGINATION) */}
        {filteredCoaches.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-white/10 text-xs text-white/60 font-medium">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white border border-neutral-200 text-neutral-700 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-[#FF6B00] h-7 shadow-xs"
              >
                <option value={3}>03</option>
                <option value={6}>06</option>
                <option value={9}>09</option>
                <option value={12}>12</option>
              </select>
              <span>trong tổng số {totalItems} huấn luyện viên</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button 
                size="icon" 
                variant="ghost" 
                className="w-7 h-7 rounded-lg border border-white/10 text-white bg-white/5 hover:bg-white/10 disabled:opacity-20"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? "bg-[#FF6B00] text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {page}
                </Button>
              ))}

              <Button 
                size="icon" 
                variant="ghost" 
                className="w-7 h-7 rounded-lg border border-white/10 text-white bg-white/5 hover:bg-white/10 disabled:opacity-20"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE PANEL CHI TIẾT HUẤN LUYỆN VIÊN (MỞ BÊN PHẢI MÀN HÌNH)               */}
        {/* ========================================================================= */}
        <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
          <SheetContent className="w-[450px] sm:max-w-[450px] bg-white p-6 overflow-y-auto flex flex-col justify-between border-l border-neutral-100 shadow-2xl">
            {selectedCoach && (
              <>
                <div className="space-y-6">
                  <SheetHeader className="text-left border-b pb-4 relative">
                    <SheetTitle className="text-base font-black text-neutral-800">
                      Thông tin chi tiết huấn luyện viên
                    </SheetTitle>
                    {/* Nút X đóng panel góc phải trên */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPanelOpen(false)}
                      className="absolute right-0 top-0 h-8 w-8 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </SheetHeader>

                  {/* Cụm Avatar & Định danh cơ bản */}
                  <div className="flex gap-4 items-center bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                    <img 
                      src={selectedCoach.avatarUrl} 
                      alt={selectedCoach.name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                    />
                    <div className="space-y-1">
                      <h2 className="text-base font-black text-neutral-900">{selectedCoach.name}</h2>
                      <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {selectedCoach.code}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold pt-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{selectedCoach.rating.toFixed(1)} / 5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Bảng hồ sơ lý lịch chi tiết */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hồ sơ cá nhân</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <p className="text-neutral-400 font-medium">Năm sinh</p>
                        <p className="text-neutral-800 font-bold mt-0.5">{selectedCoach.birthYear}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <p className="text-neutral-400 font-medium">Giới tính</p>
                        <p className="text-neutral-800 font-bold mt-0.5">{selectedCoach.gender}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <p className="text-neutral-400 font-medium">Kinh nghiệm</p>
                        <p className="text-neutral-800 font-bold mt-0.5">{selectedCoach.experienceYears} năm kinh nghiệm</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <p className="text-neutral-400 font-medium">Chuyên môn chính</p>
                        <p className="text-neutral-800 font-bold mt-0.5 truncate">{selectedCoach.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Đôi nét giới thiệu bản thân */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Giới thiệu đôi nét</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed italic bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      "{selectedCoach.bio}"
                    </p>
                  </div>

                  {/* Đánh giá từ phía hội viên thực tế */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hội viên đánh giá ({selectedCoach.reviews.length})</h3>
                    <div className="space-y-2">
                      {selectedCoach.reviews.map((rev, index) => (
                        <div key={index} className="border border-neutral-100 rounded-xl p-3 space-y-1 bg-white shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-800">{rev.memberName}</span>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-500 leading-normal">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Khối Đáy Panel: Giá/giờ & Nút Action Đăng ký */}
                <div className="border-t pt-4 mt-6 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-semibold">Chi phí huấn luyện:</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-black text-neutral-900">
                        {selectedCoach.price.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-xs text-neutral-400">/giờ</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-11 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-xl shadow-md transition-all"
                    onClick={() => {
                      setIsPanelOpen(false);
                      alert(`Đã đăng ký Huấn luyện viên: ${selectedCoach.name}`);
                    }}
                  >
                    Chọn huấn luyện viên này
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

      </div>
    </HomeLayout>
  );
}