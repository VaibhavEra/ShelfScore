import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function VideoPlayerModal({ isOpen, onClose, video }) {
  // Prevent background scrolling when modal is open
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

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (video) => {
    if (!video?.key) return "";
    return `https://www.youtube.com/embed/${video.key}?modestbranding=1&showinfo=0&rel=0&controls=1&autoplay=1`;
  };

  return (
    <AnimatePresence>
      {isOpen && video && (
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
          onClick={onClose}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 bg-[var(--bg-modal-action)] hover:bg-[var(--bg-modal-action-hover)] hover:cursor-pointer transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close video"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Video Player Container */}
          <motion.div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video iframe */}
            <iframe
              width="1200"
              height="675"
              src={getYouTubeEmbedUrl(video)}
              title={video.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-[10px]"
              style={{
                boxShadow: "var(--shadow-video)",
                maxWidth: "100%",
                maxHeight: "calc(100vh - 200px)",
              }}
            />

            {/* Video Info */}
            <div className="mt-4 text-center max-w-[1200px]">
              <h3 className="text-[var(--text-primary)] text-lg font-medium mb-2">
                {video.name}
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
                <span>{video.type || "Video"}</span>
                {video.published_date && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(video.published_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
