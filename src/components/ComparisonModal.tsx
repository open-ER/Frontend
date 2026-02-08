import { X } from "lucide-react";
import { WineRow } from "../types/wine";
import { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { compareWines } from "../api/api";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  wineIds: string[];
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
  wineIds,
}: ComparisonModalProps) {
  const [wines, setWines] = useState<WineRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hiddenCards, setHiddenCards] = useState<Set<number>>(
    new Set(),
  );

  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // API로부터 와인 데이터 가져오기
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!isOpen || wineIds.length === 0) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await compareWines(wineIds);
        setWines(response.wines);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, [isOpen, wineIds]);

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 backdrop으로 전파 방지
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  와인 비교
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-purple-100 mt-2">
                {displayWines.length}개의 와인을 비교하고
                있습니다
              </p>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-gray-600">와인 데이터를 불러오는 중...</p>
                  </div>
                </div>
              ) : wines.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-600">비교할 와인이 없습니다</p>
                </div>
              ) : (
                <div>
              {/* Tasting Profile Charts */}
              <div className="mb-8 md:mb-12">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                  테이스팅 프로필
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {displayWines.map((wine, idx) => (
                    <div
                      key={idx}
                      className="relative h-[520px]"
                      style={{
                        perspective: "1000px",
                      }}
                    >
                      <div
                        className="relative w-full h-full cursor-pointer"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: hiddenCards.has(idx)
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                          transition:
                            "transform 0.6s ease-in-out",
                        }}
                        onClick={() =>
                          toggleCardVisibility(idx)
                        }
                      >
                        {/* Front: Radar Chart */}
                        <div
                          className="absolute w-full h-full bg-gray-50 rounded-xl shadow-sm p-4 flex flex-col"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
                        >
                          {/* 제목 영역 - 고정 높이 */}
                          <div className="h-[60px] flex items-center justify-center">
                            <h4
                              className="font-bold text-center text-sm line-clamp-2 px-2"
                              style={{
                                color:
                                  WINE_COLORS[
                                    idx % WINE_COLORS.length
                                  ],
                              }}
                            >
                              {wine.wine_name}
                            </h4>
                          </div>

                          {/* 차트 영역 - 고정 높이 */}
                          <div className="h-[380px] flex items-center justify-center">
                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                            >
                              <RadarChart
                                data={getWineTastingData(wine)}
                              >
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis
                                  dataKey="attribute"
                                  tick={{
                                    fill: "#374151",
                                    fontSize: 10,
                                    fontWeight: 600,
                                  }}
                                />
                                <PolarRadiusAxis
                                  angle={90}
                                  domain={[0, 5]}
                                  tick={false}
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
                          </div>

                          {/* 안내 메시지 - 고정 높이 */}
                          <div className="h-[40px] flex items-center justify-center">
                            <p className="text-center text-xs text-gray-500">
                              클릭하여 상세 정보 보기
                            </p>
                          </div>
                        </div>

                        {/* Back: Detail Card */}
                        <div
                          className="absolute w-full h-full bg-gray-50 rounded-xl shadow-sm p-4 border-2 flex flex-col"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            borderColor:
                              WINE_COLORS[
                                idx % WINE_COLORS.length
                              ],
                          }}
                        >
                          {/* 제목 영역 - 고정 높이 */}
                          <div className="h-[60px] flex items-center justify-center mb-3">
                            <h4
                              className="font-bold text-base line-clamp-2 text-center px-2"
                              style={{
                                color:
                                  WINE_COLORS[
                                    idx % WINE_COLORS.length
                                  ],
                              }}
                            >
                              {wine.wine_name}
                            </h4>
                          </div>

                          {/* 기본 정보 영역 - 고정 높이 */}
                          <div className="h-[126px] mb-3">
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  국가/지역:
                                </span>
                                <span className="font-semibold text-gray-900 text-right truncate ml-2">
                                  {wine.country} -{" "}
                                  {wine.subregion}
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
                                <span className="font-semibold text-gray-900 text-right truncate ml-2">
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
                          </div>

                          {/* 테이스팅 프로필 영역 - 고정 높이 */}
                          <div className="h-[120px] pt-3 border-t border-gray-200 mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              테이스팅 프로필
                            </p>
                            <div className="space-y-1.5 text-xs">
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

                          {/* 향 정보 영역 - 유연한 높이 (스크롤 가능) */}
                          <div className="h-[130px] pt-3 border-t border-gray-200 overflow-hidden">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              향 프로필
                            </p>
                            {wine.aromas &&
                            wine.aromas.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-h-[90px] overflow-hidden">
                                {wine.aromas
                                  .slice(0, 12)
                                  .map((aroma, aromaIdx) => (
                                    <span
                                      key={aromaIdx}
                                      className="text-xs bg-white px-2 py-0.5 rounded border"
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
                                  ))}
                                {wine.aromas.length > 12 && (
                                  <span className="text-xs text-gray-400 px-2 py-0.5">
                                    +{wine.aromas.length - 12}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">
                                향 정보 없음
                              </p>
                            )}
                          </div>

                          {/* 안내 메시지 - 고정 하단 */}
                          <div className="h-[40px] flex items-center justify-center pt-3 border-t border-gray-200 mt-3">
                            <p className="text-center text-xs text-gray-500">
                              클릭하여 그래프 보기
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aroma Comparison */}
              <div className="overflow-hidden">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                  향 비교 (Aromas)
                </h3>

                {/* 와인별 향 프로필 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-blue-500 rounded-full" />
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">
                      와인별 향 프로필
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayWines.map((wine, idx) => {
                      const uniqueAromas = wine.aromas.filter(
                        (aroma) =>
                          !displayWines.every((w) =>
                            w.aromas.includes(aroma),
                          ),
                      );
                      const sharedAromas = wine.aromas.filter(
                        (aroma) =>
                          displayWines.some(
                            (w, wIdx) =>
                              wIdx !== idx &&
                              w.aromas.includes(aroma),
                          ),
                      );

                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-xl shadow-sm border-2 p-4 md:p-5 hover:shadow-md transition-shadow"
                          style={{
                            borderColor:
                              WINE_COLORS[
                                idx % WINE_COLORS.length
                              ],
                          }}
                        >
                          {/* 와인 헤더 */}
                          <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                              style={{
                                backgroundColor:
                                  WINE_COLORS[
                                    idx % WINE_COLORS.length
                                  ],
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5
                                className="font-bold text-sm md:text-base mb-1 truncate"
                                style={{
                                  color:
                                    WINE_COLORS[
                                      idx % WINE_COLORS.length
                                    ],
                                }}
                              >
                                {wine.wine_name}
                              </h5>
                              <p className="text-xs text-gray-600">
                                {wine.aromas.length}개의 향
                              </p>
                            </div>
                          </div>

                          {/* 고유 향 */}
                          {uniqueAromas.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                고유 향 ({uniqueAromas.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {uniqueAromas.map((aroma) => (
                                  <span
                                    key={aroma}
                                    className="inline-block text-xs px-2.5 py-1 rounded-full font-medium text-white"
                                    style={{
                                      backgroundColor:
                                        WINE_COLORS[
                                          idx %
                                            WINE_COLORS.length
                                        ],
                                    }}
                                  >
                                    {aroma}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 공유 향 */}
                          {sharedAromas.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                다른 와인과 공유 (
                                {sharedAromas.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {sharedAromas.map((aroma) => (
                                  <span
                                    key={aroma}
                                    className="inline-block text-xs px-2.5 py-1 rounded-full border font-medium"
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
                                      backgroundColor: `${WINE_COLORS[idx % WINE_COLORS.length]}10`,
                                    }}
                                  >
                                    {aroma}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 향 매트릭스 (컴팩트 뷰) */}
                <div className="mt-6 md:mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-gray-400 rounded-full" />
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        전체 향 매트릭스
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        setIsMatrixOpen(!isMatrixOpen)
                      }
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      상세보기
                    </button>
                  </div>

                  <div
                    id="aroma-matrix"
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      maxHeight: isMatrixOpen ? "2000px" : "0",
                      opacity: isMatrixOpen ? 1 : 0,
                    }}
                  >
                    <div className="bg-gray-50 rounded-xl p-4 md:p-6 overflow-x-auto">
                      <table className="w-full text-xs md:text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-2 px-2 font-bold text-gray-900 left-0 bg-gray-50 z-10">
                              향
                            </th>
                            {displayWines.map((wine, idx) => (
                              <th
                                key={idx}
                                className="text-center py-2 px-2 font-bold whitespace-nowrap"
                              >
                                <div
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-full mx-auto flex items-center justify-center text-white text-xs"
                                  style={{
                                    backgroundColor:
                                      WINE_COLORS[
                                        idx % WINE_COLORS.length
                                      ],
                                  }}
                                >
                                  {idx + 1}
                                </div>
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
                              <td className="py-2 px-2 font-medium text-gray-900 left-0 bg-gray-50 z-10">
                                {aroma}
                              </td>
                              {displayWines.map((wine, idx) => (
                                <td
                                  key={idx}
                                  className="text-center py-2 px-2"
                                >
                                  {wine.aromas.includes(
                                    aroma,
                                  ) ? (
                                    <div className="flex justify-center">
                                      <svg
                                        className="w-5 h-5 md:w-6 md:h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke={
                                          WINE_COLORS[
                                            idx %
                                              WINE_COLORS.length
                                          ]
                                        }
                                        strokeWidth={3}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <span className="text-gray-300">
                                      —
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

                {/* 통계 요약 */}
                <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {allAromas.length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        총 향 종류
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-purple-600">
                        {
                          allAromas.filter((aroma) =>
                            displayWines.every((wine) =>
                              wine.aromas.includes(aroma),
                            ),
                          ).length
                        }
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        공통 향
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-blue-600">
                        {Math.round(
                          displayWines.reduce(
                            (sum, wine) =>
                              sum + wine.aromas.length,
                            0,
                          ) / displayWines.length,
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        평균 향 개수
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-orange-600">
                        {Math.max(
                          ...displayWines.map(
                            (w) => w.aromas.length,
                          ),
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        최다 향
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}