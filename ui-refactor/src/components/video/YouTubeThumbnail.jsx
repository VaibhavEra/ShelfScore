import { ImageOff } from "lucide-react";
import { useYouTubeThumbnail } from "./useYouTubeThumbnail";

export const YouTubeThumbnail = ({
  videoKey,
  alt,
  className = "",
  containerClassName = "",
  showFallback = true,
  fallbackIcon: FallbackIcon = ImageOff,
  fallbackIconSize = 40,
}) => {
  const {
    thumbnailUrl,
    isLoading,
    hasError,
    handleImageLoad,
    handleImageError,
  } = useYouTubeThumbnail(videoKey);

  if (!videoKey) {
    return showFallback ? (
      <div
        className={`flex items-center justify-center bg-[var(--bg-trans-15)] ${containerClassName}`}
      >
        <FallbackIcon
          size={fallbackIconSize}
          className="text-[var(--text-secondary)]"
        />
      </div>
    ) : null;
  }

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-trans-15)] animate-pulse">
          <div className="w-8 h-8 border-2 border-[var(--accent-main)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-trans-15)]">
          <FallbackIcon
            size={fallbackIconSize}
            className="text-[var(--text-secondary)]"
          />
        </div>
      )}

      {/* Thumbnail image */}
      <img
        src={thumbnailUrl}
        alt={alt}
        className={`${className} ${
          hasError ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: hasError ? "none" : "block" }}
      />
    </div>
  );
};
