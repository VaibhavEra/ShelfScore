import { useState } from "react";
import { ChevronDown, Tv, TvMinimal } from "lucide-react";
import { watchProvidersData as data } from "../../data/watchProvidersData";
import {
  getTMDBImageUrl,
  getTabDisplayName,
  getCountryName,
} from "../../lib/tmdbWatchProvidersCountries";
import CountrySelector from "./CountrySelector";
import CountryButton from "./CountryButton";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchProvidersBlock() {
  const [activeTab, setActiveTab] = useState("flatrate");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [open, setOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [isCountryChanging, setIsCountryChanging] = useState(false);

  // Get available countries from data
  const availableCountries = Object.keys(data.results);

  // Smooth tab transition handler
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
    if (countryCode === selectedCountry) {
      setShowCountrySelector(false);
      return;
    }

    setIsCountryChanging(true);
    setSelectedCountry(countryCode);
    setShowCountrySelector(false);

    // Delay providers animation
    setTimeout(() => {
      setIsCountryChanging(false);
    }, 300);
  };

  // Handle provider click
  const handleProviderClick = (provider) => {
    const countryData = data.results[selectedCountry];
    if (countryData && countryData.link) {
      window.open(countryData.link, "_blank", "noopener noreferrer");
    }
  };

  // Get providers for current country and tab
  const getProvidersForCountryAndTab = () => {
    const countryData = data.results[selectedCountry];
    if (!countryData || !countryData[activeTab]) {
      return [];
    }
    return countryData[activeTab];
  };

  const currentProviders = getProvidersForCountryAndTab();

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="watch-providers"
    >
      {/* Header */}
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

      {/* Collapsible Content */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out ${
          open ? "max-h-[2000px] overflow-visible" : "max-h-0 overflow-hidden"
        }`}
      >
        {/* Main Container */}
        <div className="bg-[var(--bg-trans-5)] rounded-[18px] px-[10px] py-[10px]">
          {/* Header with proper spacing for Select Country */}
          <div className="flex justify-between items-center h-[46px]">
            {/* Left side - Tabs or Select Country with proper animation */}
            <div className="w-[238px] h-[46px] relative">
              <AnimatePresence mode="wait">
                {!showCountrySelector ? (
                  <motion.div
                    key="tabs"
                    className="flex gap-[8px] relative h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
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
                        onMouseEnter={() => setHoveredTab(tab)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className={`cursor-pointer flex items-center justify-center w-[74px] h-[46px] rounded-[10px] relative z-10 transition-all duration-300 ease-out ${
                          activeTab === tab
                            ? "text-[var(--text-primary-dark)] font-medium"
                            : hoveredTab === tab
                            ? "text-[var(--accent-main)] bg-[var(--bg-trans-15)]"
                            : "text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
                        }`}
                        style={{
                          backgroundColor:
                            hoveredTab === tab && activeTab !== tab
                              ? "var(--bg-trans-15)"
                              : "transparent",
                        }}
                      >
                        {getTabDisplayName(tab)}
                      </h5>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="select-country"
                    className="flex items-center h-[46px] px-[16px]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <h2 className="text-[var(--text-primary)] text-lg font-semibold">
                      Select Country
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side - Country Button */}
            <CountryButton
              selectedCountry={selectedCountry}
              onClick={() => setShowCountrySelector(!showCountrySelector)}
              isActive={showCountrySelector}
            />
          </div>

          {/* Country Selector */}
          <CountrySelector
            availableCountries={availableCountries}
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            isOpen={showCountrySelector}
            onClose={() => setShowCountrySelector(false)}
          />
        </div>

        {/* Providers Grid with country change animation */}
        {!showCountrySelector && (
          <div className="mt-[30px] relative">
            <div
              className={`transition-all duration-300 ease-out ${
                isTransitioning || isCountryChanging
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
                      title={`Watch on ${provider.provider_name}`}
                    >
                      <div className="relative overflow-hidden rounded-[10px] w-[66px] h-[66px] flex items-center justify-center bg-[var(--bg-trans-15)]">
                        <img
                          src={getTMDBImageUrl(provider.logo_url, "original")}
                          alt={provider.provider_name}
                          className="w-[66px] h-[66px] object-contain"
                          onError={(e) => {
                            const fallback = e.target.nextElementSibling;
                            e.target.style.display = "none";
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <TvMinimal
                          size={24}
                          className="text-[var(--text-secondary)] opacity-60 hidden items-center justify-center absolute inset-0"
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
                  <div className="col-span-full text-center py-8">
                    <div className="transition-all duration-300 opacity-60 hover:opacity-100">
                      <Tv
                        size={48}
                        className="mx-auto mb-3 text-[var(--text-secondary)] opacity-50"
                      />
                      <p className="text-[var(--text-secondary)] text-base">
                        No {getTabDisplayName(activeTab).toLowerCase()}{" "}
                        providers available for{" "}
                        {getCountryName(selectedCountry)}.
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
        )}
      </div>
    </div>
  );
}
