import { ChevronDown, Search } from "lucide-react";

type Props = {
  durationFilter: string;
  setDurationFilter: (value: string) => void;

  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function FilterBar({
  durationFilter,
  setDurationFilter,
  searchTerm,
  setSearchTerm,
}: Props) {
  return (
    <div className="mb-4 flex items-center font-sans">

      {/* Tiêu đề */}
      <div className="relative">
        <div className="rounded-lg bg-white px-6 py-3 shadow-md">
          <span className="text-lg font-medium text-orange-700">
            Chọn gói tập
          </span>
        </div>

        <div className="absolute left-0 top-4 h-6 w-1 rounded-r bg-orange-500"></div>
      </div>

      {/* Bộ lọc */}
      <div className="ml-auto flex items-center gap-2">

        {/* Thời hạn */}
        <div className="relative">
          <select
            value={durationFilter}
            onChange={(e) =>
              setDurationFilter(e.target.value)
            }
            className="
              h-10
              min-w-[180px]
              appearance-none
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              pr-12
              text-sm
              text-gray-600
              shadow-sm
              outline-none
            "
          >
            <option value="all">Tất cả thời hạn</option>
            <option value="3">&le; 3 tháng</option>
            <option value="6">&le; 6 tháng</option>
            <option value="gt6">&gt; 6 tháng</option>
          </select>

          <ChevronDown
            size={16}
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />
        </div>

        {/* Sắp xếp */}
        <div className="relative">
          <select
            className="
              h-10
              min-w-[160px]
              appearance-none
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              pr-12
              text-sm
              text-gray-600
              shadow-sm
              outline-none
            "
          >
            <option>Mặc định</option>
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
          </select>

          <ChevronDown
            size={16}
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />
        </div>

        {/* Tìm kiếm */}
        <div
          className="
            flex
            h-10
            items-center
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            shadow-sm
          "
        >
          <Search
            size={16}
            className="mr-2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Tìm gói tập theo mã, tên"
            className="
              w-[300px]
              border-none
              bg-transparent
              text-sm
              outline-none
            "
          />
        </div>

      </div>

    </div>
  );
}