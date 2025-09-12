import { useEffect, useState, useRef, useMemo } from "react";
import { movieData } from "../data/movieDetails";

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("");
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  // Memoize sections array to prevent re-creation on every render
  const sections = useMemo(
    () => [
      { id: "overview", title: "Overview" },
      { id: "cast", title: "Cast & Crew" },
      { id: "photos", title: "Photos" },
      { id: "videos", title: "Videos" },
      { id: "watch-providers", title: "Watch Providers" },
      { id: "additional-info", title: "Additional Information" },
      { id: "release-dates", title: "Release Dates" },
      // Only include Related Movies if movie belongs to a collection
      ...(movieData.primary.belongs_to_collection
        ? [{ id: "related-movies", title: "Related Movies" }]
        : []),
      { id: "similar-movies", title: "Similar Movies" },
    ],
    [movieData.primary.belongs_to_collection]
  );

  // Initialize activeSection with first section
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  // ScrollSpy effect
  useEffect(() => {
    const handleScroll = () => {
      let current = sections[0]?.id;
      for (let sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= 150) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Update indicator position whenever active section changes
  useEffect(() => {
    if (!containerRef.current) return;
    const buttons = containerRef.current.querySelectorAll("button");
    const activeIndex = sections.findIndex((s) => s.id === activeSection);
    const activeButton = buttons[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        top: activeButton.offsetTop - 6, // slightly more top padding
        height: activeButton.offsetHeight + 12, // taller highlight
      });
    }
  }, [activeSection, sections]);

  // Smooth scroll with offset
  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // adjust for sticky header height
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActiveSection(id);
  };

  return (
    <aside className="fixed top-[100px] flex gap-[21px] mt-[0px]">
      {/* Scrollbar */}
      <div className="relative w-[6px] flex-shrink-0">
        {/* Track */}
        <div className="absolute inset-0 bg-[var(--bg-trans-15)] rounded-full"></div>
        {/* Active highlight */}
        <div
          className="absolute left-0 w-full bg-[var(--accent-main)] rounded-full transition-[top,height] duration-300 ease-in-out"
          style={{
            top: `${indicatorStyle.top}px`,
            height: `${indicatorStyle.height}px`,
          }}
        ></div>
      </div>

      {/* Headings */}
      <div ref={containerRef} className="flex flex-col gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className={`relative text-left text-[16px] font-medium transition-colors duration-200 ${
              activeSection === section.id
                ? "text-[var(--accent-main)] font-semibold"
                : "text-[var(--text-primary)] hover:text-[var(--accent-main)]"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
