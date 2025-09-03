import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  UserRound,
  Clapperboard,
  PenLine,
  Film,
  Video,
  Scissors,
  Palette,
  Music,
  Shirt,
  Sparkles,
  UsersRound,
  SunMedium,
} from "lucide-react";
import { movieData } from "../../data/dune/modal/castandcrewdata";

export default function CastAndCrewModal({ isOpen, onClose, movie }) {
  const [selectedCategory, setSelectedCategory] = useState("Cast");
  const contentRef = useRef(null);

  // Lock background scroll & reset scroll on open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0 });
      }
    } else {
      document.body.style.overflow = "unset";
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0 });
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset category to "Cast" on modal open
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("Cast");
    }
  }, [isOpen]);

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Sidebar categories (without Director)
  const categories = ["Cast", ...Object.keys(movieData.crew || {})];

  // Map categories to icons
  const getCategoryIcon = (category) => {
    const iconMap = {
      Cast: UserRound,
      Directing: Clapperboard,
      Writing: PenLine,
      Production: Film,
      Camera: Video,
      Editing: Scissors,
      Art: Palette,
      Sound: Music,
      "Costume & Make-Up": Shirt,
      "Visual Effects": Sparkles,
      Crew: UsersRound,
      Lighting: SunMedium,
    };
    return iconMap[category] || UsersRound;
  };

  // Get cast array or crew grouped by job
  const getCategoryData = (category) => {
    if (category === "Cast") return movieData.cast || [];
    if (movieData.crew && movieData.crew[category]) {
      return movieData.crew[category];
    }
    return [];
  };

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setSelectedCategory(category);
  };

  const currentData = getCategoryData(selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="
              w-[1448px]
              h-[1031px]
              max-h-[95vh]
              bg-[var(--bg-secondary)]
              rounded-t-[20px]
              shadow-lg
              flex
              flex-col
              overflow-hidden
              relative
            "
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/15">
              <div className="flex flex-col ml-8 flex-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {movie?.title || "Dune: Part Two"}
                  </h2>
                  <h3 className="text-sm text-[var(--text-secondary)]">
                    (
                    {new Date(
                      movie?.release_date || "2024-01-01"
                    ).getFullYear()}
                    )
                  </h3>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2">
                  Full Cast & Crew
                </h3>
              </div>
              <button
                className="w-[42px] h-[42px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <div className="w-[340px] border-r border-white/15 flex flex-col ml-8">
                <div className="flex-1 overflow-y-auto px-5 py-6 custom-scroll">
                  <div className="flex flex-col gap-3">
                    {categories.map((cat, index) => {
                      const isSelected = selectedCategory === cat;
                      const Icon = getCategoryIcon(cat);
                      const count =
                        cat === "Cast"
                          ? getCategoryData("Cast").length
                          : Object.values(movieData.crew?.[cat] || {}).reduce(
                              (acc, arr) => acc + arr.length,
                              0
                            );
                      return (
                        <motion.button
                          key={cat}
                          onClick={() => handleCategoryChange(cat)}
                          className={`
                            flex items-center justify-between py-2.5 px-3 rounded-lg
                            transition-all duration-200 text-sm group w-full
                            border
                            ${
                              isSelected
                                ? "bg-[var(--accent-main)]/10 text-[var(--accent-main)] border-[var(--accent-main)]/20"
                                : "text-[var(--text-primary)] hover:bg-white/5 hover:text-[var(--accent-main)] border-transparent"
                            }
                          `}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isSelected
                                  ? "text-[var(--accent-main)]"
                                  : "text-[var(--text-secondary)] group-hover:text-[var(--accent-main)]"
                              } transition-colors duration-200`}
                            />
                            <span className="font-medium text-left leading-tight">
                              {cat}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-md transition-colors duration-200 font-medium min-w-[24px] text-center ${
                                isSelected
                                  ? "bg-[var(--accent-main)]/20 text-[var(--accent-main)]"
                                  : "bg-white/5 text-[var(--text-secondary)] group-hover:bg-[var(--accent-main)]/10"
                              }`}
                            >
                              {count}
                            </span>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar Footer */}
                <div className="px-5 py-4 border-t border-white/10">
                  <div className="text-xs text-[var(--text-secondary)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Total People:</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {categories.reduce((acc, cat) => {
                          if (cat === "Cast") {
                            return acc + (movieData.cast?.length || 0);
                          }
                          return (
                            acc +
                            Object.values(movieData.crew?.[cat] || {}).reduce(
                              (s, arr) => s + (arr?.length || 0),
                              0
                            )
                          );
                        }, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Categories:</span>
                      <span className="font-medium text-[var(--accent-main)]">
                        {categories.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                ref={contentRef}
                className="flex-1 px-8 py-6 overflow-y-auto custom-scroll"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedCategory === "Cast" ? (
                      // Cast grid with fallback icon for missing images
                      <div
                        className="grid gap-6 justify-center"
                        style={{
                          gridTemplateColumns: "repeat(auto-fill, 170px)",
                        }}
                      >
                        {currentData.map((person, idx) => (
                          <motion.div
                            key={`${selectedCategory}-${person.name}-${idx}`}
                            className="flex flex-col items-center w-[170px] cursor-pointer group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                          >
                            <div
                              className="w-[170px] h-[170px] rounded-[20px] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200"
                              style={{
                                backgroundColor: "hsla(0,0%,64%,0.15)", // --bg-trans-15
                              }}
                            >
                              {person.profile_url ? (
                                <img
                                  src={person.profile_url}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/api/placeholder/170/170";
                                  }}
                                />
                              ) : (
                                <UserRound
                                  className="w-20 h-20"
                                  style={{ color: "hsl(0,0%,76%)" }} // --text-secondary
                                />
                              )}
                            </div>
                            <div className="h-[12px]" />
                            <p className="text-[var(--text-primary)] text-[15px] font-medium break-words w-full text-left group-hover:text-[var(--accent-main)] group-hover:underline transition-colors duration-200">
                              {person.name}
                            </p>
                            <p className="text-[var(--text-secondary)] text-[14px] w-full text-left">
                              {person.character}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      // Crew grouped by job with fallback icon for missing images
                      <div className="flex flex-col gap-10">
                        {Object.entries(currentData || {}).map(
                          ([job, people]) => (
                            <div key={job}>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                {job}
                              </h3>
                              <div
                                className="grid gap-6"
                                style={{
                                  gridTemplateColumns:
                                    "repeat(auto-fill, 170px)",
                                }}
                              >
                                {people.map((person, idx) => (
                                  <motion.div
                                    key={`${selectedCategory}-${person.name}-${job}-${idx}`}
                                    className="flex flex-col items-center w-[170px] cursor-pointer group"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: idx * 0.05,
                                    }}
                                  >
                                    <div
                                      className="w-[170px] h-[170px] rounded-[20px] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200"
                                      style={{
                                        backgroundColor: "hsla(0,0%,64%,0.15)", // --bg-trans-15
                                      }}
                                    >
                                      {person.profile_url ? (
                                        <img
                                          src={person.profile_url}
                                          alt={person.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                              "/api/placeholder/170/170";
                                          }}
                                        />
                                      ) : (
                                        (() => {
                                          const Icon =
                                            getCategoryIcon(selectedCategory);
                                          return (
                                            <Icon
                                              className="w-20 h-20"
                                              style={{ color: "hsl(0,0%,76%)" }} // --text-secondary
                                            />
                                          );
                                        })()
                                      )}
                                    </div>
                                    <div className="h-[12px]" />
                                    <p className="text-[var(--text-primary)] text-[15px] font-medium break-words w-full text-left group-hover:text-[var(--accent-main)] group-hover:underline transition-colors duration-200">
                                      {person.name}
                                    </p>
                                    {/* job title removed */}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
