import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, X } from "lucide-react";
import { movieData } from "../../data/movieDetails";

export default function PosterBlock() {
  const [showFullPoster, setShowFullPoster] = useState(false);
  const [isPosterHovered, setIsPosterHovered] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showFullPoster) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFullPoster]);

  const handlePosterClick = () => {
    setShowFullPoster(true);
  };

  const handleCloseModal = () => {
    setShowFullPoster(false);
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
          className="relative cursor-pointer overflow-hidden"
          onClick={handlePosterClick}
          onMouseEnter={() => setIsPosterHovered(true)}
          onMouseLeave={() => setIsPosterHovered(false)}
          style={{
            borderRadius: "4px",
          }}
        >
          <motion.img
            src={movieData.primary.poster_url}
            alt={`${movieData.primary.title} Poster`}
            width={336}
            height={491}
            style={{
              borderRadius: "4px",
            }}
            animate={{ scale: isPosterHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              borderRadius: "4px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isPosterHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="flex flex-col items-center text-white"
              initial={{ y: 10, scale: 0.9 }}
              animate={{
                y: isPosterHovered ? 0 : 10,
                scale: isPosterHovered ? 1 : 0.9,
                opacity: isPosterHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Expand
                size={32}
                className="mb-2"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))",
                }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))",
                }}
              >
                Expand
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Backdrop */}
        <img
          src={movieData.primary.backdrop_url}
          alt={`${movieData.primary.title} Backdrop`}
          width={857}
          height={489}
          style={{
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Full-screen poster modal */}
      <AnimatePresence>
        {showFullPoster && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/85"
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
              className="absolute top-6 right-6 w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 bg-white/10 hover:bg-white/20 hover:cursor-pointer transition-colors duration-200"
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
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
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
    </>
  );
}
