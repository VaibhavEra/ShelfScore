import { Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Flags from "country-flag-icons/react/3x2";
import {
  getCountryName,
  formatReleaseDate,
  getCertificationColor,
} from "../../lib/releaseScheduleCountries";

export default function ReleaseDateGroup({
  date,
  releases,
  isExpanded = true,
  onToggle,
  collapsible = false,
}) {
  const releaseDate = formatReleaseDate(date);
  const releaseCount = releases.length;

  // Get unique countries for collapsed preview
  const uniqueCountries = [...new Set(releases.map((r) => r.country_code))];

  // Country Flag component
  const CountryFlag = ({ countryCode, size = "sm" }) => {
    const FlagComponent = Flags[countryCode];
    const dimensions =
      size === "lg"
        ? { width: "24px", height: "18px" }
        : size === "md"
        ? { width: "20px", height: "15px" }
        : { width: "16px", height: "12px" };

    if (FlagComponent) {
      return (
        <FlagComponent
          className="rounded-sm flex-shrink-0"
          style={{
            ...dimensions,
            objectFit: "cover",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        />
      );
    }

    return (
      <div
        className="rounded-sm bg-gray-400 flex items-center justify-center flex-shrink-0"
        style={{
          ...dimensions,
          fontSize: size === "lg" ? "6px" : "5px",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {countryCode}
      </div>
    );
  };

  return (
    <div className="pb-[30px] border-b border-[var(--bg-trans-15)] last:border-b-0 last:pb-0">
      {/* Date Header - Always visible with optional collapsible behavior */}
      <div
        className={`bg-[var(--bg-trans-8)] p-[16px] rounded-[12px] mb-0 ${
          collapsible
            ? "cursor-pointer hover:bg-[var(--bg-trans-12)] transition-colors duration-200"
            : ""
        }`}
        onClick={collapsible ? onToggle : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <Calendar size={18} className="text-[var(--accent-main)]" />
            <div className="flex-grow">
              <h3 className="text-[var(--text-primary)] text-base font-semibold">
                {releaseDate}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {releaseCount} {releaseCount === 1 ? "country" : "countries"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            {/* Country Flags Preview when Collapsed - Show up to 10 flags */}
            {collapsible && !isExpanded && (
              <div className="flex items-center gap-[6px] mr-[8px] flex-wrap">
                {uniqueCountries.slice(0, 10).map((countryCode) => (
                  <CountryFlag
                    key={countryCode}
                    countryCode={countryCode}
                    size="lg"
                  />
                ))}
                {uniqueCountries.length > 10 && (
                  <div className="bg-[var(--bg-trans-20)] rounded-sm px-[6px] py-[2px] ml-[4px]">
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                      +{uniqueCountries.length - 10}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Chevron for collapsible */}
            {collapsible && (
              <ChevronDown
                size={20}
                className={`text-[var(--text-primary)] transition-transform duration-200 flex-shrink-0 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Countries - Collapsible content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={collapsible ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-[12px] px-[16px]">
              {releases.map((release, index) => (
                <div
                  key={`${release.country_code}-${index}`}
                  className="bg-[var(--bg-trans-15)] rounded-[8px] p-[12px] flex items-center gap-[10px] w-auto min-w-fit"
                >
                  <CountryFlag countryCode={release.country_code} size="lg" />

                  <div className="flex items-center gap-[6px] text-sm whitespace-nowrap">
                    {/* Country Name */}
                    <span className="text-[var(--text-primary)] font-medium">
                      {getCountryName(release.country_code)}
                    </span>

                    {/* Certification */}
                    {release.certification && (
                      <>
                        <span className="text-[var(--text-secondary)]">•</span>
                        <span
                          className={`text-white text-xs font-semibold px-[4px] py-[1px] rounded-[3px] ${getCertificationColor(
                            release.certification
                          )}`}
                        >
                          {release.certification}
                        </span>
                      </>
                    )}

                    {/* Note */}
                    {release.note && (
                      <>
                        <span className="text-[var(--text-secondary)]">•</span>
                        <span className="text-[var(--text-secondary)] text-xs">
                          {release.note}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
