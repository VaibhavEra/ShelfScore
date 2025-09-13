// components/navbar/Navbar.js
import React from "react";
import {
  ChevronDown,
  Search,
  BookmarkPlus,
  CircleUserRound,
  Moon,
} from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-nav)] border-b border-white/10"
      style={{ height: "73px" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-center">
        {/* Main navbar container - 1442w x 39h centered */}
        <div
          className="flex items-center gap-7"
          style={{ width: "1442px", height: "39px" }}
        >
          {/* First sub-container: Logo */}
          <div className="flex items-center">
            <div className="text-[var(--text-primary)] font-medium">Logo</div>
          </div>

          {/* Second sub-container: Navigation options */}
          <div className="flex items-center gap-8">
            <span className="text-[var(--text-primary)] text-base font-normal">
              Movies
            </span>
            <span className="text-[var(--text-primary)] text-base font-normal">
              TV Shows
            </span>
            <span className="text-[var(--text-primary)] text-base font-normal">
              Popular
            </span>
            <span className="text-[var(--text-primary)] text-base font-normal">
              Now Playing
            </span>
            <span className="text-[var(--text-primary)] text-base font-normal">
              Lists
            </span>
          </div>

          {/* Third sub-container: Search bar */}
          <div
            className="flex items-center bg-[var(--bg-secondary)] rounded-[10px] px-5 py-[6px]"
            style={{ flex: "1" }}
          >
            {/* Left section: Dropdown and search input */}
            <div className="flex items-center gap-[15px] flex-1">
              {/* All dropdown */}
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] text-base font-normal">
                  All
                </span>
                <ChevronDown size={16} className="text-[var(--text-primary)]" />
              </div>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search ShelfScore"
                className="bg-transparent text-sm text-[var(--text-secondary)] placeholder-[var(--text-secondary)] border-none outline-none flex-1"
              />
            </div>

            {/* Right section: Search icon */}
            <div className="flex items-center">
              <Search size={24} className="text-[var(--text-primary)]" />
            </div>
          </div>

          {/* Fourth sub-container: Watchlist button */}
          <div className="flex items-center gap-[5px]">
            <BookmarkPlus size={24} className="text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] text-base font-normal">
              Watchlist
            </span>
          </div>

          {/* Fifth sub-container: User profile */}
          <div className="flex items-center gap-[5px]">
            <CircleUserRound size={22} className="text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] text-base font-normal">
              User
            </span>
          </div>

          {/* Sixth sub-container: Dark mode toggle */}
          <div className="flex items-center">
            <Moon size={22} className="text-[var(--text-primary)]" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
