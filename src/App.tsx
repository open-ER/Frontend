import { useState, useMemo, useEffect } from "react";
import { WineFilterSidebar } from "./components/WineFilterSidebar";
import { WineGrid } from "./components/WineGrid";
import { ComparisonBar } from "./components/ComparisonBar";
import { SearchModal } from "./components/SearchModal";
import { ComparisonModal } from "./components/ComparisonModal";
import { BeginnerGuideModal } from "./components/BeginnerGuideModal";
import { Search, HelpCircle } from "lucide-react";
import { getFilteredWines, getFilterOptions } from "./api/api";
import {
  getInitialFilters,
} from "./utils/filterWines";
import { FilterState, WineRow, FilterOptions } from "./types/wine";
import logoImage from "./assets/7f9abf46a1f71a1053cfd18e709338a4e89784ea.png";

export default function App() {
  const [isSliding, setIsSliding] = useState(false);
  const [wines, setWines] = useState<WineRow[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(
    getInitialFilters(),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedWines, setSelectedWines] = useState<
    Set<string>
  >(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] =
    useState(false);
  const [isBeginnerGuideOpen, setIsBeginnerGuideOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalWines, setTotalWines] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // API에서 와인 데이터 및 필터 옵션 가져오기 (초기 로드)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 병렬로 두 API 호출 - 초기에는 첫 페이지만 로드
        const [winesResponse, filterOptionsResponse] = await Promise.all([
          getFilteredWines(filters, 1),
          getFilterOptions(),
        ]);

        setWines(winesResponse.wines);
        setTotalWines(winesResponse.total);
        setFilterOptions(filterOptionsResponse);
        setCurrentPage(1);

        console.log(`[App] Loaded ${winesResponse.wines.length} wines from API (Total: ${winesResponse.total})`);
        console.log('[App] Loaded filter options from API');
      } catch (err) {
        console.error('[App] Failed to fetch data:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 필터 변경 시 와인 목록 다시 조회
  useEffect(() => {
    const fetchFilteredWines = async () => {
      try {
        setIsFilterLoading(true);
        const response = await getFilteredWines(filters, 1);

        setWines(response.wines);
        setTotalWines(response.total);
        setCurrentPage(1);

        console.log(`[App] Filter changed - Loaded ${response.wines.length} wines (Total: ${response.total})`);
      } catch (err) {
        console.error('[App] Failed to fetch filtered wines:', err);
      } finally {
        setIsFilterLoading(false);
      }
    };

    // 초기 로드가 아닐 때만 실행 (filterOptions가 로드된 후)
    // 슬라이더 드래그 중에는 API 호출 방지
    if (filterOptions && !isSliding) {
      fetchFilteredWines();
    }
  }, [filters, filterOptions, isSliding]);

  // API 필터 옵션과 로컬 wines에서 추출한 옵션을 조합
  const availableOptions = useMemo(() => {
    if (!filterOptions) {
      return {
        wineTypes: [],
        countries: [],
        subregions: [],
        vintages: [],
        grapeVarieties: [],
        aromas: [],
      };
    }

    // 로컬 wines에서 subregions와 aromas 추출
    const subregions = [...new Set(wines.map((w) => w.subregion))].sort();
    const aromas = [...new Set(wines.flatMap((w) => w.aromas))].sort();

    return {
      wineTypes: filterOptions.wine_type,
      countries: filterOptions.country,
      subregions,
      vintages: filterOptions.vintage,
      grapeVarieties: filterOptions.grape_or_style,
      aromas,
    };
  }, [wines, filterOptions]);

  // 서버에서 이미 필터링된 wines를 받으므로 클라이언트 필터링은 subregions와 aromas만 적용
  const filteredWines = useMemo(() => {
    let result = wines;

    // Subregions 필터링 (API에서 지원하지 않음)
    if (filters.subregions.length > 0) {
      result = result.filter((wine) =>
        filters.subregions.includes(wine.subregion)
      );
    }

    // Aromas 필터링 (API에서 지원하지 않음)
    if (filters.aromas.length > 0) {
      result = result.filter((wine) =>
        filters.aromas.some((aroma) => wine.aromas.includes(aroma))
      );
    }

    return result;
  }, [wines, filters.subregions, filters.aromas]);

  const handleResetFilters = () => {
    setFilters(getInitialFilters());
  };

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await getFilteredWines(filters, nextPage);

      setWines((prev) => [...prev, ...response.wines]);
      setCurrentPage(nextPage);

      console.log(`[App] Loaded page ${nextPage}: ${response.wines.length} wines (Total loaded: ${wines.length + response.wines.length}/${totalWines})`);
    } catch (error) {
      console.error('[App] Failed to load more wines:', error);
    } finally {
      setIsLoadingMore(false);
    }
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

  const selectedWineIds = useMemo(() => {
    return wines
      .filter((wine) => selectedWines.has(wine.wine_name))
      .map((wine) => wine._id)
      .filter((id): id is string => id !== undefined);
  }, [selectedWines, wines]);

  // 초기 로딩 중 UI (전체 페이지)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">와인 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">데이터 로드 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            API 서버 상태를 확인해주세요.<br />
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              https://opener-api.onrender.com/
            </code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Button - Fixed Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsSearchOpen(true);
        }}
        className={`fixed top-4 right-4 z-40 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-sm transition-all hover:shadow-lg ${
          isSearchOpen
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
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

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={isBeginnerGuideOpen}
        onClose={() => setIsBeginnerGuideOpen(false)}
      />

      {/* Filter Sidebar */}
      {!isBeginnerGuideOpen && (
        <WineFilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          availableOptions={availableOptions}
          wines={wines}
          onOpenGuide={() => setIsBeginnerGuideOpen(true)}
          isSearchOpen={isSearchOpen}
          setIsSliding={setIsSliding}
        />
      )}
      {/* Main Content - Fixed, not affected by sidebar */}
      <div
        className={`p-8 transition-all ${isSearchOpen ? "pointer-events-none" : ""}`}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src={logoImage}
              alt="opentR Logo"
              className="h-[173px] w-auto"
            />
          </div>
            <p className="text-gray-600">
              총 {totalWines}개의 와인
            </p>
        </div>

        {/* Wine Grid */}
        {isFilterLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-3"></div>
              <p className="text-gray-600">필터링 중...</p>
            </div>
          </div>
        ) : (
          <WineGrid
            wines={filteredWines}
            selectedWines={selectedWines}
            onToggleWine={handleToggleWine}
            onLoadMore={handleLoadMore}
            hasMore={wines.length < totalWines}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedCount={selectedWines.size}
        onClearAll={handleClearAllSelected}
        onCompare={handleCompare}
        selectedWines={selectedWines}
        wines={wines}
        onToggleWine={handleToggleWine}
        isComparisonModalOpen={isComparisonOpen}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        wineIds={selectedWineIds}
      />
    </div>
  );
}