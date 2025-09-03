import { useState, useMemo } from "react";
import { movieData } from "../../data/movieDetails";

export default function TitleBlock() {
  // Extract runtime from the original API response structure
  const runtime = movieData.primary.runtime;
  const runtimeHours = Math.floor(runtime / 60);
  const runtimeMinutes = runtime % 60;

  // persistent state (true = hrs+mins, false = mins)
  const [isPersistent, setIsPersistent] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  const persistentText = isPersistent
    ? `${runtimeHours}h ${runtimeMinutes}m`
    : `${runtime} mins`;

  const hoverText = isPersistent
    ? `${runtime} mins`
    : `${runtimeHours}h ${runtimeMinutes}m`;

  const displayText = hovering && !justToggled ? hoverText : persistentText;

  // Calculate both width and margin dynamically for center alignment
  const { calculatedWidth, calculatedMargin } = useMemo(() => {
    const format1 = `${runtimeHours}h ${runtimeMinutes}m`;
    const format2 = `${runtime} mins`;
    const maxLength = Math.max(format1.length, format2.length);

    const width = `${maxLength - 1}ch`;
    const baseMargpx = 12;
    const baseWidthCh = 10;
    const scaledMarginPx = baseMargpx * (maxLength / baseWidthCh);
    const margin = `${scaledMarginPx.toFixed(1)}px`;

    return {
      calculatedWidth: width,
      calculatedMargin: margin,
    };
  }, [runtime, runtimeHours, runtimeMinutes]);

  const handleClick = () => {
    setIsPersistent((prev) => !prev);
    setJustToggled(true);
  };

  const handleMouseEnter = () => {
    if (!justToggled) setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setJustToggled(false);
  };

  return (
    <div>
      {/* English Title */}
      <h1 className="text-[var(--text-primary)] font-bold text-3xl">
        {movieData.primary.title}
      </h1>

      {/* Original Title */}
      {movieData.primary.original_title &&
        movieData.primary.original_title !== movieData.primary.title && (
          <h2 className="text-[var(--text-secondary)] text-lg mt-1">
            {movieData.primary.original_title}
          </h2>
        )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-x-2 mt-2">
        <span
          className="text-[var(--text-secondary)]"
          title={`Full release date: ${movieData.primary.release_date.full}`}
        >
          {movieData.primary.release_date.year}
        </span>

        <span className="text-[var(--text-secondary)]">·</span>

        <span className="text-[var(--text-secondary)]">
          {movieData.primary.primary_language.toUpperCase()}
        </span>
      </div>

      {/* Genre + Runtime Line */}
      <ul className="flex flex-wrap items-center gap-3 mt-4" role="list">
        {movieData.primary.genres.map((genre) => (
          <li
            key={genre}
            className="bg-[var(--bg-trans-15)] text-[var(--text-primary)] rounded-full px-[18px] py-[8px] text-[16px] leading-[1.75]"
          >
            {genre}
          </li>
        ))}

        {/* Runtime */}
        <li className="flex items-center text-[16px] leading-[1.75]">
          <p
            className="cursor-pointer"
            title="Click to toggle runtime format"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <span
              className={`inline-block transition-all duration-300 ${
                hovering && !justToggled
                  ? "text-[var(--accent-main)] underline"
                  : "text-[var(--text-primary)]"
              }`}
              style={{ width: calculatedWidth, textAlign: "center" }}
            >
              {displayText}
            </span>
          </p>
        </li>
      </ul>
    </div>
  );
}
