import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Users,
  User,
  Camera,
  Film,
  Music,
  Palette,
  Wrench,
} from "lucide-react";
import { movieData } from "../../data/dune/modal/castandcrewdata";

export default function CastAndCrewModal({ isOpen, onClose, movie }) {
  const [selectedCategory, setSelectedCategory] = useState("Cast");
  const contentRef = useRef(null);

  const categories = ["Cast", "Director", ...Object.keys(movieData.crew || {})];

  // ✅ Same as PhotosModal: lock background scroll & reset content scroll
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

  // ✅ Reset category when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("Cast");
    }
  }, [isOpen]);

  // ✅ Support ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const getCategoryIcon = (category) => {
    const iconMap = {
      Cast: Users,
      Director: User,
      Cinematography: Camera,
      Production: Film,
      Music: Music,
      Art: Palette,
      Sound: Music,
      "Visual Effects": Wrench,
      Editing: Film,
      Writing: Film,
      "Costume & Make-Up": Palette,
    };
    return iconMap[category] || Film;
  };

  const getCategoryData = (category) => {
    if (category === "Cast") return movieData.cast || [];
    if (category === "Director") return movieData.director || [];
    if (movieData.crew && movieData.crew[category]) {
      const crewCategory = movieData.crew[category];
      const allPeople = [];
      Object.keys(crewCategory).forEach((job) => {
        crewCategory[job].forEach((person) => {
          allPeople.push({ ...person, job });
        });
      });
      return allPeople;
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
                {/* Scrollable Categories */}
                <div className="flex-1 overflow-y-auto px-5 py-6 custom-scroll">
                  <div className="flex flex-col gap-3">
                    {categories.map((cat, index) => {
                      const isSelected = selectedCategory === cat;
                      const Icon = getCategoryIcon(cat);
                      const count = getCategoryData(cat).length;
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
                        {categories.reduce(
                          (acc, cat) => acc + getCategoryData(cat).length,
                          0
                        )}
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
                className="flex-1 px-8 py-6 overflow-y-auto custom-scroll flex justify-center"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-none"
                  >
                    <div
                      className="grid gap-6 justify-center"
                      style={{
                        gridTemplateColumns: "repeat(auto-fill, 170px)",
                        maxWidth: "100%",
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
                          <div className="w-[170px] h-[170px] rounded-[20px] overflow-hidden bg-gray-300 group-hover:scale-105 transition-transform duration-200">
                            <img
                              src={
                                person.profile_url || "/api/placeholder/170/170"
                              }
                              alt={person.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/170/170";
                              }}
                            />
                          </div>

                          <div className="h-[12px]"></div>

                          {/* ✅ Person Name - now underline + highlight on hover */}
                          <p
                            className="text-[var(--text-primary)] text-[15px] leading-[1.4] font-medium break-words w-full 
                 group-hover:text-[var(--accent-main)] group-hover:underline transition-colors duration-200 text-left"
                          >
                            {person.name}
                          </p>

                          <p className="text-[var(--text-secondary)] text-[14px] leading-[1.3] break-words w-full text-left">
                            {person.character || person.job}
                          </p>
                        </motion.div>
                      ))}
                    </div>
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
