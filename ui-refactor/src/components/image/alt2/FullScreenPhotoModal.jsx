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

  const getImageUrl = (photo, size = "original") =>
    `https://image.tmdb.org/t/p/${size}${photo.file_path}`;

  return (
    <AnimatePresence>
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
        onClick={onClose}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] p-2 flex-shrink-0 bg-white/10 hover:bg-white/20 hover:cursor-pointer transition-colors duration-200"
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
          src={getImageUrl(photo)}
          alt="Photo"
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
          onError={(e) => {
            e.target.src = getImageUrl(photo, "w500");
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
