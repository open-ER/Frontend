export interface WineRow {
  wine_name: string;
  country: string;
  subregion: string;
  vintage: number | null;
  wine_type: string;
  grape_or_style: string;
  alcohol: number | null;
  tannin: number | null;
  sweetness: number | null;
  acidity: number | null;
  body: number | null;
  aromas: string[];
  price_krw: number | null;
}

export interface FilterState {
  priceRange: [number, number];
  wineTypes: string[];
  countries: string[];
  subregions: string[];
  vintages: number[];
  grapeVarieties: string[];
  tanninRange: [number, number];
  sweetnessRange: [number, number];
  acidityRange: [number, number];
  bodyRange: [number, number];
  alcoholRange: [number, number];
}
