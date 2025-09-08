import { useState, useCallback } from "react";

const YOUTUBE_THUMBNAIL_SIZES = [
  "maxresdefault", // 1280x720
  "sddefault", // 640x480
  "hqdefault", // 480x360
  "mqdefault", // 320x180
  "default", // 120x90
];

export const useYouTubeThumbnail = (videoKey) => {
  const [currentSizeIndex, setCurrentSizeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getThumbnailUrl = useCallback(
    (sizeIndex = currentSizeIndex) => {
      if (!videoKey) return "";
      const size = YOUTUBE_THUMBNAIL_SIZES[sizeIndex] || "default";
      return `https://img.youtube.com/vi/${videoKey}/${size}.jpg`;
    },
    [videoKey, currentSizeIndex]
  );

  const handleImageLoad = useCallback(
    (e) => {
      const img = e.target;

      // Check if this is YouTube's placeholder image (120x90)
      if (img.naturalWidth === 120 && img.naturalHeight === 90) {
        // Try next smaller size
        const nextIndex = currentSizeIndex + 1;
        if (nextIndex < YOUTUBE_THUMBNAIL_SIZES.length) {
          setCurrentSizeIndex(nextIndex);
          return;
        } else {
          // All sizes failed, show error state
          setHasError(true);
          setIsLoading(false);
          return;
        }
      }

      // Valid thumbnail loaded
      setIsLoading(false);
      setHasError(false);
    },
    [currentSizeIndex]
  );

  const handleImageError = useCallback(() => {
    // Try next smaller size
    const nextIndex = currentSizeIndex + 1;
    if (nextIndex < YOUTUBE_THUMBNAIL_SIZES.length) {
      setCurrentSizeIndex(nextIndex);
    } else {
      // All sizes failed
      setHasError(true);
      setIsLoading(false);
    }
  }, [currentSizeIndex]);

  const reset = useCallback(() => {
    setCurrentSizeIndex(0);
    setIsLoading(true);
    setHasError(false);
  }, []);

  return {
    thumbnailUrl: getThumbnailUrl(),
    isLoading,
    hasError,
    handleImageLoad,
    handleImageError,
    reset,
    currentSize: YOUTUBE_THUMBNAIL_SIZES[currentSizeIndex],
  };
};
