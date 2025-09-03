import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Check, ArrowLeft } from "lucide-react";
import { watchProvidersData as data } from "../../data/watchProvidersData";
import {
  getCountryName,
  getPopularCountries,
  searchCountries,
  getTMDBImageUrl,
  getTabDisplayName,
  isValidCountryCode,
} from "../../lib/tmdbCountries";

export default function WatchProvidersBlock() {
  const [activeTab, setActiveTab] = useState("flatrate");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [open, setOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false); // New state for selection mode
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
    setSelectionMode(false); // Exit selection mode
    setCountrySearchTerm("");
    setHoveredCountry(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectionMode) return;

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
          setSelectionMode(false);
          setCountrySearchTerm("");
          setHoveredCountry(null);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectionMode, hoveredCountry, getAvailableCountries]);

  // Focus search input when selection mode opens
  useEffect(() => {
    if (selectionMode && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [selectionMode]);

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

  // If in selection mode, show the full selection interface
  if (selectionMode) {
    return (
      <div
        className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
        id="watch-providers"
      >
        {/* Selection Mode Header */}
        <div className="flex items-center gap-[20px]">
          <button
            onClick={() => setSelectionMode(false)}
            className="flex items-center gap-[10px] px-[15px] py-[8px] rounded-[10px] bg-[var(--bg-trans-15)] hover:bg-[var(--bg-trans-20)] transition-all duration-200 text-[var(--text-primary)]"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Select Country
          </h2>
        </div>

        {/* Search Bar */}
        <div className="bg-[var(--bg-trans-5)] rounded-[18px] p-[20px]">
          <div className="relative max-w-[400px]">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={countrySearchTerm}
              onChange={(e) => setCountrySearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-[var(--bg-trans-10)] text-[var(--text-primary)] rounded-[12px] border border-transparent outline-none text-base transition-all duration-200 focus:bg-[var(--bg-primary)] focus:border-[var(--accent-main)] focus:shadow-lg"
            />
            {countrySearchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-[var(--text-secondary)]">
            <span>{availableCountries.length} countries available</span>
            <span className="hidden md:inline">
              Use ↑↓ to navigate, Enter to select, ESC to cancel
            </span>
          </div>
        </div>

        {/* Countries Grid */}
        <div className="bg-[var(--bg-trans-5)] rounded-[18px] p-[20px]">
          {Object.entries(groupedCountries()).map(([groupName, countries]) => (
            <div key={groupName} className="mb-[30px] last:mb-0">
              {!countrySearchTerm && (
                <h3 className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wide mb-[15px] px-[10px]">
                  {groupName}
                </h3>
              )}

              {countries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px]">
                  {countries.map((country, index) => (
                    <div
                      key={country.iso_3166_1}
                      onClick={() => handleCountrySelect(country.iso_3166_1)}
                      onMouseEnter={() => setHoveredCountry(country.iso_3166_1)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      className={`p-[16px] rounded-[12px] cursor-pointer transition-all duration-200 flex items-center gap-[12px] group ${
                        selectedCountry === country.iso_3166_1
                          ? "bg-[var(--accent-main)] bg-opacity-15 border-2 border-[var(--accent-main)] shadow-lg"
                          : hoveredCountry === country.iso_3166_1
                          ? "bg-[var(--bg-trans-20)] border-2 border-[var(--bg-trans-30)] shadow-md"
                          : "bg-[var(--bg-trans-10)] border-2 border-transparent hover:bg-[var(--bg-trans-15)] hover:border-[var(--bg-trans-20)]"
                      }`}
                      style={{
                        animationDelay: `${index * 20}ms`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--bg-trans-10)] flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🌍</span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-grow">
                            <p
                              className={`font-medium text-sm truncate transition-colors duration-200 ${
                                selectedCountry === country.iso_3166_1
                                  ? "text-[var(--accent-main)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              {country.english_name}
                            </p>
                            {country.native_name !== country.english_name && (
                              <p className="text-xs text-[var(--text-secondary)] truncate mt-1">
                                {country.native_name}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-[var(--text-secondary)] font-mono bg-[var(--bg-trans-10)] px-2 py-1 rounded flex-shrink-0">
                              {country.iso_3166_1}
                            </span>
                            {selectedCountry === country.iso_3166_1 && (
                              <Check
                                size={16}
                                className="text-[var(--accent-main)] flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-[40px]">
                  <div className="text-[var(--text-secondary)]">
                    <Search size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-base font-medium">No countries found</p>
                    <p className="text-sm mt-1">Try a different search term</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal view (when not in selection mode)
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
        {/* Tabs + Country Selection Button */}
        <div className="flex justify-between items-center bg-[var(--bg-trans-5)] rounded-[18px] px-[10px] py-[10px]">
          {/* Left - Tabs with improved transitions */}
          <div className="flex gap-[8px] relative">
            {/* Background slider */}
            <div
              className={`absolute bg-[var(--accent-main)] rounded-[10px] transition-all duration-300 ease-out w-[74px] h-[46px]`}
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

            {["flatrate", "buy", "rent"].map((tab) => (
              <h5
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`cursor-pointer flex items-center justify-center w-[74px] h-[46px] rounded-[10px] relative z-10 transition-all duration-300 ease-out ${
                  activeTab === tab
                    ? "text-[#121212] font-medium"
                    : "text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {getTabDisplayName(tab)}
              </h5>
            ))}
          </div>

          {/* Country Selection Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectionMode(true);
            }}
            className="flex items-center gap-[12px] px-[20px] py-[10px] rounded-[12px] transition-all duration-200 bg-[var(--bg-trans-15)] hover:bg-[var(--bg-trans-20)] hover:shadow-md border border-transparent hover:border-[var(--bg-trans-30)]"
          >
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-[var(--bg-trans-10)] flex items-center justify-center">
              <span className="text-sm">🌍</span>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-[var(--text-primary)] font-medium text-sm leading-tight">
                {getCountryName(selectedCountry)}
              </p>
              <p className="text-[var(--text-secondary)] text-xs">
                Change country
              </p>
            </div>
            <ChevronDown size={16} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Providers Grid with Smooth Transitions */}
        <div className="mt-[30px] relative">
          <div
            className={`transition-all duration-300 ease-out ${
              isTransitioning
                ? "opacity-0 transform translate-y-2"
                : "opacity-100 transform translate-y-0"
            }`}
          >
            <div className="flex gap-[20px] flex-wrap">
              {currentProviders.length > 0 ? (
                currentProviders.map((provider, index) => (
                  <div
                    key={`${provider.provider_name}-${index}`}
                    className="flex flex-col items-center gap-[10px] group transition-all duration-200 hover:transform hover:scale-105"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="relative overflow-hidden rounded-[10px] transition-all duration-200 group-hover:shadow-lg">
                      <img
                        src={getTMDBImageUrl(provider.logo_url, "original")}
                        alt={provider.provider_name}
                        className="w-[66px] h-[66px] object-contain transition-all duration-200 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <p className="text-[var(--text-primary)] text-sm text-center transition-all duration-200 group-hover:text-[var(--accent-main)]">
                      {provider.provider_name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12">
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
