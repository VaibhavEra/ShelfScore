import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { movieData } from "../../data/movieDetails";

export default function AdditionalInformationBlock() {
  const [open, setOpen] = useState(true);

  const infoItems = [
    {
      label: "Production Companies",
      value: movieData.additional.production_companies.join(", "),
    },
    {
      label: "Production Country",
      value: movieData.additional.origin_country.join(", "),
    },
    {
      label: "Spoken Languages",
      value: movieData.additional.spoken_languages.join(", "),
    },
    {
      label: "Primary Language",
      value: movieData.additional.primary_language.toUpperCase(),
    },
    {
      label: "Budget",
      value: `$${movieData.financial.budget.toLocaleString()}`,
    },
    {
      label: "Revenue",
      value: `$${movieData.financial.revenue.toLocaleString()}`,
    },
  ];

  return (
    <div
      className="max-w-[1219px] mx-auto flex flex-col gap-[30px]"
      id="additional-info"
    >
      {/* First Row */}
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
            Additional Information
          </h2>
        </div>
        <ChevronDown
          className={`text-[var(--text-primary)] transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          size={24}
        />
      </div>

      {/* Second Row */}
      {open && (
        <div className="flex flex-col w-full">
          {infoItems.map((item, idx) => (
            <div key={item.label} className="flex flex-col">
              <div className="flex items-center justify-between w-full">
                {/* Left side fixed box */}
                <div className="w-[150px] h-[42px] flex items-center">
                  <h5 className="text-[var(--text-primary)] font-bold">
                    {item.label}
                  </h5>
                </div>
                {/* Right side aligned fully right */}
                <div className="flex-1 flex justify-start items-center">
                  <p className="text-[var(--text-primary)] text-right">
                    {item.value}
                  </p>
                </div>
              </div>

              {/* Divider (except after last item) */}
              {idx < infoItems.length - 1 && (
                <div className="my-[20px] w-full h-[2px] rounded-full bg-[var(--bg-trans-15)]"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
