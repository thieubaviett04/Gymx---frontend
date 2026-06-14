"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { HomeLayout } from "@/components/home-layout";
import { PaymentView } from "@/components/payment-view";
import { Button } from "@/components/ui/button";
import { GymDB, type Payment } from "@/lib/mock-db";

type CheckoutAddon = {
  id: string;
  name: string;
  price: number;
};

type PendingCheckout = {
  id: string;
  source: "membership" | "pt";
  packageId?: string;
  packageName: string;
  duration?: string;
  startDate?: string;
  trainerName?: string;
  timeSlot?: string;
  durationLabel?: string;
  endTime?: string;
  selectedAddons?: CheckoutAddon[];
  amount: number;
  createdAt: string;
};

const parsePrice = (amount: number) => amount || 0;

const getDurationMonths = (duration?: string) => {
  if (!duration) return 1;
  const match = duration.match(/(\d+)\s*tháng/i);
  return match ? Number(match[1]) : 1;
};

const parseDateValue = (dateValue?: string) => {
  if (!dateValue) return new Date();

  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) return new Date();

  return new Date(year, month - 1, day);
};

const toDisplayDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}/${date.getFullYear()}`;

const formatDateTime = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

export default function PaymentPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useState<PendingCheckout | null>(null);

  useEffect(() => {
    const loadId = window.setTimeout(() => {
      const rawCheckout = localStorage.getItem("gym_pending_payment");
      if (!rawCheckout) return;

      try {
        setCheckout(JSON.parse(rawCheckout) as PendingCheckout);
      } catch {
        localStorage.removeItem("gym_pending_payment");
      }
    }, 0);

    return () => window.clearTimeout(loadId);
  }, []);

  const paymentData = useMemo(() => {
    if (!checkout) return null;

    const start = parseDateValue(checkout.startDate);
    const end = new Date(start);
    const durationMonths = checkout.source === "membership" ? getDurationMonths(checkout.duration) : 1;
    end.setMonth(end.getMonth() + durationMonths);
    const addonsTotal = (checkout.selectedAddons ?? []).reduce((sum, addon) => sum + addon.price, 0);

    return {
      selectedPackage: {
        id: checkout.packageId ?? checkout.id,
        code: checkout.packageId ?? checkout.id,
        name: checkout.packageName,
        price: Math.max(parsePrice(checkout.amount) - addonsTotal, 0),
        duration: durationMonths,
      },
      startDate: toDisplayDate(start),
      endDate: toDisplayDate(end),
      selectedAddons: checkout.selectedAddons ?? [],
      totalAmount: checkout.amount,
      billDetails:
        checkout.source === "pt"
          ? {
              trainerName: checkout.trainerName ?? checkout.packageName,
              date: toDisplayDate(start),
              timeSlot: checkout.timeSlot ?? "--",
              duration: checkout.durationLabel ?? checkout.duration ?? "--",
              endTime: checkout.endTime ?? "--",
            }
          : undefined,
    };
  }, [checkout]);

  const handlePaymentSuccess = (payment: {
    method: "QR Code" | "ATM";
    amount: number;
    planName: string;
  }) => {
    if (!checkout) return;

    const newPayment: Payment = {
      id: `PM-${Math.floor(Math.random() * 90000) + 10000}`,
      userId: "M001",
      userName: "Nguyễn Văn An",
      amount: payment.amount,
      paymentDate: formatDateTime(new Date()),
      planName: payment.planName,
      method: payment.method,
      status: "SUCCESS",
    };

    GymDB.setPayments([newPayment, ...GymDB.getPayments()]);
    localStorage.removeItem("gym_pending_payment");
    router.push("/");
  };

  const isMembership = checkout?.source === "membership";
  const pageTitle = checkout ? (isMembership ? "Đăng ký gói tập" : "Đăng ký lịch tập với HLV") : "Thanh toán";

  const pageSubtitle = checkout ? (
    <div className="flex items-center gap-4 text-sm text-white/85">
      <span>{isMembership ? "Đăng ký gói tập" : "Đăng ký lịch tập với HLV"}</span>
      <span className="text-white/60">›</span>
      <span>Form đăng ký</span>
      <span className="text-white/60">›</span>
      <span className="font-semibold text-white">Thanh toán</span>
    </div>
  ) : (
    <div className="flex items-center gap-4 text-sm text-white/85">
      <span>Thanh toán</span>
    </div>
  );

  return (
    <HomeLayout
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
    >
      <div className="mb-6 flex">
        <div className="flex select-none items-center gap-2 rounded-xl border border-neutral-100 bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-sm animate-in fade-in duration-300">
          <span className="h-5 w-1.5 rounded-full bg-[#FF6B00]" />
          Thanh toán
        </div>
      </div>

      {!paymentData ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-10 text-center shadow-sm">
          <ReceiptText className="mx-auto mb-4 h-14 w-14 text-[#FF6B00]" />
          <h2 className="text-lg font-bold text-neutral-900">Chưa có hóa đơn cần thanh toán</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Vui lòng quay lại trang đăng ký gói tập để tạo hóa đơn mới.
          </p>
          <Button
            type="button"
            onClick={() => router.push("/memberships")}
            className="mt-6 rounded-xl bg-[#FF6B00] px-5 text-xs font-bold text-white hover:bg-[#CC5500]"
          >
            Quay lại đăng ký
          </Button>
        </div>
      ) : (
        <PaymentView
          selectedPackage={paymentData.selectedPackage}
          startDate={paymentData.startDate}
          endDate={paymentData.endDate}
          selectedAddons={paymentData.selectedAddons}
          totalAmount={paymentData.totalAmount}
          billDetails={paymentData.billDetails}
          onCancel={() => router.push(checkout?.source === "pt" ? "/register-pt?cancelled=true" : "/memberships?cancelled=true")}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </HomeLayout>
  );
}
