import { Clock3 } from "lucide-react";

type Props = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  featured?: boolean;
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
  onRegister,
  onDetail,
}: Props) {
  return (
    <div
      className={`
        rounded-xl
        bg-white
        p-4
        shadow-md
        transition
        hover:-translate-y-1
        hover:shadow-xl
        font-sans
        ${
          featured
            ? "ring-3 ring-orange-400 shadow-lg shadow-orange-100"
            : ""
        }
      `}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-xl font-semibold">
          {name}
        </h3>

        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
          {id}
        </span>
      </div>

      {/* Description */}
      <p className="mb-3 min-h-[48px] text-sm text-gray-500">
        {description}
      </p>

      {/* Duration */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
        <Clock3 size={14} />

        <span>
          Thời hạn:
          <span className="ml-1 font-semibold">
            {duration}
          </span>
        </span>
      </div>

      {featured ? (
        <div className="mb-3 flex items-center justify-end">
          <span className="mr-2 text-sm text-gray-400 line-through">
            500.000 VNĐ
          </span>

          <span className="text-2xl font-bold text-orange-500">
            {price}
          </span>

          <span className="ml-1 rounded bg-yellow-200 px-2 py-1 text-xs font-semibold text-orange-500">
            -50%
          </span>
        </div>
      ) : (
        <div className="mb-3 flex h-[31px] items-center justify-end">
          <span className="text-2xl font-bold text-orange-500">
            {price}
          </span>
        </div>
      )}

      <hr className="mb-3 border-gray-200" />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onDetail}
          className="
            w-[120px]
            rounded-lg
            border
            border-gray-300
            py-2
            text-sm
          "
        >
          Xem chi tiết
        </button>

        <button
          onClick={onRegister}
          className="
            flex-1
            rounded-lg
            bg-orange-500
            py-2
            text-sm
            text-white
            hover:bg-orange-600
          "
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}