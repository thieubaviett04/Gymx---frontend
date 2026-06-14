type Props = {
  onClear: () => void;
};

export default function EmptyState({
  onClear,
}: Props) {
  return (
    <div className="flex min-h-[370px] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white px-6 py-16 text-center font-sans shadow-sm">
      <svg width="160" height="110" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 animate-in fade-in zoom-in-95 duration-300">
        <rect x="76" y="10" width="56" height="76" rx="8" stroke="#FF6B00" strokeWidth="2" fill="#FFFFFF" />
        <path d="M84 10h40v6a6 6 0 01-6 6H90a6 6 0 01-6-6v-6z" fill="#FFF0E5" stroke="#FF6B00" strokeWidth="2" />
        <line x1="90" y1="34" x2="118" y2="34" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="46" x2="110" y2="46" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="58" x2="114" y2="58" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <rect x="42" y="44" width="52" height="34" rx="4" stroke="#FF6B00" strokeWidth="2" fill="#FFFFFF" />
        <rect x="50" y="52" width="12" height="14" rx="2" stroke="#FF6B00" strokeWidth="2" fill="#FFF0E5" />
        <line x1="68" y1="54" x2="84" y2="54" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <line x1="68" y1="62" x2="78" y2="62" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <circle cx="71" cy="72" r="2" fill="#FF6B00" />
        <circle cx="80" cy="72" r="2" fill="#FF6B00" />
        <path d="M132 36h6v42l-3 8-3-8V36z" fill="#FFF0E5" stroke="#FF6B00" strokeWidth="2" strokeLinejoin="round" />
        <path d="M132 36l3-8 3 8" stroke="#FF6B00" strokeWidth="2" strokeLinejoin="round" />
        <path d="M54 22h8M58 18v8" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 34h4M70 32v4" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <p className="max-w-md text-sm font-medium leading-relaxed text-neutral-600">
        Không có gói tập nào đáp ứng tiêu chí lọc. Vui lòng chọn
        <br />
        lại bộ lọc
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-xl bg-[#FF6B00] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF6B00]/10 transition hover:bg-[#CC5500]"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}
