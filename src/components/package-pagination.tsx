type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  pageSize: number;
  setPageSize: (size: number) => void;

  totalItems: number;
};

export default function PackagePagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
  totalItems,
}: Props) {
  return (
    <div className="mt-6 flex items-center text-sm text-white font-sans">
      {/* Left */}
      <div className="flex w-[320px] items-center gap-2">
        <span>Hiển thị</span>

        <select
          value={pageSize}
          onChange={(e) =>
            setPageSize(
              Number(e.target.value)
            )
          }
          className="
            rounded-md
            border
            border-gray-300
            bg-white
            px-3
            py-1
            text-black
          "
        >
          <option value={3}>
            03
          </option>

          <option value={6}>
            06
          </option>
        </select>

        <span>
          trong tổng {totalItems} gói tập
        </span>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-4">

        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          className={`
            ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white"
            }
          `}
        >
          &lt; Trước
        </button>

        {/* Pages */}
        {Array.from(
          { length: totalPages },
          (_, i) => (
            <button
              key={i}
              onClick={() =>
                onPageChange(i + 1)
              }
              className={
                currentPage === i + 1
                  ? `
                    rounded
                    bg-orange-500
                    px-3
                    py-1
                    text-white
                  `
                  : `
                    hover:text-orange-400
                  `
              }
            >
              {i + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          className={`
            ${
              currentPage ===
              totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white"
            }
          `}
        >
          Tiếp &gt;
        </button>

      </div>
    </div>
  );
}