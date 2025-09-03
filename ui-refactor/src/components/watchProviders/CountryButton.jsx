import { ChevronDown } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { getCountryName } from "../../lib/tmdbWatchProvidersCountries";

export default function CountryButton({ selectedCountry, onClick, isActive }) {
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
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      );
    }

    return null; // No fallback needed for button
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-[8px] px-[16px] py-[10px] rounded-[12px] cursor-pointer transition-all duration-300 group ${
        isActive
          ? "bg-[var(--accent-main)] shadow-lg"
          : "bg-[var(--bg-trans-15)] hover:bg-[var(--accent-main)] hover:shadow-lg"
      }`}
    >
      {/* Country Flag */}
      {selectedCountry && (
        <div className="flex-shrink-0">
          <CountryFlag countryCode={selectedCountry} />
        </div>
      )}

      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          isActive
            ? "text-[#121212]"
            : "text-[var(--text-primary)] group-hover:text-[#121212]"
        }`}
      >
        {getCountryName(selectedCountry)}
      </span>

      <ChevronDown
        size={16}
        className={`transition-all duration-300 ${
          isActive
            ? "rotate-180 text-[#121212]"
            : "rotate-0 text-[var(--text-primary)] group-hover:text-[#121212]"
        }`}
      />
    </div>
  );
}
