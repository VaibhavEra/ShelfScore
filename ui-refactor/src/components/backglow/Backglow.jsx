import { movieData } from "../../data/movieDetails";

function Backglow() {
  const posterUrl = movieData.primary.poster_url;

  return (
    <div className="w-full h-full overflow-visible pointer-events-none relative">
      <div
        className="opacity-50 absolute"
        style={{
          // Center horizontally and make it full width
          left: "50%",
          transform: "translateX(-50%) scale(1.2)",
          top: "-50vh", // Adjust this value to control vertical positioning
          width: "100vw", // Full viewport width
          height: "200vh", // Tall enough to cover scroll area
          backgroundImage: `url(${posterUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(120px)",
          maskImage: `
            radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%),
            linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)
          `,
          WebkitMaskImage: `
            radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%),
            linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "destination-in",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
export default Backglow;
