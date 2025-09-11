import { useState } from "react";
import { ChevronDown, Globe, Film } from "lucide-react";
import { movieData } from "../../data/movieDetails";

export default function AdditionalInformationBlock() {
  const [open, setOpen] = useState(true);

  // Platform icons mapping
  const getPlatformIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("imdb")) {
      return <Film size={16} className="text-yellow-500" />;
    } else if (platformLower.includes("tmdb")) {
      return <Globe size={16} className="text-blue-500" />;
    } else if (platformLower.includes("homepage")) {
      return <Globe size={16} className="text-green-500" />;
    }
    return <Globe size={16} className="text-[var(--text-secondary)]" />;
  };

  const infoItems = [
    // {
    //   label: "Status",
    //   value: movieData.additional.status,
    // },
    {
      label: "Origin Country",
      value: movieData.additional.origin_country.join(", "),
    },
    {
      label: "Production Companies",
      value: movieData.additional.production_companies
        .map((company) => company.name)
        .join(", "),
    },
    {
      label: "Production Country",
      value: movieData.additional.production_countries
        .map((country) => country.name)
        .join(", "),
    },
    {
      label: "Spoken Languages",
      value: movieData.additional.spoken_languages
        .map((language) => language.english_name)
        .join(", "),
    },
    // {
    //   label: "Primary Language",
    //   value: movieData.additional.primary_language.toUpperCase(),
    // },
    {
      label: "Budget",
      value: `$${movieData.financial.budget.toLocaleString()}`,
    },
    {
      label: "Revenue",
      value: `$${movieData.financial.revenue.toLocaleString()}`,
    },
    {
      label: "Platforms",
      value: (
        <div className="flex items-center gap-3">
          {movieData.platforms.imdb_id && (
            <div className="flex items-center gap-2">
              {getPlatformIcon("imdb")}
              <a
                href={`https://www.imdb.com/title/${movieData.platforms.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-primary)] hover:text-[var(--accent-main)] transition-colors"
              >
                IMDb
              </a>
            </div>
          )}
          {movieData.platforms.tmdb_id && (
            <div className="flex items-center gap-2">
              {getPlatformIcon("tmdb")}
              <a
                href={`https://www.themoviedb.org/movie/${movieData.platforms.tmdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-primary)] hover:text-[var(--accent-main)] transition-colors"
              >
                TMDB
              </a>
            </div>
          )}
          {movieData.platforms.homepage && (
            <div className="flex items-center gap-2">
              {getPlatformIcon("homepage")}
              <a
                href={movieData.platforms.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-primary)] hover:text-[var(--accent-main)] transition-colors"
              >
                Official Site
              </a>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="additional-info"
    >
      {/* First Row */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-[10px]">
          <div
            className={`bg-[var(--accent-main)] flex-shrink-0 transition-all duration-300 
              ${
                open
                  ? "w-[20px] h-[12px] rounded-full"
                  : "w-[14px] h-[14px] rounded-full"
              }`}
          ></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Additional Information
          </h2>
        </div>
        <ChevronDown
          className={`text-[var(--text-primary)] transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          size={24}
        />
      </div>

      {/* Second Row */}
      {open && (
        <div className="flex flex-col w-full">
          {infoItems.map((item, idx) => (
            <div key={item.label} className="flex flex-col">
              <div className="flex items-center justify-between w-full">
                {/* Left side fixed box */}
                <div className="w-[150px] h-[42px] flex items-center">
                  <h5 className="text-[var(--text-primary)] font-bold">
                    {item.label}
                  </h5>
                </div>
                {/* Right side aligned fully right */}
                <div className="flex-1 flex justify-start items-center">
                  {typeof item.value === "string" ? (
                    <p className="text-[var(--text-primary)] text-right">
                      {item.value}
                    </p>
                  ) : (
                    item.value
                  )}
                </div>
              </div>

              {/* Divider (except after last item) */}
              {idx < infoItems.length - 1 && (
                <div className="my-[20px] w-full h-[2px] rounded-full bg-[var(--bg-trans-15)]"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
