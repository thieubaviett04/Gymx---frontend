"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Copy, Check, Clock, ShieldCheck, CreditCard, QrCode, Lock, X, XCircle, ChevronDown, CheckCircle, HelpCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomToast from "@/components/ui/custom-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function BankIcon({ bank }: { bank: string }) {
  switch (bank) {
    case "MB bank":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#1A3E95] text-white shrink-0 shadow-xs select-none">
          MB
        </span>
      );
    case "Techcombank":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#E21E26] text-white shrink-0 shadow-xs select-none">
          TCB
        </span>
      );
    case "Vietcombank":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#00A950] text-white shrink-0 shadow-xs select-none">
          VCB
        </span>
      );
    case "VietinBank":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#0076A3] text-white shrink-0 shadow-xs select-none">
          VTB
        </span>
      );
    case "BIDV":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#005A3C] text-white shrink-0 shadow-xs select-none">
          BID
        </span>
      );
    case "ACB":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#0070C0] text-white shrink-0 shadow-xs select-none">
          ACB
        </span>
      );
    case "TPBank":
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-[#5F259F] text-white shrink-0 shadow-xs select-none">
          TPB
        </span>
      );
    default:
      return (
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black bg-neutral-200 text-neutral-500 shrink-0 shadow-xs select-none">
          BANK
        </span>
      );
  }
}


interface Addon {
  id: string;
  name: string;
  price: number;
}

interface Package {
  id: string;
  code: string;
  name: string;
  price: number;
  duration: number; // in months
}

interface PaymentViewProps {
  selectedPackage: Package;
  startDate: string;
  endDate: string;
  selectedAddons: Addon[];
  totalAmount: number;
  billDetails?: {
    trainerName: string;
    date: string;
    timeSlot: string;
    duration: string;
    endTime: string;
  };
  onCancel: () => void;
  onSuccess: (payment: {
    method: "QR Code" | "ATM";
    amount: number;
    planName: string;
  }) => void;
}

export function PaymentView({
  selectedPackage,
  startDate,
  endDate,
  selectedAddons,
  totalAmount,
  onCancel,
  onSuccess,
}: PaymentViewProps) {
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds for convenient mock testing!
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Modals visibility states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "card">("transfer");
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  // Bank Form States
  const [selectedBank, setSelectedBank] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Pricing calculations
  const basePrice = selectedPackage.price;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = selectedAddons.length >= 2 ? Math.round(addonsTotal * 0.1) : 0;
  const computedTotal = basePrice + addonsTotal - discountAmount;

  // Bank Info details
  const bankInfo = {
    bankName: "Vietcombank",
    accountNumber: "1234 5678 9012",
    accountName: "CONG TY TNHH GYM MAX",
    amount: computedTotal,
    content: `#HD-20250526-001`,
  };

  // 1. Transaction Timeout Timer
  useEffect(() => {
    if (showSuccessModal) return;
    if (timeLeft <= 0) {
      setShowTimeoutAlert(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowTimeoutAlert(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showSuccessModal]);

  // QR code scan simulation
  const handleQRClick = () => {
    if (timeLeft > 0 && !showTimeoutAlert) {
      setShowSuccessModal(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReturnHome = () => {
    setShowSuccessModal(false);
    onSuccess({
      method: paymentMethod === "transfer" ? "QR Code" : "ATM",
      amount: computedTotal,
      planName: selectedPackage.name,
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const limited = value.substring(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
    if (formErrors.cardNumber) {
      setFormErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCardHolder(value);
    if (formErrors.cardHolder) {
      setFormErrors((prev) => ({ ...prev, cardHolder: "" }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCvv(value);
    if (formErrors.cvv) {
      setFormErrors((prev) => ({ ...prev, cvv: "" }));
    }
  };

  const handleValidateAndOpenConfirm = () => {
    const errors: Record<string, string> = {};
    if (!selectedBank) {
      errors.selectedBank = "Vui lòng chọn ngân hàng";
    }
    if (!cardHolder.trim()) {
      errors.cardHolder = "Vui lòng điền tên chủ thẻ";
    }
    const cleanCardNo = cardNumber.replace(/\s/g, "");
    if (cleanCardNo.length < 16) {
      errors.cardNumber = "Số thẻ phải đủ 16 chữ số";
    }
    if (!expiryMonth) {
      errors.expiryMonth = "Vui lòng chọn tháng";
    }
    if (!expiryYear) {
      errors.expiryYear = "Vui lòng chọn năm";
    }
    if (cvv.length < 3) {
      errors.cvv = "Mã CVV phải gồm 3 chữ số";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setShowConfirmPaymentModal(true);
  };

  return (
    <div className="w-full py-4 animate-in fade-in duration-300">
      {/* Toast alerts for Chuyển khoản QR */}
      {paymentMethod === "transfer" && (
        <>
          {/* 1. Loading toast when timer is running */}
          {!showSuccessModal && timeLeft > 0 && !showTimeoutAlert && (
            <div className="fixed top-6 left-0 right-0 flex justify-center pointer-events-none z-[999999] px-4 font-sans select-none">
              <div className="pointer-events-auto bg-white border border-[#E5E7EB] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] pl-3.5 pr-4 py-2.5 flex items-center gap-3 w-[360px] max-w-[90vw]">
                <div className="w-8 h-8 rounded-full bg-[#FFF0E5] text-[#FF6B00] flex items-center justify-center shrink-0 shadow-sm">
                  <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                </div>
                <span className="text-sm font-semibold text-[#111111] flex-1 leading-normal text-left pr-1">
                  Đang xử lý thanh toán...
                </span>
              </div>
            </div>
          )}

          {/* 2. Timeout toast when timer has run out */}
          <CustomToast
            show={showTimeoutAlert}
            type="error"
            message="Đã quá thời gian thanh toán, thử lại"
            onClose={() => {
              setShowTimeoutAlert(false);
              setTimeLeft(10); // reset/refresh timer
            }}
          />
        </>
      )}

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Column 1: Bill details - Left */}
        <div className="w-full lg:col-span-4 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] overflow-hidden flex flex-col h-full">
          <div className="bg-[#FFF0E5]/60 px-6 py-4 border-b border-orange-100">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#FF6B00]" />
              Thông tin hóa đơn
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="divide-y divide-[#E5E5E5]">
              {/* Row 1: Huấn luyện viên */}
              <div className="flex justify-between items-center py-4">
                <span className="text-neutral-500 font-medium text-sm">Huấn luyện viên</span>
                <span className="font-semibold text-neutral-800 text-sm">Nguyễn Văn A</span>
              </div>
              
              {/* Row 2: Ngày tập */}
              <div className="flex justify-between items-center py-4">
                <span className="text-neutral-500 font-medium text-sm">Ngày tập</span>
                <span className="font-semibold text-neutral-800 text-sm">{startDate}</span>
              </div>

              {/* Row 3: Khung giờ */}
              <div className="flex justify-between items-center py-4">
                <span className="text-neutral-500 font-medium text-sm">Khung giờ</span>
                <span className="font-semibold text-[#FF6B00] text-sm">18:00</span>
              </div>

              {/* Row 4: Thời lượng */}
              <div className="flex justify-between items-center py-4">
                <span className="text-neutral-500 font-medium text-sm">Thời lượng</span>
                <span className="font-semibold text-neutral-800 text-sm">1 giờ</span>
              </div>

              {/* Row 5: Giờ kết thúc */}
              <div className="flex justify-between items-center py-4">
                <span className="text-neutral-500 font-medium text-sm">Giờ kết thúc</span>
                <span className="font-semibold text-neutral-800 text-sm">21:00</span>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="border-t border-dashed border-[#E5E5E5] mb-5" />
              <div className="flex justify-between items-center px-1">
                <div className="space-y-0.5">
                  <span className="text-neutral-800 text-sm font-bold uppercase tracking-wider block">Tổng cộng</span>
                  <span className="text-[10px] text-neutral-400 font-medium block">Đã bao gồm thuế & phí</span>
                </div>
                <span className="text-3xl font-extrabold text-[#FF6B00] tracking-tight">
                  {computedTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Payment method and details - Right */}
        <div className="w-full lg:col-span-8 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] overflow-hidden">
          <div className="bg-[#FFF0E5]/60 px-6 py-4 border-b border-orange-100">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#FF6B00]" />
              Phương thức thanh toán
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Selector Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Chuyển khoản */}
              <div
                onClick={() => setPaymentMethod("transfer")}
                className={cn(
                  "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer select-none",
                  paymentMethod === "transfer"
                    ? "border-[#FF6B00] bg-[#FFF0E5]/50 text-neutral-855"
                    : "border-[#E5E5E5] bg-white text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    paymentMethod === "transfer" ? "bg-orange-100 text-[#FF6B00]" : "bg-neutral-100 text-neutral-450"
                  )}>
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm text-neutral-800">Chuyển khoản</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Quét QR hoặc chuyển khoản ngân hàng</div>
                  </div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                  paymentMethod === "transfer"
                    ? "border-[#FF6B00] bg-white"
                    : "border-neutral-300"
                )}>
                  {paymentMethod === "transfer" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                  )}
                </div>
              </div>

              {/* Option 2: Thẻ ngân hàng */}
              <div
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer select-none",
                  paymentMethod === "card"
                    ? "border-[#FF6B00] bg-[#FFF0E5]/50 text-neutral-855"
                    : "border-[#E5E5E5] bg-white text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    paymentMethod === "card" ? "bg-orange-100 text-[#FF6B00]" : "bg-neutral-100 text-neutral-450"
                  )}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm text-neutral-800">Thẻ ngân hàng</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Thanh toán bằng ATM / Visa / Mastercard</div>
                  </div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                  paymentMethod === "card"
                    ? "border-[#FF6B00] bg-white"
                    : "border-neutral-300"
                )}>
                  {paymentMethod === "card" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                  )}
                </div>
              </div>
            </div>

            {/* Content Switched Section */}
            {paymentMethod === "transfer" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  {/* QR code block */}
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
                    <h3 className="font-bold text-sm text-neutral-800">Quét mã để hoàn tất thanh toán</h3>
                    <p className="text-[11px] text-neutral-400 mt-1">Mở ứng dụng ngân hàng và quét mã QR bên dưới</p>

                    {/* QR Code Container */}
                    <div
                      onClick={handleQRClick}
                      title="Click vào mã QR để giả lập thanh toán thành công"
                      className="my-5 p-3 bg-white border border-[#E5E5E5] rounded-xl flex items-center justify-center relative shadow-sm w-44 h-44 cursor-pointer hover:border-[#FF6B00] transition-colors"
                    >
                      <svg className="w-full h-full text-neutral-900" viewBox="0 0 100 100">
                        <rect x="0" y="0" width="22" height="22" fill="currentColor" rx="2" />
                        <rect x="3" y="3" width="16" height="16" fill="white" rx="1.5" />
                        <rect x="6" y="6" width="10" height="10" fill="currentColor" rx="1" />

                        <rect x="78" y="0" width="22" height="22" fill="currentColor" rx="2" />
                        <rect x="81" y="3" width="16" height="16" fill="white" rx="1.5" />
                        <rect x="84" y="6" width="10" height="10" fill="currentColor" rx="1" />

                        <rect x="0" y="78" width="22" height="22" fill="currentColor" rx="2" />
                        <rect x="3" y="81" width="16" height="16" fill="white" rx="1.5" />
                        <rect x="6" y="84" width="10" height="10" fill="currentColor" rx="1" />

                        <rect x="74" y="74" width="8" height="8" fill="currentColor" rx="1" />
                        <rect x="76" y="76" width="4" height="4" fill="white" rx="0.5" />
                        <rect x="77" y="77" width="2" height="2" fill="currentColor" />

                        <path
                          d="M 30,2 h 8 v 4 h -8 z M 45,0 h 12 v 3 h -12 z M 62,3 h 4 v 8 h -4 z M 30,10 h 5 v 5 h -5 z M 40,8 h 10 v 2 h -10 z M 54,12 h 8 v 5 h -8 z M 66,10 h 8 v 3 h -8 z M 26,18 h 14 v 4 H 26 z M 44,18 h 8 v 4 h -8 z M 56,18 h 16 v 4 H 56 z M 0,26 h 8 v 12 H 0 z M 12,26 h 12 v 4 H 12 z M 28,26 h 12 v 8 H 28 z M 44,26 h 16 v 4 H 44 z M 64,26 h 8 v 12 h -8 z M 76,26 h 12 v 4 H 76 z M 92,26 h 8 v 6 h -8 z M 12,34 h 8 v 8 h -8 z M 24,34 h 2 v 6 h -2 z M 40,34 h 16 v 4 H 40 z M 80,34 h 16 v 4 H 80 z M 0,42 h 16 v 4 H 0 z M 20,42 h 12 v 4 H 20 z M 36,42 h 8 v 8 h -8 z M 48,42 h 16 v 4 H 48 z M 68,42 h 8 v 8 h -8 z M 80,42 h 20 v 4 H 80 z M 8,50 h 16 v 4 H 8 z M 28,50 h 4 v 12 h -4 z M 40,50 h 12 v 4 H 40 z M 56,50 h 8 v 8 h -8 z M 88,50 h 12 v 4 H 88 z M 0,58 h 8 v 12 H 0 z M 12,58 h 12 v 4 H 12 z M 36,58 h 16 v 4 H 36 z M 56,58 h 8 v 12 h -8 z M 68,58 h 16 v 4 H 68 z M 88,58 h 8 v 8 h -8 z M 8,66 h 16 v 4 H 8 z M 28,66 h 12 v 4 H 28 z M 44,66 h 8 v 8 h -8 z M 80,66 h 16 v 4 H 80 z M 0,74 h 16 v 4 H 0 z M 20,74 h 8 v 8 h -8 z M 32,74 h 12 v 4 H 32 z M 48,74 h 16 v 4 H 48 z M 68,74 h 4 v 10 h -4 z M 88,78 h 12 v 4 H 88 z M 24,84 h 12 v 4 H 24 z M 40,84 h 8 v 12 h -8 z M 52,84 h 16 v 4 H 52 z M 72,84 h 8 v 12 h -8 z M 24,92 h 12 v 4 H 24 z M 52,92 h 16 v 4 H 52 z M 84,92 h 16 v 4 H 84 z"
                          fill="currentColor"
                        />
                        <rect x="2" y="2" width="2" height="2" fill="currentColor" />
                        <rect x="76" y="2" width="2" height="2" fill="currentColor" />
                        <rect x="2" y="76" width="2" height="2" fill="currentColor" />
                      </svg>

                      <div className="absolute w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#E5E5E5] shadow-md">
                        <span className="font-extrabold text-[9px] text-[#FF6B00] tracking-tighter">GymX</span>
                      </div>
                    </div>

                    {/* Timer Clock */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold bg-neutral-50 px-3 py-1.5 rounded-full border border-[#E5E5E5] select-none">
                      <Clock className="w-3.5 h-3.5 text-[#FF6B00] animate-pulse" />
                      <span className="font-bold text-[#FF6B00] font-mono">{formatTime(timeLeft)}</span>
                    </div>

                    <div className="w-24 h-1 bg-[#FF6B00] rounded-full mt-4" />
                  </div>

                  {/* Transfer Details Card */}
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <h3 className="font-bold text-base text-neutral-900 mb-4 text-left border-b border-[#E5E5E5] pb-3">Thông tin chuyển khoản</h3>
                    
                    <div className="divide-y divide-[#E5E5E5] text-sm">
                      {/* Row 1: Tổng tiền */}
                      <div className="flex justify-between items-center py-4">
                        <span className="text-neutral-500 font-medium text-sm">Tổng tiền</span>
                        <span className="font-bold text-[#FF6B00] text-sm">{bankInfo.amount.toLocaleString("vi-VN")} VNĐ</span>
                      </div>

                      {/* Row 2: Số tài khoản */}
                      <div className="flex justify-between items-center py-4">
                        <span className="text-neutral-500 font-medium text-sm">Số tài khoản</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-800 text-sm tracking-wider font-mono">{bankInfo.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(bankInfo.accountNumber, "accountNumber")}
                            className="p-1.5 text-neutral-400 hover:text-[#FF6B00] hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                            title="Copy số tài khoản"
                          >
                            {copiedField === "accountNumber" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Row 3: Ngân hàng */}
                      <div className="flex justify-between items-center py-4">
                        <span className="text-neutral-500 font-medium text-sm">Ngân hàng</span>
                        <span className="font-semibold text-neutral-800 text-sm">{bankInfo.bankName}</span>
                      </div>

                      {/* Row 4: Chủ tài khoản */}
                      <div className="flex justify-between items-center py-4">
                        <span className="text-neutral-500 font-medium text-sm">Chủ tài khoản</span>
                        <span className="font-semibold text-neutral-800 text-sm uppercase">{bankInfo.accountName}</span>
                      </div>

                      {/* Row 5: Nội dung chuyển khoản */}
                      <div className="flex justify-between items-center py-4">
                        <span className="text-neutral-500 font-medium text-sm">Nội dung chuyển khoản</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-800 text-sm tracking-wider font-mono">{bankInfo.content}</span>
                          <button
                            onClick={() => copyToClipboard(bankInfo.content, "content")}
                            className="p-1.5 text-[#FF6B00] hover:text-[#CC5500] hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                            title="Copy nội dung"
                          >
                            {copiedField === "content" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulation info */}
                <div className="text-center text-[10px] text-neutral-400 select-none py-1">
                  (Mô phỏng: Click vào hình ảnh QR Code để giả lập thanh toán thành công)
                </div>
              </div>
            ) : (
              /* Card payment form */
              <div className="space-y-6">
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="text-left mb-2">
                    <h3 className="font-bold text-sm text-neutral-800">Điền thông tin thẻ</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Thông tin thẻ được bảo mật và chỉ dùng cho giao dịch này.</p>
                  </div>

                  {/* Row 1: Ngân hàng & Tên chủ thẻ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Ngân hàng <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Select
                          value={selectedBank}
                          onValueChange={(val) => {
                            if (val) {
                              setSelectedBank(val);
                              if (formErrors.selectedBank) {
                                setFormErrors((prev) => ({ ...prev, selectedBank: "" }));
                              }
                            }
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              formErrors.selectedBank ? "border-red-500 focus:border-red-500 focus-visible:border-red-500" : ""
                            )}
                          >
                            <SelectValue placeholder="Chọn ngân hàng của bạn" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="MB bank">
                              <BankIcon bank="MB bank" />
                              <span>MB bank</span>
                            </SelectItem>
                            <SelectItem value="Techcombank">
                              <BankIcon bank="Techcombank" />
                              <span>Techcombank</span>
                            </SelectItem>
                            <SelectItem value="Vietcombank">
                              <BankIcon bank="Vietcombank" />
                              <span>Vietcombank</span>
                            </SelectItem>
                            <SelectItem value="VietinBank">
                              <BankIcon bank="VietinBank" />
                              <span>VietinBank</span>
                            </SelectItem>
                            <SelectItem value="BIDV">
                              <BankIcon bank="BIDV" />
                              <span>BIDV</span>
                            </SelectItem>
                            <SelectItem value="ACB">
                              <BankIcon bank="ACB" />
                              <span>ACB</span>
                            </SelectItem>
                            <SelectItem value="TPBank">
                              <BankIcon bank="TPBank" />
                              <span>TPBank</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formErrors.selectedBank && (
                        <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{formErrors.selectedBank}</span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Tên chủ thẻ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập họ tên của bạn"
                        value={cardHolder}
                        onChange={handleCardHolderChange}
                        className={cn(
                          "w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-neutral-700 outline-none focus:border-[#FF6B00] transition-colors text-left",
                          formErrors.cardHolder ? "border-red-500 focus:border-red-500" : "border-[#E5E5E5]"
                        )}
                      />
                      {formErrors.cardHolder && (
                        <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{formErrors.cardHolder}</span>
                      )}
                    </div>
                  </div>

                  {/* Grouping div wrapping Số thẻ and (Ngày hết hạn + CVV) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Số thẻ */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Số thẻ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className={cn(
                          "w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-neutral-700 outline-none focus:border-[#FF6B00] transition-colors tracking-wider font-mono text-left",
                          formErrors.cardNumber ? "border-red-500 focus:border-red-500" : "border-[#E5E5E5]"
                        )}
                      />
                      {formErrors.cardNumber && (
                        <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{formErrors.cardNumber}</span>
                      )}
                    </div>

                    {/* Ngày hết hạn & CVV sub-grid - 3 columns of equal width */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Tháng */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-neutral-700 block whitespace-nowrap">
                          Ngày hết hạn <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Select
                            value={expiryMonth}
                            onValueChange={(val) => {
                              if (val) {
                                setExpiryMonth(val);
                                if (formErrors.expiryMonth) {
                                  setFormErrors((prev) => ({ ...prev, expiryMonth: "" }));
                                }
                              }
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                "px-3 py-2.5",
                                formErrors.expiryMonth ? "border-red-500 focus:border-red-500 focus-visible:border-red-500" : ""
                              )}
                            >
                              <SelectValue placeholder="Tháng" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              {Array.from({ length: 12 }).map((_, i) => {
                                const val = (i + 1).toString().padStart(2, "0");
                                return (
                                  <SelectItem key={val} value={val}>
                                    {val}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        {formErrors.expiryMonth && (
                          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">
                            {formErrors.expiryMonth}
                          </span>
                        )}
                      </div>

                      {/* Năm */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-transparent block select-none">
                          Năm
                        </label>
                        <div className="relative">
                          <Select
                            value={expiryYear}
                            onValueChange={(val) => {
                              if (val) {
                                setExpiryYear(val);
                                if (formErrors.expiryYear) {
                                  setFormErrors((prev) => ({ ...prev, expiryYear: "" }));
                                }
                              }
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                "px-3 py-2.5",
                                formErrors.expiryYear ? "border-red-500 focus:border-red-500 focus-visible:border-red-500" : ""
                              )}
                            >
                              <SelectValue placeholder="Năm" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              {Array.from({ length: 11 }).map((_, i) => {
                                const val = (2026 + i).toString();
                                return (
                                  <SelectItem key={val} value={val}>
                                    {val}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        {formErrors.expiryYear && (
                          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">
                            {formErrors.expiryYear}
                          </span>
                        )}
                      </div>

                      {/* CVV */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-neutral-700 block">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          placeholder="000"
                          value={cvv}
                          onChange={handleCvvChange}
                          className={cn(
                            "w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-neutral-700 outline-none focus:border-[#FF6B00] transition-colors text-left tracking-widest font-mono",
                            formErrors.cvv ? "border-red-500 focus:border-red-500" : "border-[#E5E5E5]"
                          )}
                        />
                        {formErrors.cvv && (
                          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{formErrors.cvv}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 select-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>Thông tin thẻ được mã hóa và bảo mật tuyệt đối</span>
                  </div>
                  <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setShowConfirmCancelModal(true)}
                      className="py-2.5 px-6 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium text-sm text-neutral-700 cursor-pointer w-full sm:w-auto text-center"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleValidateAndOpenConfirm}
                      className="py-2.5 px-6 rounded-xl bg-[#FF6B00] text-white hover:bg-[#CC5500] font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-orange-500/10 w-full sm:w-auto text-center whitespace-nowrap"
                    >
                      Xác nhận thanh toán
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Xác nhận thanh toán hóa đơn */}
      {showConfirmPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#E5E5E5] text-center space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button X */}
            <button
              onClick={() => setShowConfirmPaymentModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer animate-none"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Question Mark Green Icon */}
            <div className="mx-auto w-20 h-20 rounded-full border-4 border-[#22C55E] flex items-center justify-center text-[#22C55E] font-bold text-4xl">
              ?
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900">Xác nhận thanh toán hóa đơn</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Thanh toán hóa đơn <strong className="text-neutral-800">{bankInfo.content}</strong> với số tiền{" "}
                <strong className="text-[#FF6B00]">{computedTotal.toLocaleString("vi-VN")} VNĐ</strong>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmPaymentModal(false)}
                className="py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium text-sm text-neutral-700 cursor-pointer"
              >
                Không
              </button>
              <button
                onClick={() => {
                  setShowConfirmPaymentModal(false);
                  setShowSuccessModal(true);
                }}
                className="py-2.5 bg-[#22C55E] text-white rounded-xl hover:bg-[#1E9E4C] font-semibold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Có, tôi đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal: Xác nhận hủy thanh toán */}
      {showConfirmCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#E5E5E5] text-center space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button X */}
            <button
              onClick={() => setShowConfirmCancelModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer animate-none"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Question Mark Red Icon */}
            <div className="mx-auto w-20 h-20 rounded-full border-4 border-[#EF4444] flex items-center justify-center text-[#EF4444] font-bold text-4xl">
              ?
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900">Xác nhận hủy thanh toán</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Bạn có chắc chắn muốn hủy không? Thông tin sẽ không được lưu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmCancelModal(false)}
                className="py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium text-sm text-neutral-700 cursor-pointer"
              >
                Không
              </button>
              <button
                onClick={() => {
                  setShowConfirmCancelModal(false);
                  onCancel();
                }}
                className="py-2.5 bg-[#EF4444] text-white rounded-xl hover:bg-[#D32F2F] font-semibold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Có, tôi đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal: Đăng ký lịch tập thành công */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-[#E5E5E5] text-center space-y-6 animate-in zoom-in-95 duration-200">
            {/* Green animated badge check */}
            <div className="mx-auto w-16 h-16 rounded-full bg-[#E8F8F0] flex items-center justify-center text-[#22C55E]">
              <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-white">
                <Check className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-neutral-900">Đăng ký lịch tập thành công</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Hóa đơn đã được cập nhật và xuất thành công.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="border border-[#E5E5E5] rounded-2xl overflow-hidden text-left text-sm">
              <div className="bg-neutral-50 px-4 py-3 border-b border-[#E5E5E5] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span className="text-xs font-bold text-neutral-500 tracking-wider">BIÊN LAI THANH TOÁN</span>
              </div>
              <div className="divide-y divide-[#E5E5E5]">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-neutral-500">Mã hóa đơn</span>
                  <span className="font-semibold text-neutral-800 font-mono">{bankInfo.content}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-neutral-500">Dịch vụ</span>
                  <span className="font-semibold text-neutral-800">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-neutral-400">Khách hàng</span>
                  <span className="font-semibold text-neutral-800">Nguyễn Văn A</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-neutral-500">Hình thức</span>
                  <span className="font-semibold text-neutral-800">
                    {paymentMethod === "transfer" ? "Chuyển khoản QR" : "Thẻ ngân hàng"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-neutral-500">Thời gian</span>
                  <span className="font-semibold text-neutral-800">
                    23:50:18 3/6/2026
                  </span>
                </div>
                <div className="flex justify-between px-4 py-4 bg-neutral-50/50">
                  <span className="font-semibold text-neutral-800">Tổng thanh toán</span>
                  <span className="font-bold text-xl text-[#FF6B00]">
                    {computedTotal.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => alert("Tính năng lịch sử thanh toán đang được phát triển!")}
                className="py-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium text-sm text-neutral-700 cursor-pointer"
              >
                Xem lịch sử
              </button>
              <button
                onClick={handleReturnHome}
                className="py-3 bg-[#FF6B00] text-white rounded-xl hover:bg-[#CC5500] font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-orange-500/10"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
