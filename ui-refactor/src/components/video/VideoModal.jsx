import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Youtube,
} from "lucide-react";
import { data } from "../../data/videodata";

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
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [brokenThumbnails, setBrokenThumbnails] = useState(new Set());

  const contentRef = useRef(null);
  const videoTypeRef = useRef(null);
  const sortByRef = useRef(null);
  const itemsPerPage = 9;

  // Helper function to generate thumbnail URL from key
  const getThumbnail = (key) =>
    `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;

  // Function to check if thumbnail is broken (120x90 YouTube placeholder)
  const checkThumbnailValidity = (imgElement, videoKey) => {
    if (imgElement.naturalWidth === 120 && imgElement.naturalHeight === 90) {
      setBrokenThumbnails((prev) => new Set(prev).add(videoKey));
      return false;
    }
    return true;
  };

  // Function to handle thumbnail load
  const handleThumbnailLoad = (e, videoKey) => {
    if (!checkThumbnailValidity(e.target, videoKey)) {
      e.target.style.display = "none";
      const fallbackDiv = e.target.nextElementSibling;
      if (fallbackDiv) {
        fallbackDiv.classList.remove("hidden");
      }
    }
  };

  // Function to handle thumbnail error
  const handleThumbnailError = (e, videoKey) => {
    setBrokenThumbnails((prev) => new Set(prev).add(videoKey));
    e.target.style.display = "none";
    const fallbackDiv = e.target.nextElementSibling;
    if (fallbackDiv) {
      fallbackDiv.classList.remove("hidden");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        videoTypeRef.current &&
        !videoTypeRef.current.contains(event.target)
      ) {
        setIsVideoTypeOpen(false);
      }
      if (sortByRef.current && !sortByRef.current.contains(event.target)) {
        setIsSortByOpen(false);
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
      setIsSortByOpen(false);
      setIsAnimating(false);
      setBrokenThumbnails(new Set());

      // Set the initial selected video if passed from VideoBlock
      if (initialSelectedVideo) {
        setSelectedVideo(initialSelectedVideo);
      } else {
        setSelectedVideo(null);
      }
    }
  }, [isOpen, initialSelectedVideo]);

  // Update the escape key handler to fix double-click issue
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

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, selectedVideo, isOpen]);

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

    if (filterType === "videoType") {
      setSelectedVideoType(value);
      setIsVideoTypeOpen(false);
    } else if (filterType === "sortBy") {
      setSelectedSortBy(value);
      setIsSortByOpen(false);
    }

    setCurrentPage(1);
    setIsAnimating(false);
  };

  const videoTypeOptions = [
    { value: "all", label: "All" },
    { value: "trailers_teasers", label: "Trailers & Teasers" },
    { value: "clips", label: "Clips" },
    { value: "bts", label: "Behind the Scenes" },
    { value: "featurettes", label: "Featurettes" },
    { value: "bloopers", label: "Bloopers" },
    { value: "others", label: "Others" },
  ];

  const sortByOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name", label: "Name" },
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
    switch (selectedSortBy) {
      case "newest":
        return sortedVideos.sort((a, b) => {
          const dateA = new Date(a.published_date || "1900-01-01");
          const dateB = new Date(b.published_date || "1900-01-01");
          return dateB - dateA;
        });
      case "oldest":
        return sortedVideos.sort((a, b) => {
          const dateA = new Date(a.published_date || "1900-01-01");
          const dateB = new Date(b.published_date || "1900-01-01");
          return dateA - dateB;
        });
      case "name":
        return sortedVideos.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      default:
        return sortedVideos;
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
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [];
    if (validCurrentPage <= 3) {
      pages = [1, 2, 3, 4, "...", totalPages];
    } else if (validCurrentPage >= totalPages - 2) {
      pages = [
        1,
        "...",
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
        validCurrentPage + 2,
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

  const similarVideos = selectedVideo ? getSimilarVideos(selectedVideo) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop - ALWAYS closes the entire modal */}
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
                  {selectedVideo ? selectedVideo.name : "Videos"}
                </h3>
              </div>
              <button
                className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 hover:cursor-pointer hover:bg-white/10 transition-all duration-200"
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
              {selectedVideo ? (
                /* Video Player View */
                <div className="px-6 py-4">
                  {/* Video Player */}
                  <div className="flex justify-center mb-[24px]">
                    <iframe
                      width="990"
                      height="557"
                      src={getYouTubeEmbedUrl(selectedVideo)}
                      title={selectedVideo.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-[10px]"
                    ></iframe>
                  </div>

                  {/* Similar Videos Section */}
                  {similarVideos.length > 0 && (
                    <div>
                      {/* Heading and View All Button */}
                      <div className="flex items-center gap-[10px] mb-[24px]">
                        <h3 className="text-lg font-semibold text-white">
                          Similar Videos
                        </h3>
                        <button
                          onClick={() => handleViewAllSimilar(selectedVideo)}
                          className="flex items-center gap-[10px] px-[18px] py-[8px] bg-white/15 rounded-[10px] hover:bg-white/20 transition-colors"
                        >
                          <p className="text-sm text-[var(--text-primary)]">
                            View All
                          </p>
                          <ChevronRight className="w-[24px] h-[24px] text-[var(--text-primary)]" />
                        </button>
                      </div>

                      {/* Similar Videos Grid */}
                      <div className="grid grid-cols-4 gap-[20px]">
                        {similarVideos.map((video, idx) => (
                          <div
                            key={video.key || idx}
                            className="flex flex-col cursor-pointer group"
                            onClick={() => handleVideoClick(video)}
                          >
                            <div className="w-[302px] h-[151px] rounded-[10px] overflow-hidden group-hover:scale-105 transition-transform duration-200 flex items-center justify-center relative">
                              <img
                                src={getThumbnail(video.key)}
                                alt={video.name || `Video ${idx + 1}`}
                                className="w-full h-full object-contain bg-[var(--bg-primary)]"
                                onLoad={(e) =>
                                  handleThumbnailLoad(e, video.key)
                                }
                                onError={(e) =>
                                  handleThumbnailError(e, video.key)
                                }
                              />
                              <div className="hidden flex items-center justify-center w-full h-full bg-[var(--bg-trans-15)]">
                                <Youtube
                                  size={40}
                                  className="text-[var(--text-secondary)]"
                                />
                              </div>
                            </div>
                            <p className="text-[var(--text-primary)] mt-[10px] text-sm leading-relaxed group-hover:underline group-hover:text-[var(--accent-main)] transition-colors">
                              {video.name || "Untitled Video"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Video Grid View */
                <>
                  {/* Controls Row */}
                  <div className="flex items-center justify-between mt-8 mb-6 px-6">
                    {/* Filters */}
                    <div className="flex gap-6">
                      {/* Video Type */}
                      <div className="relative" ref={videoTypeRef}>
                        <button
                          className="flex items-center gap-2 bg-white/5 px-4 py-[14px] rounded-[10px] shadow-inner text-sm"
                          onClick={() => setIsVideoTypeOpen(!isVideoTypeOpen)}
                        >
                          <span className="text-[var(--text-secondary)]">
                            Video Type:
                          </span>
                          <span className="text-[var(--text-primary)]">
                            {
                              videoTypeOptions.find(
                                (opt) => opt.value === selectedVideoType
                              )?.label
                            }
                          </span>
                          <motion.div
                            animate={{ rotate: isVideoTypeOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-[var(--text-primary)]" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isVideoTypeOpen && (
                            <motion.div
                              className="absolute top-full left-0 mt-1 bg-[var(--bg-secondary)] border border-white/15 rounded-[10px] shadow-lg z-10 min-w-full"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {videoTypeOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 first:rounded-t-[10px] last:rounded-b-[10px] ${
                                    selectedVideoType === option.value
                                      ? "bg-[var(--accent-main)] text-white"
                                      : "text-[var(--text-primary)]"
                                  }`}
                                  onClick={() =>
                                    handleFilterChange(
                                      "videoType",
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

                      {/* Sort By */}
                      <div className="relative" ref={sortByRef}>
                        <button
                          className="flex items-center gap-2 bg-white/5 px-4 py-[14px] rounded-[10px] shadow-inner text-sm"
                          onClick={() => setIsSortByOpen(!isSortByOpen)}
                        >
                          <span className="text-[var(--text-secondary)]">
                            Sort By:
                          </span>
                          <span className="text-[var(--text-primary)]">
                            {
                              sortByOptions.find(
                                (opt) => opt.value === selectedSortBy
                              )?.label
                            }
                          </span>
                          <motion.div
                            animate={{ rotate: isSortByOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-[var(--text-primary)]" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isSortByOpen && (
                            <motion.div
                              className="absolute top-full left-0 mt-1 bg-[var(--bg-secondary)] border border-white/15 rounded-[10px] shadow-lg z-10 min-w-full max-h-60 overflow-y-auto"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {sortByOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 first:rounded-t-[10px] last:rounded-b-[10px] ${
                                    selectedSortBy === option.value
                                      ? "bg-[var(--accent-main)] text-white"
                                      : "text-[var(--text-primary)]"
                                  }`}
                                  onClick={() =>
                                    handleFilterChange("sortBy", option.value)
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

                    {/* Page Info */}
                    <div className="text-[var(--text-secondary)] text-sm">
                      {totalItems > 0
                        ? `${startIndex + 1}-${endIndex} of ${totalItems}`
                        : "0 of 0"}
                    </div>
                  </div>

                  {/* Video Grid */}
                  <div className="w-[1267px] mx-auto mb-8 mt-6">
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
                              key={`${
                                video.key || video.id || idx
                              }-${validCurrentPage}`}
                              className="flex flex-col cursor-pointer group"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              onClick={() => handleVideoClick(video)}
                            >
                              <div className="w-[409px] h-[261px] rounded-[10px] overflow-hidden group-hover:scale-105 transition-all duration-200 flex items-center justify-center relative">
                                <img
                                  src={getThumbnail(video.key)}
                                  alt={video.name || `Video ${idx + 1}`}
                                  className="w-full h-full object-contain bg-black"
                                  onLoad={(e) =>
                                    handleThumbnailLoad(e, video.key)
                                  }
                                  onError={(e) =>
                                    handleThumbnailError(e, video.key)
                                  }
                                />
                                <div className="hidden flex items-center justify-center w-full h-full bg-[var(--bg-trans-15)]">
                                  <Youtube
                                    size={72}
                                    className="text-[var(--text-secondary)]"
                                  />
                                </div>
                              </div>
                              <p className="text-[var(--text-primary)] mt-[10px] text-sm leading-relaxed w-[409px] truncate group-hover:underline group-hover:text-[var(--accent-main)] transition-colors duration-200">
                                {video.name || "Untitled Video"}
                              </p>
                              <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                                {video.type || "Unknown Type"}
                              </p>
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
                      {/* Left Arrow */}
                      <button
                        onClick={() =>
                          handlePageChangeAnimated(validCurrentPage - 1)
                        }
                        disabled={validCurrentPage === 1 || isAnimating}
                        className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                          validCurrentPage === 1 || isAnimating
                            ? "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                            : "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Page Numbers */}
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
                                ? "bg-[var(--accent-main)] text-white"
                                : "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                            } ${
                              isAnimating ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      {/* Right Arrow */}
                      <button
                        onClick={() =>
                          handlePageChangeAnimated(validCurrentPage + 1)
                        }
                        disabled={
                          validCurrentPage === totalPages || isAnimating
                        }
                        className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                          validCurrentPage === totalPages || isAnimating
                            ? "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                            : "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
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
