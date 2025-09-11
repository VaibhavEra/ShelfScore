// src/components/relatedMovies/RelatedMoviesBlock.jsx
import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { relatedMoviesData as data } from "../../data/relatedMoviesData";
import { movieData } from "../../data/movieDetails";

export default function RelatedMoviesBlock() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showFadeOverlay, setShowFadeOverlay] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // Don't render component if movie doesn't belong to a collection
  if (!movieData.primary.belongs_to_collection) {
    return null;
  }

  const cardWidth = 234;
  const gap = 17;
  const cardWithGap = cardWidth + gap;

  // Filter out the current movie from related movies
  const filteredMovies = data.parts.filter(
    (movie) => movie.id !== movieData.primary.id
  );

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
      const currentCardIndex = Math.ceil(container.scrollLeft / cardWithGap);
      const targetCardIndex = Math.max(0, currentCardIndex - 1);
      targetPosition = targetCardIndex * cardWithGap;
    } else {
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
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="related-movies"
    >
      {/* First Row */}
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[20px] h-[12px] rounded-full bg-[var(--accent-main)] flex-shrink-0"></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Related Movies
          </h2>
        </div>

        {/* Right Section - Navigation Arrows */}
        <div className="flex items-center gap-[5px]">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || isScrolling}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
                    canScrollLeft && !isScrolling
                      ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
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
                      ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
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
          className="flex gap-[17px] overflow-x-auto no-scrollbar snap-x scroll-smooth"
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[234px] bg-[rgba(255,255,255,0.05)] rounded-[10px] p-[15px] flex flex-col gap-[17px] snap-start"
            >
              {/* Poster */}
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-[204px] h-[321px] object-cover rounded-[5px]"
              />

              {/* Title */}
              <h3 className="w-[204px] h-[23px] text-[var(--text-primary)] text-[16px] font-semibold truncate">
                {movie.title} ({movie.release_date.year})
              </h3>

              {/* Ratings & Rate */}
              <div className="flex gap-auto w-[204px] h-[42px] items-center justify-between">
                {/* Rating */}
                <div className="flex items-center justify-center gap-[5px] h-[42px] px-[7px] rounded-[10px]">
                  <Star size={24} className="text-yellow-400" />
                  <p className="text-[var(--text-primary)] text-[14px] font-medium">
                    N/A
                  </p>
                </div>

                {/* Rate Button */}
                <button className="flex items-center justify-center gap-[5px] w-[68px] h-[42px] px-[7px] rounded-[10px]">
                  <Star size={24} className="text-[var(--text-primary)]" />
                  <p className="text-[var(--text-primary)] text-[14px] font-medium">
                    Rate
                  </p>
                </button>
              </div>

              {/* Add to Watchlist Row */}
              <button
                aria-label={`Add ${movie.title} to Watchlist`}
                className="flex items-center justify-center gap-[8px] w-full h-[42px] rounded-[10px] bg-[var(--accent-main)] hover:opacity-90 transition-colors duration-200"
              >
                <span className="text-lg text-[#121212]">+</span>
                <p className="text-[14px] font-medium text-[#121212]">
                  Add to Watchlist
                </p>
              </button>
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
    </div>
  );
}
