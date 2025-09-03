import { movieData } from "../data/movieDetails";

function Backglow() {
  const posterUrl = movieData.primary.poster_url;

  return (
    <div className="w-full h-full overflow-visible pointer-events-none relative">
      <div
        className="opacity-50 absolute"
        style={{
          // Converted from 164px left on 1920px width to ~8.5vw
          left: "8.5vw",
          // Converted from -1063px top on 1080px height to ~-98.4vh (adjusted for effect)
          top: "-98vh",
          // Converted from 1592px width on 1920px width to ~83vw
          width: "83vw",
          // Converted from 2326px height on 1080px height to ~215vh (scaled for stylized blur)
          height: "215vh",
          backgroundImage: `url(${posterUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(120px)",
          transform: "scale(1.2)",
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
