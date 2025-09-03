// src/components/CastBlock.jsx
import { useRef, useState, useEffect } from "react";
import { movieData } from "../../data/dune/modal/castandcrewdata";
import { ChevronRight, ChevronLeft, UserRound } from "lucide-react";
import CastModal from "./CastModal";

function flattenCredits(creditsObj) {
  const creditsList = [];
  if (!creditsObj) return creditsList;

  Object.keys(creditsObj).forEach((role) => {
    const roleEntries = creditsObj[role];
    roleEntries.forEach((person) => {
      creditsList.push({
        ...person,
        role:
          person.job ||
          role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      });
    });
  });

  return creditsList;
}

export default function CastBlock() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showFadeOverlay, setShowFadeOverlay] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topCast = (movieData.cast || []).slice(0, 6);
  const topCrew = flattenCredits(movieData.credits).slice(0, 6);
  const combined = [...topCast, ...topCrew];

  const scrollAmount = 200;

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);

    // Update fade overlay visibility: show only when at the leftmost position
    setShowFadeOverlay(
      scrollLeft === 0 && scrollLeft + clientWidth < scrollWidth - 5
    );
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollButtons();
    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.addEventListener("scroll", updateScrollButtons);
    return () => scroller.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <div className="max-w-[1219px] mx-auto flex flex-col gap-[30px]" id="cast">
      {/* First Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <div className="w-[20px] h-[12px] rounded-full bg-[var(--accent-main)] flex-shrink-0"></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Cast & Crew
          </h2>
          <button
            className="flex items-center gap-[10px] bg-[var(--bg-trans-15)] px-[18px] py-[8px] rounded-[10px] text-[var(--text-primary)] text-base"
            onClick={() => setIsModalOpen(true)}
          >
            See all
            <ChevronRight size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        <div className="flex items-center gap-[5px]">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
                    canScrollLeft
                      ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                      : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                  }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
                    canScrollRight
                      ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                      : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                  }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll with Fade Overlay */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-[20px] overflow-x-auto no-scrollbar snap-x scroll-smooth"
        >
          {combined.map((person, idx) => (
            <div
              key={`${person.name}-${idx}`}
              className="flex-shrink-0 w-[181px] flex flex-col cursor-pointer group snap-start"
            >
              <div
                className="w-[181px] h-[181px] rounded-[20px] flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: "hsla(0,0%,64%,0.15)" }}
              >
                {person.profile_url ? (
                  <img
                    src={person.profile_url}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.replaceWith(
                        (() => (
                          <UserRound
                            className="w-20 h-20"
                            style={{ color: "hsl(0,0%,76%)" }}
                          />
                        ))()
                      );
                    }}
                  />
                ) : (
                  <UserRound
                    className="w-20 h-20"
                    style={{ color: "hsl(0,0%,76%)" }}
                  />
                )}
              </div>

              <div className="h-[12px]" />
              <p className="text-white text-[16px] leading-[1.5] font-medium transition-colors duration-200 group-hover:text-[var(--accent-main)] group-hover:underline">
                {person.name}
              </p>
              <p className="text-[var(--text-secondary)] text-[16px] leading-[1.4]">
                {person.character || person.role || ""}
              </p>
            </div>
          ))}
        </div>

        {/* Fade Overlay - Only visible when scrolled to the left */}
        <div
          className={`absolute top-0 right-0 w-[120px] h-full pointer-events-none transition-opacity duration-300 ease-in-out ${
            showFadeOverlay ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to left, rgba(0, 0, 0, 0.8), transparent)",
          }}
        />
      </div>

      <CastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
