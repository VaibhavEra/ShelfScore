import PosterBlock from "./PosterBlock";
import TitleBlock from "./TitleBlock";
import MetaDataBlock from "./MetaDataBlock";

// HeroLayout.jsx
function HeroLayout() {
  return (
    <div className="mt-[20px]" id="overview">
      <div className="max-w-[1219px] mx-auto flex flex-col gap-[20px]">
        <TitleBlock />
        <PosterBlock />
        <MetaDataBlock />
      </div>
    </div>
  );
}

export default HeroLayout;
