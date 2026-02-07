import { X } from "lucide-react";

interface ComparisonBarProps {
  selectedCount: number;
  onClearAll: () => void;
  onCompare: () => void;
}

export function ComparisonBar({ selectedCount, onClearAll, onCompare }: ComparisonBarProps) {
  if (selectedCount === 0) return null;

  const canCompare = selectedCount >= 2 && selectedCount <= 5;
  const buttonText = 
    selectedCount < 2 
      ? "2개 이상 선택해주세요" 
      : selectedCount > 5
      ? "최대 5개까지만 선택 가능"
      : "비교하기";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-4 px-6 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg">
            <span className="font-bold">{selectedCount}</span>개의 와인 선택됨
            {selectedCount > 5 && (
              <span className="ml-2 text-sm text-yellow-400">
                (최대 5개)
              </span>
            )}
          </span>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            모두 해제
          </button>
        </div>
        <button
          onClick={onCompare}
          disabled={!canCompare}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            canCompare
              ? "bg-white text-gray-900 hover:bg-gray-100"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}