import axios from 'axios';
import { WineApiResponse, WineRow, FilterOptions, FilterRequest, FilterState } from '../types/wine';

const API_BASE_URL = 'http://opener-api.ap-northeast-2.elasticbeanstalk.com/';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getWines = async (page: number = 1): Promise<WineApiResponse> => {
    try {
        console.log(`[API] Fetching wines page ${page}...`);
        const response = await apiClient.get<WineApiResponse>(`/wines?page=${page}`);

        console.log(`[API] Page ${page} loaded: ${response.data.wines.length} wines (Total: ${response.data.total})`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch wines page ${page}:`, error);
        throw error;
    }
};

export const searchWines = async (searchTerm: string, page: number = 1): Promise<WineRow[]> => {
    try {
        if (!searchTerm.trim()) {
            return [];
        }

        console.log(`[API] Searching wines with term: "${searchTerm}", page: ${page}`);
        const response = await apiClient.get<WineApiResponse>(`/wines/search?keyword=${encodeURIComponent(searchTerm)}&page=${page}`);

        console.log(`[API] Search found ${response.data.wines.length} wines`);
        return response.data.wines;
    } catch (error) {
        console.error('Failed to search wines:', error);
        throw error;
    }
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
    try {
        console.log('[API] Fetching filter options...');
        const response = await apiClient.get<FilterOptions>('/wines/filter-options');

        console.log('[API] Filter options loaded:', {
            wine_types: response.data.wine_type.length,
            countries: response.data.country.length,
            vintages: response.data.vintage.length,
            grape_styles: response.data.grape_or_style.length,
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch filter options:', error);
        throw error;
    }
};

// FilterState를 API 요청 형식으로 변환
export const convertFilterStateToRequest = (filters: FilterState): Omit<FilterRequest, 'page'> => {
    const request: Omit<FilterRequest, 'page'> = {};

    // 가격 범위
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
        request.price_krw_min = filters.priceRange[0];
        request.price_krw_max = filters.priceRange[1];
    }

    // 와인 타입
    if (filters.wineTypes.length > 0) {
        request.wine_type = filters.wineTypes;
    }

    // 국가
    if (filters.countries.length > 0) {
        request.country = filters.countries;
    }

    // 빈티지
    if (filters.vintages.length > 0) {
        request.vintage = filters.vintages;
    }

    // 품종/스타일
    if (filters.grapeVarieties.length > 0) {
        request.grape_or_style = filters.grapeVarieties;
    }

    // 타닌
    if (filters.tanninRange[0] > 0 || filters.tanninRange[1] < 5) {
        request.tannin_min = filters.tanninRange[0];
        request.tannin_max = filters.tanninRange[1];
    }

    // 당도
    if (filters.sweetnessRange[0] > 0 || filters.sweetnessRange[1] < 5) {
        request.sweetness_min = filters.sweetnessRange[0];
        request.sweetness_max = filters.sweetnessRange[1];
    }

    // 산도
    if (filters.acidityRange[0] > 0 || filters.acidityRange[1] < 5) {
        request.acidity_min = filters.acidityRange[0];
        request.acidity_max = filters.acidityRange[1];
    }

    // 바디
    if (filters.bodyRange[0] > 0 || filters.bodyRange[1] < 5) {
        request.body_min = filters.bodyRange[0];
        request.body_max = filters.bodyRange[1];
    }

    // 알코올
    if (filters.alcoholRange[0] > 0 || filters.alcoholRange[1] < 25) {
        request.alcohol_min = filters.alcoholRange[0];
        request.alcohol_max = filters.alcoholRange[1];
    }

    return request;
};

// 필터링된 와인 목록 가져오기
export const getFilteredWines = async (filters: FilterState, page: number = 1): Promise<WineApiResponse> => {
    try {
        console.log(`[API] Fetching filtered wines page ${page}...`);

        const filterRequest: FilterRequest = {
            page,
            ...convertFilterStateToRequest(filters),
        };

        const response = await apiClient.post<WineApiResponse>('/wines/filter', filterRequest);

        console.log(`[API] Filtered page ${page} loaded: ${response.data.wines.length} wines (Total: ${response.data.total})`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch filtered wines page ${page}:`, error);
        throw error;
    }
};

// 선택한 와인들 비교
export const compareWines = async (ids: string[]): Promise<WineApiResponse> => {
    try {
        console.log(`[API] Comparing ${ids.length} wines...`);
        const response = await apiClient.post<WineApiResponse>('/wines/compare', { ids });
        console.log(`[API] Comparison loaded: ${response.data.wines.length} wines`);
        return response.data;
    } catch (error) {
        console.error('Failed to compare wines:', error);
        throw error;
    }
};

