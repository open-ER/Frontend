import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { FilterState, WineRow } from "../types/wine";
import { RangeSlider } from "./RangeSlider";

interface WineFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
  availableOptions: {
    countries: string[];
    subregions: string[];
    vintages: number[];
    grapeVarieties: string[];
  };
  wines: WineRow[]; // 전체 와인 데이터 추가
}

export function WineFilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onToggle,
  availableOptions,
  wines,
}: WineFilterSidebarProps) {
  const [isSubregionVisible, setIsSubregionVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const prevCountriesLength = useRef(filters.countries.length);

  const wineTypes = [
    "레드",
    "화이트",
    "로제",
    "스파클링",
    "주정강화",
    "디저트",
  ];

  // 국가 선택 변경 감지
  useEffect(() => {
    const currentLength = filters.countries.length;
    const prevLength = prevCountriesLength.current;

    if (currentLength > 0 && prevLength === 0) {
      // 국가가 새로 선택됨 -> slideDown
      setIsSubregionVisible(true);
      setIsAnimatingOut(false);
    } else if (currentLength === 0 && prevLength > 0) {
      // 모든 국가가 해제됨 -> slideUp
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsSubregionVisible(false);
        setIsAnimatingOut(false);
      }, 300);
    }

    prevCountriesLength.current = currentLength;
  }, [filters.countries.length]);

  // 선택된 국가에 해당하는 지역만 필터링
  const filteredSubregions = useMemo(() => {
    if (filters.countries.length === 0) {
      return availableOptions.subregions;
    }

    const regionsSet = new Set<string>();
    wines.forEach((wine) => {
      if (filters.countries.includes(wine.country)) {
        regionsSet.add(wine.subregion);
      }
    });

    return Array.from(regionsSet).sort();
  }, [filters.countries, wines, availableOptions.subregions]);

  const handleWineTypeToggle = (type: string) => {
    const newTypes = filters.wineTypes.includes(type)
      ? filters.wineTypes.filter((t) => t !== type)
      : [...filters.wineTypes, type];
    onFilterChange({ ...filters, wineTypes: newTypes });
  };

  const handleCountryToggle = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];

    // 국가 선택이 해제되면 해당 국가의 지역도 선택 해제
    let newSubregions = filters.subregions;
    if (!newCountries.includes(country)) {
      const countryRegions = new Set(
        wines
          .filter((w) => w.country === country)
          .map((w) => w.subregion),
      );
      newSubregions = filters.subregions.filter(
        (s) => !countryRegions.has(s),
      );
    }

    onFilterChange({
      ...filters,
      countries: newCountries,
      subregions: newSubregions,
    });
  };

  const handleSubregionToggle = (subregion: string) => {
    const newSubregions = filters.subregions.includes(subregion)
      ? filters.subregions.filter((s) => s !== subregion)
      : [...filters.subregions, subregion];
    onFilterChange({ ...filters, subregions: newSubregions });
  };

  const handleVintageToggle = (vintage: number) => {
    const newVintages = filters.vintages.includes(vintage)
      ? filters.vintages.filter((v) => v !== vintage)
      : [...filters.vintages, vintage];
    onFilterChange({ ...filters, vintages: newVintages });
  };

  const handleGrapeVarietyToggle = (grape: string) => {
    const newGrapes = filters.grapeVarieties.includes(grape)
      ? filters.grapeVarieties.filter((g) => g !== grape)
      : [...filters.grapeVarieties, grape];
    onFilterChange({ ...filters, grapeVarieties: newGrapes });
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-60 z-40 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-6 left-6 z-50 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="필터 열기"
        >
          <SlidersHorizontal className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Floating Sidebar Modal */}
      <div
        className={`fixed left-6 top-6 bottom-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[450px] opacity-0"
        }`}
      >
        {/* Sidebar Header - Fixed */}
        <div className="sticky top-0 bg-gradient-to-r from-[#8B1538] to-[#6B0F2A] text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggle}
                className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                aria-label="필터 닫기"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">필터</h2>
            </div>
            <button
              onClick={onReset}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-88px)] px-8 py-4">
          {/* Price Range */}
          <RangeSlider
            min={0}
            max={500000}
            step={10000}
            value={filters.priceRange}
            onChange={(value) =>
              onFilterChange({
                ...filters,
                priceRange: value,
              })
            }
            formatLabel={(value) =>
              `₩${value.toLocaleString()}`
            }
            label="가격 범위"
          />

          {/* Wine Types */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              와인 타입
            </label>
            <div className="space-y-2">
              {wineTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={filters.wineTypes.includes(type)}
                    onChange={() => handleWineTypeToggle(type)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm group-hover:text-purple-600 transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              국가
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {availableOptions.countries.map((country) => (
                <label
                  key={country}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={filters.countries.includes(
                      country,
                    )}
                    onChange={() =>
                      handleCountryToggle(country)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm group-hover:text-indigo-600 transition-colors">
                    {country}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Subregions */}
          {isSubregionVisible && (
            <div
              className={`mb-6 bg-gray-50 rounded-xl p-4 shadow-sm ${
                isAnimatingOut ? "animate-slideUp" : "animate-slideDown"
              }`}
            >
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                지역
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredSubregions.map((subregion) => (
                  <label
                    key={subregion}
                    className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.subregions.includes(
                        subregion,
                      )}
                      onChange={() =>
                        handleSubregionToggle(subregion)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm group-hover:text-purple-600 transition-colors">
                      {subregion}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Vintages */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              빈티지
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {availableOptions.vintages.map((vintage) => (
                <label
                  key={vintage}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={filters.vintages.includes(vintage)}
                    onChange={() =>
                      handleVintageToggle(vintage)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm group-hover:text-amber-700 transition-colors">
                    {vintage}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Grape Varieties */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              품종
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {availableOptions.grapeVarieties.map((grape) => (
                <label
                  key={grape}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={filters.grapeVarieties.includes(
                      grape,
                    )}
                    onChange={() =>
                      handleGrapeVarietyToggle(grape)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm group-hover:text-green-700 transition-colors">
                    {grape}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Taste Profile Section */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm">
            <h3 className="text-base font-semibold mb-4 text-gray-700">
              맛 프로필
            </h3>

            {/* Tannin Range */}
            <RangeSlider
              min={1}
              max={5}
              step={0.1}
              value={filters.tanninRange}
              onChange={(value) =>
                onFilterChange({
                  ...filters,
                  tanninRange: value,
                })
              }
              formatLabel={(value) => value.toFixed(1)}
              label="타닌"
            />

            {/* Sweetness Range */}
            <RangeSlider
              min={1}
              max={5}
              step={0.1}
              value={filters.sweetnessRange}
              onChange={(value) =>
                onFilterChange({
                  ...filters,
                  sweetnessRange: value,
                })
              }
              formatLabel={(value) => value.toFixed(1)}
              label="당도"
            />

            {/* Acidity Range */}
            <RangeSlider
              min={1}
              max={5}
              step={0.1}
              value={filters.acidityRange}
              onChange={(value) =>
                onFilterChange({
                  ...filters,
                  acidityRange: value,
                })
              }
              formatLabel={(value) => value.toFixed(1)}
              label="산도"
            />

            {/* Body Range */}
            <RangeSlider
              min={1}
              max={5}
              step={0.1}
              value={filters.bodyRange}
              onChange={(value) =>
                onFilterChange({
                  ...filters,
                  bodyRange: value,
                })
              }
              formatLabel={(value) => value.toFixed(1)}
              label="바디"
            />

            {/* Alcohol Range */}
            <RangeSlider
              min={0}
              max={25}
              step={0.5}
              value={filters.alcoholRange}
              onChange={(value) =>
                onFilterChange({
                  ...filters,
                  alcoholRange: value,
                })
              }
              formatLabel={(value) => `${value.toFixed(1)}%`}
              label="알코올 도수 (%)"
            />
          </div>
        </div>
      </div>
    </>
  );
}