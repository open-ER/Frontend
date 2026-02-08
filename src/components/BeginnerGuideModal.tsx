import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuidePage {
  title: string;
  content: JSX.Element;
}

export function BeginnerGuideModal({
  isOpen,
  onClose,
}: BeginnerGuideModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const guidePages: GuidePage[] = [
    {
      title: "와인이란?",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            와인은 기본적으로{" "}
            <strong>포도를 발효해서 만든 술</strong>입니다.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <p className="text-gray-700">
              와인 스타일을 결정하는 주요 요소:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">
                  •
                </span>
                <div>
                  <strong className="text-gray-900">
                    당도
                  </strong>
                  <span className="text-gray-600">
                    : 단맛이 남느냐
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">
                  •
                </span>
                <div>
                  <strong className="text-gray-900">
                    타닌
                  </strong>
                  <span className="text-gray-600">
                    : 껍질/씨에서 오는 떫은맛이 있느냐
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">
                  •
                </span>
                <div>
                  <strong className="text-gray-900">
                    산도
                  </strong>
                  <span className="text-gray-600">
                    : 산미가 어느 정도냐
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "와인의 타입",
      content: (
        <div className="space-y-3">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-900 mb-2">
              레드
            </h4>
            <p className="text-sm text-gray-700">
              포도 껍질과 함께 발효하는 경우가 많아 타닌이 있는
              편이라 <strong>"떫은맛/구조감"</strong>이 느껴지기
              쉬워요.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-2">
              화이트
            </h4>
            <p className="text-sm text-gray-700">
              껍질 접촉이 짧거나 없는 경우가 많아 타닌이 낮고,{" "}
              <strong>산미/향</strong>이 두드러지는 스타일이
              많아요.
            </p>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <h4 className="font-bold text-pink-900 mb-2">
              로제
            </h4>
            <p className="text-sm text-gray-700">
              레드처럼 껍질 색은 조금만 우려내고(짧은 접촉){" "}
              <strong>산뜻하게</strong> 만드는 경우가 많아요.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">
              스파클링
            </h4>
            <p className="text-sm text-gray-700">
              <strong>탄산(기포)</strong>이 있는 와인으로,
              병/탱크에서 2차 발효 등을 통해 기포가 만들어진
              스타일이 대표적이에요.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-bold text-orange-900 mb-2">
              주정강화
            </h4>
            <p className="text-sm text-gray-700">
              발효 중/후에{" "}
              <strong>증류주를 더해 알코올 도수를 올린</strong>{" "}
              와인이고, 달콤한 스타일이 많지만 드라이한 것도
              있어요.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-2">
              디저트 와인
            </h4>
            <p className="text-sm text-gray-700">
              <strong>"단맛이 뚜렷한 와인"</strong>의 큰 범주로,
              늦수확/귀부/강화 등 다양한 방식이 있어요.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "국가별 와인 특징",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-900">
                💡 중요한 포인트:
              </strong>{" "}
              "국가=맛"으로 단정하기보다 같은 국가 안에서도
              지역·기후·품종에 따라 스타일이 크게 달라져요.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                🇫🇷 프랑스
              </h4>
              <p className="text-sm text-gray-700">
                전통적으로 지역(보르도/부르고뉴/샹파뉴 등)
                중심의 다양한 스타일을 많이 만듭니다.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                🇮🇹 이탈리아
              </h4>
              <p className="text-sm text-gray-700">
                지역/품종 다양성이 특히 크고(키안티, 바롤로,
                프로세코 등) 스타일 폭이 넓습니다.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                🇪🇸 스페인
              </h4>
              <p className="text-sm text-gray-700">
                포도밭 면적이 매우 크고, 템프라니요가 대표
                품종으로 널리 언급됩니다.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                🇺🇸 미국 (캘리포니아)
              </h4>
              <p className="text-sm text-gray-700">
                미국 와인의 중심으로 자주 거론되고, 카베르네
                소비뇽/샤르도네 같은 품종이 대표로 언급됩니다.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                🇨🇱 칠레
              </h4>
              <p className="text-sm text-gray-700">
                카베르네 소비뇽/메를로와 함께{" "}
                <strong>카르메네르</strong>가 "칠레의
                강점(USP)"으로 자주 언급됩니다.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                🇩🇪 독일
              </h4>
              <p className="text-sm text-gray-700">
                <strong>리슬링</strong>이 대표로 자주 언급되고,
                뛰어난 화이트 산지로 소개됩니다.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "빈티지 와인이란?",
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-3 text-lg">
              빈티지(Vintage)의 의미
            </h4>
            <p className="text-gray-700 leading-relaxed">
              와인에서 "빈티지"는 그 와인을 만든{" "}
              <strong>포도의 수확 연도</strong>를 말해요.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">
              🔑 핵심 포인트
            </h4>
            <p className="text-gray-700 leading-relaxed mb-3">
              같은 라벨/같은 와인이라도 해마다 날씨가 다르기
              때문에,{" "}
              <strong className="text-purple-600">
                빈티지(연도)에 따라 맛과 품질이 달라질 수 있다
              </strong>
              는 점이 핵심이에요.
            </p>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">예시:</strong>{" "}
                2018년 빈티지와 2019년 빈티지는 같은 와이너리,
                같은 품종이어도 그 해의 기후·강수량·일조량 등에
                따라 향과 맛이 다를 수 있습니다.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              💡 <strong>참고:</strong> 빈티지는 "오래된
              것=좋다"가 아니라, 해당 연도의 재배 환경이 얼마나
              좋았는지를 나타내는 지표입니다.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "포도 품종",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-gray-700 leading-relaxed">
              포도 품종은 와인의{" "}
              <strong>향과 맛을 결정하는 핵심 요소</strong>
              입니다. 각 품종마다 고유한 특징이 있어요.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">
              대표적인 레드 품종
            </h4>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  카베르네 소비뇽 (Cabernet Sauvignon)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  강한 타닌, 블랙커런트/삼나무 향, 풀바디
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  메를로 (Merlot)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  부드러운 타닌, 자두/체리 향, 미디엄-풀바디
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  피노 누아 (Pinot Noir)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  섬세한 타닌, 딸기/체리 향, 라이트-미디엄바디
                </p>
              </div>
            </div>

            <h4 className="font-bold text-gray-900 mt-4">
              대표적인 화이트 품종
            </h4>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  샤르도네 (Chardonnay)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  다양한 스타일, 사과/바닐라/버터 향 (오크 숙성
                  시)
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  소비뇽 블랑 (Sauvignon Blanc)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  높은 산도, 풀/라임/자몽 향, 상큼한 스타일
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  리슬링 (Riesling)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  높은 산도, 꽃/복숭아/꿀 향, 드라이부터
                  스위트까지 다양
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 품종은 와인의 기본 성격을 만들지만, 재배 지역과
              양조 방식에 따라 같은 품종이라도 완전히 다른
              스타일이 될 수 있어요.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "맛 프로필 용어",
      content: (
        <div className="space-y-3">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-900 mb-2">
              타닌 (Tannin)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              주로 포도 <strong>껍질/씨(그리고 오크)</strong>
              에서 오는 <strong>떫은 느낌</strong>
            </p>
            <p className="text-xs text-gray-600">
              입안을 마르게 하는 느낌으로 이해하면 됩니다.
            </p>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <h4 className="font-bold text-pink-900 mb-2">
              당도 (Sweetness)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              남아있는 당(잔당) 때문에 느껴지는{" "}
              <strong>단맛의 정도</strong>
            </p>
            <p className="text-xs text-gray-600">
              드라이(Dry) / 세미드라이(Semi-Dry) /
              스위트(Sweet)로 구분
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-2">
              산도 (Acidity)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              와인의 <strong>신맛·상큼함</strong>을 결정하는
              요소
            </p>
            <p className="text-xs text-gray-600">
              산도가 높으면 상큼하고 입안이 깔끔하게 정리됩니다.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">
              바디 (Body)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              물처럼 가벼운지, 우유/크림처럼 묵직한지에 가까운{" "}
              <strong>"무게감"</strong>
            </p>
            <p className="text-xs text-gray-600">
              알코올, 당, 추출감 등 여러 요소가 합쳐진 체감
            </p>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p>• 라이트 바디: 물처럼 가벼움</p>
              <p>• 미디엄 바디: 우유 정도의 무게감</p>
              <p>• 풀 바디: 크림처럼 묵직함</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-2">
              알코올 도수 (ABV - Alcohol by Volume)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              발효로 만들어진 <strong>알코올의 비율</strong>
            </p>
            <p className="text-xs text-gray-600">
              도수가 높을수록 따뜻함/무게감이 더 느껴지는 경우가
              많습니다.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 mt-4">
            <h4 className="font-bold text-gray-900 mb-2">
              🌱 이 요소들의 형성
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>기본:</strong> 포도
                자체(품종/숙성도/산지 기후) + 수확 타이밍
              </p>
              <p>
                <strong>변화:</strong> 양조 과정(껍질 접촉 시간,
                발효 정도, 오크 숙성 여부)이 타닌/바디/향의
                방향을 크게 바꿉니다.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentPageIndex(0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 페이지 전환 시 스크롤 리셋
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentPageIndex]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < guidePages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (
      isLeftSwipe &&
      currentPageIndex < guidePages.length - 1
    ) {
      handleNextPage();
    }
    if (isRightSwipe && currentPageIndex > 0) {
      handlePrevPage();
    }
  };

  const currentPage = guidePages[currentPageIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop"
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
            className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl h-[65vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 backdrop으로 전파 방지
          >
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  초보자 가이드
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="text-white hover:bg-white/20 transition-colors rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Page Title */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {currentPage.title}
              </h3>
              <div className="flex gap-1 mt-2">
                {guidePages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index === currentPageIndex
                        ? "bg-purple-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto p-6"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {currentPage.content}
            </div>

            {/* Navigation Footer */}
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between rounded-b-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPage();
                }}
                disabled={currentPageIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPageIndex === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                이전
              </button>

              <div className="text-sm text-gray-600">
                {currentPageIndex + 1} / {guidePages.length}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPage();
                }}
                disabled={
                  currentPageIndex === guidePages.length - 1
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPageIndex === guidePages.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                다음
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}