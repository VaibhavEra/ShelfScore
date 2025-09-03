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

// Define consistent master categories in desired order
const masterCategories = [
  "Cast",
  "Director",
  "Producers",
  "Executive Producers",
  "Writers",
  "Casting",
  "Editor",
  "Camera",
  "Production Design",
  "Art Direction",
  "Set Decoration",
  "Costume Design",
  "Makeup",
  "Special Effects",
  "Visual Effects",
  "Stunts",
  "Composer",
  "Songs",
  "Sound",
  "Lighting",
];

// Map categories to icons
const getCategoryIcon = (category) => {
  const iconMap = {
    Cast: UserRound,
    Director: Clapperboard,
    Producers: Film,
    "Executive Producers": Film,
    Writers: PenLine,
    Casting: UsersRound,
    Editor: Scissors,
    Camera: Video,
    "Production Design": Palette,
    "Art Direction": Palette,
    "Set Decoration": Palette,
    "Costume Design": Shirt,
    Makeup: Sparkles,
    "Special Effects": Sparkles,
    "Visual Effects": Sparkles,
    Stunts: UsersRound,
    Composer: Music,
    Songs: Music,
    Sound: Music,
    Lighting: SunMedium,
  };
  return iconMap[category] || UsersRound;
};

// Normalize raw movieData.crew into masterCategories using your exact keys
const normalizeCrewData = (crew) => {
  return {
    Director: crew?.Directing?.Director || movieData.director || [],

    Producers: [
      ...(crew?.Production?.Producer || []),
      ...(crew?.Production?.["Co-Producer"] || []),
    ],

    "Executive Producers": crew?.Production?.["Executive Producer"] || [],

    Writers: [
      ...(crew?.Writing?.Screenplay || []),
      ...(crew?.Writing?.Novel || []),
      ...(crew?.Crew?.["Additional Writing"] || []),
    ],

    Casting: [
      ...(crew?.Production?.Casting || []),
      ...(crew?.Production?.["Casting Assistant"] || []),
    ],

    Editor: crew?.Editing?.Editor || [],

    Camera: [
      ...(crew?.Camera?.["Director of Photography"] || []),
      ...(crew?.Camera?.["Camera Operator"] || []),
      ...(crew?.Camera?.['"A" Camera Operator'] || []),
      ...(crew?.Camera?.Grip || []),
      ...(crew?.Camera?.["Steadicam Operator"] || []),
      ...(crew?.Camera?.["Camera Technician"] || []),
    ],

    "Production Design": crew?.Art?.["Production Design"] || [],
    "Art Direction": [
      ...(crew?.Art?.["Art Direction"] || []),
      ...(crew?.Art?.["Supervising Art Director"] || []),
      ...(crew?.Art?.["Art Direction Intern"] || []),
      ...(crew?.Art?.["Assistant Art Director"] || []),
    ],
    "Set Decoration": [
      ...(crew?.Art?.["Set Decoration"] || []),
      ...(crew?.Art?.["Lead Set Dresser"] || []),
      ...(crew?.Art?.["Set Dresser"] || []),
      ...(crew?.Art?.["Set Designer"] || []),
      ...(crew?.Art?.["Set Decoration Buyer"] || []),
    ],

    "Costume Design": crew?.["Costume & Make-Up"]?.["Costume Design"] || [],
    Makeup: [
      ...(crew?.["Costume & Make-Up"]?.["Makeup Artist"] || []),
      ...(crew?.["Costume & Make-Up"]?.["Makeup Department Head"] || []),
      ...(crew?.["Costume & Make-Up"]?.["Prosthetic Designer"] || []),
      ...(crew?.["Costume & Make-Up"]?.["Prosthetic Makeup Artist"] || []),
      ...(crew?.["Costume & Make-Up"]?.["Hair Designer"] || []),
      ...(crew?.["Costume & Make-Up"]?.["Key Hair Stylist"] || []),
    ],

    "Special Effects": [
      ...(crew?.Crew?.["Special Effects Technician"] || []),
      ...(crew?.Crew?.["Special Effects Coordinator"] || []),
      ...(crew?.["Visual Effects"]?.["Special Effects Supervisor"] || []),
    ],

    "Visual Effects": [
      ...(crew?.["Visual Effects"]?.["Visual Effects Supervisor"] || []),
      ...(crew?.["Visual Effects"]?.["Visual Effects Producer"] || []),
      ...(crew?.["Visual Effects"]?.["Visual Effects Coordinator"] || []),
      ...(crew?.["Visual Effects"]?.["VFX Artist"] || []),
    ],

    Stunts: [
      ...(crew?.Crew?.["Stunt Coordinator"] || []),
      ...(crew?.Crew?.Stunts || []),
      ...(crew?.Crew?.["Stunt Double"] || []),
      ...(crew?.Crew?.["Fight Choreographer"] || []),
    ],

    Composer: crew?.Sound?.["Original Music Composer"] || [],
    Songs: [
      ...(crew?.Crew?.["Additional Music"] || []),
      ...(crew?.Sound?.Vocals || []),
    ],
    Sound: [
      ...(crew?.Sound?.["Sound Re-Recording Mixer"] || []),
      ...(crew?.Sound?.["Sound Mixer"] || []),
      ...(crew?.Sound?.["Production Sound Mixer"] || []),
      ...(crew?.Sound?.["Sound Effects Editor"] || []),
      ...(crew?.Sound?.["Dialogue Editor"] || []),
      ...(crew?.Sound?.["Foley Editor"] || []),
      ...(crew?.Sound?.["Foley Artist"] || []),
      ...(crew?.Sound?.["Supervising Sound Editor"] || []),
      ...(crew?.Sound?.["Sound Designer"] || []),
    ],

    Lighting: crew?.Lighting?.Gaffer || [],
  };
};

export default function CastAndCrewModal({ isOpen, onClose, movie }) {
  const [selectedCategory, setSelectedCategory] = useState("Cast");
  const contentRef = useRef(null);

  const crewData = normalizeCrewData(movieData.crew || {});

  // Sidebar list = master list, show only categories with data
  const categories = masterCategories.filter((cat) => {
    if (cat === "Cast") return (movieData.cast?.length || 0) > 0;
    return (crewData[cat]?.length || 0) > 0;
  });

  // Lock/unlock background scroll on modal open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (contentRef.current) contentRef.current.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset category when modal opens
  useEffect(() => {
    if (isOpen) setSelectedCategory("Cast");
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const getCategoryData = (category) => {
    if (category === "Cast") return movieData.cast || [];
    return crewData[category] || [];
  };

  const totalPeople =
    (movieData.cast?.length || 0) +
    Object.values(crewData).reduce((sum, arr) => sum + (arr?.length || 0), 0);

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
                      const count = getCategoryData(cat)?.length || 0;
                      return (
                        <motion.button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            if (contentRef.current)
                              contentRef.current.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                          }}
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
                              }`}
                            />
                            <span className="font-medium text-left leading-tight">
                              {cat}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-md font-medium min-w-[24px] text-center ${
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
                        {totalPeople}
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
                              style={{ backgroundColor: "hsla(0,0%,64%,0.15)" }}
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
                                  style={{ color: "hsl(0,0%,76%)" }}
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
                              style={{ backgroundColor: "hsla(0,0%,64%,0.15)" }}
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
                                (() => {
                                  const Icon =
                                    getCategoryIcon(selectedCategory);
                                  return (
                                    <Icon
                                      className="w-20 h-20"
                                      style={{ color: "hsl(0,0%,76%)" }}
                                    />
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
