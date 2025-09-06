import { useState, useRef, useEffect } from "react";
import { data } from "../../data/videodata";
import { ChevronRight, ChevronLeft, Youtube } from "lucide-react";
import VideoModal from "./VideoModal";

export default function VideoBlock() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showFadeOverlay, setShowFadeOverlay] = useState(true);
  const [isVideosModalOpen, setIsVideosModalOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [brokenThumbnails, setBrokenThumbnails] = useState(new Set());

  // Video dimensions
  const videoWidth = 409;
  const gap = 26;
  const videoWithGap = videoWidth + gap;

  // Helper function to generate thumbnail URL from key
  const getThumbnail = (key) =>
    `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;

  // Function to check if thumbnail is broken (120x90 YouTube placeholder)
  const checkThumbnailValidity = (imgElement, videoKey) => {
    if (imgElement.naturalWidth === 120 && imgElement.naturalHeight === 90) {
      setBrokenThumbnails((prev) => new Set(prev).add(videoKey));
      return false;
    }
    return true;
  };

  // Function to handle thumbnail load
  const handleThumbnailLoad = (e, videoKey) => {
    if (!checkThumbnailValidity(e.target, videoKey)) {
      e.target.style.display = "none";
      const fallbackDiv = e.target.nextElementSibling;
      if (fallbackDiv) {
        fallbackDiv.classList.remove("hidden");
      }
    }
  };

  // Function to handle thumbnail error
  const handleThumbnailError = (e, videoKey) => {
    setBrokenThumbnails((prev) => new Set(prev).add(videoKey));
    e.target.style.display = "none";
    const fallbackDiv = e.target.nextElementSibling;
    if (fallbackDiv) {
      fallbackDiv.classList.remove("hidden");
    }
  };

  // Get trailers and teasers data for display
  const trailersAndTeasers = data?.trailers_teasers || [];

  // Get total video count for "See all" button
  const getAllVideos = () => {
    if (!data) return [];
    return Object.values(data).flat();
  };

  const allVideos = getAllVideos();
  const totalVideoCount = allVideos.length;

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
    const videos = container.querySelectorAll(".snap-start");

    setIsScrolling(true);

    // Disable snap during animation
    container.classList.remove("snap-x");
    videos.forEach((video) => video.classList.remove("snap-start"));

    let targetPosition;

    if (direction === "left") {
      // Calculate how many videos to scroll back
      const currentVideoIndex = Math.ceil(container.scrollLeft / videoWithGap);
      const targetVideoIndex = Math.max(0, currentVideoIndex - 1);
      targetPosition = targetVideoIndex * videoWithGap;
    } else {
      // Calculate how many videos to scroll forward
      const currentVideoIndex = Math.floor(container.scrollLeft / videoWithGap);
      const visibleVideos = Math.floor(container.clientWidth / videoWithGap);
      const maxVideoIndex = Math.max(0, videos.length - visibleVideos);
      const targetVideoIndex = Math.min(maxVideoIndex, currentVideoIndex + 1);
      targetPosition = targetVideoIndex * videoWithGap;
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
        videos.forEach((video) => video.classList.add("snap-start"));
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Handle video click - open modal with selected video
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsVideosModalOpen(true);
  };

  // Handle "See all" button click - opens modal without specific video selection
  const handleSeeAllClick = () => {
    setSelectedVideo(null); // No specific video selected
    setIsVideosModalOpen(true);
  };

  // Handle modal close - reset selected video
  const handleModalClose = () => {
    setIsVideosModalOpen(false);
    setSelectedVideo(null);
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
      id="videos"
    >
      {/* First Row */}
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[20px] h-[12px] rounded-full bg-[var(--accent-main)] flex-shrink-0"></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Videos
          </h2>
          <button
            className="flex items-center gap-[10px] bg-[var(--bg-trans-15)] px-[18px] py-[8px] rounded-[10px] text-[var(--text-primary)] text-base transition-colors duration-200 hover:bg-[var(--bg-trans-60)] active:bg-[var(--bg-trans-60)] active:scale-95 cursor-pointer"
            onClick={handleSeeAllClick}
          >
            See all {totalVideoCount > 0 && `(${totalVideoCount})`}
            <ChevronRight size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Right Section - Navigation Arrows */}
        <div className="flex items-center gap-[5px]">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || isScrolling}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
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
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-colors duration-200 
                  ${
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
          {trailersAndTeasers.map((video, index) => (
            <div
              key={video.key || index}
              className="flex-shrink-0 snap-start cursor-pointer group"
              style={{ width: "409px" }}
              onClick={() => handleVideoClick(video)}
            >
              <div className="w-[409px] h-[261px] rounded-[10px] overflow-hidden bg-[var(--bg-trans-15)] flex items-center justify-center">
                <img
                  src={getThumbnail(video.key)}
                  alt={video.name}
                  className="w-[409px] h-[261px] rounded-[10px] object-contain bg-black"
                  style={{ objectPosition: "center" }}
                  onLoad={(e) => handleThumbnailLoad(e, video.key)}
                  onError={(e) => handleThumbnailError(e, video.key)}
                />
                <div
                  className={`flex items-center justify-center w-full h-full ${
                    !brokenThumbnails.has(video.key) ? "hidden" : ""
                  }`}
                >
                  <Youtube size={64} className="text-[var(--text-secondary)]" />
                </div>
              </div>
              <div className="h-[10px]" />
              <p className="text-[var(--text-primary)] text-[16px] leading-[1.5] font-medium group-hover:underline group-hover:text-[var(--accent-main)] transition-colors duration-200">
                {video.name}
              </p>
              <p className="text-[var(--text-secondary)] text-[14px] leading-[1.5] mt-[2px]">
                {video.type || "Trailer"}
              </p>
            </div>
          ))}
        </div>

        {/* Fade Overlay - Visible until scrolled all the way to the right */}
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

      {/* Videos Modal */}
      <VideoModal
        isOpen={isVideosModalOpen}
        onClose={handleModalClose}
        movie={{ release_date: "2024-01-01" }}
        selectedVideo={selectedVideo}
      />
    </div>
  );
}
