import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image,
  Languages,
} from "lucide-react";
import { data } from "../../data/photosdata";
import PhotoViewer from "./PhotoViewer";

export default function PhotosModal({
  isOpen,
  onClose,
  movie,
  selectedPhoto: initialPhoto,
}) {
  const [selectedPhotoType, setSelectedPhotoType] = useState("backdrops");
  const [selectedLanguage, setSelectedLanguage] = useState("no-language");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPhotoTypeOpen, setIsPhotoTypeOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const contentRef = useRef(null);
  const photoTypeRef = useRef(null);
  const languageRef = useRef(null);
  const itemsPerPage = 25;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        photoTypeRef.current &&
        !photoTypeRef.current.contains(event.target)
      ) {
        setIsPhotoTypeOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedPhotoType("backdrops");
      setSelectedLanguage("no-language");
      setCurrentPage(1);
      setIsPhotoTypeOpen(false);
      setIsLanguageOpen(false);
      setIsAnimating(false);

      // Set selected photo if provided
      if (initialPhoto) {
        setSelectedPhoto(initialPhoto);
      } else {
        setSelectedPhoto(null);
      }
    }
  }, [isOpen, initialPhoto]);

  // Auto-detect photo category when opening with selected photo
  useEffect(() => {
    if (isOpen && initialPhoto) {
      const photoCategory = Object.keys(data).find((cat) => {
        const categoryData = data[cat];
        return (
          Array.isArray(categoryData) &&
          categoryData.some((p) => p.file_path === initialPhoto.file_path)
        );
      });

      if (photoCategory) {
        setSelectedPhotoType(photoCategory);
      }
    }
  }, [isOpen, initialPhoto]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, selectedPhoto]);

  // Handle photo click
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle view all similar photos
  const handleViewAllSimilar = (photo) => {
    const category = Object.keys(data).find((cat) => {
      const categoryData = data[cat];
      return (
        Array.isArray(categoryData) &&
        categoryData.some((p) => p.file_path === photo.file_path)
      );
    });

    if (category) {
      setSelectedPhotoType(category);
      setSelectedPhoto(null);
      setCurrentPage(1);
    }
  };

  // Animated page change with scroll to top
  const handlePageChangeAnimated = async (newPage) => {
    if (newPage === currentPage || isAnimating) return;

    setIsAnimating(true);

    // Scroll to top with animation
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    setCurrentPage(newPage);
    setIsAnimating(false);
  };

  // Animated filter change
  const handleFilterChange = async (filterType, value) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (filterType === "photoType") {
      setSelectedPhotoType(value);
      setIsPhotoTypeOpen(false);
    } else if (filterType === "language") {
      setSelectedLanguage(value);
      setIsLanguageOpen(false);
    }

    setCurrentPage(1);
    setIsAnimating(false);
  };

  const photoTypeOptions = [
    { value: "backdrops", label: "Backdrops" },
    { value: "posters", label: "Posters" },
    { value: "logos", label: "Logos" },
  ];

  const getLanguageOptions = () => {
    if (!data)
      return [
        { value: "no-language", label: "No Language" },
        { value: "all", label: "All Languages" },
      ];

    const languages = new Set();
    Object.values(data)
      .filter(Array.isArray)
      .flat()
      .forEach((item) => {
        if (item.iso_639_1) {
          languages.add(item.iso_639_1);
        }
      });

    return [
      { value: "no-language", label: "No Language" },
      { value: "all", label: "All Languages" },
      ...Array.from(languages)
        .sort()
        .map((lang) => ({
          value: lang,
          label: lang.toUpperCase(),
        })),
    ];
  };

  const languageOptions = getLanguageOptions();

  const getFilteredPhotos = () => {
    if (!data || !data[selectedPhotoType]) return [];
    let photos = data[selectedPhotoType];

    // Safety check
    if (!Array.isArray(photos)) return [];

    if (selectedLanguage === "all") {
      return photos;
    } else if (selectedLanguage === "no-language") {
      return photos.filter(
        (photo) => !photo.iso_639_1 || photo.iso_639_1.trim() === ""
      );
    } else {
      return photos.filter((photo) => photo.iso_639_1 === selectedLanguage);
    }
  };

  const filteredPhotos = getFilteredPhotos();
  const totalItems = filteredPhotos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPhotos = filteredPhotos.slice(startIndex, endIndex);

  const getImageUrl = (photo, size = "w500") =>
    `https://image.tmdb.org/t/p/${size}${photo.file_path}`;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [];
    if (validCurrentPage <= 4) {
      pages = [1, 2, 3, 4, 5, "...", totalPages];
    } else if (validCurrentPage >= totalPages - 3) {
      pages = [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [
        1,
        "...",
        validCurrentPage - 1,
        validCurrentPage,
        validCurrentPage + 1,
        "...",
        totalPages,
      ];
    }
    return pages;
  };

  // Helper function to get photo category safely
  const getPhotoCategory = (photo) => {
    if (!photo || !data) return null;
    return Object.keys(data).find((cat) => {
      const categoryData = data[cat];
      return (
        Array.isArray(categoryData) &&
        categoryData.some((p) => p.file_path === photo.file_path)
      );
    });
  };

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
            className="w-[1448px] h-[1031px] max-h-[95vh] bg-[var(--bg-secondary)] rounded-t-[20px] shadow-lg flex flex-col overflow-hidden relative"
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
                    Dune: Part Two
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
                  {selectedPhoto
                    ? photoTypeOptions.find(
                        (opt) => opt.value === getPhotoCategory(selectedPhoto)
                      )?.label || "Photo"
                    : "Posters, Backdrops & Logos"}
                </h3>

                {/* Filters on new line below heading - only show when not in photo viewer */}
                {!selectedPhoto && (
                  <div className="flex items-center justify-between mt-3">
                    {/* Left side - Filters */}
                    <div className="flex gap-3">
                      {/* Photo Type */}
                      <div className="relative" ref={photoTypeRef}>
                        <button
                          className="flex items-center gap-2 bg-[var(--bg-trans-15)] px-3 py-1.5 rounded-[8px] shadow-inner text-xs cursor-pointer hover:bg-[var(--accent-main)] transition-colors duration-200 group"
                          onClick={() => setIsPhotoTypeOpen(!isPhotoTypeOpen)}
                        >
                          <Image className="w-3 h-3 group-hover:text-[#121212]" />
                          <span className="text-[var(--text-primary)] group-hover:text-[#121212]">
                            Type:
                          </span>
                          <span className="text-[var(--text-secondary)] group-hover:text-[#121212]">
                            {
                              photoTypeOptions.find(
                                (opt) => opt.value === selectedPhotoType
                              )?.label
                            }
                          </span>
                          <motion.div
                            animate={{ rotate: isPhotoTypeOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-3 h-3 group-hover:text-[#121212]" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isPhotoTypeOpen && (
                            <motion.div
                              className="absolute top-full left-0 mt-1 bg-[var(--bg-primary)] rounded-[8px] shadow-lg z-20 min-w-full"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {photoTypeOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-3 py-1.5 text-xs first:rounded-t-[8px] last:rounded-b-[8px] transition-colors duration-200 ${
                                    selectedPhotoType === option.value
                                      ? "bg-[var(--accent-main)] text-[#121212]"
                                      : "text-[var(--text-primary)] hover:bg-[var(--bg-trans-15)]"
                                  }`}
                                  onClick={() =>
                                    handleFilterChange(
                                      "photoType",
                                      option.value
                                    )
                                  }
                                >
                                  {option.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Language */}
                      <div className="relative" ref={languageRef}>
                        <button
                          className="flex items-center gap-2 bg-[var(--bg-trans-15)] px-3 py-1.5 rounded-[8px] shadow-inner text-xs cursor-pointer hover:bg-[var(--accent-main)] transition-colors duration-200 group"
                          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                        >
                          <Languages className="w-3 h-3 group-hover:text-[#121212]" />
                          <span className="text-[var(--text-primary)] group-hover:text-[#121212]">
                            Lang:
                          </span>
                          <span className="text-[var(--text-secondary)] group-hover:text-[#121212]">
                            {
                              languageOptions.find(
                                (opt) => opt.value === selectedLanguage
                              )?.label
                            }
                          </span>
                          <motion.div
                            animate={{ rotate: isLanguageOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-3 h-3 group-hover:text-[#121212]" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isLanguageOpen && (
                            <motion.div
                              className="absolute top-full left-0 mt-1 bg-[var(--bg-primary)] rounded-[8px] shadow-lg z-20 min-w-full max-h-48 overflow-y-auto"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {languageOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-3 py-1.5 text-xs first:rounded-t-[8px] last:rounded-b-[8px] transition-colors duration-200 ${
                                    selectedLanguage === option.value
                                      ? "bg-[var(--accent-main)] text-[#121212]"
                                      : "text-[var(--text-primary)] hover:bg-[var(--bg-trans-15)]"
                                  }`}
                                  onClick={() =>
                                    handleFilterChange("language", option.value)
                                  }
                                >
                                  {option.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Right side - Results Counter */}
                    <div className="text-[var(--text-secondary)] text-sm">
                      {totalItems > 0
                        ? `${startIndex + 1}-${endIndex} of ${totalItems}`
                        : "0 of 0"}
                    </div>
                  </div>
                )}
              </div>
              <button
                className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 hover:cursor-pointer hover:bg-[var(--bg-trans-15)] transition-all duration-200"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto custom-scroll ml-8"
            >
              {selectedPhoto ? (
                <PhotoViewer
                  selectedPhoto={selectedPhoto}
                  setSelectedPhoto={setSelectedPhoto}
                  data={data}
                  selectedLanguage={selectedLanguage}
                  photoTypeOptions={photoTypeOptions}
                  getImageUrl={getImageUrl}
                  handleViewAllSimilar={handleViewAllSimilar}
                />
              ) : (
                /* Photo Grid View */
                <>
                  {/* Grid */}
                  <div className="w-[1267px] mx-auto mb-8 mt-8">
                    <AnimatePresence mode="wait">
                      {currentPhotos.length > 0 ? (
                        <motion.div
                          key={`${selectedPhotoType}-${selectedLanguage}-${validCurrentPage}`}
                          className="grid grid-cols-5 gap-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {currentPhotos.map((photo, idx) => (
                            <motion.div
                              key={`${photo.file_path}-${idx}`}
                              className="cursor-pointer group"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              onClick={() => handlePhotoClick(photo)}
                            >
                              <div
                                className={`w-[236px] h-[236px] rounded-[3px] overflow-hidden group-hover:scale-105 transition-transform duration-200 ${
                                  selectedPhotoType === "logos"
                                    ? "bg-[var(--bg-primary)]"
                                    : "bg-gray-300"
                                }`}
                              >
                                <img
                                  src={getImageUrl(photo)}
                                  alt={`${selectedPhotoType} ${idx + 1}`}
                                  className={`w-full h-full ${
                                    selectedPhotoType === "logos"
                                      ? "object-contain"
                                      : "object-cover"
                                  }`}
                                  onError={(e) => {
                                    e.target.src = "/api/placeholder/236/236";
                                  }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          className="text-center py-12 text-[var(--text-secondary)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          No {selectedPhotoType} found for the selected
                          language.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Pagination - centered without results counter */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pb-8 px-6">
                      {/* Prev */}
                      <button
                        onClick={() =>
                          handlePageChangeAnimated(validCurrentPage - 1)
                        }
                        disabled={validCurrentPage === 1 || isAnimating}
                        className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                          validCurrentPage > 1 && !isAnimating
                            ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
                            : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Pages */}
                      {getPageNumbers().map((page, idx) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-[var(--text-secondary)]"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${page}`}
                            onClick={() => handlePageChangeAnimated(page)}
                            disabled={isAnimating}
                            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                              validCurrentPage === page
                                ? "bg-[var(--accent-main)] text-[#121212]"
                                : "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
                            } ${
                              isAnimating ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      {/* Next */}
                      <button
                        onClick={() =>
                          handlePageChangeAnimated(validCurrentPage + 1)
                        }
                        disabled={
                          validCurrentPage === totalPages || isAnimating
                        }
                        className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                          validCurrentPage < totalPages && !isAnimating
                            ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
                            : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
