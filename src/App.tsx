import { useState, useMemo } from "react";
import { WineFilterSidebar } from "./components/WineFilterSidebar";
import { WineGrid } from "./components/WineGrid";
import { ComparisonBar } from "./components/ComparisonBar";
import { SearchModal } from "./components/SearchModal";
import { ComparisonModal } from "./components/ComparisonModal";
import { Search } from "lucide-react";
import { WINES } from "./data/wines";
import {
  filterWines,
  getAvailableOptions,
  getInitialFilters,
} from "./utils/filterWines";
import { FilterState } from "./types/wine";

export default function App() {
  const [filters, setFilters] = useState<FilterState>(
    getInitialFilters(),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedWines, setSelectedWines] = useState<
    Set<string>
  >(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const availableOptions = useMemo(
    () => getAvailableOptions(WINES),
    [],
  );

  const filteredWines = useMemo(() => {
    return filterWines(WINES, filters);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(getInitialFilters());
  };

  const handleToggleWine = (wineName: string) => {
    setSelectedWines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wineName)) {
        newSet.delete(wineName);
      } else {
        // 최대 5개까지만 선택 가능
        if (newSet.size >= 5) {
          alert("최대 5개의 와인까지만 비교할 수 있습니다.");
          return prev;
        }
        newSet.add(wineName);
      }
      return newSet;
    });
  };

  const handleClearAllSelected = () => {
    setSelectedWines(new Set());
  };

  const handleCompare = () => {
    setIsComparisonOpen(true);
  };

  const selectedWineData = useMemo(() => {
    return WINES.filter((wine) => selectedWines.has(wine.wine_name));
  }, [selectedWines]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Button - Fixed Top Right */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed top-4 right-4 z-40 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:shadow-xl"
        aria-label="검색"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        wines={WINES}
        onToggleWine={handleToggleWine}
        selectedWines={selectedWines}
      />

      {/* Filter Sidebar */}
      <WineFilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        availableOptions={availableOptions}
        wines={WINES}
      />

      {/* Main Content - Fixed, not affected by sidebar */}
      <div className="p-8 pt-20">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            와인 카탈로그
          </h1>
          <p className="text-gray-600">
            총{" "}
            <span className="font-semibold text-gray-900">
              {filteredWines.length}
            </span>
            개의 와인
          </p>
        </div>

        {/* Wine Grid */}
        <WineGrid
          wines={filteredWines}
          selectedWines={selectedWines}
          onToggleWine={handleToggleWine}
        />
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedCount={selectedWines.size}
        onClearAll={handleClearAllSelected}
        onCompare={handleCompare}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        wines={selectedWineData}
      />
    </div>
  );
}