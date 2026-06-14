type Props = {
  show: boolean;
};

export default function ErrorToast({ show }: Props) {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          z-40
          bg-black/50
        "
      />

      {/* Toast */}
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
            bg-red-500
            text-sm
            font-bold
            text-white
          "
        >
          ×
        </div>

        <div className="ml-3 text-sm">
          Có lỗi xảy ra! Vui lòng thử lại
        </div>

        <button className="flex items-center justify-center ml-auto mr-2 text-3xl font-light leading-non">
          ×
        </button>
      </div>
    </>
  );
}