import { X } from "lucide-react";
import { WineRow } from "../types/wine";
import { motion, AnimatePresence } from "framer-motion";

interface ComparisonBarProps {
  selectedCount: number;
  onClearAll: () => void;
  onCompare: () => void;
  selectedWines: Set<string>;
  wines: WineRow[];
  onToggleWine: (wineName: string) => void;
  isComparisonModalOpen: boolean;
}

export function ComparisonBar({
  selectedCount,
  onClearAll,
  onCompare,
  selectedWines,
  wines,
  onToggleWine,
  isComparisonModalOpen,
}: ComparisonBarProps) {
  // isComparisonModalOpen이 true이거나 selectedCount가 0이면 렌더링하지 않음
  const shouldShow = selectedCount > 0 && !isComparisonModalOpen;

  const canCompare = selectedCount >= 2 && selectedCount <= 5;
  const buttonText =
    selectedCount < 2
      ? "2개 이상 선택해주세요"
      : selectedCount > 5
        ? "최대 5개까지만 선택 가능"
        : "비교하기";

  const selectedWineData = wines.filter((wine) =>
    selectedWines.has(wine.wine_name),
  );

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
          }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-[60]"
        >
          {/* 선택된 와인 목록 */}
          {selectedWineData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.1 }}
              className="border-b border-gray-700 bg-gray-800 px-6 py-3 overflow-x-auto"
            >
              <div className="flex gap-3 min-w-max">
                {selectedWineData.map((wine, index) => (
                  <div
                    key={`${wine.wine_name}-${index}`}
                    className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-600 transition-colors group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWine(wine.wine_name);
                    }}
                  >
                    <span className="text-white truncate max-w-[200px]">
                      {wine.wine_name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {wine.wine_type}
                    </span>
                    <X className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors ml-1" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 하단 액션 바 */}
          <div className="py-3 px-4 md:py-4 md:px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
              <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
                <span className="text-sm md:text-sm">
                  <span className="font-bold">{selectedCount}</span>
                  개의 와인 선택됨
                  {selectedCount > 5 && (
                    <span className="ml-2 text-xs text-yellow-400">
                      (최대 5개)
                    </span>
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAll();
                  }}
                  className="flex items-center gap-1 text-xs md:text-xs text-gray-300 hover:text-white transition-colors py-2 px-3 md:py-0 md:px-0 hover:bg-white/10 md:hover:bg-transparent rounded-lg md:rounded-none"
                >
                  <X className="w-4 h-4" />
                  <span className="md:inline">모두 해제</span>
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare();
                }}
                disabled={!canCompare}
                className={`px-6 py-3 md:px-5 md:py-2 rounded-lg text-sm md:text-sm font-semibold transition-colors w-full md:w-auto ${
                  canCompare
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}