import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterModal({
  open,
  onClose,
}: Props) {
    const [startDate, setStartDate] =
  useState("");

const handleClose = () => {
  setStartDate("");
  setShowDateError(false);
  setDateErrorMessage("");
  setShowWarning(false);
  setBenefits([]);
  onClose();
};
const [showDateError, setShowDateError] =
  useState(false);

const [dateErrorMessage, setDateErrorMessage] =
  useState("");

const [showWarning, setShowWarning] =
  useState(false);

  const [benefits, setBenefits] =
  useState<string[]>([]);

const basePrice = 250000;

const totalPrice =
  basePrice +
  benefits.length * 50000;
const now = new Date();

const today =
  `${now.getFullYear()}-${
    String(now.getMonth() + 1).padStart(2, "0")
  }-${
    String(now.getDate()).padStart(2, "0")
  }`;
let endDate = "";

if (startDate) {
  const date = new Date(startDate);

  date.setMonth(
    date.getMonth() + 1
  );

  endDate = date.toLocaleDateString(
    "en-US"
  );
}

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed inset-0
          z-40
          bg-black/50
        "
      />

{showWarning && (
<div
  className="
    fixed
    left-1/2
    top-5
    z-[60]
    flex
    w-[320px]
    -translate-x-1/2
    items-center
    rounded-full
    bg-white
    px-2
    py-1.5
    shadow-lg
    font-sans
  "
>
    <div
      className="
        flex
    h-8
    w-8
    items-center
    justify-center
    rounded-full
    bg-yellow-500
    text-sm
    font-bold
    text-white
      "
    >
      !
    </div>

    <span className="ml-3 text-sm">
      Vui lòng chọn 1 ngày bắt đầu!
    </span>
          <button className="flex items-center justify-center ml-auto mr-2 text-3xl font-light leading-non">
          ×
        </button>
  </div>
)}

      {/* Modal */}
 <div
  className="
    fixed
    left-1/2
    top-[53%]
    z-50
    w-[520px]
    -translate-x-1/2
    -translate-y-1/2
    rounded-xl
    bg-white
    p-5
    shadow-2xl
    font-sans
  "
>
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Đăng ký gói tập
            </h2>

            <p className="text-sm text-gray-500">
              Kiểm tra lại thông tin trước khi hoàn tất đăng ký
            </p>
          </div>

          <button
            onClick={handleClose}
              className="
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    text-3xl
    text-gray-500
    hover:bg-gray-100
  "
          >
            ×
          </button>

        </div>

       <div className="mt-3">

  {/* Header */}
  <div className="mb-4 flex items-center justify-between">

    <h3 className="font-semibold text-lg">
      Gói 1 tháng cơ bản
    </h3>

    <span
      className="
        rounded
        bg-gray-100
        px-3
        py-1
        text-xs
        text-gray-500
      "
    >
      GT001
    </span>

  </div>

  {/* Thời hạn */}
  <div className="mb-4">

    <label className="mb-1 block text-sm font-semibold">
      Thời hạn
    </label>

    <input
      disabled
      value="1 tháng"
      className="
        w-full
        rounded-lg
        border
        bg-gray-100
        text-gray-600
        font-medium
        p-2
      "
    />

  </div>

  {/* Giá gói */}
  <div className="mb-4">

    <label className="mb-1 block text-sm font-semibold">
      Giá gói
    </label>

  <input
  disabled
  value="250.000"
  className="
    w-full
    rounded-lg
    border
    bg-gray-100
    p-2
    text-lg
    font-semibold
    text-gray-600
  "
/>

  </div>

  {/* Ngày */}
  <div className="mb-4 grid grid-cols-2 gap-3">

    <div>

      <label className="mb-1 block text-sm font-semibold">
        Ngày bắt đầu
      </label>

<input
  type="date"
  min={today}
  value={startDate}
onChange={(e) => {
  setStartDate(e.target.value);
  setShowDateError(false);
  setDateErrorMessage("");
}}

  className={`
    w-full
    rounded-lg
    p-2
    ${
      showDateError
        ? "border border-red-500 ring-1 ring-red-200"
        : "border"
    }
  `}
/>
    
    
{showDateError && (
    <p className="mt-1 text-xs text-red-500">
       {dateErrorMessage}
    </p>
)}
</div>
    <div>

      <label className="mb-1 block text-sm font-semibold">
        Ngày kết thúc
      </label>

<input
  disabled
  value={endDate}
  className="
    w-full
    rounded-lg
    border
    bg-gray-50
    p-2
    text-gray-700
    font-normal
  "
/>

    </div>

  </div>

  {/* Quyền lợi */}
  <div className="mb-4">

    <div className="mb-2 text-sm font-semibold">
      Quyền lợi
    </div>

    <div className="grid grid-cols-2 gap-2">

<label
  className="
    flex
    items-start
    gap-3
    rounded-lg
    border
    p-2
  "
>
<input
  type="checkbox"
  checked={benefits.includes("nutrition")}
  onChange={(e) => {
    if (e.target.checked) {
      setBenefits([
        ...benefits,
        "nutrition",
      ]);
    } else {
      setBenefits(
        benefits.filter(
          item => item !== "nutrition"
        )
      );
    }
  }}
  className="
    h-5
    w-5
    accent-blue-500
    cursor-pointer
    self-start
    mt-1
  "
/>

        <div>

          <div className="text-sm font-medium">
            Tư vấn dinh dưỡng cá nhân
          </div>

          <div className="text-xs text-orange-500">
            +50.000 VND
          </div>

        </div>

      </label>

      <label
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          p-2
        "
      >
<input
  type="checkbox"
  checked={benefits.includes("pt")}
  onChange={(e) => {
    if (e.target.checked) {
      setBenefits([
        ...benefits,
        "pt",
      ]);
    } else {
      setBenefits(
        benefits.filter(
          item => item !== "pt"
        )
      );
    }
  }}
  className="
    h-5
    w-5
    accent-blue-500
    cursor-pointer
    self-start
    mt-1
  "
/>

        <div>

          <div className="text-sm font-medium">
            PT cá nhân
          </div>

          <div className="text-xs text-orange-500">
            +50.000 VND
          </div>

        </div>

      </label>

      <label
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          p-2
        "
      >
<input
  type="checkbox"
  checked={benefits.includes("sauna")}
  onChange={(e) => {
    if (e.target.checked) {
      setBenefits([
        ...benefits,
        "sauna",
      ]);
    } else {
      setBenefits(
        benefits.filter(
          item => item !== "sauna"
        )
      );
    }
  }}
  className="
    h-5
    w-5
    accent-blue-500
    cursor-pointer
    self-start
    mt-1
  "
/>

        <div>

          <div className="text-sm font-medium">
            Xông hơi VIP
          </div>

          <div className="text-xs text-orange-500">
            +50.000 VND
          </div>

        </div>

      </label>

      <label
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          p-2
        "
      >
<input
  type="checkbox"
  checked={benefits.includes("towel")}
  onChange={(e) => {
    if (e.target.checked) {
      setBenefits([
        ...benefits,
        "towel",
      ]);
    } else {
      setBenefits(
        benefits.filter(
          item => item !== "towel"
        )
      );
    }
  }}
  className="
    h-5
    w-5
    accent-blue-500
    cursor-pointer
    self-start
    mt-1
  "
/>

        <div>

          <div className="text-sm font-medium">
            Khăn miễn phí
          </div>

          <div className="text-xs text-orange-500">
            +50.000 VND
          </div>

        </div>

      </label>

    </div>

  </div>

  {/* Tổng tiền */}
  <div className="mb-2 flex items-center justify-between">

    <span className="font-semibold">
      Tổng thanh toán
    </span>

    <span
      className="
        text-2xl
        font-bold
        text-orange-500
      "
    >
    {totalPrice.toLocaleString()} VND
    </span>

  </div>
<hr className="mt-1 mb-2 border-gray-200" />
  {/* Buttons */}

  <div className="flex justify-end gap-2">

    <button
      onClick={handleClose}
      className="
        rounded-lg
        border
        px-5
        py-2
        text-sm
      "
    >
      Hủy
    </button>

    <button
      onClick={() => {

if (!startDate) {

  setShowWarning(true);

  setTimeout(() => {
    setShowWarning(false);
  }, 3000);

  return;
}

if (startDate === today) {

  setDateErrorMessage(
    "Ngày bắt đầu phải sau ngày hết hạn của gói cũ."
  );

  setShowDateError(true);

  return;
}

    alert("Đi tới thanh toán");
  }}
  className="
    rounded-lg
    bg-orange-500
    px-6
    py-2
    text-white
    text-sm
    hover:bg-orange-600
  "    >
      Xác nhận
    </button>
  </div>
</div>
      </div>
    </>
  );
}