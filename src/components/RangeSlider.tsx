import { useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  onChangeStart?: () => void;
  onChangeComplete?: (value: [number, number]) => void;
  onStart?: () => void; // 호환성을 위한 별칭
  onComplete?: (value: [number, number]) => void; // 호환성을 위한 별칭
  formatLabel?: (value: number) => string;
  label: string;
}

export function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  onChangeStart,
  onChangeComplete,
  onStart,
  onComplete,
  formatLabel = (v) => v.toString(),
  label,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [minValue, maxValue] = value;

  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const minPercent = getPercent(minValue);
  const maxPercent = getPercent(maxValue);

  const handleMinChange = (newValue: number) => {
    const clampedValue = Math.min(newValue, maxValue - step);
    onChange([clampedValue, maxValue]);
  };

  const handleMaxChange = (newValue: number) => {
    const clampedValue = Math.max(newValue, minValue + step);
    onChange([minValue, clampedValue]);
  };

  const handleSlideStart = () => {
    onChangeStart?.();
    onStart?.(); // 호환성을 위한 별칭 지원
  };

  const handleSlideEnd = () => {
    onChangeComplete?.([minValue, maxValue]);
    onComplete?.([minValue, maxValue]); // 호환성을 위한 별칭 지원
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
      <div className="relative pt-6 pb-4">
        {/* Track Background */}
        <div ref={trackRef} className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded" />

        {/* Active Track */}
        <div
          className="absolute top-8 h-1 bg-blue-500 rounded"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => {
            handleMinChange(parseFloat(e.target.value));
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSlideStart();
          }}
          onMouseUp={handleSlideEnd}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleSlideStart();
          }}
          onTouchEnd={handleSlideEnd}
          className="absolute top-0 w-full h-8 appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
          style={{ zIndex: minValue > max - (max - min) / 2 ? 5 : 3 }}
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => {
            handleMaxChange(parseFloat(e.target.value));
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSlideStart();
          }}
          onMouseUp={handleSlideEnd}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleSlideStart();
          }}
          onTouchEnd={handleSlideEnd}
          className="absolute top-0 w-full h-8 appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Value Labels */}
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>{formatLabel(minValue)}</span>
        <span>{formatLabel(maxValue)}</span>
      </div>
    </div>
  );
}
