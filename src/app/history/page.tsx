"use client";

import { HomeLayout } from "@/components/home-layout";
import HistoryLayout from "@/components/history-layout";
import { Clock3 } from "lucide-react";

export default function HistoryPage() {
  return (
    <HomeLayout
      pageTitle="Lịch sử tập"
      pageSubtitle="Chọn một buổi tập để xem chi tiết và thực hiện đánh giá"
    >
      <HistoryLayout />
    </HomeLayout>
  );
}
