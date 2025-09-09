import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export default function PhotoViewer({
  selectedPhoto,
  setSelectedPhoto,
  data,
  selectedLanguage,
  photoTypeOptions,
  getImageUrl,
  handleViewAllSimilar,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Get all photos from the same category for carousel
  const getCarouselPhotos = () => {
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

  const carouselPhotos = getCarouselPhotos();

  // Get current photo category
  const currentPhotoCategory = getPhotoCategory(selectedPhoto);

  // Frame size configurations - using CSS classes
  const getFrameClasses = (photoType) => {
    switch (photoType) {
      case "posters":
        return "w-[350px] h-[525px]";
      case "backdrops":
        return "w-[900px] h-[506px]";
      case "logos":
        return "w-[700px] h-[350px]";
      default:
        return "w-[600px] h-[400px]";
    }
  };

  // Helper function to get background styles based on photo category
  const getFrameBackgroundClass = (photoCategory) => {
    return photoCategory === "logos"
      ? "bg-[var(--bg-primary)]"
      : "bg-[var(--bg-trans-15)]";
  };

  // Initialize current index
  useEffect(() => {
    if (selectedPhoto && carouselPhotos.length > 0) {
      const photoIndex = carouselPhotos.findIndex(
        (photo) => photo.file_path === selectedPhoto.file_path
      );
      if (photoIndex !== -1) {
        setCurrentIndex(photoIndex);
      }
    }
  }, [selectedPhoto, carouselPhotos]);

  // Navigation functions
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < carouselPhotos.length - 1;

  const navigatePhoto = useCallback(
    (direction) => {
      if (direction === "prev" && canNavigatePrev) {
        setCurrentIndex((prev) => prev - 1);
        setSelectedPhoto(carouselPhotos[currentIndex - 1]);
      } else if (direction === "next" && canNavigateNext) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedPhoto(carouselPhotos[currentIndex + 1]);
      }
    },
    [
      currentIndex,
      canNavigatePrev,
      canNavigateNext,
      carouselPhotos,
      setSelectedPhoto,
    ]
  );

  // Handle back button - return to modal grid view
  const handleBackClick = () => {
    setSelectedPhoto(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        navigatePhoto("prev");
      } else if (e.key === "ArrowRight") {
        navigatePhoto("next");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigatePhoto]);

  if (!selectedPhoto || carouselPhotos.length === 0) {
    return null;
  }

  const currentPhoto = carouselPhotos[currentIndex];

  return (
    <div className="pt-6 px-6 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-[1267px] mx-auto mb-6">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-trans-15)] rounded-[10px] hover:bg-[var(--bg-trans-60)] cursor-pointer"
        >
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Back to Gallery
          </span>
        </button>
      </div>

      {/* Carousel Container */}
      <div className="flex items-center justify-center gap-6">
        {/* Previous Button */}
        <button
          onClick={() => navigatePhoto("prev")}
          disabled={!canNavigatePrev}
          className={`w-[48px] h-[48px] flex items-center justify-center rounded-full ${
            canNavigatePrev
              ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
              : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed opacity-50"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Photo Frame */}
        <div
          className={`${getFrameClasses(
            currentPhotoCategory
          )} ${getFrameBackgroundClass(
            currentPhotoCategory
          )} flex items-center justify-center rounded-[10px] overflow-hidden`}
        >
          <img
            src={getImageUrl(currentPhoto, "original")}
            alt="Selected photo"
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.src = getImageUrl(currentPhoto, "w500");
            }}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={() => navigatePhoto("next")}
          disabled={!canNavigateNext}
          className={`w-[48px] h-[48px] flex items-center justify-center rounded-full ${
            canNavigateNext
              ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)] hover:bg-[var(--bg-trans-60)] cursor-pointer"
              : "bg-[var(--bg-trans-5)] text-[var(--text-secondary)] cursor-not-allowed opacity-50"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Photo Counter */}
      <div className="mt-6 text-center">
        <span className="text-sm text-[var(--text-secondary)]">
          {currentIndex + 1} of {carouselPhotos.length}
        </span>
      </div>
    </div>
  );
}
