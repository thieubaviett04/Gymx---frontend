import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  featured?: boolean;
 showDiscount?: boolean;
  onRegister?: () => void;
  onDetail?: () => void;
};

export default function PackageCard({
  id,
  name,
  duration,
  price,
  description,
  featured,
  showDiscount,
  onRegister,
  onDetail,
}: Props) {
  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden font-sans h-full min-h-[220px]",
        featured
          ? "border-[#FF6B00] border-2 shadow-[#FF6B00]/5"
          : "border-neutral-200"
      )}
    >
      {/* Featured Ribbon / Badge */}
      {featured && (
<div className="absolute right-0 top-0 bg-gradient-to-l from-[#FF6B00] to-[#FF8833] text-white text-[7.5px] font-bold uppercase px-2 py-0.75 rounded-bl-md shadow-xs select-none">
  🔥 PHỔ BIẾN NHẤT
</div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-neutral-800 leading-tight group-hover:text-[#FF6B00] transition-colors">
            {name}
          </h3>

          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] text-neutral-600 border border-neutral-200/50 font-mono font-bold shrink-0">
            {id}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-xs leading-relaxed text-neutral-500 ">
          {description}
        </p>

        {/* Duration & Price Row matching design */}
        <div className="space-y-2 font-sans">

  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
    <Clock3 size={14} />
    <span>
      Thời hạn:
      <span className="font-bold text-neutral-900">
        {" "}
        {duration}
      </span>
    </span>
  </div>

<div className="flex items-center justify-end gap-2">

  {showDiscount && (
    <span className="text-[10px] text-neutral-400 line-through">
      500.000 VNĐ
    </span>
  )}

  <span className="text-2xl font-extrabold text-[#FF6B00]">
    {price}
  </span>

  {showDiscount && (
    <span className="rounded bg-[#FFF0E5] px-1.5 py-0.5 text-[9px] font-bold text-[#FF6B00] border border-[#FF6B00]/10">
      -50%
    </span>
  )}

</div>
</div></div>
      {/* Buttons */}
      <div className="mt-2 grid grid-cols-[112px_minmax(0,1fr)] gap-3 border-t border-neutral-100 pt-2">
        <button
          type="button"
          onClick={onDetail}
          className="flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-700 shadow-xs transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
        >
          Xem chi tiết
        </button>

        <button
          type="button"
          onClick={onRegister}
          className="flex h-10 min-w-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8833] px-4 text-xs font-bold text-white shadow-sm shadow-[#FF6B00]/10 transition hover:from-[#CC5500] hover:to-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/15"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}
