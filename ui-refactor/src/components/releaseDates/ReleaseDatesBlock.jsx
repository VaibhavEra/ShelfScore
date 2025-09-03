import { useState, useMemo } from "react";
import {
  ChevronDown,
  Calendar,
  Globe,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReleaseCountrySelector from "./ReleaseCountrySelector";
import ReleaseCountryButton from "./ReleaseCountryButton";
import ReleaseDateGroup from "./ReleaseDateGroup";
import ReleaseCountryGroup from "./ReleaseCountryGroup";
import ViewButton from "./ViewButton";
import SortButton from "./SortButton";
import {
  getCountryName,
  getReleaseTypeDisplayName,
  formatReleaseDate,
  getCertificationColor,
  sortReleasesByDate,
} from "../../lib/releaseScheduleCountries";

export default function ReleaseDatesBlock({ releaseData }) {
  const [activeTab, setActiveTab] = useState("premiere");
  const [open, setOpen] = useState(true);
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  // Filter state (moved from search bar)
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [isCountryChanging, setIsCountryChanging] = useState(false);

  // New view and sort states
  const [viewMode, setViewMode] = useState("expanded"); // "expanded" | "collapsible"
  const [sortMode, setSortMode] = useState("date"); // "date" | "country"
  const [isViewChanging, setIsViewChanging] = useState(false);
  const [isSortChanging, setIsSortChanging] = useState(false);

  const availableReleaseTypes = Object.keys(releaseData).filter(
    (type) => releaseData[type] && releaseData[type].length > 0
  );

  // Fixed tab sizing
  const TAB_WIDTH = 105;
  const TAB_SPACING = 12;

  // Get available countries for current tab
  const availableCountries = useMemo(() => {
    const releases = releaseData[activeTab] || [];
    return [...new Set(releases.map((r) => r.country_code))];
  }, [releaseData, activeTab]);

  // Calculate position for active tab indicator
  const getTabPosition = () => {
    const activeIndex = availableReleaseTypes.indexOf(activeTab);
    return activeIndex * (TAB_WIDTH + TAB_SPACING);
  };

  // Handle tab change with animation
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  // Handle country selection with animation delay
  const handleCountrySelect = (countryCode) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries((prev) => prev.filter((c) => c !== countryCode));
    } else {
      setSelectedCountries((prev) => [...prev, countryCode]);
    }

    setIsCountryChanging(true);
    setTimeout(() => {
      setIsCountryChanging(false);
    }, 300);
  };

  // Handle view mode change
  const handleViewModeChange = (newViewMode) => {
    if (newViewMode === viewMode) return;
    setIsViewChanging(true);
    setTimeout(() => {
      setViewMode(newViewMode);
      setIsViewChanging(false);
    }, 150);
  };

  // Handle sort mode change
  const handleSortModeChange = (newSortMode) => {
    if (newSortMode === sortMode) return;
    setIsSortChanging(true);
    setTimeout(() => {
      setSortMode(newSortMode);
      setExpandedDates(new Set()); // Reset expanded dates when switching sort
      setIsSortChanging(false);
    }, 150);
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  // Group releases by country for country-sorted view
  const groupReleasesByCountry = (releases) => {
    const groupedReleases = {};
    releases.forEach((release) => {
      const countryCode = release.country_code;
      if (!groupedReleases[countryCode]) {
        groupedReleases[countryCode] = [];
      }
      groupedReleases[countryCode].push(release);
    });

    // Sort countries alphabetically and sort releases within each country by date
    const sortedCountries = {};
    Object.keys(groupedReleases)
      .sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)))
      .forEach((countryCode) => {
        sortedCountries[countryCode] = sortReleasesByDate(
          groupedReleases[countryCode]
        );
      });

    return sortedCountries;
  };

  // Filter and group releases
  const { processedReleases, totalReleases, filteredReleases } = useMemo(() => {
    const releases = releaseData[activeTab] || [];
    const totalCount = releases.length;

    // Apply country filter
    let filtered = releases;
    if (selectedCountries.length > 0) {
      filtered = filtered.filter((release) =>
        selectedCountries.includes(release.country_code)
      );
    }

    const filteredCount = filtered.length;

    let processed;
    if (sortMode === "date") {
      // Group by date (existing logic)
      const sortedReleases = sortReleasesByDate(filtered);
      const groupedReleases = {};
      sortedReleases.forEach((release) => {
        const date = release.release_date;
        if (!groupedReleases[date]) {
          groupedReleases[date] = [];
        }
        groupedReleases[date].push(release);
      });
      processed = groupedReleases;
    } else {
      // Group by country
      processed = groupReleasesByCountry(filtered);
    }

    return {
      processedReleases: processed,
      totalReleases: totalCount,
      filteredReleases: filteredCount,
    };
  }, [releaseData, activeTab, selectedCountries, sortMode]);

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="release-dates"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-[10px]">
          <div
            className={`bg-[var(--accent-main)] flex-shrink-0 transition-all duration-300 ${
              open
                ? "w-[20px] h-[12px] rounded-full"
                : "w-[14px] h-[14px] rounded-full"
            }`}
          ></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Release Dates
          </h2>
        </div>
        <ChevronDown
          size={24}
          className={`text-[var(--text-primary)] transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out ${
          open ? "max-h-[3000px] overflow-visible" : "max-h-0 overflow-hidden"
        }`}
      >
        {/* Main Container */}
        <div className="bg-[var(--bg-trans-5)] rounded-[18px] px-[10px] py-[10px]">
          {/* Header with tabs and control buttons */}
          <div className="flex justify-between items-center h-[46px]">
            {/* Left side - Tabs or Select Countries */}
            <div className="flex-1 h-[46px] relative">
              <AnimatePresence mode="wait">
                {!showCountrySelector ? (
                  <motion.div
                    key="tabs"
                    className={`flex gap-[${TAB_SPACING}px] relative h-full`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {/* Active Tab Indicator */}
                    <div
                      className="absolute bg-[var(--accent-main)] rounded-[10px] transition-all duration-300 ease-out h-[46px]"
                      style={{
                        width: `${TAB_WIDTH}px`,
                        transform: `translateX(${getTabPosition()}px)`,
                      }}
                    />

                    {/* Tab Buttons */}
                    {availableReleaseTypes.map((tab) => {
                      const isActive = activeTab === tab;

                      return (
                        <h5
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          onMouseEnter={() => setHoveredTab(tab)}
                          onMouseLeave={() => setHoveredTab(null)}
                          className={`cursor-pointer flex items-center justify-center h-[46px] rounded-[10px] relative z-10 transition-all duration-300 ease-out px-[16px] ${
                            isActive
                              ? "text-[#121212] font-medium"
                              : hoveredTab === tab
                              ? "text-[var(--accent-main)] bg-[var(--bg-trans-15)]"
                              : "text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
                          }`}
                          style={{
                            width: `${TAB_WIDTH}px`,
                            backgroundColor:
                              hoveredTab === tab && !isActive
                                ? "var(--bg-trans-15)"
                                : "transparent",
                          }}
                        >
                          <span className="text-sm whitespace-nowrap select-none">
                            {getReleaseTypeDisplayName(tab)}
                          </span>
                        </h5>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="select-countries"
                    className="flex items-center h-[46px] px-[16px]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <h2 className="text-[var(--text-primary)] text-lg font-semibold">
                      Filter Countries{" "}
                      {selectedCountries.length > 0 &&
                        `(${selectedCountries.length} selected)`}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side - Control Buttons */}
            <div className="flex items-center gap-[12px]">
              <ReleaseCountryButton
                selectedCountries={selectedCountries}
                onClick={() => setShowCountrySelector(!showCountrySelector)}
                isActive={showCountrySelector}
                totalReleases={totalReleases}
                filteredReleases={filteredReleases}
              />

              <SortButton sortMode={sortMode} onChange={handleSortModeChange} />

              <ViewButton
                viewMode={viewMode}
                onChange={handleViewModeChange}
                disabled={sortMode === "country"}
              />
            </div>
          </div>

          {/* Country Selector */}
          <ReleaseCountrySelector
            availableCountries={availableCountries}
            selectedCountries={selectedCountries}
            onCountrySelect={handleCountrySelect}
            isOpen={showCountrySelector}
            onClose={() => setShowCountrySelector(false)}
            onClearAll={() => setSelectedCountries([])}
          />
        </div>

        {/* Release Timeline with filter animation */}
        {!showCountrySelector && (
          <div className="mt-[30px] relative">
            <div
              className={`transition-all duration-300 ease-out ${
                isTransitioning ||
                isCountryChanging ||
                isViewChanging ||
                isSortChanging
                  ? "opacity-0 transform translate-y-2"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              {Object.keys(processedReleases).length > 0 ? (
                <div className="space-y-[12px]">
                  {sortMode === "date" ? (
                    // Date-sorted view
                    Object.entries(processedReleases).map(
                      ([date, releases]) => (
                        <ReleaseDateGroup
                          key={date}
                          date={date}
                          releases={releases}
                          isExpanded={
                            viewMode === "expanded"
                              ? true
                              : expandedDates.has(date)
                          }
                          onToggle={() =>
                            viewMode === "collapsible" &&
                            toggleDateExpansion(date)
                          }
                          collapsible={viewMode === "collapsible"}
                        />
                      )
                    )
                  ) : (
                    // Country-sorted view - Flex wrap the country groups themselves
                    <div className="flex flex-wrap gap-[12px]">
                      {Object.entries(processedReleases).map(
                        ([countryCode, releases]) => (
                          <ReleaseCountryGroup
                            key={countryCode}
                            countryCode={countryCode}
                            releases={releases}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-[60px]">
                  <Clock
                    size={48}
                    className="mx-auto mb-4 text-[var(--text-secondary)] opacity-50"
                  />
                  <p className="text-[var(--text-secondary)] text-lg font-medium mb-2">
                    {selectedCountries.length > 0
                      ? "No releases found for selected countries"
                      : `No ${getReleaseTypeDisplayName(
                          activeTab
                        ).toLowerCase()} releases available`}
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm mt-3">
                    {selectedCountries.length > 0
                      ? "Try adjusting your country filters."
                      : "Try selecting a different release type."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
