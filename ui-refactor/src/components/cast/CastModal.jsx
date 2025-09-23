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
  Search,
} from "lucide-react";
import { movieData } from "../../data/castandcrewdata";

// Helper function to construct TMDB image URL
function getTMDBImageUrl(profilePath, size = "w185") {
  if (!profilePath) return null;
  return `https://image.tmdb.org/t/p/${size}${profilePath}`;
}

export default function CastAndCrewModal({ isOpen, onClose, movie }) {
  const [selectedCategory, setSelectedCategory] = useState("Cast");
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Reset category to "Cast" and clear search on modal open
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("Cast");
      setSearchQuery("");
    }
  }, [isOpen]);

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) {
          setSearchQuery("");
          searchInputRef.current?.blur();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, searchQuery]);

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

  // Filter function for search
  const filterBySearch = (people, query) => {
    if (!query.trim()) return people;
    const searchTerm = query.toLowerCase().trim();

    if (Array.isArray(people)) {
      return people.filter(
        (person) =>
          person.name.toLowerCase().includes(searchTerm) ||
          person.character?.toLowerCase().includes(searchTerm) ||
          person.job?.toLowerCase().includes(searchTerm)
      );
    } else {
      // For crew data (object of job -> people arrays)
      const filtered = {};
      Object.entries(people).forEach(([job, jobPeople]) => {
        const filteredPeople = jobPeople.filter(
          (person) =>
            person.name.toLowerCase().includes(searchTerm) ||
            job.toLowerCase().includes(searchTerm)
        );
        if (filteredPeople.length > 0) {
          filtered[job] = filteredPeople;
        }
      });
      return filtered;
    }
  };

  // Get cast array or crew grouped by job
  const getCategoryData = (category) => {
    if (category === "Cast") return movieData.cast || [];
    if (movieData.crew && movieData.crew[category]) {
      return movieData.crew[category];
    }
    return [];
  };

  // Get filtered data based on search
  const getFilteredData = (category) => {
    const data = getCategoryData(category);
    return filterBySearch(data, searchQuery);
  };

  // Count total people in filtered results
  const getFilteredCount = (category) => {
    const filtered = getFilteredData(category);
    if (category === "Cast") {
      return filtered.length;
    } else {
      return Object.values(filtered).reduce((acc, arr) => acc + arr.length, 0);
    }
  };

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const currentData = getFilteredData(selectedCategory);
  const hasResults =
    selectedCategory === "Cast"
      ? currentData.length > 0
      : Object.keys(currentData).length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[var(--bg-modal)]"
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
            <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border-modal)]">
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

              {/* Search Bar */}
              <div className="relative flex-1 max-w-[400px] mx-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search cast & crew..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-trans-15)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-main)]/20 focus:border-[var(--accent-main)] transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <button
                className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 hover:cursor-pointer hover:bg-[var(--bg-button-hover)] transition-all duration-200"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <div className="w-[340px] border-r border-[var(--border-modal)] flex flex-col ml-8">
                <div className="flex-1 overflow-y-auto px-5 py-6 custom-scroll">
                  <div className="flex flex-col gap-3">
                    {categories.map((cat, index) => {
                      const isSelected = selectedCategory === cat;
                      const Icon = getCategoryIcon(cat);
                      const count = searchQuery
                        ? getFilteredCount(cat)
                        : cat === "Cast"
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
                            transition-all duration-200 text-sm group w-full cursor-pointer
                            border
                            ${
                              isSelected
                                ? "bg-[var(--accent-main)]/10 text-[var(--accent-main)] border-[var(--accent-main)]/20"
                                : "text-[var(--text-primary)] hover:bg-[var(--bg-hover-subtle)] hover:text-[var(--accent-main)] border-transparent"
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
                                  : "bg-[var(--bg-hover-subtle)] text-[var(--text-secondary)] group-hover:bg-[var(--accent-main)]/10"
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
                <div className="px-5 py-4 border-t border-[var(--border-secondary)]">
                  <div className="text-xs text-[var(--text-secondary)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{searchQuery ? "Filtered:" : "Total People:"}</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {searchQuery
                          ? categories.reduce(
                              (acc, cat) => acc + getFilteredCount(cat),
                              0
                            )
                          : categories.reduce((acc, cat) => {
                              if (cat === "Cast") {
                                return acc + (movieData.cast?.length || 0);
                              }
                              return (
                                acc +
                                Object.values(
                                  movieData.crew?.[cat] || {}
                                ).reduce((s, arr) => s + (arr?.length || 0), 0)
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
                    key={`${selectedCategory}-${searchQuery}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {!hasResults && searchQuery ? (
                      // No results message
                      <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <Search className="w-16 h-16 text-[var(--text-secondary)] mb-4" />
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                          No results found
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                          No cast or crew members match "{searchQuery}" in{" "}
                          {selectedCategory}
                        </p>
                        <button
                          onClick={clearSearch}
                          className="px-4 py-2 bg-[var(--accent-main)] text-white rounded-lg hover:bg-[var(--accent-main)]/90 transition-colors duration-200"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : selectedCategory === "Cast" ? (
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
                            <div className="w-[170px] h-[170px] rounded-[20px] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200 bg-[var(--bg-trans-15)]">
                              {person.profile_path ? (
                                <img
                                  src={getTMDBImageUrl(
                                    person.profile_path,
                                    "w185"
                                  )}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.replaceWith(
                                      (() => {
                                        const fallbackDiv =
                                          document.createElement("div");
                                        fallbackDiv.className =
                                          "w-full h-full flex items-center justify-center";
                                        fallbackDiv.innerHTML = `<svg class="w-20 h-20 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
                                        return fallbackDiv;
                                      })()
                                    );
                                  }}
                                />
                              ) : (
                                <UserRound className="w-20 h-20 text-[var(--text-secondary)]" />
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
                                    <div className="w-[170px] h-[170px] rounded-[20px] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200 bg-[var(--bg-trans-15)]">
                                      {person.profile_path ? (
                                        <img
                                          src={getTMDBImageUrl(
                                            person.profile_path,
                                            "w185"
                                          )}
                                          alt={person.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.replaceWith(
                                              (() => {
                                                const fallbackDiv =
                                                  document.createElement("div");
                                                fallbackDiv.className =
                                                  "w-full h-full flex items-center justify-center";
                                                const Icon =
                                                  getCategoryIcon(
                                                    selectedCategory
                                                  );
                                                fallbackDiv.innerHTML = `<svg class="w-20 h-20 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">${
                                                  Icon === UserRound
                                                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>'
                                                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>'
                                                }</svg>`;
                                                return fallbackDiv;
                                              })()
                                            );
                                          }}
                                        />
                                      ) : (
                                        (() => {
                                          const Icon =
                                            getCategoryIcon(selectedCategory);
                                          return (
                                            <Icon className="w-20 h-20 text-[var(--text-secondary)]" />
                                          );
                                        })()
                                      )}
                                    </div>
                                    <div className="h-[12px]" />
                                    <p className="text-[var(--text-primary)] text-[15px] font-medium break-words w-full text-left group-hover:text-[var(--accent-main)] group-hover:underline transition-colors duration-200">
                                      {person.name}
                                    </p>
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
