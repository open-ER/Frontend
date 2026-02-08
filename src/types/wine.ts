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
  aromas: string[];
  tanninRange: [number, number];
  sweetnessRange: [number, number];
  acidityRange: [number, number];
  bodyRange: [number, number];
  alcoholRange: [number, number];
}

export interface FilterOptions {
  wine_type: string[];
  country: string[];
  vintage: number[];
  grape_or_style: string[];
}

export interface WineApiResponse {
  total: number;
  page: number;
  wines: WineRow[];
}

export interface FilterRequest {
  page: number;
  price_krw_min?: number;
  price_krw_max?: number;
  wine_type?: string[];
  country?: string[];
  vintage?: number[];
  grape_or_style?: string[];
  tannin_min?: number;
  tannin_max?: number;
  sweetness_min?: number;
  sweetness_max?: number;
  acidity_min?: number;
  acidity_max?: number;
  body_min?: number;
  body_max?: number;
  alcohol_min?: number;
  alcohol_max?: number;
}