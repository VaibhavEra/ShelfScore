// src/components/CastBlock.jsx
import { useRef, useState, useEffect } from "react";
import { movieData } from "../../data/castandcrewdata";
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
  const [isScrolling, setIsScrolling] = useState(false);

  const topCast = (movieData.cast || []).slice(0, 6);
  const topCrew = flattenCredits(movieData.credits).slice(0, 6);
  const combined = [...topCast, ...topCrew];

  // Card dimensions
  const cardWidth = 181;
  const gap = 20;
  const cardWithGap = cardWidth + gap;

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);

    // Show fade overlay when there's still content to scroll to the right
    setShowFadeOverlay(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scroll = (direction) => {
    if (!scrollRef.current || isScrolling) return;

    const container = scrollRef.current;
    const cards = container.querySelectorAll(".snap-start");

    setIsScrolling(true);

    // Disable snap during animation
    container.classList.remove("snap-x");
    cards.forEach((card) => card.classList.remove("snap-start"));

    let targetPosition;

    if (direction === "left") {
      // Calculate how many cards to scroll back
      const currentCardIndex = Math.ceil(container.scrollLeft / cardWithGap);
      const targetCardIndex = Math.max(0, currentCardIndex - 1);
      targetPosition = targetCardIndex * cardWithGap;
    } else {
      // Calculate how many cards to scroll forward
      const currentCardIndex = Math.floor(container.scrollLeft / cardWithGap);
      const visibleCards = Math.floor(container.clientWidth / cardWithGap);
      const maxCardIndex = Math.max(0, cards.length - visibleCards);
      const targetCardIndex = Math.min(maxCardIndex, currentCardIndex + 1);
      targetPosition = targetCardIndex * cardWithGap;
    }

    // Ensure we don't scroll beyond bounds
    const maxScroll = container.scrollWidth - container.clientWidth;
    targetPosition = Math.max(0, Math.min(targetPosition, maxScroll));

    // Animate to target position
    const startPosition = container.scrollLeft;
    const distance = targetPosition - startPosition;
    const duration = 300;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      container.scrollLeft = startPosition + distance * easeOutCubic;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Re-enable snap after animation
        container.classList.add("snap-x");
        cards.forEach((card) => card.classList.add("snap-start"));
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
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
            className="flex items-center gap-[10px] bg-[var(--bg-trans-15)] px-[18px] py-[8px] rounded-[10px] text-[var(--text-primary)] text-base transition-colors duration-200 hover:bg-[var(--bg-trans-60)] active:bg-[var(--bg-trans-60)] active:scale-95 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            See all
            <ChevronRight size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        <div className="flex items-center gap-[5px]">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || isScrolling}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
                    canScrollLeft && !isScrolling
                      ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                      : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                  }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight || isScrolling}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
                    canScrollRight && !isScrolling
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
              <div className="w-[181px] h-[181px] rounded-[20px] flex items-center justify-center overflow-hidden bg-[var(--bg-trans-15)]">
                {person.profile_url ? (
                  <img
                    src={person.profile_url}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.replaceWith(
                        (() => (
                          <UserRound className="w-20 h-20 text-[var(--text-secondary)]" />
                        ))()
                      );
                    }}
                  />
                ) : (
                  <UserRound className="w-20 h-20 text-[var(--text-secondary)]" />
                )}
              </div>

              <div className="h-[12px]" />
              <p className="text-[var(--text-primary)] text-[16px] leading-[1.5] font-medium transition-colors duration-200 group-hover:text-[var(--accent-main)] group-hover:underline">
                {person.name}
              </p>
              <p className="text-[var(--text-secondary)] text-[16px] leading-[1.4]">
                {person.character || person.role || ""}
              </p>
            </div>
          ))}
        </div>

        {/* Fade Overlay - Visible until scrolled all the way to the right */}
        <div
          className={`absolute top-0 right-0 w-[120px] h-full pointer-events-none transition-opacity duration-300 ease-in-out bg-[var(--bg-primary)] ${
            showFadeOverlay ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to left, var(--bg-primary), transparent)",
          }}
        />
      </div>

      <CastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
