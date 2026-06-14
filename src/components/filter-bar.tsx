"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type Props = {
  durationFilter: string;
  setDurationFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const durationLabels: Record<string, string> = {
  all: "Tất cả thời hạn",
  "3": "≤ 3 tháng",
  "6": "≤ 6 tháng",
  gt6: "> 6 tháng",
};

const sortLabels: Record<string, string> = {
  default: "Mặc định",
  "price-asc": "Giá tăng dần",
  "price-desc": "Giá giảm dần",
};

export default function FilterBar({
  durationFilter,
  setDurationFilter,
  searchTerm,
  setSearchTerm,
}: Props) {
  const [sortValue, setSortValue] = useState("default");

  return (
    <div className="mb-6 flex flex-col gap-4 font-sans md:flex-row md:items-center">
      <div className="flex w-fit select-none items-center rounded-xl border border-neutral-100 bg-white px-4 py-2.5 shadow-2xs">
        <div className="mr-2.5 h-4 w-1 rounded-full bg-[#FF6B00]" />
        <span className="text-sm font-bold text-neutral-800">
          Danh sách gói tập
        </span>
      </div>

      <div className="flex w-full flex-wrap items-center gap-3 md:ml-auto md:w-auto">
        <div className="flex-1 md:flex-none">
          <Select value={durationFilter} onValueChange={(val) => setDurationFilter(val || "all")}>
            <SelectTrigger className="h-10 w-full rounded-xl border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 shadow-2xs md:min-w-[180px]">
              <span>{durationLabels[durationFilter] ?? "Tất cả thời hạn"}</span>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-xl">
              <SelectItem value="all">Tất cả thời hạn</SelectItem>
              <SelectItem value="3">&le; 3 tháng</SelectItem>
              <SelectItem value="6">&le; 6 tháng</SelectItem>
              <SelectItem value="gt6">&gt; 6 tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 md:flex-none">
          <Select value={sortValue} onValueChange={(value) => setSortValue(value || "default")}>
            <SelectTrigger className="h-10 w-full rounded-xl border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 shadow-2xs md:min-w-[160px]">
              <span>{sortLabels[sortValue] ?? "Mặc định"}</span>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-xl">
              <SelectItem value="default">Mặc định</SelectItem>
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex h-10 min-w-[280px] flex-1 items-center rounded-xl border border-neutral-200 bg-white px-3 shadow-2xs transition-colors focus-within:border-[#FF6B00] focus-within:ring-1 focus-within:ring-[#FF6B00] md:w-[320px] md:flex-none">
          <Search size={16} className="mr-2 text-[#FF6B00] stroke-[2.5]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm gói tập theo mã, tên..."
            className="w-full border-none bg-transparent text-sm text-neutral-850 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}
