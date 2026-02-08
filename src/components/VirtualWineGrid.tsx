import { FixedSizeGrid as Grid } from 'react-window'
import { WineRow } from '../types/wine'
import { WineCard } from './WineCard'
import { useMemo, useState, useEffect, useRef } from 'react'

interface VirtualWineGridProps {
  wines: WineRow[]
  selectedWines: Set<string>
  onToggleWine: (wineName: string) => void
}

export function VirtualWineGrid({ wines, selectedWines, onToggleWine }: VirtualWineGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    // Initial size
    updateDimensions()

    // Resize observer
    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (wines.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-2">No items match your filters</p>
          <p className="text-gray-500">필터 조건을 변경하거나 초기화해 주세요</p>
        </div>
      </div>
    )
  }

  // Defensive programming: fallback to window if container is 0 (initial render)
  // or just render nothing until we have size to avoid "0" errors in grid
  const width = dimensions.width || (typeof window !== 'undefined' ? window.innerWidth - 400 : 800)
  const height = dimensions.height || (typeof window !== 'undefined' ? window.innerHeight - 200 : 600)

  // Card dimensions
  const CARD_HEIGHT = 550
  const GAP = 12

  // Calculate columns
  let columnCount = 1
  if (width >= 1280) columnCount = 4
  else if (width >= 1024) columnCount = 3
  else if (width >= 768) columnCount = 2

  const columnWidth = (width - GAP * (columnCount - 1)) / columnCount
  const rowCount = Math.ceil(wines.length / columnCount)

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh-200px)] px-5">
      {width > 0 && height > 0 && (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={height}
          rowCount={rowCount}
          rowHeight={CARD_HEIGHT + GAP}
          width={width}
          className="custom-scrollbar">
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * columnCount + columnIndex
            if (index >= wines.length) return null

            const wine = wines[index]
            const cellStyle = {
              ...style,
              left: Number(style.left),
              top: Number(style.top),
              width: Number(style.width) - GAP,
              height: Number(style.height) - GAP,
            }

            const uniqueKey = `${wine.wine_name}-${wine.vintage || 'nv'}-${wine.subregion}-${index}`

            return (
              <div style={cellStyle}>
                <WineCard
                  key={uniqueKey}
                  wine={wine}
                  isSelected={selectedWines.has(wine.wine_name)}
                  onToggleSelect={() => onToggleWine(wine.wine_name)}
                />
              </div>
            )
          }}
        </Grid>
      )}
    </div>
  )
}
