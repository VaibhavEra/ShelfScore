import { ChevronDown, Filter } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { getCountryName } from "../../lib/releaseScheduleCountries";

export default function ReleaseCountryButton({
  selectedCountries,
  onClick,
  isActive,
  totalReleases,
  filteredReleases,
}) {
  // Flag component with fallback
  const CountryFlag = ({ countryCode }) => {
    const FlagComponent = Flags[countryCode];

    if (FlagComponent) {
      return (
        <FlagComponent
          style={{
            width: "20px",
            height: "15px",
            borderRadius: "2px",
            boxShadow: "var(--shadow-drop-small)",
          }}
        />
      );
    }

    return null;
  };

  const hasSelectedCountries = selectedCountries.length > 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center px-[16px] py-[10px] rounded-[12px] cursor-pointer transition-all duration-300 group ${
        isActive
          ? "bg-[var(--accent-main)] shadow-lg"
          : "bg-[var(--bg-trans-15)] hover:bg-[var(--accent-main)] hover:shadow-lg"
      } ${hasSelectedCountries ? "min-w-[120px]" : "min-w-[80px]"}`}
    >
      {/* Filter Icon */}
      <Filter
        size={16}
        className={`transition-colors duration-300 flex-shrink-0 ${
          isActive
            ? "text-[var(--text-primary-dark)]"
            : "text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]"
        }`}
      />

      {/* Content Container with proper spacing */}
      <div className="flex items-center gap-[8px] ml-[8px] mr-[8px]">
        {/* Selected Countries Preview or Filter Text */}
        {hasSelectedCountries ? (
          <div className="flex items-center gap-[4px]">
            {selectedCountries.slice(0, 3).map((countryCode) => (
              <CountryFlag key={countryCode} countryCode={countryCode} />
            ))}
            {selectedCountries.length > 3 && (
              <span
                className={`text-xs transition-colors duration-300 ml-[2px] ${
                  isActive
                    ? "text-[var(--text-primary-dark)]"
                    : "text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]"
                }`}
              >
                +{selectedCountries.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span
            className={`text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
              isActive
                ? "text-[var(--text-primary-dark)]"
                : "text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]"
            }`}
          >
            Filter
          </span>
        )}

        {/* Active indicator badge */}
        {hasSelectedCountries && (
          <span className="bg-[var(--text-primary-dark)] text-[var(--text-primary)] rounded-full px-[6px] py-[1px] text-xs font-semibold whitespace-nowrap">
            {selectedCountries.length}
          </span>
        )}
      </div>

      {/* Chevron */}
      <ChevronDown
        size={16}
        className={`transition-all duration-300 flex-shrink-0 ${
          isActive
            ? "rotate-180 text-[var(--text-primary-dark)]"
            : "rotate-0 text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]"
        }`}
      />
    </div>
  );
}
