import React from "react";
import { movieData } from "../data/movieDetails";
import { data } from "../data/photosdata";

const MovieLogo = () => {
  // Get the primary language from movie data
  const primaryLanguage = movieData?.primary?.primary_language;

  // Find the first logo that matches the primary language
  const matchingLogo = data?.logos?.find(
    (logo) => logo.iso_639_1 === primaryLanguage
  );

  // If no matching logo found, return null or a fallback
  if (!matchingLogo) {
    return (
      <div className="w-[1219px] flex justify-center items-center p-10 box-border">
        <div className="text-gray-500 italic text-center">
          No logo available for primary language
        </div>
      </div>
    );
  }

  return (
    <div className="w-[1219px] flex justify-center items-center p-10 box-border">
      <div className="flex justify-center items-center max-w-full">
        <img
          src={matchingLogo.url}
          alt={`${movieData?.primary?.title} logo`}
          className="max-w-full max-h-[200px] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default MovieLogo;
