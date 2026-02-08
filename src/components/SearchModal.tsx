import { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import { WineRow } from "../types/wine";
import { motion, AnimatePresence } from "motion/react";
import { searchWines } from "../api/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  wines: WineRow[]; // 더 이상 사용하지 않지만 호환성을 위해 유지
  onToggleWine: (wineName: string) => void;
  selectedWines: Set<string>;
}

export function SearchModal({
  isOpen,
  onClose,
  wines,
  onToggleWine,
  selectedWines,
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<WineRow[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // 디바운싱을 위한 타이머
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchWines(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('[SearchModal] Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchTerm("");
      setSearchResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 pb-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-2xl h-[65vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 backdrop으로 전파 방지
          >
            {/* Search Input */}
            <div className="p-3 shadow-lg relative bg-white rounded-t-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="와인 이름, 국가, 지역, 품종, 향 검색..."
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
                  autoFocus
                  onClick={(e) => e.stopPropagation()} // input 클릭 시 이벤트 전파 방지
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4 pb-16 min-h-0">
              {searchTerm.trim() === "" ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>와인을 검색해보세요</p>
                </div>
              ) : isSearching ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
                  <p>검색 중...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>검색 결과가 없습니다</p>
                  <p className="text-sm mt-2">
                    다른 키워드로 검색해보세요
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((wine, index) => {
                    const uniqueKey = `${wine.wine_name}-${wine.country}-${wine.subregion}-${wine.vintage}-${index}`;
                    const isSelected = selectedWines.has(
                      wine.wine_name,
                    );
                    return (
                      <div
                        key={uniqueKey}
                        className={`p-4 border shadow-sm rounded-lg transition-colors cursor-pointer relative ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation(); // 검색 결과 클릭 시 이벤트 전파 방지
                          onToggleWine(wine.wine_name);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {wine.wine_name}
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs mr-2">
                                  {wine.wine_type}
                                </span>
                                {wine.country}, {wine.subregion}
                              </p>
                              <p>
                                <span className="font-medium">
                                  품종:
                                </span>{" "}
                                {wine.grape_or_style}
                              </p>
                              {wine.vintage && (
                                <p>
                                  <span className="font-medium">
                                    빈티지:
                                  </span>{" "}
                                  {wine.vintage}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end gap-2">
                            {isSelected && (
                              <div className="flex items-center gap-1 text-blue-600 text-sm">
                                <Check className="w-4 h-4" />
                                <span className="font-medium">
                                  선택됨
                                </span>
                              </div>
                            )}
                            {wine.price_krw && (
                              <p className="font-bold text-gray-900">
                                ₩
                                {wine.price_krw.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Floating Footer */}
            {searchResults.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-3 text-sm text-gray-400 text-center pointer-events-none">
                <span className="inline-block bg-white/65 backdrop px-4 py-2 rounded-full shadow-lg font-medium">
                  {searchResults.length}개의 와인이
                  검색되었습니다
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}