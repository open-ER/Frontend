import { WineRow } from "../types/wine";
import { WineCard } from "./WineCard";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

interface WineGridProps {
  wines: WineRow[];
  selectedWines: Set<string>;
  onToggleWine: (wineName: string) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function WineGrid({ wines, selectedWines, onToggleWine, hasMore, isLoadingMore, onLoadMore }: WineGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(wines.length);

  const handleLoadMore = () => {
    previousCountRef.current = wines.length;
    onLoadMore();

    // Smooth scroll to new content after a brief delay for rendering
    setTimeout(() => {
      if (gridRef.current) {
        const cardHeight = 450; // Approximate card height
        const gap = 24; // gap-6 = 24px
        const cols = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        const rowsToScroll = Math.ceil((wines.length - previousCountRef.current) / cols);
        const scrollDistance = rowsToScroll * (cardHeight + gap) - gap;

        window.scrollBy({
          top: scrollDistance,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

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
    <div>
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {hasMore && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-all hover:shadow-md border border-gray-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoadingMore ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="font-medium">로딩 중...</span>
              </>
            ) : (
              <>
                <span className="font-medium">더보기</span>
                <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}