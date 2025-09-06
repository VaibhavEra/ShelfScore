import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FileImage } from "lucide-react";

export default function PhotoViewer({
  selectedPhoto,
  setSelectedPhoto,
  data,
  selectedLanguage,
  photoTypeOptions,
  getImageUrl,
  handleViewAllSimilar,
}) {
  const galleryRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const lastNavigationDirection = useRef(null);

  // Configuration for different photo types
  const getPhotoConfig = (photoType) => {
    switch (photoType) {
      case "posters":
        return {
          itemWidth: 63,
          thumbnailClass: "w-[55px] h-[83px]",
          frameSize: { width: "350px", height: "525px" },
        };
      case "backdrops":
        return {
          itemWidth: 98,
          thumbnailClass: "w-[90px] h-[56px]",
          frameSize: { width: "900px", height: "506px" },
        };
      case "logos":
        return {
          itemWidth: 98,
          thumbnailClass: "w-[90px] h-[56px]",
          frameSize: { width: "700px", height: "350px" },
        };
      default:
        return {
          itemWidth: 98,
          thumbnailClass: "w-[90px] h-[56px]",
          frameSize: { width: "600px", height: "400px" },
        };
    }
  };

  // Helper function to get background styles based on photo category
  const getFrameBackgroundClass = (photoCategory) => {
    return photoCategory === "logos"
      ? "bg-[var(--bg-primary)]"
      : "bg-[var(--bg-trans-15)]";
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

  // Get all photos from the same category for gallery
  const getGalleryPhotos = () => {
    if (!selectedPhoto || !data) return [];

    const currentPhotoCategory = Object.keys(data).find((category) => {
      const categoryData = data[category];
      return (
        Array.isArray(categoryData) &&
        categoryData.some(
          (photo) => photo.file_path === selectedPhoto.file_path
        )
      );
    });

    if (!currentPhotoCategory) return [];

    let photos = data[currentPhotoCategory];
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

  const galleryPhotos = getGalleryPhotos();
  const currentPhotoIndex = galleryPhotos.findIndex(
    (photo) => photo.file_path === selectedPhoto?.file_path
  );

  // Reset image loaded state when photo changes
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedPhoto]);

  // Enhanced visibility and positioning logic
  const ensurePhotoVisible = (photoIndex, direction) => {
    if (!galleryRef.current || !selectedPhoto || photoIndex < 0) return;

    const container = galleryRef.current;
    const photoCategory = getPhotoCategory(selectedPhoto);
    const config = getPhotoConfig(photoCategory);
    const containerWidth = container.clientWidth;
    const currentScrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - containerWidth;

    const photoStart = photoIndex * config.itemWidth;
    const photoEnd = photoStart + config.itemWidth;
    const viewportStart = currentScrollLeft;
    const viewportEnd = currentScrollLeft + containerWidth;
    const margin = config.itemWidth * 0.1;

    let targetScroll = currentScrollLeft;
    let shouldScroll = false;

    const isFullyVisible =
      photoStart >= viewportStart + margin && photoEnd <= viewportEnd - margin;
    const isPartiallyCutLeft = photoStart < viewportStart;
    const isPartiallyCutRight = photoEnd > viewportEnd;
    const isPartiallyVisible = isPartiallyCutLeft || isPartiallyCutRight;

    if (!isFullyVisible || isPartiallyVisible) {
      shouldScroll = true;

      if (direction === "next") {
        targetScroll = Math.max(0, photoStart - margin);
      } else if (direction === "prev") {
        targetScroll = Math.max(0, photoEnd - containerWidth + margin);
      } else {
        if (isPartiallyCutLeft) {
          targetScroll = Math.max(0, photoStart - margin);
        } else if (isPartiallyCutRight) {
          targetScroll = Math.max(0, photoEnd - containerWidth + margin);
        } else if (!isFullyVisible) {
          const centerOffset = containerWidth / 2 - config.itemWidth / 2;
          targetScroll = photoStart - centerOffset;
        }
      }
    }

    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    if (shouldScroll && Math.abs(targetScroll - currentScrollLeft) > 2) {
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll to selected photo when it changes
  useEffect(() => {
    if (shouldAutoScroll && currentPhotoIndex >= 0) {
      const timeoutId = setTimeout(() => {
        ensurePhotoVisible(currentPhotoIndex, lastNavigationDirection.current);
        setShouldAutoScroll(false);
        lastNavigationDirection.current = null;
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [currentPhotoIndex, shouldAutoScroll, selectedPhoto]);

  // Navigation functions
  const canNavigatePrev = currentPhotoIndex > 0;
  const canNavigateNext = currentPhotoIndex < galleryPhotos.length - 1;

  const navigatePhoto = (direction) => {
    if (direction === "prev" && canNavigatePrev) {
      lastNavigationDirection.current = "prev";
      setSelectedPhoto(galleryPhotos[currentPhotoIndex - 1]);
      setShouldAutoScroll(true);
    } else if (direction === "next" && canNavigateNext) {
      lastNavigationDirection.current = "next";
      setSelectedPhoto(galleryPhotos[currentPhotoIndex + 1]);
      setShouldAutoScroll(true);
    }
  };

  // Gallery navigation - scroll by viewport width
  const scrollGallery = (direction) => {
    if (!galleryRef.current) return;

    const container = galleryRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let targetScroll;
    if (direction === "prev") {
      targetScroll = Math.max(0, currentScroll - scrollAmount);
    } else {
      targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
    }

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  // Check if gallery can scroll in each direction
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!galleryRef.current) return;

    const container = galleryRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < maxScroll - 5);
  };

  // Update scroll buttons on scroll and resize
  useEffect(() => {
    const container = galleryRef.current;
    if (!container) return;

    updateScrollButtons();

    const handleScroll = () => updateScrollButtons();
    const handleResize = () => {
      setTimeout(() => {
        updateScrollButtons();
        if (currentPhotoIndex >= 0) {
          ensurePhotoVisible(currentPhotoIndex);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [galleryPhotos.length, currentPhotoIndex]);

  // Handle manual photo selection from gallery
  const handlePhotoSelect = (photo) => {
    lastNavigationDirection.current = null;
    setShouldAutoScroll(true);
    setSelectedPhoto(photo);
  };

  // Auto-scroll to selected photo when photo category changes
  useEffect(() => {
    if (selectedPhoto && currentPhotoIndex >= 0) {
      lastNavigationDirection.current = null;
      setShouldAutoScroll(true);
    }
  }, [getPhotoCategory(selectedPhoto)]);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Photo Frame with Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Previous Button */}
        <motion.button
          onClick={() => navigatePhoto("prev")}
          disabled={!canNavigatePrev}
          className={`w-[48px] h-[48px] flex items-center justify-center rounded-full transition-colors duration-200 ${
            canNavigatePrev
              ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
              : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
          }`}
          whileHover={canNavigatePrev ? { scale: 1.05 } : {}}
          whileTap={canNavigatePrev ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        {/* Photo Frame with AnimatePresence for smooth transitions */}
        <div
          className={`flex items-center justify-center rounded-[10px] overflow-hidden relative ${getFrameBackgroundClass(
            getPhotoCategory(selectedPhoto)
          )}`}
          style={getPhotoConfig(getPhotoCategory(selectedPhoto)).frameSize}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedPhoto?.file_path}
              src={getImageUrl(selectedPhoto, "original")}
              alt="Selected photo"
              className="max-w-full max-h-full object-contain"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = getImageUrl(selectedPhoto, "w500");
                setImageLoaded(true);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            />
          </AnimatePresence>

          {/* Loading state with consistent styling based on photo category */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[10px]">
              {/* FileImage Icon */}
              <motion.div
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FileImage size={80} className="text-[var(--text-secondary)]" />
              </motion.div>

              {/* Loading Spinner */}
              <motion.div
                className="w-6 h-6 border-2 border-[var(--text-secondary)] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={() => navigatePhoto("next")}
          disabled={!canNavigateNext}
          className={`w-[48px] h-[48px] flex items-center justify-center rounded-full transition-colors duration-200 ${
            canNavigateNext
              ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
              : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
          }`}
          whileHover={canNavigateNext ? { scale: 1.05 } : {}}
          whileTap={canNavigateNext ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Photo Gallery Block */}
      {galleryPhotos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          {/* Heading and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-[10px]">
              <motion.h3
                className="text-lg font-semibold text-[#FFFFFF]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {photoTypeOptions.find(
                  (opt) => opt.value === getPhotoCategory(selectedPhoto)
                )?.label || "Photos"}
              </motion.h3>
              <motion.button
                onClick={() => handleViewAllSimilar(selectedPhoto)}
                className="flex items-center gap-[10px] px-[18px] py-[8px] bg-white/15 rounded-[10px] hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <p className="text-sm text-[var(--text-primary)]">View All</p>
                <ChevronRight className="w-[24px] h-[24px] text-[var(--text-primary)]" />
              </motion.button>
            </div>

            {/* Gallery Scroll Arrows */}
            <motion.div
              className="flex items-center gap-[5px]"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.button
                onClick={() => scrollGallery("prev")}
                disabled={!canScrollLeft}
                className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                  canScrollLeft
                    ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                    : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                }`}
                whileHover={canScrollLeft ? { scale: 1.05 } : {}}
                whileTap={canScrollLeft ? { scale: 0.95 } : {}}
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                onClick={() => scrollGallery("next")}
                disabled={!canScrollRight}
                className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
                  canScrollRight
                    ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)]"
                    : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
                }`}
                whileHover={canScrollRight ? { scale: 1.05 } : {}}
                whileTap={canScrollRight ? { scale: 0.95 } : {}}
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          </div>

          {/* Photos Grid with staggered animation and border hover effect */}
          <motion.div
            ref={galleryRef}
            className="flex gap-[8px] overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {galleryPhotos.map((photo, idx) => (
              <motion.div
                key={photo.file_path}
                className={`flex-shrink-0 cursor-pointer rounded-[10px] overflow-hidden transition-colors duration-200 ${
                  photo.file_path === selectedPhoto.file_path
                    ? "border-2 border-[var(--accent-main)]"
                    : "border-2 border-transparent hover:border-[var(--bg-trans-15)]"
                }`}
                onClick={() => handlePhotoSelect(photo)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.4 + idx * 0.05,
                  ease: "easeOut",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`${
                    getPhotoConfig(getPhotoCategory(photo)).thumbnailClass
                  } ${getFrameBackgroundClass(getPhotoCategory(photo))}`}
                >
                  <img
                    src={getImageUrl(photo)}
                    alt={`Gallery photo ${idx + 1}`}
                    className={`w-full h-full transition-transform duration-200 ${
                      getPhotoCategory(photo) === "logos"
                        ? "object-contain"
                        : "object-cover"
                    }`}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/114/71";
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
