// utils/getCertificationForOrigin.js
export function getCertificationForOrigin(movieData, releaseDatesData) {
  const originCountry = movieData.additional.origin_country[0];
  const theatrical = releaseDatesData.theatrical || [];

  // Find the theatrical release entry matching the origin country
  const matchingEntry = theatrical.find(
    (entry) => entry.iso_3166_1 === originCountry
  );

  if (matchingEntry) {
    return {
      certification: matchingEntry.certification || "",
      year: movieData.primary.release_date.year,
      language: movieData.primary.primary_language.toUpperCase(),
    };
  }

  return null;
}
