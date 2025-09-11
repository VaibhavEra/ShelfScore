import AdditionalInformationBlock from "./components/additionalInfo/AdditionalInformationBlock";
import CastBlock from "./components/cast/CastBlock";
import CrewBlock from "./components/crew/CrewBlock";
import HeroLayout from "./components/hero/HeroLayout";
import ImageBlock from "./components/image/ImageBlock";
import SectionDivider from "./components/sectiondivider/SectionDivider";
import VideoBlock from "./components/video/VideoBlock";
import WatchProvidersBlock from "./components/watchProviders/WatchProvidersBlock";
import Backglow from "./components/Backglow";
import SimilarMoviesBlock from "./components/similarMovies/SimilarMoviesBlock";
import RelatedMoviesBlock from "./components/relatedMovies/RelatedMoviesBlock";
import Sidebar from "./components/Sidebar";

import ReleaseDatesBlock from "./components/releaseDates/ReleaseDatesBlock";
import Logo from "./components/Logo";
import { data } from "../src/data/releaseDatesData";

function App() {
  return (
    <div className="relative bg-[var(--bg-primary)] min-h-screen overflow-hidden">
      {/* Glow stays back */}
      <div className="absolute inset-0 z-0">
        <Backglow />
      </div>

      {/* Layout: content + sidebar */}
      <div className="relative z-10 flex max-w-[1400px] mx-auto px-8 gap-16">
        {/* Main content */}
        <div className="flex-1">
          <HeroLayout id="overview" />
          <SectionDivider />
          <div className="space-y-[100px]">
            <CastBlock id="cast" />
            {/* <CrewBlock id="crew" /> */}
            <ImageBlock id="photos" />
            <VideoBlock id="videos" />
            <WatchProvidersBlock id="watch-providers" />
            <AdditionalInformationBlock id="additional-info" />
            <ReleaseDatesBlock releaseData={data} id="release-dates" />
            <RelatedMoviesBlock id="related-movies" />
            <SimilarMoviesBlock id="similar-movies" />
            <Logo />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[200px] shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
