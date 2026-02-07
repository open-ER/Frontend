import { WineRow } from "../types/wine";
import { WineCard } from "./WineCard";

interface WineGridProps {
  wines: WineRow[];
  selectedWines: Set<string>;
  onToggleWine: (wineName: string) => void;
}

export function WineGrid({ wines, selectedWines, onToggleWine }: WineGridProps) {
  if (wines.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-2">No items match your filters</p>
          <p className="text-gray-500">필터 조건을 변경하거나 초기화해 주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wines.map((wine, index) => {
        // Create a unique key combining index and wine properties to handle duplicate wine names
        const uniqueKey = `${wine.wine_name}-${wine.vintage || 'nv'}-${wine.subregion}-${index}`;
        return (
          <WineCard
            key={uniqueKey}
            wine={wine}
            isSelected={selectedWines.has(wine.wine_name)}
            onToggleSelect={() => onToggleWine(wine.wine_name)}
          />
        );
      })}
    </div>
  );
}