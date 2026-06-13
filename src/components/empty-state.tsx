type Props = {
  onClear: () => void;
};

export default function EmptyState({
  onClear,
}: Props) {
  return (
    <div
      className="
        flex
        h-[420px]
        flex-col
        items-center
        justify-center
        rounded-xl
        bg-white
        font-sans
      "
    >
      <div className="mb-4 text-6xl">
        📄
      </div>

      <p className="mb-4 text-gray-500">
        Vui lòng thử tìm kiếm lại hoặc điều chỉnh bộ lọc
      </p>

      <button
        onClick={onClear}
        className="
          rounded-lg
          bg-orange-500
          px-5
          py-2
          text-sm
          text-white
          hover:bg-orange-600
        "
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}