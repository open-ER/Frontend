import { useState, useMemo } from 'react';
import { Wine, WineFilterState, CountryCount, RegionCount, VintageCount, WineTypeCount, GrapeCount } from '../types/wine';

export function useWineFilters(wines: Wine[]) {
  const [filters, setFilters] = useState<WineFilterState>({
    priceRange: [0, 1500000],
    selectedCountries: [],
    selectedRegions: [],
    selectedVintages: [],
    selectedWineTypes: [],
    selectedGrapes: [],
    alcoholRange: [0, 20],
    tanninRange: [1, 5],
    sweetnessRange: [1, 5],
    acidityRange: [1, 5],
    selectedBodies: [],
  });

  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      // Price filter
      if (wine.price_krw < filters.priceRange[0] || wine.price_krw > filters.priceRange[1]) {
        return false;
      }

      // Country filter
      if (filters.selectedCountries.length > 0 && !filters.selectedCountries.includes(wine.country)) {
        return false;
      }

      // Region filter
      if (filters.selectedRegions.length > 0 && !filters.selectedRegions.includes(wine.subregion)) {
        return false;
      }

      // Vintage filter
      if (filters.selectedVintages.length > 0 && !filters.selectedVintages.includes(wine.vintage)) {
        return false;
      }

      // Wine type filter
      if (filters.selectedWineTypes.length > 0 && !filters.selectedWineTypes.includes(wine.wine_type)) {
        return false;
      }

      // Grape/style filter
      if (filters.selectedGrapes.length > 0 && !filters.selectedGrapes.includes(wine.grape_or_style)) {
        return false;
      }

      // Alcohol filter
      if (wine.alcohol < filters.alcoholRange[0] || wine.alcohol > filters.alcoholRange[1]) {
        return false;
      }

      // Tannin filter
      if (wine.tannin < filters.tanninRange[0] || wine.tannin > filters.tanninRange[1]) {
        return false;
      }

      // Sweetness filter
      if (wine.sweetness < filters.sweetnessRange[0] || wine.sweetness > filters.sweetnessRange[1]) {
        return false;
      }

      // Acidity filter
      if (wine.acidity < filters.acidityRange[0] || wine.acidity > filters.acidityRange[1]) {
        return false;
      }

      // Body filter
      if (filters.selectedBodies.length > 0 && !filters.selectedBodies.includes(wine.body)) {
        return false;
      }

      return true;
    });
  }, [wines, filters]);

  // Count calculations
  const countryCounts = useMemo((): CountryCount[] => {
    const counts = wines.reduce((acc, wine) => {
      acc[wine.country] = (acc[wine.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [wines]);

  const regionCounts = useMemo((): RegionCount[] => {
    const counts = wines.reduce((acc, wine) => {
      acc[wine.subregion] = (acc[wine.subregion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);
  }, [wines]);

  const vintageCounts = useMemo((): VintageCount[] => {
    const counts = wines.reduce((acc, wine) => {
      acc[wine.vintage] = (acc[wine.vintage] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(counts)
      .map(([vintage, count]) => ({ vintage: Number(vintage), count }))
      .sort((a, b) => b.vintage - a.vintage);
  }, [wines]);

  const wineTypeCounts = useMemo((): WineTypeCount[] => {
    const counts = wines.reduce((acc, wine) => {
      acc[wine.wine_type] = (acc[wine.wine_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [wines]);

  const grapeCounts = useMemo((): GrapeCount[] => {
    const counts = wines.reduce((acc, wine) => {
      acc[wine.grape_or_style] = (acc[wine.grape_or_style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([grape, count]) => ({ grape, count }))
      .sort((a, b) => b.count - a.count);
  }, [wines]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1500000],
      selectedCountries: [],
      selectedRegions: [],
      selectedVintages: [],
      selectedWineTypes: [],
      selectedGrapes: [],
      alcoholRange: [0, 20],
      tanninRange: [1, 5],
      sweetnessRange: [1, 5],
      acidityRange: [1, 5],
      selectedBodies: [],
    });
  };

  return {
    filters,
    setFilters,
    filteredWines,
    countryCounts,
    regionCounts,
    vintageCounts,
    wineTypeCounts,
    grapeCounts,
    resetFilters,
  };
}
