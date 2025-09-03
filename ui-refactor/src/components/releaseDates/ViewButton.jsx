import { List, ListCollapse } from "lucide-react";

export default function ViewButton({ viewMode, onChange, disabled = false }) {
  const isExpanded = viewMode === "expanded";

  return (
    <button
      onClick={
        disabled
          ? undefined
          : () => onChange(isExpanded ? "collapsible" : "expanded")
      }
      disabled={disabled}
      className={`flex items-center px-[16px] py-[10px] rounded-[12px] transition-all duration-300 group h-[46px] ${
        disabled
          ? "bg-[var(--bg-trans-8)] opacity-50 cursor-not-allowed"
          : "bg-[var(--bg-trans-15)] hover:bg-[var(--accent-main)] hover:shadow-lg cursor-pointer"
      }`}
      title={
        disabled
          ? "View options available only for date sorting"
          : `Switch to ${isExpanded ? "collapsible" : "expanded"} view`
      }
    >
      {/* View Icon */}
      {isExpanded ? (
        <List
          size={16}
          className={`transition-colors duration-300 flex-shrink-0 ${
            disabled
              ? "text-[var(--text-secondary)]"
              : "text-[var(--text-primary)] group-hover:text-[#121212]"
          }`}
        />
      ) : (
        <ListCollapse
          size={16}
          className={`transition-colors duration-300 flex-shrink-0 ${
            disabled
              ? "text-[var(--text-secondary)]"
              : "text-[var(--text-primary)] group-hover:text-[#121212]"
          }`}
        />
      )}

      {/* View Text */}
      <span
        className={`text-sm font-medium transition-colors duration-300 whitespace-nowrap ml-[8px] ${
          disabled
            ? "text-[var(--text-secondary)]"
            : "text-[var(--text-primary)] group-hover:text-[#121212]"
        }`}
      >
        View
      </span>
    </button>
  );
}
