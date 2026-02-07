import { WineRow } from "../types/wine";
import { Wine } from "lucide-react";

interface WineCardProps {
  wine: WineRow;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const getWineTypeColor = (type: string) => {
  switch (type) {
    case "레드":
      return "#FFCCCB"; // 라이트 코랄
    case "화이트":
      return "#FFFACD"; // 레몬 쉬폰
    case "로제":
      return "#FFE4E1"; // 미스티 로즈
    case "스파클링":
      return "#F0F8FF"; // 앨리스 블루
    case "주정강화":
      return "#F5DEB3"; // 밀색
    case "디저트":
      return "#FFF0F5"; // 라벤더 블러쉬
    default:
      return "#F5F5F5"; // 기본 회색
  }
};

export function WineCard({
  wine,
  isSelected,
  onToggleSelect,
}: WineCardProps) {
  const headerColor = getWineTypeColor(wine.wine_type);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header with wine type - 검은 글씨 + 파스텔 배경 */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: headerColor }}
      >
        <div className="flex items-center gap-2">
          <Wine className="w-5 h-5 text-black" />
          <span className="font-semibold text-black">
            {wine.wine_type}
          </span>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-5 h-5 rounded border-gray-400"
          />
        </label>
      </div>

      {/* Wine Details */}
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[56px]">
          {wine.wine_name}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3 min-h-[120px]">
          <p>
            <span className="font-medium">원산지:</span>{" "}
            {wine.country}, {wine.subregion}
          </p>
          {wine.vintage && (
            <p>
              <span className="font-medium">빈티지:</span>{" "}
              {wine.vintage}
            </p>
          )}
          <p>
            <span className="font-medium">품종:</span>{" "}
            {wine.grape_or_style}
          </p>
          {wine.alcohol && (
            <p>
              <span className="font-medium">알코올:</span>{" "}
              {wine.alcohol}%
            </p>
          )}
        </div>

        {/* Taste Profile */}
        <div className="border-t pt-3 mb-3 min-h-[100px]">
          <p className="text-xs font-medium text-gray-700 mb-2">
            테이스팅 프로필
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {wine.tannin && (
              <div>
                <span className="text-gray-600">타닌:</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded ${
                        i < Math.round(wine.tannin!)
                          ? "bg-amber-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {wine.sweetness && (
              <div>
                <span className="text-gray-600">당도:</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded ${
                        i < Math.round(wine.sweetness!)
                          ? "bg-rose-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {wine.acidity && (
              <div>
                <span className="text-gray-600">산도:</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded ${
                        i < Math.round(wine.acidity!)
                          ? "bg-emerald-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {wine.body && (
              <div>
                <span className="text-gray-600">바디:</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded ${
                        i < Math.round(wine.body!)
                          ? "bg-slate-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aromas */}
        <div className="border-t pt-3 mb-3 min-h-[90px]">
          {wine.aromas.length > 0 && (
            <>
              <p className="text-xs font-medium text-gray-700 mb-2">
                향
              </p>
              <div className="flex flex-wrap gap-1">
                {wine.aromas.slice(0, 6).map((aroma, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {aroma}
                  </span>
                ))}
                {wine.aromas.length > 6 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{wine.aromas.length - 6}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Price */}
        {wine.price_krw && (
          <div className="flex items-center justify-between border-t pt-3 mt-auto">
            <span className="text-2xl font-bold text-gray-900 text-center">
              ₩{wine.price_krw.toLocaleString()}
            </span>
            {/* <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm">
              상세보기
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}