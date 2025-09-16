import { Calendar, Globe } from "lucide-react";

export default function SortButton({ sortMode, onChange }) {
  const isByDate = sortMode === "date";

  return (
    <button
      onClick={() => onChange(isByDate ? "country" : "date")}
      className="flex items-center px-[16px] py-[10px] rounded-[12px] cursor-pointer transition-all duration-300 group bg-[var(--bg-trans-15)] hover:bg-[var(--accent-main)] hover:shadow-lg h-[46px]"
      title={`Sort by ${isByDate ? "country" : "date"}`}
    >
      {/* Sort Icon */}
      {isByDate ? (
        <Calendar
          size={16}
          className="transition-colors duration-300 flex-shrink-0 text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]"
        />
      ) : (
        <Globe
          size={16}
          className="transition-colors duration-300 flex-shrink-0 text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]"
        />
      )}

      {/* Sort Text with Current Mode */}
      <span className="text-sm font-medium transition-colors duration-300 whitespace-nowrap ml-[8px] text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]">
        Sort by: {isByDate ? "Date" : "Country"}
      </span>
    </button>
  );
}
