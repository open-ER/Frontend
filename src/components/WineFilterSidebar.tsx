import { useState, useMemo, useEffect, useRef } from 'react'
import { ArrowLeft, RotateCcw, SlidersHorizontal, HelpCircle } from 'lucide-react'
import { FilterState, WineRow } from '../types/wine'
import { RangeSlider } from './RangeSlider'
import { motion, AnimatePresence } from 'framer-motion'

interface WineFilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
  availableOptions: {
    wineTypes: string[]
    countries: string[]
    subregions: string[]
    vintages: number[]
    grapeVarieties: string[]
    aromas: string[]
  }
  wines: WineRow[]
  onOpenGuide: () => void
  isSearchOpen?: boolean
  setIsSliding?: (sliding: boolean) => void
}

export function WineFilterSidebar({ filters, onFilterChange, onReset, isOpen, onToggle, availableOptions, wines, onOpenGuide, isSearchOpen = false, setIsSliding }: WineFilterSidebarProps) {
  const [isSubregionVisible, setIsSubregionVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const prevCountriesLength = useRef(filters.countries.length)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)

  // 와인 타입 목록 (내부 정의)
  const wineTypes = availableOptions.wineTypes || ['레드', '화이트', '로제', '스파클링', '주정강화', '디저트']

  // 슬라이더 드래그 시작/종료 핸들러
  const handleSliderStart = () => {
    setIsSliding?.(true)
  }

  const handleSliderComplete = () => {
    setIsSliding?.(false)
  }

  // 모달 열릴 때 body 스크롤 차단 (개선된 버전)
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY

      // body 고정 - 더 안정적인 방법
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'

      return () => {
        // body 고정 해제
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.width = ''

        // 스크롤 위치 복원
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // 국가 선택 변경 감지
  useEffect(() => {
    const currentLength = filters.countries.length
    const prevLength = prevCountriesLength.current

    if (currentLength > 0 && prevLength === 0) {
      setIsSubregionVisible(true)
      setIsAnimatingOut(false)
    } else if (currentLength === 0 && prevLength > 0) {
      setIsAnimatingOut(true)
      setTimeout(() => {
        setIsSubregionVisible(false)
        setIsAnimatingOut(false)
      }, 300)
    }

    prevCountriesLength.current = currentLength
  }, [filters.countries.length])

  // 선택된 국가에 해당하는 지역만 필터링
  const filteredSubregions = useMemo(() => {
    if (filters.countries.length === 0) {
      return availableOptions.subregions
    }

    const regionsSet = new Set<string>()
    wines.forEach((wine) => {
      if (filters.countries.includes(wine.country)) {
        regionsSet.add(wine.subregion)
      }
    })

    return Array.from(regionsSet).sort()
  }, [filters.countries, wines, availableOptions.subregions])

  const handleWineTypeToggle = (type: string) => {
    const newTypes = filters.wineTypes.includes(type) ? filters.wineTypes.filter((t) => t !== type) : [...filters.wineTypes, type]
    onFilterChange({ ...filters, wineTypes: newTypes })
  }

  const handleCountryToggle = (country: string) => {
    const newCountries = filters.countries.includes(country) ? filters.countries.filter((c) => c !== country) : [...filters.countries, country]

    let newSubregions = filters.subregions
    if (!newCountries.includes(country)) {
      const countryRegions = new Set(wines.filter((w) => w.country === country).map((w) => w.subregion))
      newSubregions = filters.subregions.filter((r) => !countryRegions.has(r))
    }

    onFilterChange({
      ...filters,
      countries: newCountries,
      subregions: newSubregions,
    })
  }

  const handleSubregionToggle = (subregion: string) => {
    const newSubregions = filters.subregions.includes(subregion) ? filters.subregions.filter((s) => s !== subregion) : [...filters.subregions, subregion]
    onFilterChange({ ...filters, subregions: newSubregions })
  }

  const handleVintageToggle = (vintage: number) => {
    const newVintages = filters.vintages.includes(vintage) ? filters.vintages.filter((v) => v !== vintage) : [...filters.vintages, vintage]
    onFilterChange({ ...filters, vintages: newVintages })
  }

  const handleGrapeToggle = (grape: string) => {
    const newGrapes = filters.grapeVarieties.includes(grape) ? filters.grapeVarieties.filter((g) => g !== grape) : [...filters.grapeVarieties, grape]
    onFilterChange({ ...filters, grapeVarieties: newGrapes })
  }

  const handleAromaToggle = (aroma: string) => {
    const newAromas = filters.aromas.includes(aroma) ? filters.aromas.filter((a) => a !== aroma) : [...filters.aromas, aroma]
    onFilterChange({ ...filters, aromas: newAromas })
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`fixed left-4 top-4 z-40 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:shadow-xl ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="필터 열기">
        <SlidersHorizontal className="w-6 h-6" />
      </button>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop"
            onClick={onToggle}
          />

          {/* Modal */}
          <motion.div
            ref={sidebarRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="
              relative
              w-[calc(100%-2rem)] md:w-[420px] lg:w-[460px]
              max-h-[90vh]
              m-4 md:m-8
              bg-white rounded-2xl shadow-2xl
              flex flex-col
            "
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-12 py-4 md:py-6 border-b bg-white shrink-0">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">필터</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenGuide}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
                  aria-label="가이드 열기"
                  title="와인 가이드">
                  <HelpCircle
                    className="w-6 h-6 text-gray-600"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </button>
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="모든 필터 초기화">
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline">초기화</span>
                </button>
                <button
                  onClick={onToggle}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 ml-2"
                  aria-label="필터 닫기"
                  title="닫기">
                  <ArrowLeft
                    className="w-5 h-5 text-gray-600"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollableRef}
              className="flex-1 overflow-y-auto px-6 md:px-12 py-4 md:py-6"
              style={{
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}>
              {/* Price Range */}
              <div className="mb-6 shadow-sm p-4 rounded-lg border border-gray-200">
                <RangeSlider
                  min={0}
                  max={500000}
                  step={10000}
                  value={filters.priceRange}
                  onChange={(value) =>
                    onFilterChange({
                      ...filters,
                      priceRange: value,
                    })
                  }
                  onStart={handleSliderStart}
                  onComplete={handleSliderComplete}
                  formatLabel={(value) => `₩${value.toLocaleString()}`}
                  label="가격 범위"
                />
              </div>

              {/* Wine Types */}
              <div className="mb-6 shadow-sm p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium mb-3 text-gray-700">와인 타입</label>
                <div className="space-y-2">
                  {wineTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.wineTypes.includes(type)}
                        onChange={() => handleWineTypeToggle(type)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="mb-6 shadow-sm p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium mb-3 text-gray-700">국가</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(availableOptions.countries || []).map((country) => (
                    <label
                      key={country}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.countries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subregions */}
              {isSubregionVisible && (
                <div className={`mb-6 shadow-sm p-4 rounded-lg border border-gray-200 transition-all duration-300 ${isAnimatingOut ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                  <label className="block text-sm font-medium mb-3 text-gray-700">세부 지역</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(filteredSubregions || []).map((subregion) => (
                      <label
                        key={subregion}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                        <input
                          type="checkbox"
                          checked={filters.subregions.includes(subregion)}
                          onChange={() => handleSubregionToggle(subregion)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{subregion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Vintages */}
              <div className="mb-6 shadow-sm p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium mb-3 text-gray-700">빈티지</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(availableOptions.vintages || []).map((vintage) => (
                    <label
                      key={vintage}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.vintages.includes(vintage)}
                        onChange={() => handleVintageToggle(vintage)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{vintage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grape Varieties */}
              <div className="mb-6 shadow-sm p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium mb-3 text-gray-700">품종</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(availableOptions.grapeVarieties || []).map((grape) => (
                    <label
                      key={grape}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.grapeVarieties.includes(grape)}
                        onChange={() => handleGrapeToggle(grape)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{grape}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Aromas */}
              <div className="mb-6 shadow-sm p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium mb-3 text-gray-700">향</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(availableOptions.aromas || []).map((aroma) => (
                    <label
                      key={aroma}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.aromas.includes(aroma)}
                        onChange={() => handleAromaToggle(aroma)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{aroma}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tasting Profile */}
              <div className="mb-8 shadow-sm p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-4 text-gray-700">테이스팅 프로필</h3>

                <RangeSlider
                  min={1}
                  max={5}
                  step={0.1}
                  value={filters.tanninRange}
                  onChange={(value) =>
                    onFilterChange({
                      ...filters,
                      tanninRange: value,
                    })
                  }
                  onStart={handleSliderStart}
                  onComplete={handleSliderComplete}
                  formatLabel={(value) => value.toFixed(1)}
                  label="타닌"
                />

                <RangeSlider
                  min={1}
                  max={5}
                  step={0.1}
                  value={filters.sweetnessRange}
                  onChange={(value) =>
                    onFilterChange({
                      ...filters,
                      sweetnessRange: value,
                    })
                  }
                  onStart={handleSliderStart}
                  onComplete={handleSliderComplete}
                  formatLabel={(value) => value.toFixed(1)}
                  label="당도"
                />

                <RangeSlider
                  min={1}
                  max={5}
                  step={0.1}
                  value={filters.acidityRange}
                  onChange={(value) =>
                    onFilterChange({
                      ...filters,
                      acidityRange: value,
                    })
                  }
                  onStart={handleSliderStart}
                  onComplete={handleSliderComplete}
                  formatLabel={(value) => value.toFixed(1)}
                  label="산도"
                />

                <RangeSlider
                  min={1}
                  max={5}
                  step={0.1}
                  value={filters.bodyRange}
                  onChange={(value) =>
                    onFilterChange({
                      ...filters,
                      bodyRange: value,
                    })
                  }
                  onStart={handleSliderStart}
                  onComplete={handleSliderComplete}
                  formatLabel={(value) => value.toFixed(1)}
                  label="바디"
                />

                <RangeSlider
                  min={0}
                  max={25}
                  step={0.5}
                  value={filters.alcoholRange}
                  onChange={(value) =>
                    onFilterChange({
                      ...filters,
                      alcoholRange: value,
                    })
                  }
                  onStart={handleSliderStart}
                  onComplete={handleSliderComplete}
                  formatLabel={(value) => `${value.toFixed(1)}%`}
                  label="알코올 도수"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
