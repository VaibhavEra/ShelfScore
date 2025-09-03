import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { watchProvidersData as data } from "../../data/watchProvidersData";
import {
  getCountryName,
  getPopularCountries,
  searchCountries,
  getTMDBImageUrl,
  getTabDisplayName,
  isValidCountryCode,
} from "../../lib/tmdbWatchProvidersCountries";

export default function WatchProvidersBlock() {
  const [activeTab, setActiveTab] = useState("flatrate");
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [open, setOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get filtered countries based on search and what's actually available in the data
  const getAvailableCountries = () => {
    const availableInData = Object.keys(data.results);
    const searchResults = countrySearchTerm
      ? searchCountries(countrySearchTerm)
      : getPopularCountries();

    return searchResults.filter((country) =>
      availableInData.includes(country.iso_3166_1)
    );
  };

  // Clear search
  const clearSearch = () => {
    setCountrySearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Smooth tab transition handler
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;

    setIsTransitioning(true);

    // Short delay to allow fade out
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  // Handle country selection
  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setCountryOpen(false);
    setCountrySearchTerm("");
    setHoveredCountry(null);
  };

  // Handle provider click - use the actual link from data
  const handleProviderClick = (provider) => {
    const countryData = data.results[selectedCountry];
    if (countryData && countryData.link) {
      window.open(countryData.link, "_blank", "noopener noreferrer");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCountryOpen(false);
        setCountrySearchTerm("");
        setHoveredCountry(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!countryOpen) return;

      const availableCountries = getAvailableCountries();
      const currentIndex = hoveredCountry
        ? availableCountries.findIndex((c) => c.iso_3166_1 === hoveredCountry)
        : -1;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextIndex =
            currentIndex < availableCountries.length - 1 ? currentIndex + 1 : 0;
          setHoveredCountry(availableCountries[nextIndex]?.iso_3166_1);
          break;
        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : availableCountries.length - 1;
          setHoveredCountry(availableCountries[prevIndex]?.iso_3166_1);
          break;
        case "Enter":
          e.preventDefault();
          if (hoveredCountry) {
            handleCountrySelect(hoveredCountry);
          }
          break;
        case "Escape":
          setCountryOpen(false);
          setCountrySearchTerm("");
          setHoveredCountry(null);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [countryOpen, hoveredCountry, getAvailableCountries]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (countryOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [countryOpen]);

  // Get providers for current country and tab
  const getProvidersForCountryAndTab = () => {
    const countryData = data.results[selectedCountry];
    if (!countryData || !countryData[activeTab]) {
      return [];
    }
    return countryData[activeTab];
  };

  const currentProviders = getProvidersForCountryAndTab();
  const availableCountries = getAvailableCountries();

  // Group countries for better organization
  const groupedCountries = () => {
    if (countrySearchTerm) return { "Search Results": availableCountries };

    const popular = availableCountries.slice(0, 12); // First 12 are popular
    const others = availableCountries.slice(12);

    return {
      Popular: popular,
      "All Countries": others,
    };
  };

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="watch-providers"
    >
      {/* First Row - Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-[10px]">
          <div
            className={`bg-[var(--accent-main)] flex-shrink-0 transition-all duration-300 
              ${
                open
                  ? "w-[20px] h-[12px] rounded-full"
                  : "w-[14px] h-[14px] rounded-full"
              }`}
          ></div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Watch Providers
          </h2>
        </div>
        <ChevronDown
          size={24}
          className={`text-[var(--text-primary)] transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Second + Third Rows - Collapsible */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out ${
          open ? "max-h-[2000px] overflow-visible" : "max-h-0 overflow-hidden"
        }`}
      >
        {/* Tabs + Country Dropdown */}
        <div className="flex justify-between items-center bg-[var(--bg-trans-5)] rounded-[18px] px-[10px] py-[10px] relative overflow-visible">
          {/* Left - Tabs with improved hover states */}
          <div className="flex gap-[8px] relative">
            {/* Background slider - only shows for active tab */}
            <div
              className={`absolute bg-[var(--accent-main)] rounded-[10px] transition-all duration-300 ease-out w-[74px] h-[46px] ${
                activeTab ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transform: `translateX(${
                  activeTab === "flatrate"
                    ? "0px"
                    : activeTab === "buy"
                    ? "82px"
                    : "164px"
                })`,
              }}
            />

            {["flatrate", "buy", "rent"].map((tab, index) => (
              <h5
                key={tab}
                onClick={() => handleTabChange(tab)}
                onMouseEnter={() => setHoveredTab(tab)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`cursor-pointer flex items-center justify-center w-[74px] h-[46px] rounded-[10px] relative z-10 transition-all duration-300 ease-out ${
                  activeTab === tab
                    ? "text-[#121212] font-medium"
                    : hoveredTab === tab
                    ? "text-[var(--accent-main)] bg-[var(--bg-trans-15)]"
                    : "text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
                }`}
                style={{
                  backgroundColor:
                    hoveredTab === tab && activeTab !== tab
                      ? "var(--bg-trans-15)"
                      : activeTab === tab
                      ? "transparent"
                      : "transparent",
                }}
              >
                {getTabDisplayName(tab)}
              </h5>
            ))}
          </div>

          {/* Enhanced Country Dropdown */}
          <div className="relative z-50" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCountryOpen(!countryOpen);
              }}
              className={`flex items-center gap-[10px] px-[18px] py-[8px] rounded-[10px] transition-all duration-200 border ${
                countryOpen
                  ? "bg-[var(--bg-trans-20)] border-[var(--accent-main)] shadow-lg"
                  : "bg-[var(--bg-trans-15)] border-transparent hover:bg-[var(--bg-trans-20)] hover:border-[var(--bg-trans-30)]"
              }`}
            >
              {/* Country Flag Emoji (optional) */}
              <div className="w-5 h-5 rounded-sm overflow-hidden bg-[var(--bg-trans-10)] flex items-center justify-center">
                <span className="text-xs">🌍</span>
              </div>
              <p className="text-[var(--text-secondary)] font-medium">
                {getCountryName(selectedCountry)}
              </p>
              <ChevronDown
                size={20}
                className={`text-[var(--text-primary)] transition-all duration-300 ${
                  countryOpen
                    ? "rotate-180 text-[var(--accent-main)]"
                    : "rotate-0"
                }`}
              />
            </button>

            {countryOpen && (
              <>
                {/* Backdrop for mobile */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
                  onClick={() => setCountryOpen(false)}
                />

                {/* Dropdown */}
                <div className="fixed md:absolute right-0 md:right-0 top-1/2 md:top-full md:mt-3 left-1/2 md:left-auto transform -translate-x-1/2 md:transform-none -translate-y-1/2 md:translate-y-0 w-[90vw] md:w-[350px] max-w-[350px] bg-[var(--bg-primary)] rounded-[12px] shadow-2xl border border-[var(--bg-trans-20)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Enhanced Search Header */}
                  <div className="p-4 border-b border-[var(--bg-trans-10)] bg-[var(--bg-trans-5)]">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearchTerm}
                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-[var(--bg-trans-10)] text-[var(--text-primary)] rounded-[8px] border border-transparent outline-none text-sm transition-all duration-200 focus:bg-[var(--bg-primary)] focus:border-[var(--accent-main)] focus:shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {countrySearchTerm && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-secondary)]">
                      <span>
                        {availableCountries.length} countries available
                      </span>
                      {countrySearchTerm && (
                        <span className="hidden md:inline">
                          Press ↑↓ to navigate, Enter to select
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Countries List with Grouping */}
                  <div className="max-h-[280px] overflow-y-auto scrollbar-thin">
                    {Object.entries(groupedCountries()).map(
                      ([groupName, countries]) => (
                        <div key={groupName}>
                          {!countrySearchTerm && (
                            <div className="px-4 py-2 bg-[var(--bg-trans-5)] border-b border-[var(--bg-trans-5)]">
                              <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                                {groupName}
                              </span>
                            </div>
                          )}

                          {countries.length > 0 ? (
                            countries.map((country, index) => (
                              <div
                                key={country.iso_3166_1}
                                onClick={() =>
                                  handleCountrySelect(country.iso_3166_1)
                                }
                                onMouseEnter={() =>
                                  setHoveredCountry(country.iso_3166_1)
                                }
                                onMouseLeave={() => setHoveredCountry(null)}
                                className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                                  selectedCountry === country.iso_3166_1
                                    ? "bg-[var(--accent-main)] bg-opacity-10 text-[var(--accent-main)] border-r-2 border-[var(--accent-main)]"
                                    : hoveredCountry === country.iso_3166_1 ||
                                      (index === 0 && !hoveredCountry)
                                    ? "bg-[var(--bg-trans-15)] text-[var(--text-primary)]"
                                    : "text-[var(--text-primary)] hover:bg-[var(--bg-trans-10)]"
                                }`}
                                style={{
                                  animationDelay: `${index * 15}ms`,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-sm overflow-hidden bg-[var(--bg-trans-10)] flex items-center justify-center text-xs">
                                    🌍
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">
                                      {country.english_name}
                                    </span>
                                    {country.native_name !==
                                      country.english_name && (
                                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                                        {country.native_name}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[var(--text-secondary)] font-mono bg-[var(--bg-trans-10)] px-1.5 py-0.5 rounded">
                                    {country.iso_3166_1}
                                  </span>
                                  {selectedCountry === country.iso_3166_1 && (
                                    <Check
                                      size={16}
                                      className="text-[var(--accent-main)]"
                                    />
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center">
                              <div className="text-[var(--text-secondary)]">
                                <Search
                                  size={24}
                                  className="mx-auto mb-2 opacity-50"
                                />
                                <p className="text-sm">No countries found</p>
                                <p className="text-xs mt-1">
                                  Try a different search term
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {/* Footer with tips */}
                  <div className="p-3 bg-[var(--bg-trans-5)] border-t border-[var(--bg-trans-10)]">
                    <div className="text-xs text-[var(--text-secondary)] flex items-center justify-between">
                      <span className="hidden md:inline">
                        Use keyboard arrows to navigate
                      </span>
                      <span className="md:hidden">Tap to select country</span>
                      <span className="font-mono">ESC to close</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Providers Grid with Simple Underline and Even Spacing */}
        <div className="mt-[30px] relative">
          <div
            className={`transition-all duration-300 ease-out ${
              isTransitioning
                ? "opacity-0 transform translate-y-2"
                : "opacity-100 transform translate-y-0"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-[20px]">
              {currentProviders.length > 0 ? (
                currentProviders.map((provider, index) => (
                  <div
                    key={`${provider.provider_name}-${index}`}
                    onClick={() => handleProviderClick(provider)}
                    onMouseEnter={() => setHoveredProvider(index)}
                    onMouseLeave={() => setHoveredProvider(null)}
                    className="flex flex-col items-center gap-[10px] cursor-pointer transition-all duration-300"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    title={`Watch on ${provider.provider_name}`}
                  >
                    <div className="relative overflow-hidden rounded-[10px]">
                      <img
                        src={getTMDBImageUrl(provider.logo_url, "original")}
                        alt={provider.provider_name}
                        className="w-[66px] h-[66px] object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <p
                      className={`text-sm text-center transition-all duration-300 font-medium ${
                        hoveredProvider === index
                          ? "text-[var(--accent-main)] underline"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {provider.provider_name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="transition-all duration-300 opacity-60 hover:opacity-100">
                    <p className="text-[var(--text-secondary)] text-base">
                      No {getTabDisplayName(activeTab).toLowerCase()} providers
                      available for {getCountryName(selectedCountry)}.
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm mt-2">
                      Try selecting a different country or tab.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
