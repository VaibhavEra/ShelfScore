import { movieData } from "../../data/movieDetails";
import { movieData as castCrewData } from "../../data/castandcrewdata";
import { Plus, Check, Pencil } from "lucide-react";

export default function MetadataBlock() {
  // Get tagline and synopsis from the original API response
  const tagline = movieData.primary.oneliner;
  const synopsis = movieData.primary.synopsis;

  // Get directors and writers from the separate cast/crew data
  const directors = castCrewData.credits?.director || [];
  const writers = castCrewData.credits?.writing || [];

  // Format people with individual hover elements
  const formatPeopleWithHover = (arr) => {
    if (!arr || !arr.length) return "—";

    return (
      <span>
        {arr.map((person, index) => (
          <span key={person.id || index}>
            <span className="cursor-pointer transition-all duration-300 hover:text-[var(--accent-main)] hover:underline">
              {person.name}
            </span>
            {index < arr.length - 1 && (
              <span className="text-[var(--text-secondary)]"> · </span>
            )}
          </span>
        ))}
      </span>
    );
  };

  // map our semantic color keys to actual CSS variable classes
  const colorClassFor = (colorKey) => {
    if (colorKey === "primary") return "text-[var(--text-primary)]";
    if (colorKey === "sec2") return "text-[var(--accent-sec2)]";
    // fallback
    return "text-[var(--text-primary)]";
  };

  // Reusable row component - updated to handle JSX content
  const Row = ({ category, content, color, isJSX = false }) => {
    const contentColorClass = colorClassFor(color);
    return (
      <div className="flex">
        <h5 className="text-[var(--text-secondary)] font-bold text-[21px] w-[150px]">
          {category}
        </h5>
        <div
          className={`${contentColorClass} text-[16px] leading-[1.75]`}
          style={{ maxWidth: "calc(100% - 150px)" }}
        >
          {isJSX ? content : <p>{content}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between gap-[20px]">
      {/* LEFT SECTION */}
      <div className="w-[785px] flex flex-col gap-[15px]">
        <Row category="Tagline" content={tagline} color="sec2" />
        <Row category="Synopsis" content={synopsis} color="primary" />
        <Row
          category="Director"
          content={formatPeopleWithHover(directors)}
          color="sec2"
          isJSX={true}
        />
        <Row
          category="Writers"
          content={formatPeopleWithHover(writers)}
          color="sec2"
          isJSX={true}
        />
      </div>

      {/* RIGHT SECTION - Only text color fixed */}
      <div className="flex flex-col items-end gap-4">
        <button className="w-[249px] h-[44px] rounded-[10px] px-[18px] py-[10px] bg-[var(--accent-main)] text-[var(--text-primary-dark)] flex items-center">
          <span className="flex-1 text-center">Add to Watchlist</span>
          <div className="w-px h-4 mx-2 bg-[#121212] opacity-16"></div>
          <Plus size={18} />
        </button>

        <button className="w-[249px] h-[44px] rounded-[10px] px-[18px] py-[10px] bg-[var(--accent-main)] text-[var(--text-primary-dark)] flex items-center">
          <span className="flex-1 text-center">Watched</span>
          <div className="w-px h-4 mx-2 bg-[#121212] opacity-16"></div>
          <Check size={18} />
        </button>

        <button className="w-[249px] h-[44px] rounded-[10px] px-[18px] py-[10px] bg-[var(--accent-main)] text-[var(--text-primary-dark)] flex items-center">
          <span className="flex-1 text-center">Add a Review</span>
          <div className="w-px h-4 mx-2 bg-[#121212] opacity-16"></div>
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}
