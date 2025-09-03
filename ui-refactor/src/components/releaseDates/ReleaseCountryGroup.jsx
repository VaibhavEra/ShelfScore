import * as Flags from "country-flag-icons/react/3x2";
import {
  getCountryName,
  formatReleaseDate,
  getCertificationColor,
} from "../../lib/releaseScheduleCountries";

export default function ReleaseCountryGroup({ countryCode, releases }) {
  // Country Flag component
  const CountryFlag = ({ countryCode }) => {
    const FlagComponent = Flags[countryCode];

    if (FlagComponent) {
      return (
        <FlagComponent
          className="rounded-sm flex-shrink-0"
          style={{
            width: "20px",
            height: "15px",
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
          width: "20px",
          height: "15px",
          fontSize: "6px",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {countryCode}
      </div>
    );
  };

  return (
    <div className="space-y-[12px]">
      {/* Remove the border separator that was used in date view */}
      <div className="flex flex-wrap gap-[12px]">
        {releases.map((release, index) => (
          <div
            key={`${release.release_date}-${index}`}
            className="bg-[var(--bg-trans-15)] rounded-[8px] p-[12px] flex items-center gap-[10px] w-auto min-w-fit"
          >
            <CountryFlag countryCode={countryCode} />

            <div className="flex items-center gap-[6px] text-sm whitespace-nowrap">
              {/* Country Name */}
              <span className="text-[var(--text-primary)] font-medium">
                {getCountryName(countryCode)}
              </span>

              {/* Release Date */}
              <span className="text-[var(--text-secondary)]">•</span>
              <span className="text-[var(--text-primary)] font-medium">
                {formatReleaseDate(release.release_date)}
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
    </div>
  );
}
