import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Expand,
  X,
  CirclePlay,
  ChevronLeft,
  ChevronRight,
  Play,
  Image,
} from "lucide-react";
import { movieData } from "../../data/movieDetails";
import { data } from "../../data/videodata";
import VideoPlayerModal from "../video/VideoPlayerModal";
import { useYouTubeThumbnail } from "../video/useYouTubeThumbnail";

// Trailer Carousel Component (inline)
function TrailerCarousel({
  trailers,
  currentIndex,
  onPrev,
  onNext,
  onPlay,
  onSetIndex,
}) {
  const currentTrailer = trailers[currentIndex];
  const {
    thumbnailUrl,
    isLoading,
    hasError,
    handleImageLoad,
    handleImageError,
  } = useYouTubeThumbnail(currentTrailer?.key);

  if (!currentTrailer) return null;

  return (
    <div className="relative w-full h-full group">
      {/* Thumbnail */}
      <div
        className="relative w-full h-full cursor-pointer hover:cursor-pointer"
        onClick={() => onPlay(currentTrailer)}
      >
        {!hasError ? (
          <img
            src={thumbnailUrl}
            alt={currentTrailer?.name}
            style={{
              borderRadius: "4px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div
            className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center"
            style={{ borderRadius: "4px" }}
          >
            <CirclePlay size={48} className="text-[var(--text-muted)]" />
          </div>
        )}

        {/* Play button overlay - Only CirclePlay icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-overlay)] hover:bg-[var(--bg-overlay-hover)] transition-colors duration-300">
          <CirclePlay
            size={64}
            className="text-[var(--text-primary)] hover:cursor-pointer transition-all duration-200 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Navigation and dots - Bottom right corner */}
      {trailers.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {trailers.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 hover:cursor-pointer ${
                  index === currentIndex
                    ? "bg-[var(--text-primary)]"
                    : "bg-[var(--text-muted)] hover:bg-[var(--text-secondary)]"
                }`}
                aria-label={`Go to trailer ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-[5px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
              aria-label="Previous trailer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
              aria-label="Next trailer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PosterBlock() {
  const [showFullPoster, setShowFullPoster] = useState(false);
  const [isPosterHovered, setIsPosterHovered] = useState(false);
  const [showTrailers, setShowTrailers] = useState(false);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isContentAreaHovered, setIsContentAreaHovered] = useState(false);

  // Filter only trailers (type: "Trailer")
  const trailers =
    data.trailers_teasers?.filter((video) => video.type === "Trailer") || [];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showFullPoster || isVideoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFullPoster, isVideoModalOpen]);

  const handlePosterClick = () => {
    setShowFullPoster(true);
  };

  const handleCloseModal = () => {
    setShowFullPoster(false);
  };

  const handleToggleContent = () => {
    setShowTrailers(!showTrailers);
    if (!showTrailers) {
      setCurrentTrailerIndex(0); // Reset to first trailer when switching
    }
  };

  const handlePrevTrailer = () => {
    setCurrentTrailerIndex((prev) =>
      prev === 0 ? trailers.length - 1 : prev - 1
    );
  };

  const handleNextTrailer = () => {
    setCurrentTrailerIndex((prev) =>
      prev === trailers.length - 1 ? 0 : prev + 1
    );
  };

  const handleSetTrailerIndex = (index) => {
    setCurrentTrailerIndex(index);
  };

  const handlePlayTrailer = (trailer) => {
    setSelectedVideo(trailer);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <div
        className="mx-auto flex"
        style={{
          maxWidth: "1219px",
          gap: "26px",
        }}
      >
        {/* Poster with hover effect */}
        <div
          className="relative cursor-pointer overflow-hidden hover:cursor-pointer"
          onClick={handlePosterClick}
          onMouseEnter={() => setIsPosterHovered(true)}
          onMouseLeave={() => setIsPosterHovered(false)}
          style={{
            borderRadius: "4px",
            width: "336px",
            height: "491px",
          }}
        >
          <motion.img
            src={movieData.primary.poster_url}
            alt={`${movieData.primary.title} Poster`}
            style={{
              borderRadius: "4px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            animate={{ scale: isPosterHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              borderRadius: "4px",
              backgroundColor: "var(--bg-overlay)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isPosterHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-2 text-[var(--text-primary)]"
              initial={{ y: 10, scale: 0.9 }}
              animate={{
                y: isPosterHovered ? 0 : 10,
                scale: isPosterHovered ? 1 : 0.9,
                opacity: isPosterHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Expand
                size={24}
                style={{
                  filter: "var(--shadow-drop)",
                }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  filter: "var(--shadow-drop-small)",
                }}
              >
                Expand
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Content Area (Backdrop or Trailers) */}
        <div
          className="relative group"
          style={{
            borderRadius: "4px",
            width: "857px",
            height: "489px",
            overflow: "hidden",
          }}
          onMouseEnter={() => setIsContentAreaHovered(true)}
          onMouseLeave={() => setIsContentAreaHovered(false)}
        >
          {/* Toggle Button - Always visible */}
          {trailers.length > 0 && (
            <button
              onClick={handleToggleContent}
              className="absolute top-4 right-4 z-10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:cursor-pointer opacity-100"
              style={{
                backgroundColor: "var(--bg-trans-15)",
                color: "var(--text-primary)",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--bg-trans-60)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--bg-trans-15)";
              }}
            >
              {showTrailers ? (
                <>
                  <Image size={16} />
                  Show Backdrop
                </>
              ) : (
                <>
                  <Play size={16} />
                  Show Trailers
                </>
              )}
            </button>
          )}

          <AnimatePresence mode="wait">
            {!showTrailers ? (
              // Backdrop
              <motion.img
                key="backdrop"
                src={movieData.primary.backdrop_url}
                alt={`${movieData.primary.title} Backdrop`}
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              // Trailers Carousel
              <motion.div
                key="trailers"
                className="relative w-full h-full"
                style={{
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {trailers.length > 0 ? (
                  <TrailerCarousel
                    trailers={trailers}
                    currentIndex={currentTrailerIndex}
                    onPrev={handlePrevTrailer}
                    onNext={handleNextTrailer}
                    onSetIndex={handleSetTrailerIndex}
                    onPlay={handlePlayTrailer}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded">
                    <span>No trailers available</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Full-screen poster modal */}
      <AnimatePresence>
        {showFullPoster && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-[var(--bg-modal)]"
            style={{
              backdropFilter: "blur(8px)",
              padding: "60px 20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={handleCloseModal}
          >
            {/* Close button with pointer cursor */}
            <button
              className="absolute top-6 right-6 w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 bg-[var(--bg-button-trans)] hover:bg-[var(--bg-button-hover)] hover:cursor-pointer transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              aria-label="Close poster view"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Full poster */}
            <motion.img
              src={movieData.primary.poster_url}
              alt={`${movieData.primary.title} Poster`}
              className="max-w-full max-h-full object-contain"
              style={{
                borderRadius: "8px",
                boxShadow: "var(--shadow-modal)",
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        video={selectedVideo}
      />
    </>
  );
}
