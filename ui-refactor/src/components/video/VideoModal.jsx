import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  SquarePlay,
  ArrowUp,
  ArrowDown,
  ImageOff,
} from "lucide-react";
import { data } from "../../data/videodata";
import { YouTubeThumbnail } from "./YouTubeThumbnail";
import { movieData } from "../../data/movieDetails";

export default function VideosModal({
  isOpen,
  onClose,
  movie,
  selectedVideo: initialSelectedVideo,
}) {
  const [selectedVideoType, setSelectedVideoType] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isVideoTypeOpen, setIsVideoTypeOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const contentRef = useRef(null);
  const videoTypeRef = useRef(null);
  const itemsPerPage = 9;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        videoTypeRef.current &&
        !videoTypeRef.current.contains(event.target)
      ) {
        setIsVideoTypeOpen(false);
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
      setSelectedVideoType("all");
      setSelectedSortBy("newest");
      setCurrentPage(1);
      setIsVideoTypeOpen(false);
      setIsAnimating(false);

      // Set the initial selected video if passed from VideoBlock
      if (initialSelectedVideo) {
        setSelectedVideo(initialSelectedVideo);
      } else {
        setSelectedVideo(null);
      }
    }
  }, [isOpen, initialSelectedVideo]);

  // Auto-detect video category when opening with selected video
  useEffect(() => {
    if (isOpen && initialSelectedVideo) {
      const videoCategory = Object.keys(data).find((cat) => {
        const categoryData = data[cat];
        return (
          Array.isArray(categoryData) &&
          categoryData.some((v) => v.key === initialSelectedVideo.key)
        );
      });

      if (videoCategory) {
        setSelectedVideoType(videoCategory);
      }
    }
  }, [isOpen, initialSelectedVideo]);

  // Update the escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (selectedVideo) {
          setSelectedVideo(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, selectedVideo]);

  // Handle video click
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get similar videos from the same category
  const getSimilarVideos = (currentVideo) => {
    if (!currentVideo || !data) return [];

    const currentVideoCategory = Object.keys(data).find((category) =>
      data[category].some((video) => video.key === currentVideo.key)
    );

    if (!currentVideoCategory) return [];

    return data[currentVideoCategory]
      .filter((video) => video.key !== currentVideo.key)
      .slice(0, 4);
  };

  // Handle view all similar videos
  const handleViewAllSimilar = (video) => {
    const category = Object.keys(data).find((cat) =>
      data[cat].some((v) => v.key === video.key)
    );

    if (category) {
      setSelectedVideoType(category);
      setSelectedVideo(null);
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

  // Handle video type change
  const handleVideoTypeChange = async (newVideoType) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    setSelectedVideoType(newVideoType);
    setIsVideoTypeOpen(false);
    setCurrentPage(1);
    setIsAnimating(false);
  };

  // Handle sort toggle
  const handleSortToggle = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    setSelectedSortBy(selectedSortBy === "newest" ? "oldest" : "newest");
    setCurrentPage(1);
    setIsAnimating(false);
  };

  // Get count for each video type
  const getVideoTypeCount = (videoType) => {
    if (videoType === "all") {
      return Object.values(data).flat().length;
    }
    if (!data || !data[videoType] || !Array.isArray(data[videoType])) {
      return 0;
    }
    return data[videoType].length;
  };

  const videoTypeOptions = [
    { value: "all", label: "All", count: getVideoTypeCount("all") },
    {
      value: "trailers_teasers",
      label: "Trailers & Teasers",
      count: getVideoTypeCount("trailers_teasers"),
    },
    { value: "clips", label: "Clips", count: getVideoTypeCount("clips") },
    {
      value: "bts",
      label: "Behind the Scenes",
      count: getVideoTypeCount("bts"),
    },
    {
      value: "featurettes",
      label: "Featurettes",
      count: getVideoTypeCount("featurettes"),
    },
    {
      value: "bloopers",
      label: "Bloopers",
      count: getVideoTypeCount("bloopers"),
    },
    { value: "others", label: "Others", count: getVideoTypeCount("others") },
  ];

  const getFilteredVideos = () => {
    if (!data) return [];

    let videos = [];
    if (selectedVideoType === "all") {
      videos = Object.values(data).flat();
    } else {
      videos = data[selectedVideoType] || [];
    }

    const sortedVideos = [...videos];
    if (selectedSortBy === "newest") {
      return sortedVideos.sort((a, b) => {
        const dateA = new Date(a.published_date || "1900-01-01");
        const dateB = new Date(b.published_date || "1900-01-01");
        return dateB - dateA;
      });
    } else {
      return sortedVideos.sort((a, b) => {
        const dateA = new Date(a.published_date || "1900-01-01");
        const dateB = new Date(b.published_date || "1900-01-01");
        return dateA - dateB;
      });
    }
  };

  const filteredVideos = getFilteredVideos();
  const totalItems = filteredVideos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

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

  // Get YouTube embed URL with minimal branding
  const getYouTubeEmbedUrl = (video) => {
    if (!video.key) return "";
    return `https://www.youtube.com/embed/${video.key}?modestbranding=1&showinfo=0&rel=0&controls=1&autoplay=1`;
  };

  // Get sort icon based on current sort
  const getSortIcon = () => {
    if (selectedSortBy === "newest") {
      return (
        <ArrowDown className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary-dark)]" />
      );
    } else {
      return (
        <ArrowUp className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary-dark)]" />
      );
    }
  };

  // Get sort label
  const getSortLabel = () => {
    return selectedSortBy === "newest" ? "Newest First" : "Oldest First";
  };

  const similarVideos = selectedVideo ? getSimilarVideos(selectedVideo) : [];

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
            className="w-[1448px] h-[1031px] max-h-[95vh] bg-[var(--bg-secondary)] rounded-t-[20px] shadow-lg flex flex-col overflow-hidden relative"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - with proper left alignment */}
            <div className="flex items-start justify-between border-b border-[var(--border-modal)] pl-[90px] pr-6 py-5">
              <div className="flex flex-col flex-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {movieData.primary.title}
                  </h2>
                  <h3 className="text-sm text-[var(--text-secondary)]">
                    ({movieData.primary.release_date.year})
                  </h3>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2">
                  {selectedVideo
                    ? selectedVideo.name
                    : "Trailers, Clips & Behind the Scenes"}
                </h3>

                {/* Filters on new line below heading - only show when not in video viewer */}
                {!selectedVideo && (
                  <div className="flex items-center justify-between mt-3">
                    {/* Left side - Filters */}
                    <div className="flex gap-3">
                      {/* Video Type */}
                      <div className="relative" ref={videoTypeRef}>
                        <button
                          className="flex items-center gap-2 bg-[var(--bg-trans-15)] px-4 py-2.5 rounded-[8px] shadow-inner text-sm cursor-pointer hover:bg-[var(--accent-main)] transition-colors duration-200 group"
                          onClick={() => setIsVideoTypeOpen(!isVideoTypeOpen)}
                        >
                          <SquarePlay className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary-dark)]" />
                          <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary-dark)]">
                            Type:
                          </span>
                          <span className="text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]">
                            {
                              videoTypeOptions.find(
                                (opt) => opt.value === selectedVideoType
                              )?.label
                            }
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-md transition-colors duration-200 font-medium min-w-[24px] text-center bg-[var(--bg-hover-subtle)] text-[var(--text-secondary)] group-hover:bg-[var(--text-primary-dark)]/20 group-hover:text-[var(--text-primary-dark)]`}
                          >
                            {videoTypeOptions.find(
                              (opt) => opt.value === selectedVideoType
                            )?.count || 0}
                          </span>
                          <motion.div
                            animate={{ rotate: isVideoTypeOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary-dark)]" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isVideoTypeOpen && (
                            <motion.div
                              className="absolute top-full left-0 mt-1 bg-[var(--dropdown-bg)] border border-[var(--border-modal)] rounded-[8px] shadow-lg z-20 min-w-full whitespace-nowrap"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {videoTypeOptions.map((option) => {
                                const isSelected =
                                  selectedVideoType === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer first:rounded-t-[8px] last:rounded-b-[8px] transition-colors duration-200 flex justify-between items-center group ${
                                      isSelected
                                        ? "bg-[var(--dropdown-selected)] text-[var(--text-primary-dark)]"
                                        : "text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)]"
                                    }`}
                                    onClick={() =>
                                      handleVideoTypeChange(option.value)
                                    }
                                  >
                                    <span className="mr-8">{option.label}</span>
                                    <span
                                      className={`text-xs px-1.5 py-0.5 rounded-md transition-colors duration-200 font-medium min-w-[24px] text-center ${
                                        isSelected
                                          ? "bg-[var(--text-primary-dark)]/20 text-[var(--text-primary-dark)]"
                                          : "bg-[var(--bg-hover-subtle)] text-[var(--text-secondary)] group-hover:bg-[var(--bg-hover-subtle)] group-hover:text-[var(--text-primary)]"
                                      }`}
                                    >
                                      {option.count}
                                    </span>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Sort Toggle */}
                      <button
                        className="flex items-center gap-2 bg-[var(--bg-trans-15)] px-4 py-2.5 rounded-[8px] shadow-inner text-sm cursor-pointer hover:bg-[var(--accent-main)] transition-colors duration-200 group"
                        onClick={handleSortToggle}
                        disabled={isAnimating}
                      >
                        {getSortIcon()}
                        <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary-dark)] flex-shrink-0">
                          Sort:
                        </span>
                        <span className="text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)] whitespace-nowrap">
                          {getSortLabel()}
                        </span>
                      </button>
                    </div>

                    {/* Right side - Results Counter */}
                    <div className="text-[var(--text-secondary)] text-sm ml-auto">
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
              className="flex-1 overflow-y-auto custom-scroll"
            >
              {selectedVideo ? (
                /* Video Player View */
                <div className="px-6 py-6">
                  {/* Video Player - centered */}
                  <div className="flex justify-center mb-6">
                    <iframe
                      width="990"
                      height="557"
                      src={getYouTubeEmbedUrl(selectedVideo)}
                      title={selectedVideo.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-[10px]"
                      style={{
                        boxShadow: "var(--shadow-video)",
                      }}
                    ></iframe>
                  </div>

                  {/* Similar Videos Section */}
                  {similarVideos.length > 0 && (
                    <div className="max-w-[1267px] mx-auto">
                      {/* Heading and View All Button */}
                      <div className="flex items-center gap-[10px] mb-6">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          Similar Videos
                        </h3>
                        <button
                          onClick={() => handleViewAllSimilar(selectedVideo)}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-trans-15)] rounded-[8px] hover:bg-[var(--accent-main)] transition-colors duration-200 group cursor-pointer"
                        >
                          <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]">
                            View All
                          </span>
                          <ChevronRight className="w-4 h-4 text-[var(--text-primary)] group-hover:text-[var(--text-primary-dark)]" />
                        </button>
                      </div>

                      {/* Similar Videos Grid - properly aligned and spaced */}
                      <div className="grid grid-cols-4 gap-5">
                        {similarVideos.map((video, idx) => (
                          <motion.div
                            key={video.key || idx}
                            className="flex flex-col cursor-pointer group"
                            onClick={() => handleVideoClick(video)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                          >
                            <YouTubeThumbnail
                              videoKey={video.key}
                              alt={video.name || `Video ${idx + 1}`}
                              className="w-full h-full object-cover"
                              containerClassName="w-[302px] h-[170px] rounded-[8px] overflow-hidden group-hover:scale-105 transition-transform duration-200 bg-[var(--bg-primary)]"
                              fallbackIcon={ImageOff}
                              fallbackIconSize={40}
                            />
                            <p className="text-[var(--text-primary)] mt-2 text-sm leading-relaxed group-hover:underline group-hover:text-[var(--accent-main)] transition-colors line-clamp-2">
                              {video.name || "Untitled Video"}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Video Grid View */
                <>
                  {/* Grid */}
                  <div className="w-[1267px] mx-auto mb-8 mt-8">
                    <AnimatePresence mode="wait">
                      {currentVideos.length > 0 ? (
                        <motion.div
                          key={`${selectedVideoType}-${selectedSortBy}-${validCurrentPage}`}
                          className="grid grid-cols-3 gap-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {currentVideos.map((video, idx) => (
                            <motion.div
                              key={`${video.key || video.id || idx}`}
                              className="flex flex-col cursor-pointer group"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              onClick={() => handleVideoClick(video)}
                            >
                              <YouTubeThumbnail
                                videoKey={video.key}
                                alt={video.name || `Video ${idx + 1}`}
                                className="w-full h-full object-cover"
                                containerClassName="w-[409px] h-[230px] rounded-[8px] overflow-hidden group-hover:scale-105 transition-transform duration-200 bg-[var(--bg-primary)]"
                                fallbackIcon={ImageOff}
                                fallbackIconSize={60}
                              />
                              <div className="mt-3">
                                <p className="text-[var(--text-primary)] text-sm font-medium leading-relaxed w-[409px] line-clamp-2 group-hover:underline group-hover:text-[var(--accent-main)] transition-colors duration-200">
                                  {video.name || "Untitled Video"}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-[var(--text-secondary)] text-xs">
                                    {video.type || "Unknown Type"}
                                  </p>
                                  {video.published_date && (
                                    <>
                                      <span className="text-[var(--text-secondary)] text-xs">
                                        •
                                      </span>
                                      <p className="text-[var(--text-secondary)] text-xs">
                                        {new Date(
                                          video.published_date
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </>
                                  )}
                                </div>
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
                          No videos found for the selected filters.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
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
                                ? "bg-[var(--accent-main)] text-[var(--text-primary-dark)]"
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
