
import { X, HelpCircle, Search, Filter, ArrowRightLeft } from "lucide-react";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-6 h-6" />
                        <h2 className="text-xl font-bold">도움말</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl h-fit">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">와인 검색</h3>
                            <p className="text-gray-600 text-sm">
                                우측 상단의 검색 버튼을 클릭하여 와인 이름, 국가, 품종 등으로 원하는 와인을 빠르게 찾아보세요.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-purple-100 p-3 rounded-xl h-fit">
                            <Filter className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">상세 필터</h3>
                            <p className="text-gray-600 text-sm">
                                좌측 사이드바에서 가격, 국가, 맛 프로필(당도, 산도 등)을 조절하여 취향에 맞는 와인을 발견하세요.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-amber-100 p-3 rounded-xl h-fit">
                            <ArrowRightLeft className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">와인 비교</h3>
                            <p className="text-gray-600 text-sm">
                                와인 카드를 클릭하여 최대 5개까지 선택하고, 하단의 비교하기 버튼을 눌러 스펙을 한눈에 비교해보세요.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 text-center">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        확인했습니다
                    </button>
                </div>
            </div>
        </div>
    );
}
