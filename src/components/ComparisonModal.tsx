import { X } from "lucide-react";
import { WineRow } from "../types/wine";
import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  wines: WineRow[];
}

const WINE_COLORS = [
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
];

export function ComparisonModal({
  isOpen,
  onClose,
  wines,
}: ComparisonModalProps) {
  const [hiddenCards, setHiddenCards] = useState<Set<number>>(
    new Set(),
  );

  if (!isOpen) return null;

  // 최대 5개까지만 표시
  const displayWines = wines.slice(0, 5);

  // Toggle card visibility
  const toggleCardVisibility = (index: number) => {
    setHiddenCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Prepare data for individual radar charts
  const getWineTastingData = (wine: WineRow) => [
    { attribute: "탄닌", value: wine.tannin || 0 },
    { attribute: "단맛", value: wine.sweetness || 0 },
    { attribute: "산도", value: wine.acidity || 0 },
    { attribute: "바디", value: wine.body || 0 },
    {
      attribute: "알코올",
      value: ((wine.alcohol || 0) / 20) * 5,
    },
  ];

  // Get all unique aromas
  const allAromas = Array.from(
    new Set(displayWines.flatMap((wine) => wine.aromas)),
  ).sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">와인 비교</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            {displayWines.length}개의 와인을 비교하고 있습니다
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Tasting Profile Charts with Flip Animation */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              테이스팅 프로필
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayWines.map((wine, idx) => (
                <div
                  key={idx}
                  className="relative h-[400px]"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 cursor-pointer`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: hiddenCards.has(idx)
                        ? "rotateY(0deg)"
                        : "rotateY(180deg)",
                    }}
                    onClick={() => toggleCardVisibility(idx)}
                  >
                    {/* Front: Radar Chart */}
                    <div
                      className="absolute w-full h-full bg-gray-50 rounded-xl shadow-sm hover:shadow-md p-4"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <h4
                        className="font-bold text-center mb-4 text-sm"
                        style={{
                          color:
                            WINE_COLORS[
                              idx % WINE_COLORS.length
                            ],
                        }}
                      >
                        {wine.wine_name}
                      </h4>
                      <ResponsiveContainer
                        width="100%"
                        height={280}
                      >
                        <RadarChart
                          data={getWineTastingData(wine)}
                        >
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis
                            dataKey="attribute"
                            tick={{
                              fill: "#374151",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 5]}
                            tick={{
                              fill: "#6b7280",
                              fontSize: 10,
                            }}
                          />
                          <Radar
                            dataKey="value"
                            stroke={
                              WINE_COLORS[
                                idx % WINE_COLORS.length
                              ]
                            }
                            fill={
                              WINE_COLORS[
                                idx % WINE_COLORS.length
                              ]
                            }
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                      <p className="text-center text-xs text-gray-500 mt-2">
                        클릭하여 상세 정보 보기
                      </p>
                    </div>

                    {/* Back: Detail Card */}
                    <div
                      className="absolute w-full h-full bg-gray-50 rounded-xl shadow-sm p-6 overflow-y-auto border-2"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderColor:
                          WINE_COLORS[idx % WINE_COLORS.length],
                      }}
                    >
                      <h4
                        className="font-bold text-lg mb-4"
                        style={{
                          color:
                            WINE_COLORS[
                              idx % WINE_COLORS.length
                            ],
                        }}
                      >
                        {wine.wine_name}
                      </h4>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            국가/지역:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {wine.country} - {wine.subregion}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            와인 타입:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {wine.wine_type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            품종:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {wine.grape_or_style}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            빈티지:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {wine.vintage || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            가격:
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₩
                            {wine.price_krw?.toLocaleString() ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            알코올:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {wine.alcohol}%
                          </span>
                        </div>
                      </div>

                      {/* 테이스팅 프로필 상세 */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          테이스팅 프로필
                        </p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              타닌:
                            </span>
                            <span className="font-medium">
                              {wine.tannin}/5
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              당도:
                            </span>
                            <span className="font-medium">
                              {wine.sweetness}/5
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              산도:
                            </span>
                            <span className="font-medium">
                              {wine.acidity}/5
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              바디:
                            </span>
                            <span className="font-medium">
                              {wine.body}/5
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 향 정보 */}
                      {wine.aromas &&
                        wine.aromas.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              향 프로필
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {wine.aromas.map(
                                (aroma, aromaIdx) => (
                                  <span
                                    key={aromaIdx}
                                    className="text-xs bg-white px-2 py-1 rounded border"
                                    style={{
                                      borderColor:
                                        WINE_COLORS[
                                          idx %
                                            WINE_COLORS.length
                                        ],
                                      color:
                                        WINE_COLORS[
                                          idx %
                                            WINE_COLORS.length
                                        ],
                                    }}
                                  >
                                    {aroma}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      <p className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        클릭하여 그래프 보기
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aroma Comparison */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              향 비교 (Aromas)
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 overflow-x-auto shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">
                      향
                    </th>
                    {displayWines.map((wine, idx) => (
                      <th
                        key={idx}
                        className="text-center py-3 px-4 font-bold"
                        style={{
                          color:
                            WINE_COLORS[
                              idx % WINE_COLORS.length
                            ],
                        }}
                      >
                        {wine.wine_name
                          .split(" ")
                          .filter((_, i) => i === 0 || i === 1)
                          .join(" ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allAromas.map((aroma) => (
                    <tr
                      key={aroma}
                      className="border-b border-gray-200 hover:bg-white transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {aroma}
                      </td>
                      {displayWines.map((wine, idx) => (
                        <td
                          key={idx}
                          className="text-center py-3 px-4"
                        >
                          {wine.aromas.includes(aroma) ? (
                            <span
                              className="inline-block w-6 h-6 rounded-full"
                              style={{
                                backgroundColor:
                                  WINE_COLORS[
                                    idx % WINE_COLORS.length
                                  ],
                              }}
                            />
                          ) : (
                            <span className="text-gray-300">
                              -
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}