import { WineRow, FilterState } from "../types/wine";

export function filterWines(wines: WineRow[], filters: FilterState): WineRow[] {
  return wines.filter((wine) => {
    // Price filter
    if (
      wine.price_krw &&
      (wine.price_krw < filters.priceRange[0] || wine.price_krw > filters.priceRange[1])
    ) {
      return false;
    }

    // Wine type filter
    if (filters.wineTypes.length > 0 && !filters.wineTypes.includes(wine.wine_type)) {
      return false;
    }

    // Country filter
    if (filters.countries.length > 0 && !filters.countries.includes(wine.country)) {
      return false;
    }

    // Subregion filter
    if (filters.subregions.length > 0 && !filters.subregions.includes(wine.subregion)) {
      return false;
    }

    // Vintage filter
    if (filters.vintages.length > 0 && wine.vintage && !filters.vintages.includes(wine.vintage)) {
      return false;
    }

    // Grape variety filter
    if (filters.grapeVarieties.length > 0 && !filters.grapeVarieties.includes(wine.grape_or_style)) {
      return false;
    }

    // Tannin filter
    if (
      wine.tannin &&
      (wine.tannin < filters.tanninRange[0] || wine.tannin > filters.tanninRange[1])
    ) {
      return false;
    }

    // Sweetness filter
    if (
      wine.sweetness &&
      (wine.sweetness < filters.sweetnessRange[0] || wine.sweetness > filters.sweetnessRange[1])
    ) {
      return false;
    }

    // Acidity filter
    if (
      wine.acidity &&
      (wine.acidity < filters.acidityRange[0] || wine.acidity > filters.acidityRange[1])
    ) {
      return false;
    }

    // Body filter
    if (
      wine.body &&
      (wine.body < filters.bodyRange[0] || wine.body > filters.bodyRange[1])
    ) {
      return false;
    }

    // Alcohol filter
    if (
      wine.alcohol &&
      (wine.alcohol < filters.alcoholRange[0] || wine.alcohol > filters.alcoholRange[1])
    ) {
      return false;
    }

    return true;
  });
}

export function getAvailableOptions(wines: WineRow[]) {
  const countries = [...new Set(wines.map((w) => w.country))].sort();
  const subregions = [...new Set(wines.map((w) => w.subregion))].sort();
  const vintages = [
    ...new Set(wines.map((w) => w.vintage).filter((v): v is number => v !== null)),
  ].sort((a, b) => b - a);
  const grapeVarieties = [...new Set(wines.map((w) => w.grape_or_style))].sort();

  return {
    countries,
    subregions,
    vintages,
    grapeVarieties,
  };
}

export function getInitialFilters(): FilterState {
  return {
    priceRange: [0, 500000],
    wineTypes: [],
    countries: [],
    subregions: [],
    vintages: [],
    grapeVarieties: [],
    tanninRange: [1, 5],
    sweetnessRange: [1, 5],
    acidityRange: [1, 5],
    bodyRange: [1, 5],
    alcoholRange: [0, 25],
  };
}
