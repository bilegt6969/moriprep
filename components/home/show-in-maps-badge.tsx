export default function ShowInMapsBadge() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] transition-colors duration-200 rounded-full py-2 pl-2 pr-5 cursor-pointer group"
    >
      {/* Text Label */}
      <span className="text-[#3C3C43] font-semibold text-[15px] tracking-tight select-none">
        bytecode Initiative
      </span>
    </button>
  );
}
