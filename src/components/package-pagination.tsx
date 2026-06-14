import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalItems: number;
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export default function PackagePagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
  totalItems,
}: Props) {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-6 flex flex-col gap-4 font-sans text-xs text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-neutral-200">
        <span>Hiển thị</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            setPageSize(Number(value));
            onPageChange(1);
          }}
        >
          <SelectTrigger className="h-8 w-[74px] rounded-md border-0 bg-white px-3 py-0 text-xs font-semibold text-neutral-800 shadow-sm [&_svg]:text-[#FF6B00]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-xl">
            <SelectItem value="3">03</SelectItem>
            <SelectItem value="6">06</SelectItem>
            <SelectItem value="9">09</SelectItem>
          </SelectContent>
        </Select>
        <span>trong tổng {totalItems} gói tập</span>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-7 rounded-md px-1.5 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          ‹ Trước
        </Button>

        {visiblePages.map((page, index) => {
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
              onClick={() => onPageChange(pageNum)}
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
          onClick={() => onPageChange(currentPage + 1)}
          className="h-7 rounded-md px-1.5 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          Tiếp ›
        </Button>
      </div>
    </div>
  );
}
