// type Props = {
//   open: boolean;
//   onClose: () => void;
// };

// export default function PackageDetailPanel({
//   open,
//   onClose,
// }: Props) {
//   return (
//     <>
//       {/* Overlay */}
//       <div
//         onClick={onClose}
//         className={`
//           fixed inset-0 z-40
//           bg-black/50
//           transition-opacity
//           ${open ? "opacity-100" : "pointer-events-none opacity-0"}
//         `}
//       />

//       {/* Panel */}
//       <div
//         className={`
//           fixed right-0 top-0 z-50
//           h-screen w-[340px]
//           bg-white
//           shadow-2xl
//           transition-transform duration-300
//           ${open ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         <div className="flex items-center justify-between border-b p-4">

//           <h2 className="font-semibold">
//             Chi tiết gói tập
//           </h2>

//           <button
//             onClick={onClose}
//             className="text-xl text-gray-500"
//           >
//             ×
//           </button>

//         </div>

//         <div className="p-4">

//           <div className="mb-4 flex items-center justify-between">

//             <h3 className="text-xl font-bold">
//               Gói 1 tháng cơ bản
//             </h3>

//             <span className="rounded bg-gray-100 px-2 py-1 text-xs">
//               GT001
//             </span>

//           </div>

//           <div className="mb-4">
//             <p className="mb-2 font-medium">
//               Thời hạn
//             </p>

//             <div className="rounded border p-3">
//               1 tháng
//             </div>
//           </div>

//           <div className="mb-4">
//             <p className="mb-2 font-medium">
//               Mô tả
//             </p>

//             <p className="text-sm text-gray-500">
//               Gói ngắn hạn phù hợp cho người mới bắt đầu tìm hiểu phòng gym.
//             </p>
//           </div>

//           <div className="mb-6">
//             <p className="mb-3 font-medium">
//               Quyền lợi
//             </p>

//             <ul className="space-y-2 text-sm text-gray-600">
//               <li>✓ Sử dụng thiết bị cơ bản</li>
//               <li>✓ Sử dụng khu tắm khoáng</li>
//               <li>✓ Xông hơi</li>
//               <li>✓ Tủ đồ cá nhân</li>
//             </ul>
//           </div>

//           <div className="border-t pt-4">

//             <p className="text-xs text-gray-400">
//               GIÁ DỊCH VỤ
//             </p>

//             <div className="mb-4 text-3xl font-bold text-orange-500">
//               250.000đ
//             </div>

//             <button
//               className="
//                 w-full
//                 rounded-lg
//                 bg-orange-500
//                 py-3
//                 text-white
//               "
//             >
//               Đăng ký ngay
//             </button>

//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// code mới
import { CheckCircle2 } from "lucide-react";
import { Phone } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
};

export default function PackageDetailPanel({
  open,
  onClose,
  onRegister,
}: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/50
          transition-opacity
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Panel */}
      <div
        className={`
          fixed right-0 top-0 z-50
          h-screen w-[360px]
          bg-[#FFFDFB]
          border-l border-orange-100
          shadow-2xl
          transition-transform duration-300
          font-sans
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="relative border-b p-4">
          <div
            className="
              absolute
              left-0
              top-4
              h-8
              w-1
              rounded-r
              bg-orange-500
            "
          />

          <div className="flex items-center justify-between">
            <h2 className="pl-4 font-semibold text-gray-800">
              Chi tiết gói tập
            </h2>

            <button
              onClick={onClose}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full
                bg-orange-50
                text-xl
                text-gray-500
              "
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">
              Gói 1 tháng cơ bản
            </h3>

            <span className="rounded bg-gray-100 px-2 py-1 text-xs">
              GT001
            </span>
          </div>

          <div className="mb-4">
            <p className="mb-2 font-medium">
              Thời hạn
            </p>

            <div
              className="
                rounded-lg
                border
                border-orange-200
                bg-orange-50/40
                px-4
                py-3
                text-gray-700
              "
            >
              1 tháng
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 font-medium">
              Mô tả
            </p>

            <p className="text-sm text-gray-500">
              Tiết kiệm 50% so với gói 1 tháng, dùng đầy đủ thiết bị cao cấp.
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-2 font-medium">
              Quyền lợi
            </p>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-1">
                <CheckCircle2
                  size={16}
                  className="text-white fill-orange-400"
                />
                Sử dụng thiết bị cao cấp
              </li>

              <li className="flex items-center gap-1">
                <CheckCircle2
                  size={16}
                  className="text-white fill-orange-400"
                />
                Sử dụng khu tắm khoáng
              </li>

              <li className="flex items-center gap-1">
                <CheckCircle2
                  size={16}
                  className="text-white fill-orange-400"
                />
                Xông hơi
              </li>
            </ul>
          </div>

          <div
            className="
              mt-6
              rounded-xl
              border
              border-orange-200
              bg-orange-50/40
              p-4
            "
          >
            {/* Tag */}
            <div
              className="
                mb-3
                inline-block
                rounded-md
                bg-orange-100
                px-2
                py-1
                text-xs
                font-semibold
                text-orange-500
              "
            >
              TIẾT KIỆM TỚI 50%
            </div>

            {/* Giá */}
            <div className="mb-4 flex items-end">
              <div className="text-3xl font-bold text-orange-500">
                250.000đ
              </div>

              <div className="mb-1 ml-2 text-sm text-gray-500">
                /1 tháng
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onRegister}
              className="
                mb-4
                w-full
                rounded-lg
                bg-orange-500
                py-2
                text-white
                hover:bg-orange-600
              "
            >
              Đăng ký ngay →
            </button>

            {/* Hotline */}
            <div
              className="
                text-center
                text-sm
                text-gray-500
              "
            >
              Hoặc liên hệ tư vấn

              <span className="ml-2 inline-flex items-center gap-1 font-semibold text-gray-700">
                <Phone className="h-4 w-4 fill-green-500/10 text-green-500" />
                1900 1234
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}