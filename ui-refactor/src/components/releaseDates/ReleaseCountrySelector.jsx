import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Globe } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import {
  getCountryName,
  getFilteredCountriesWithToggle,
} from "../../lib/releaseScheduleCountries";

export default function ReleaseCountrySelector({
  availableCountries,
  selectedCountries,
  onCountrySelect,
  isOpen,
  onClose,
  onClearAll,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [clearAllCounter, setClearAllCounter] = useState(0);
  const searchInputRef = useRef(null);

  // Get filtered countries based on search
  const getFilteredCountries = () => {
    if (searchTerm) {
      const { countries } = getFilteredCountriesWithToggle(
        availableCountries,
        true
      );
      return countries.filter(
        (country) =>
          country.english_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          country.native_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          country.iso_3166_1.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const { countries } = getFilteredCountriesWithToggle(
      availableCountries,
      showAllCountries
    );
    return countries;
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFocusedIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle country selection
  const handleCountrySelect = (countryCode) => {
    onCountrySelect(countryCode);
  };

  // Handle clear all with animation trigger
  const handleClearAll = () => {
    onClearAll();
    setClearAllCounter((c) => c + 1);
  };

  // Reset states when selector closes
  useEffect(() => {
    if (!isOpen) {
      setShowAllCountries(false);
      setSearchTerm("");
      setHoveredCountry(null);
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Calculate grid dimensions for navigation
  const getGridDimensions = () => {
    const countries = getFilteredCountries();
    const cols =
      window.innerWidth >= 1280
        ? 4
        : window.innerWidth >= 1024
        ? 3
        : window.innerWidth >= 640
        ? 2
        : 1;
    const rows = Math.ceil(countries.length / cols);
    return { cols, rows, total: countries.length };
  };

  // Navigate grid in all directions
  const navigateGrid = (direction) => {
    const countries = getFilteredCountries();
    const { cols } = getGridDimensions();
    let newIndex = focusedIndex;

    switch (direction) {
      case "ArrowDown":
        newIndex = focusedIndex + cols;
        if (newIndex >= countries.length) {
          newIndex = focusedIndex % cols;
        }
        break;
      case "ArrowUp":
        newIndex = focusedIndex - cols;
        if (newIndex < 0) {
          const col = focusedIndex % cols;
          const lastRowStart = Math.floor((countries.length - 1) / cols) * cols;
          newIndex = lastRowStart + col;
          if (newIndex >= countries.length) {
            newIndex = lastRowStart + col - cols;
          }
        }
        break;
      case "ArrowRight":
        newIndex = focusedIndex + 1;
        if (
          newIndex >= countries.length ||
          Math.floor(newIndex / cols) !== Math.floor(focusedIndex / cols)
        ) {
          newIndex = Math.floor(focusedIndex / cols) * cols;
        }
        break;
      case "ArrowLeft":
        newIndex = focusedIndex - 1;
        if (
          newIndex < 0 ||
          Math.floor(newIndex / cols) !== Math.floor(focusedIndex / cols)
        ) {
          const rowStart = Math.floor(focusedIndex / cols) * cols;
          const rowEnd = Math.min(rowStart + cols - 1, countries.length - 1);
          newIndex = rowEnd;
        }
        break;
    }

    setFocusedIndex(newIndex);
    setHoveredCountry(countries[newIndex]?.iso_3166_1 || null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const countries = getFilteredCountries();

      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowLeft":
          e.preventDefault();
          if (focusedIndex === -1 && countries.length > 0) {
            setFocusedIndex(0);
            setHoveredCountry(countries[0]?.iso_3166_1);
          } else {
            navigateGrid(e.key);
          }
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && countries[focusedIndex]) {
            handleCountrySelect(countries[focusedIndex].iso_3166_1);
          }
          break;
        case "Escape":
          onClose();
          setSearchTerm("");
          setHoveredCountry(null);
          setShowAllCountries(false);
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, searchTerm, showAllCountries]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset states when searching
  useEffect(() => {
    if (searchTerm) {
      setFocusedIndex(-1);
    }
  }, [searchTerm]);

  // Flag component with error handling
  const CountryFlag = ({ countryCode, country }) => {
    const FlagComponent = Flags[countryCode];

    if (FlagComponent) {
      return (
        <FlagComponent
          title={country.english_name}
          style={{
            width: "28px",
            height: "21px",
            borderRadius: "3px",
            boxShadow: "var(--shadow-drop-small)",
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: "28px",
          height: "21px",
          borderRadius: "3px",
          backgroundColor: "var(--bg-trans-60)",
          border: "1px solid var(--border-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          color: "var(--text-secondary)",
        }}
        title={country.english_name}
      >
        {countryCode}
      </div>
    );
  };

  const displayCountries = getFilteredCountries();
  const { showToggle } = getFilteredCountriesWithToggle(
    availableCountries,
    showAllCountries
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pt-[10px]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Search Bar */}
          <motion.div
            className="rounded-[12px] p-[16px] mb-[20px]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-[var(--bg-trans-15)] text-[var(--text-primary)] rounded-[10px] border border-transparent outline-none text-base transition-all duration-200 focus:bg-[var(--bg-primary)] focus:border-[var(--accent-main)] focus:shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-[var(--text-secondary)]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${searchTerm}-${showAllCountries}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {searchTerm
                    ? `${displayCountries.length} countries found`
                    : showToggle && !showAllCountries
                    ? "Popular countries"
                    : `${displayCountries.length} countries available`}
                </motion.span>
              </AnimatePresence>
              <span className="hidden md:inline text-xs">
                Use arrows to navigate, Enter to select, ESC to cancel
              </span>
            </div>
          </motion.div>

          {/* Countries Grid */}
          <motion.div
            className="rounded-[12px] p-[16px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Section Header - Shows when toggle is available */}
            {!searchTerm && showToggle && (
              <div className="flex items-center justify-between mb-[16px]">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={showAllCountries}
                    className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wide flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {showAllCountries ? (
                      <>
                        <Globe size={16} />
                        All Countries
                      </>
                    ) : (
                      <>
                        <MapPin size={16} />
                        Popular Countries
                      </>
                    )}
                  </motion.h3>
                </AnimatePresence>
                <div className="flex items-center gap-4">
                  {/* Clear All Button */}
                  {selectedCountries.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-[var(--accent-main)] text-sm font-medium hover:underline transition-all duration-200 cursor-pointer"
                    >
                      Clear all ({selectedCountries.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowAllCountries(!showAllCountries);
                      setFocusedIndex(-1);
                    }}
                    className="text-[var(--accent-main)] text-sm font-medium hover:underline transition-all duration-200 cursor-pointer"
                  >
                    {showAllCountries
                      ? "Show popular only"
                      : "Show all countries"}
                  </button>
                </div>
              </div>
            )}

            {/* Clear All Button - Show when no toggle but have selections */}
            {!searchTerm && !showToggle && selectedCountries.length > 0 && (
              <div className="flex items-center justify-end mb-[16px]">
                <button
                  onClick={handleClearAll}
                  className="text-[var(--accent-main)] text-sm font-medium hover:underline transition-all duration-200 cursor-pointer"
                >
                  Clear all ({selectedCountries.length})
                </button>
              </div>
            )}

            {displayCountries.length > 0 ? (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${showAllCountries}-${searchTerm}-${clearAllCounter}`}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px] max-h-[400px] overflow-y-auto custom-scroll pr-[8px]"
                    style={{ scrollbarGutter: "stable" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {displayCountries.map((country, index) => {
                      const isSelected = selectedCountries.includes(
                        country.iso_3166_1
                      );

                      return (
                        <div
                          key={country.iso_3166_1}
                          onClick={() =>
                            handleCountrySelect(country.iso_3166_1)
                          }
                          onMouseEnter={() => {
                            setHoveredCountry(country.iso_3166_1);
                            setFocusedIndex(index);
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry(null);
                            setFocusedIndex(-1);
                          }}
                          className={`p-[14px] rounded-[12px] cursor-pointer transition-all duration-200 flex items-center gap-[14px] group min-h-[72px] ${
                            isSelected
                              ? "bg-[var(--accent-main)] bg-opacity-25 border-2 border-[var(--accent-main)] shadow-lg"
                              : focusedIndex === index ||
                                hoveredCountry === country.iso_3166_1
                              ? "bg-[var(--accent-main)] bg-opacity-20 border-2 border-[var(--accent-main)] shadow-md"
                              : "bg-[var(--bg-trans-15)] border-2 border-transparent hover:bg-[var(--bg-trans-60)] hover:border-[var(--border-secondary)]"
                          }`}
                        >
                          {/* Country Flag */}
                          <div className="flex-shrink-0">
                            <CountryFlag
                              countryCode={country.iso_3166_1}
                              country={country}
                            />
                          </div>

                          {/* Country Info */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-[8px]">
                              <div className="min-w-0 flex-grow">
                                <p
                                  className={`font-semibold text-sm truncate transition-colors duration-200 leading-tight ${
                                    isSelected
                                      ? "text-[var(--text-primary-dark)]"
                                      : focusedIndex === index ||
                                        hoveredCountry === country.iso_3166_1
                                      ? "text-[var(--text-primary-dark)]"
                                      : "text-[var(--text-primary)]"
                                  }`}
                                >
                                  {country.english_name}
                                </p>
                                {/* Native Name */}
                                {country.native_name &&
                                  country.native_name !==
                                    country.english_name && (
                                    <p
                                      className={`text-xs truncate mt-[2px] transition-colors duration-200 leading-tight ${
                                        isSelected
                                          ? "text-[var(--text-primary-dark)] opacity-75"
                                          : focusedIndex === index ||
                                            hoveredCountry ===
                                              country.iso_3166_1
                                          ? "text-[var(--text-primary-dark)] opacity-75"
                                          : "text-[var(--text-secondary)] opacity-75"
                                      }`}
                                    >
                                      {country.native_name}
                                    </p>
                                  )}
                              </div>

                              {/* Country Code + Selection Indicator */}
                              <div className="flex items-center flex-shrink-0">
                                <span
                                  className={`text-xs font-mono transition-colors duration-200 ${
                                    isSelected
                                      ? "text-[var(--text-primary-dark)] font-semibold"
                                      : focusedIndex === index ||
                                        hoveredCountry === country.iso_3166_1
                                      ? "text-[var(--text-primary-dark)] font-semibold"
                                      : "text-[var(--text-secondary)] opacity-75"
                                  }`}
                                >
                                  {country.iso_3166_1}
                                </span>
                                {/* Selection Indicator */}
                                {isSelected && (
                                  <div className="flex items-center justify-center w-[20px] h-[20px] bg-[var(--text-primary-dark)] rounded-full ml-[8px]">
                                    <span className="text-[var(--text-primary)] text-xs">
                                      ✓
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-[30px]">
                <div className="transition-all duration-300 opacity-60 hover:opacity-100">
                  <Search
                    size={28}
                    className="mx-auto mb-3 text-[var(--text-secondary)] opacity-50"
                  />
                  <p className="text-base font-medium text-[var(--text-secondary)]">
                    No countries found
                  </p>
                  <p className="text-sm mt-1 text-[var(--text-secondary)]">
                    Try a different search term
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
