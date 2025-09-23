import { useRef, useState, useEffect } from "react";
import { data } from "../../data/photosdata";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PhotosModal from "./PhotosModal";
import FullScreenPhotoModal from "./FullScreenPhotoModal";

export default function ImageBlock() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showFadeOverlay, setShowFadeOverlay] = useState(true);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Image dimensions
  const imageWidth = 246;
  const gap = 26;
  const imageWithGap = imageWidth + gap;

  // Get total image count and display images (starting from 4th, showing 15 max)
  const getAllPhotos = () => {
    if (!data) return [];
    return Object.values(data)
      .filter(Array.isArray)
      .flat()
      .filter((photo) => photo && photo.file_path); // updated: filter by file_path presence
  };

  const allPhotos = getAllPhotos();
  const totalImages = allPhotos.length;
  const startIndex = 3; // 4th image (0-based index)
  const maxDisplay = 15;
  const displayPhotos = allPhotos.slice(startIndex, startIndex + maxDisplay);

  // Helper function to get image URL - builds full TMDB path from file_path
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
  const getImageUrl = (photo, size = "w500") =>
    `${TMDB_IMAGE_BASE_URL}${size}${photo.file_path}`;

  // Handle photo click to open full-screen photo viewer
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowFullPhoto(true);
  };

  // Handle "See all" button click - opens modal without specific photo selection
  const handleSeeAllClick = () => {
    setIsPhotosModalOpen(true);
  };

  // Handle photo modal close
  const handlePhotoModalClose = () => {
    setIsPhotosModalOpen(false);
  };

  // Handle full-screen photo modal close
  const handleFullScreenClose = () => {
    setShowFullPhoto(false);
    setSelectedPhoto(null);
  };

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);

    // Show fade overlay when there's still content to scroll to the right
    setShowFadeOverlay(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scroll = (direction) => {
    if (!scrollRef.current || isScrolling) return;

    const container = scrollRef.current;
    const images = container.querySelectorAll(".snap-start");

    setIsScrolling(true);

    // Disable snap during animation
    container.classList.remove("snap-x");
    images.forEach((image) => image.classList.remove("snap-start"));

    let targetPosition;

    if (direction === "left") {
      const currentImageIndex = Math.ceil(container.scrollLeft / imageWithGap);
      const targetImageIndex = Math.max(0, currentImageIndex - 1);
      targetPosition = targetImageIndex * imageWithGap;
    } else {
      const currentImageIndex = Math.floor(container.scrollLeft / imageWithGap);
      const visibleImages = Math.floor(container.clientWidth / imageWithGap);
      const maxImageIndex = Math.max(0, images.length - visibleImages);
      const targetImageIndex = Math.min(maxImageIndex, currentImageIndex + 1);
      targetPosition = targetImageIndex * imageWithGap;
    }

    // Ensure we don't scroll beyond bounds
    const maxScroll = container.scrollWidth - container.clientWidth;
    targetPosition = Math.max(0, Math.min(targetPosition, maxScroll));

    // Animate to target position
    const startPosition = container.scrollLeft;
    const distance = targetPosition - startPosition;
    const duration = 300;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      container.scrollLeft = startPosition + distance * easeOutCubic;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Re-enable snap after animation
        container.classList.add("snap-x");
        images.forEach((image) => image.classList.add("snap-start"));
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    updateScrollButtons();
    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.addEventListener("scroll", updateScrollButtons);
    return () => scroller.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="photos"
    >
      {/* First Row */}
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[20px] h-[12px] rounded-full bg-[var(--accent-main)] flex-shrink-0"></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Photos
          </h2>
          <button
            className="flex items-center gap-[10px] bg-[var(--bg-trans-15)] px-[18px] py-[8px] rounded-[10px] text-[var(--text-primary)] text-base transition-colors duration-200 hover:bg-[var(--bg-trans-60)] active:bg-[var(--bg-trans-60)] active:scale-95 cursor-pointer"
            onClick={handleSeeAllClick}
          >
            See all {totalImages > 0 && `(${totalImages})`}
            <ChevronRight size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Right Section - Navigation Arrows */}
        <div className="flex items-center gap-[5px]">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || isScrolling}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
              canScrollLeft && !isScrolling
                ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
                : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight || isScrolling}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 ${
              canScrollRight && !isScrolling
                ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
                : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll with Fade Overlay */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-[26px] overflow-x-auto no-scrollbar snap-x scroll-smooth"
        >
          {displayPhotos.map((photo, index) => (
            <div
              key={photo.file_path} // updated to file_path key
              className="flex-shrink-0 w-[246px] h-[246px] snap-start cursor-pointer group overflow-hidden rounded-[10px] shadow-lg"
              onClick={() => handlePhotoClick(photo)}
            >
              <img
                src={getImageUrl(photo)}
                alt={`Photo ${startIndex + index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "/api/placeholder/246/246";
                }}
              />
            </div>
          ))}
        </div>

        {/* Fade Overlay */}
        <div
          className={`absolute top-0 right-0 w-[120px] h-full pointer-events-none transition-opacity duration-300 ease-in-out bg-[var(--bg-primary)] ${
            showFadeOverlay ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to left, var(--bg-primary), transparent)",
          }}
        />
      </div>

      {/* Photos Modal */}
      <PhotosModal
        isOpen={isPhotosModalOpen}
        onClose={handlePhotoModalClose}
        movie={{ release_date: "2024-01-01" }}
      />

      {/* Full-Screen Photo Modal */}
      {showFullPhoto && selectedPhoto && (
        <FullScreenPhotoModal
          photo={selectedPhoto}
          onClose={handleFullScreenClose}
        />
      )}
    </div>
  );
}
