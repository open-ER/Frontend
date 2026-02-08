import { useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  onChangeStart?: () => void;
  onChangeComplete?: (value: [number, number]) => void;
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
  formatLabel = (v) => v.toString(),
  label,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [minValue, maxValue] = value;

  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const minPercent = getPercent(minValue);
  const maxPercent = getPercent(maxValue);

  // 트랙 클릭 시 가까운 thumb 이동
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const valueAtClick = min + percent * (max - min);
    // 더 가까운 thumb 결정
    const distToMin = Math.abs(valueAtClick - minValue);
    const distToMax = Math.abs(valueAtClick - maxValue);
    if (distToMin < distToMax) {
      handleMinChange(Math.round(valueAtClick / step) * step);
    } else {
      handleMaxChange(Math.round(valueAtClick / step) * step);
    }
  };

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
  };

  const handleSlideEnd = () => {
    onChangeComplete?.([minValue, maxValue]);
  };

  return (
    <div className="mb-8 select-none" onClick={(e) => e.stopPropagation()}>
      <label className="block text-base font-semibold mb-3 text-gray-800">{label}</label>
      <div className="relative pt-10 pb-6" style={{height: 56}}>
        {/* Track Background */}
        <div
          ref={trackRef}
          className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full"
          style={{transform: 'translateY(-50%)'}}
          onClick={handleTrackClick}
        />
        {/* Active Track */}
        <div
          className="absolute top-1/2 h-2 bg-blue-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
            transform: 'translateY(-50%)',
          }}
          onClick={handleTrackClick}
        />
        {/* Min Thumb + Tooltip */}
        <div
          className="absolute z-10"
          style={{ left: `calc(${minPercent}% - 18px)`, top: 0 }}
        >
          <div className="flex flex-col items-center">
            <span className="mb-2 px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-lg">
              {formatLabel(minValue)}
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={minValue}
              onChange={(e) => {
                e.stopPropagation();
                handleMinChange(parseFloat(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleSlideStart();
              }}
              onMouseUp={handleSlideEnd}
              onTouchStart={handleSlideStart}
              onTouchEnd={handleSlideEnd}
              className="w-9 h-9 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-xl [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-xl"
              style={{ zIndex: minValue > max - (max - min) / 2 ? 5 : 3 }}
            />
          </div>
        </div>
        {/* Max Thumb + Tooltip */}
        <div
          className="absolute z-10"
          style={{ left: `calc(${maxPercent}% - 18px)`, top: 0 }}
        >
          <div className="flex flex-col items-center">
            <span className="mb-2 px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-lg">
              {formatLabel(maxValue)}
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={maxValue}
              onChange={(e) => {
                e.stopPropagation();
                handleMaxChange(parseFloat(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleSlideStart();
              }}
              onMouseUp={handleSlideEnd}
              onTouchStart={handleSlideStart}
              onTouchEnd={handleSlideEnd}
              className="w-9 h-9 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-xl [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-xl"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}