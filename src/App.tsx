
import { useState, useMemo, useEffect } from "react";
import { WineFilterSidebar } from "./components/WineFilterSidebar";
import { VirtualWineGrid } from "./components/VirtualWineGrid";
import { ComparisonBar } from "./components/ComparisonBar";
import { SearchModal } from "./components/SearchModal";
import { ComparisonModal } from "./components/ComparisonModal";
import { HelpModal } from "./components/HelpModal";
import { Search, Loader2, HelpCircle } from "lucide-react";
// import { WINES } from "./data/wines"; // Removed mock data
import { getWines } from "./api/api";
import {
  filterWines,
  getAvailableOptions,
  getInitialFilters,
} from "./utils/filterWines";
import { FilterState, WineRow } from "./types/wine";

export default function App() {
  const [wines, setWines] = useState<WineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>(
    getInitialFilters(),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedWines, setSelectedWines] = useState<
    Set<string>
  >(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        // Fetch all 10000 wines.
        // The API defaults to 100 per page and ignores 'per_page' param, so we must iterate pages.
        // The updated getWines(10000) handles this iteration concurrently.
        console.log("[App] Starting fetchWines...");
        const response = await getWines(10000);
        console.log("[App] Fetched wines count:", response.wines.length);
        setWines(response.wines);
      } catch (err) {
        console.error(err);
        setError("와인 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  const availableOptions = useMemo(
    () => getAvailableOptions(wines),
    [wines],
  );

  const filteredWines = useMemo(() => {
    return filterWines(wines, filters);
  }, [wines, filters]);

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
    return wines.filter((wine) => selectedWines.has(wine.wine_name));
  }, [wines, selectedWines]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">와인 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Help Button - Fixed above sidebar or near it */}
      {/* If sidebar is closed, filter button is at top-6 left-6. We place this above it at top-2 left-6? or maybe right next to it? */}
      {/* Let's place it at top-6 left-24 (if closed) or inside sidebar? */}
      {/* User said 'above the filter button'. Let's assume top-left corner stack. */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed top-20 left-6 z-50 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-110"
        aria-label="도움말"
        title="도움말"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

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
        wines={wines}
        onToggleWine={handleToggleWine}
        selectedWines={selectedWines}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Filter Sidebar */}
      <WineFilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        availableOptions={availableOptions}
        wines={wines}
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

        {/* Wine Grid (Virtual) */}
        <VirtualWineGrid
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