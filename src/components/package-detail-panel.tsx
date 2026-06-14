import { CheckCircle2, Phone, X } from "lucide-react";

type SelectedPackage = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
  selectedPackage?: SelectedPackage | null;
};

export default function PackageDetailPanel({
  open,
  onClose,
  onRegister,
  selectedPackage,
}: Props) {
  if (!selectedPackage) return null;

  // Dynamic benefits based on package tier/id
  const getBenefits = (id: string) => {
    const normId = id.toUpperCase();
    if (normId === "GT001" || normId === "GT002") {
      return [
        "Truy cập phòng tập tất cả các giờ",
        "Đầy đủ trang thiết bị Gym & Cardio",
        "Sử dụng tủ đồ cá nhân & phòng tắm",
        "Nước uống tinh khiết miễn phí",
      ];
    } else if (normId === "GT003") {
      return [
        "Truy cập phòng tập tất cả các giờ",
        "Đầy đủ trang thiết bị Gym & Cardio",
        "Đo chỉ số cơ thể InBody miễn phí",
        "Sử dụng xông hơi & tắm khoáng",
      ];
    } else if (normId === "GT004") {
      return [
        "Truy cập không giới hạn tất cả cơ sở",
        "Tham gia các lớp Group X (Yoga, Zumba...)",
        "Đo chỉ số InBody & 1 buổi định hướng với PT",
        "Xông hơi khô/ướt & Tắm khoáng nóng",
      ];
    } else if (normId === "GT005" || normId === "GT007") {
      return [
        "Huấn luyện viên cá nhân 1-1 kèm sát",
        "Thiết kế giáo án tập luyện riêng biệt",
        "Tư vấn thực đơn dinh dưỡng hàng ngày",
        "Hỗ trợ đo InBody & đánh giá hàng tuần",
      ];
    } else if (normId === "GT006" || normId === "GT009") {
      return [
        "Đặc quyền VIP sử dụng toàn bộ tiện ích",
        "Tủ đồ VIP riêng & miễn phí khăn tập hàng ngày",
        "Mời 1 người bạn tập cùng (1 lần/tháng)",
        "Xông hơi VIP, tắm khoáng & bể sục jacuzzi",
      ];
    }
    return [
      "Sử dụng thiết bị hiện đại",
      "Tủ đồ cá nhân an toàn",
      "Hỗ trợ tư vấn luyện tập",
    ];
  };

  const isFeatured = selectedPackage.id === "GT001";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/60 backdrop-blur-xs
          transition-opacity duration-300
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Panel */}
      <div
        className={`
          fixed right-0 top-0 z-50
          h-screen w-full max-w-sm sm:w-[380px]
          bg-[#FFFDFB]
          border-l border-neutral-200
          shadow-2xl
          transition-transform duration-300 ease-in-out
          font-sans flex flex-col justify-between
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="relative border-b border-neutral-100 p-5 flex-none bg-white">
          <div
            className="
              absolute
              left-0
              top-5
              h-6
              w-1
              rounded-r
              bg-gradient-to-b from-[#FF6B00] to-[#FF8833]
            "
          />

          <div className="flex items-center justify-between">
            <h2 className="pl-4 font-bold text-neutral-800 text-base">
              Chi tiết gói tập
            </h2>

            <button
              onClick={onClose}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full
                bg-neutral-100 hover:bg-neutral-200/60
                text-neutral-500 hover:text-neutral-800
                transition-colors cursor-pointer
              "
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-extrabold text-neutral-900 leading-tight">
                {selectedPackage.name}
              </h3>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 font-mono font-bold border border-neutral-200/50 shrink-0">
                {selectedPackage.id}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              GymMax Strength & Fitness Club
            </p>
          </div>

          {/* Duration info */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
              Thời hạn sử dụng
            </p>
            <div
              className="
                rounded-xl
                border
                border-neutral-200
                bg-neutral-50
                px-4
                py-3
                text-sm
                font-bold
                text-neutral-800
              "
            >
              {selectedPackage.duration}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
              Mô tả chi tiết
            </p>
            <p className="text-sm text-neutral-650 leading-relaxed font-light">
              {selectedPackage.description}
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
              Quyền lợi hội viên
            </p>
            <ul className="space-y-3 text-sm">
              {getBenefits(selectedPackage.id).map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5 text-neutral-700">
                  <CheckCircle2
                    size={16}
                    className="text-white fill-[#FF6B00] shrink-0 mt-0.5"
                  />
                  <span className="font-medium text-neutral-700 leading-tight">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing Actions Block */}
        <div
          className="
            flex-none
            border-t border-neutral-150
            bg-white
            p-6
            space-y-4
            shadow-inner-xs
          "
        >
          {/* Savings Tag */}
          <div
            className={`
              inline-block
              rounded-lg
              px-2.5
              py-1
              text-[10px]
              font-extrabold
              tracking-wider
              ${isFeatured 
                ? "bg-[#FFF0E5] text-[#FF6B00] border border-[#FF6B00]/10" 
                : "bg-neutral-100 text-neutral-600 border border-neutral-200/50"}
            `}
          >
            {isFeatured ? "TIẾT KIỆM TỚI 50%" : "ĐĂNG KÝ NGAY HÔM NAY"}
          </div>

          {/* Price Label */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-neutral-400 font-medium">Tổng phí gói tập</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-[#FF6B00]">
                  {selectedPackage.price.replace(" VNĐ", "")}
                </span>
                <span className="text-xs font-bold text-neutral-500">
                  VNĐ / {selectedPackage.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={onRegister}
            className="
              w-full
              rounded-xl
              py-3
              text-sm
              font-bold
              text-white
              transition
              shadow-lg shadow-[#FF6B00]/10
              cursor-pointer
              bg-gradient-to-r from-[#FF6B00] to-[#FF8833]
              hover:from-[#CC5500] hover:to-[#FF6B00]
              hover:shadow-xl hover:shadow-[#FF6B00]/15
            "
          >
            Đăng ký gói này ngay
          </button>

          {/* Hotline Contact */}
          <div
            className="
              text-center
              text-xs
              text-neutral-450
              pt-1
            "
          >
            Hoặc gọi hotline tư vấn 24/7
            <span className="ml-2 inline-flex items-center gap-1 font-bold text-neutral-700">
              <Phone className="h-3.5 w-3.5 fill-[#22C55E]/10 text-[#22C55E]" />
              1900 1234
            </span>
          </div>
        </div>
      </div>
    </>
  );
}