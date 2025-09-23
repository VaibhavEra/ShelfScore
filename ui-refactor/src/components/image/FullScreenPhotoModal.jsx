// components/FullScreenPhotoModal.jsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FullScreenPhotoModal({ photo, onClose }) {
  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

  // Updated getImageUrl to construct full URL using file_path
  const getImageUrl = (photo, size = "original") =>
    `${TMDB_IMAGE_BASE_URL}${size}${photo.file_path}`;

  return (
    <AnimatePresence>
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
          className="absolute top-6 right-6 w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 bg-[var(--bg-button-trans)] hover:bg-[var(--bg-button-hover)] hover:cursor-pointer transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close photo view"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Full photo */}
        <motion.img
          src={getImageUrl(photo, "original")}
          alt="Photo"
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
          onError={(e) => {
            e.target.src = getImageUrl(photo, "w500");
            // In case fallback is needed, but usually photo.url no longer applies with new API
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
