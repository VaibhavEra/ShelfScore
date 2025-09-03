// src/components/relatedMovies/RelatedMoviesBlock.jsx
import { useRef } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { similarMoviesData as data } from "../../data/similarMoviesData";

export default function SimilarMoviesBlock() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 234 + 17; // updated card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="similar-movies"
    >
      {/* First Row */}
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[20px] h-[12px] rounded-full bg-[var(--accent-main)] flex-shrink-0"></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Similar Movies
          </h2>
        </div>

        {/* Right Section - Navigation Arrows */}
        <div className="flex items-center gap-[5px]">
          <button
            onClick={() => scroll("left")}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] transition-colors duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] transition-colors duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Second Row - Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-[17px] overflow-x-auto no-scrollbar scroll-smooth"
      >
        {data.movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-[234px] bg-[rgba(255,255,255,0.05)] rounded-[10px] p-[15px] flex flex-col gap-[17px]"
          >
            {/* Poster */}
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-[204px] h-[321px] object-cover rounded-[5px]"
            />

            {/* Title */}
            <h3 className="w-[204px] h-[23px] text-[var(--text-primary)] text-[16px] font-semibold truncate">
              {movie.title}
            </h3>

            {/* Ratings & Rate */}
            <div className="flex gap-auto w-[204px] h-[42px] items-center justify-between">
              {/* Rating */}
              <div className="flex items-center justify-center gap-[5px] h-[42px] px-[7px]  rounded-[10px]">
                <Star size={24} className="text-yellow-400" />
                <p className="text-[var(--text-primary)] text-[14px] font-medium">
                  {movie.rating}
                </p>
              </div>

              {/* Rate Button */}
              <button className="flex items-center justify-center gap-[5px] w-[68px] h-[42px] px-[7px]  rounded-[10px]">
                <Star size={24} className="text-[var(--text-primary)]" />
                <p className="text-[var(--text-primary)] text-[14px] font-medium">
                  Rate
                </p>
              </button>
            </div>
            {/* Add to Watchlist Row */}
            <button
              aria-label={`Add ${movie.title} to Watchlist`}
              className="flex items-center justify-center gap-[8px] w-full h-[42px] rounded-[10px] bg-[var(--accent-main)] text-white hover:opacity-90 transition-colors duration-200"
            >
              <span className="text-lg">+</span>
              <p className="text-[14px] font-medium">Add to Watchlist</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
