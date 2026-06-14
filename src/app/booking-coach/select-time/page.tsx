"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HomeLayout } from "@/components/home-layout";
import { GymDB, PT } from "@/lib/mock-db";// Kiểm tra đường dẫn import cho đúng
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Sparkles, CheckCircle2 } from "lucide-react";

interface ExtraService {
  id: string;
  name: string;
  price: number;
}

const EXTRA_SERVICES: ExtraService[] = [
  { id: "nutrition", name: "Không thêm dịch vụ khác", price: 0 },
  { id: "water", name: "Gói cơ bản + 100k", price: 100000 },
  { id: "inbody", name: "Gói chuyên sâu (+320k)", price: 320000 }
];

const TIME_SLOTS = ["08:00 - 09:00", "09:30 - 10:30", "14:00 - 15:00", "15:30 - 16:30", "18:00 - 19:00", "19:30 - 20:30"];

export default function SelectTimePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ptId = searchParams.get("ptId");

  const [pt, setPt] = useState<PT | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-15");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (ptId) {
      const allPts = GymDB.getPTs();
      const foundPt = allPts.find(p => p.id === ptId);
      if (foundPt) setPt(foundPt);
    }
  }, [ptId]);

  if (!pt) {
    return (
      <HomeLayout pageTitle="Đặt lịch hẹn">
        <p className="text-center py-10 text-neutral-500">Đang tải thông tin huấn luyện viên...</p>
      </HomeLayout>
    );
  }

  // LOGIC TÍNH TOÁN HÓA ĐƠN THEO ĐẶC TẢ FIGMA
  const basePrice = pt.price;
  const servicesPrice = selectedServices.reduce((total, serviceId) => {
    const s = EXTRA_SERVICES.find(srv => srv.id === serviceId);
    return total + (s ? s.price : 0);
  }, 0);

  const subTotal = basePrice + servicesPrice;
  // Giảm giá 10% khi tích chọn từ 2 dịch vụ đi kèm trở lên
  const isDiscounted = selectedServices.length >= 2;
  const discountAmount = isDiscounted ? subTotal * 0.1 : 0;
  const finalTotal = subTotal - discountAmount;

  const handleToggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) {
      alert("Vui lòng chọn khung giờ tập trước khi xác nhận!");
      return;
    }
    
    // Lưu lịch hẹn mới vào dữ liệu chung nhóm qua GymDB để các thành viên khác thấy lịch đặt này!
    const currentBookings = GymDB.getBookings();
    const newBooking = {
      id: `BK-${Math.floor(Math.random() * 90000) + 10000}`,
      userId: "M001", // Mặc định tài khoản thử nghiệm của bạn
      ptId: pt.id,
      ptName: pt.name,
      timeSlot: selectedSlot,
      date: selectedDate,
      status: "CONFIRMED" as const,
      serviceName: selectedServices.map(sid => EXTRA_SERVICES.find(s => s.id === sid)?.name.split(" ")[0]).join(", ") || pt.specialty.split(",")[0]
    };

    GymDB.setBookings([newBooking, ...currentBookings]);
    setShowSuccessModal(true);
  };

  return (
    <HomeLayout pageTitle="Thiết lập lịch tập & dịch vụ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative pb-16">
        
        {/* CỘT TRÁI CHỌN CẤU HÌNH LỊCH (MÀN HÌNH FIGMA SỐ 5 & 6) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin HLV rút gọn */}
          <Card className="bg-white border-none rounded-2xl shadow-xs p-5 flex items-center gap-4">
            <img src={pt.avatarUrl} alt={pt.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-neutral-800 text-base">{pt.name}</h3>
              <p className="text-xs text-[#FF6B00] font-semibold bg-orange-50 px-2.5 py-0.5 rounded-md inline-block mt-1">{pt.specialty.split(",")[0]}</p>
            </div>
          </Card>

          {/* Chọn ngày tập */}
          <Card className="bg-white border-none rounded-2xl shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 1. Chọn ngày huấn luyện</h4>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl p-3 text-sm font-medium focus:outline-none bg-neutral-50/50" 
            />
          </Card>

          {/* Lưới chọn Giờ bắt đầu */}
          <Card className="bg-white border-none rounded-2xl shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2. Chọn ca tập trống</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all ${
                      isSelected 
                        ? "bg-[#FF6B00] border-[#FF6B00] text-white shadow-sm shadow-orange-500/20 scale-[1.02]" 
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Tích chọn dịch vụ bổ sung */}
          <Card className="bg-white border-none rounded-2xl shadow-xs p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-orange-500" /> 3. Dịch vụ bổ sung</h4>
              <p className="text-[11px] text-[#FF6B00] font-medium mt-1 bg-orange-50/60 p-2 rounded-lg border border-orange-100/60">
                  </p>
            </div>
            
            <div className="space-y-3">
              {EXTRA_SERVICES.map((srv) => (
                <div key={srv.id} className="flex items-center space-x-3 p-3 border border-neutral-100 rounded-xl hover:bg-neutral-50/50 transition-colors">
                  <Checkbox 
                    id={srv.id} 
                    checked={selectedServices.includes(srv.id)} 
                    onCheckedChange={() => handleToggleService(srv.id)}
                  />
                  <Label htmlFor={srv.id} className="text-xs font-semibold text-neutral-700 cursor-pointer flex-1">{srv.name}</Label>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CỘT PHẢI HOÁ ĐƠN CỐ ĐỊNH REALTIME */}
        <div className="lg:sticky lg:top-6">
          <Card className="bg-white border-none rounded-2xl shadow-md overflow-hidden border border-neutral-100/50">
            <div className="bg-neutral-900 text-white p-4 font-bold text-sm text-center tracking-wide uppercase">
              Tóm tắt hóa đơn thanh toán
            </div>
            <CardContent className="p-5 space-y-4 text-xs font-medium text-neutral-600">
              <div className="flex justify-between border-b pb-2.5">
                <span>Huấn luyện viên:</span>
                <span className="font-bold text-neutral-900">{pt.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2.5">
                <span>Ngày tập hẹn:</span>
                <span className="font-bold text-neutral-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between border-b pb-2.5">
                <span>Khung giờ chọn:</span>
                <span className="font-bold text-[#FF6B00]">{selectedSlot || "Chưa chọn"}</span>
              </div>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Phí huấn luyện gốc:</span>
                  <span>{basePrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Phí dịch vụ kèm theo:</span>
                  <span>{servicesPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                
                {isDiscounted && (
                  <div className="flex justify-between text-emerald-500 bg-emerald-50 p-2 rounded-lg text-[11px] font-bold mt-2">
                    <span>Ưu đãi đặc biệt (Giảm 10%):</span>
                    <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-neutral-800">Tổng chi phí thanh toán:</span>
                <span className="text-2xl font-black text-[#FF6B00]">{finalTotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <Button 
                onClick={handleConfirmBooking}
                className="w-full bg-[#FF6B00] text-white hover:bg-[#e05e00] py-6 rounded-xl font-bold text-sm shadow-md shadow-orange-500/10 mt-4"
              >
                Xác nhận đặt lịch ngay
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* MODALpopup XÁC NHẬN THÀNH CÔNG (MÀN HÌNH FIGMA SỐ 7) */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Đặt lịch huấn luyện thành công!</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Hệ thống đã ghi nhận lịch tập của bạn với HLV <span className="font-bold text-neutral-700">{pt.name}</span> vào lúc {selectedSlot} ngày {selectedDate}.
              </p>
              <Button 
                onClick={() => router.push("/")}
                className="mt-5 w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold text-xs py-4"
              >
                Quay về trang chủ Gym-X
              </Button>
            </div>
          </div>
        )}

      </div>
    </HomeLayout>
  );
}