// src/components/CrewBlock.jsx
import { useState } from "react";
// import { movieData as movie } from "../../data/dune/crewData";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CrewBlock() {
  const [open, setOpen] = useState(true); // default open
  const topCrew = movie.crew.slice(0, 6);

  return (
    <div className="max-w-[1219px] mx-auto flex flex-col gap-[30px]" id="crew">
      {/* First Row */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {/* Left Section */}
        <div className="flex items-center gap-[10px]">
          {/* Accent Shape with animation */}
          <div
            className={`bg-[var(--accent-main)] flex-shrink-0 transition-all duration-300 
              ${
                open
                  ? "w-[20px] h-[12px] rounded-full"
                  : "w-[14px] h-[14px] rounded-full"
              }`}
          ></div>

          {/* Title */}
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">
            Crew
          </h2>

          {/* See All Button */}
          <button
            className="flex items-center gap-[10px] bg-[var(--bg-trans-15)] px-[18px] py-[8px] rounded-[10px] 
                       text-[var(--text-primary)] text-base"
            onClick={(e) => e.stopPropagation()} // prevent toggle
          >
            See all
            <ChevronRight size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Right Section - Toggle Icon */}
        <ChevronDown
          size={24}
          className={`text-[var(--text-primary)] transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Second Row - Animated Collapse */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
          open ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="flex justify-between flex-wrap">
          {topCrew.map((member) => (
            <div key={member.name} className="w-[181px] flex flex-col">
              {/* Image */}
              <img
                src={
                  member.profile_url ||
                  "https://via.placeholder.com/181x181?text=No+Image"
                }
                alt={member.name}
                className="w-[181px] h-[181px] object-cover rounded-[20px]"
              />

              {/* Gap */}
              <div className="h-[12px]"></div>

              {/* Name */}
              <p className="text-white text-[16px] leading-[1.5] font-medium">
                {member.name}
              </p>

              {/* Role */}
              <p className="text-[var(--text-secondary)] text-[16px] leading-[1.4]">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
