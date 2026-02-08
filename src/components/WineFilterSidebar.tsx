import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  RotateCcw,
  SlidersHorizontal,
  HelpCircle,
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
    wineTypes: string[];
    countries: string[];
    subregions: string[];
    vintages: number[];
    grapeVarieties: string[];
    aromas: string[];
  };
  wines: WineRow[];
  onOpenGuide: () => void;
  isSearchOpen?: boolean;
  setIsSliding?: (sliding: boolean) => void;
}

export function WineFilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onToggle,
  availableOptions,
  wines,
  onOpenGuide,
  isSearchOpen = false,
  setIsSliding,
}: WineFilterSidebarProps) {
  const [isSubregionVisible, setIsSubregionVisible] =
    useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const prevCountriesLength = useRef(filters.countries.length);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  // 슬라이더 드래그 시작/종료 핸들러
  const handleSliderStart = () => {
    setIsSliding?.(true);
  };

  const handleSliderComplete = () => {
    setIsSliding?.(false);
  };

  // API에서 가져온 와인 타입 사용
  const wineTypes = availableOptions.wineTypes;

  // 스크롤 이벤트 완전 차단
  useEffect(() => {
    if (!isOpen) return;

    const preventScroll = (e: Event) => {
      e.stopPropagation();
    };

    const preventWheelScroll = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      const target = wheelEvent.target as HTMLElement;
      const scrollable = target.closest(".overflow-y-auto");

      if (scrollable) {
        const { scrollTop, scrollHeight, clientHeight } = scrollable;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        // 맨 위에서 위로 스크롤 또는 맨 아래에서 아래로 스크롤하는 경우 차단
        if (
          (isAtTop && wheelEvent.deltaY < 0) ||
          (isAtBottom && wheelEvent.deltaY > 0)
        ) {
          wheelEvent.preventDefault();
        }
      }

      wheelEvent.stopPropagation();
    };

    const sidebar = sidebarRef.current;
    const scrollable = scrollableRef.current;

    if (sidebar) {
      sidebar.addEventListener("wheel", preventWheelScroll, {
        passive: false,
      });
      sidebar.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
      sidebar.addEventListener("scroll", preventScroll, true);
    }

    if (scrollable) {
      scrollable.addEventListener("wheel", preventWheelScroll, {
        passive: false,
      });
      scrollable.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
    }

    // 모든 하위 스크롤 영역에도 적용
    const scrollableAreas = sidebar?.querySelectorAll(
      ".overflow-y-auto",
    );
    scrollableAreas?.forEach((area) => {
      area.addEventListener("wheel", preventWheelScroll, {
        passive: false,
      });
      area.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
    });

    return () => {
      if (sidebar) {
        sidebar.removeEventListener(
          "wheel",
          preventWheelScroll,
        );
        sidebar.removeEventListener("touchmove", preventScroll);
        sidebar.removeEventListener("scroll", preventScroll);
      }
      if (scrollable) {
        scrollable.removeEventListener(
          "wheel",
          preventWheelScroll,
        );
        scrollable.removeEventListener(
          "touchmove",
          preventScroll,
        );
      }
      scrollableAreas?.forEach((area) => {
        area.removeEventListener("wheel", preventWheelScroll);
        area.removeEventListener("touchmove", preventScroll);
      });
    };
  }, [isOpen]);

  // 국가 선택 변경 감지
  useEffect(() => {
    const currentLength = filters.countries.length;
    const prevLength = prevCountriesLength.current;

    if (currentLength > 0 && prevLength === 0) {
      setIsSubregionVisible(true);
      setIsAnimatingOut(false);
    } else if (currentLength === 0 && prevLength > 0) {
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

  const handleAromaToggle = (aroma: string) => {
    const newAromas = filters.aromas.includes(aroma)
      ? filters.aromas.filter((a) => a !== aroma)
      : [...filters.aromas, aroma];
    onFilterChange({ ...filters, aromas: newAromas });
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop z-40 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Help Button (when sidebar closed) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenGuide();
        }}
        className={`fixed top-4 left-4 z-50 bg-white shadow-sm rounded-full p-3 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen || isSearchOpen ? "hidden" : ""
        }`}
        aria-label="도움말"
      >
        <HelpCircle className="w-6 h-6 text-gray-700" />
      </button>

      {/* Toggle Button (when closed) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`fixed top-24 left-4 z-50 bg-white shadow-sm rounded-full p-3 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen || isSearchOpen ? "hidden" : ""
        }`}
        aria-label="필터 열기"
      >
        <SlidersHorizontal className="w-6 h-6 text-gray-700" />
      </button>

      {/* Floating Sidebar Modal */}
      <div
        ref={sidebarRef}
        className={`fixed max-h-[80vh] left-6 top-6 bottom-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300 ease-in-out ${
          isOpen && !isSearchOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[450px] opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Header - Fixed */}
        <div className="sticky top-0 bg-gradient-to-r from-[#8B1538] to-[#6B0F2A] text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                aria-label="필터 닫기"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">필터</h2>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollableRef}
          className="overflow-y-auto h-[calc(100%-88px)] px-8 py-4"
        >
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
            onChangeStart={handleSliderStart}
            onChangeComplete={() => handleSliderComplete()}
            formatLabel={(value) =>
              `₩${value.toLocaleString()}`
            }
            label="가격 범위"
          />

          {/* Wine Types */}
          <div className="mb-6 p-4">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              와인 타입
            </label>
            <div className="space-y-2">
              {wineTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={filters.wineTypes.includes(type)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleWineTypeToggle(type);
                    }}
                    onClick={(e) => e.stopPropagation()}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              국가
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {availableOptions.countries.map((country) => (
                <label
                  key={country}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={filters.countries.includes(
                      country,
                    )}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCountryToggle(country);
                    }}
                    onClick={(e) => e.stopPropagation()}
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
                isAnimatingOut
                  ? "animate-slideUp"
                  : "animate-slideDown"
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={filters.subregions.includes(
                        subregion,
                      )}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSubregionToggle(subregion);
                      }}
                      onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={filters.vintages.includes(vintage)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleVintageToggle(vintage);
                    }}
                    onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={filters.grapeVarieties.includes(
                      grape,
                    )}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleGrapeVarietyToggle(grape);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm group-hover:text-green-700 transition-colors">
                    {grape}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Aromas */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              향
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {availableOptions.aromas.map((aroma) => (
                <label
                  key={aroma}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-2 transition-colors group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={filters.aromas.includes(aroma)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleAromaToggle(aroma);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-700 transition-colors">
                    {aroma}
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
              onChangeStart={handleSliderStart}
              onChangeComplete={() => handleSliderComplete()}
              formatLabel={(value) => value.toFixed(1)}
              label="타닌"
            />

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
              onChangeStart={handleSliderStart}
              onChangeComplete={() => handleSliderComplete()}
              formatLabel={(value) => value.toFixed(1)}
              label="당도"
            />

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
              onChangeStart={handleSliderStart}
              onChangeComplete={() => handleSliderComplete()}
              formatLabel={(value) => value.toFixed(1)}
              label="산도"
            />

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
              onChangeStart={handleSliderStart}
              onChangeComplete={() => handleSliderComplete()}
              formatLabel={(value) => value.toFixed(1)}
              label="바디"
            />

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
              onChangeStart={handleSliderStart}
              onChangeComplete={() => handleSliderComplete()}
              formatLabel={(value) => `${value.toFixed(1)}%`}
              label="알코올 도수 (%)"
            />
          </div>
        </div>
      </div>
    </>
  );
}