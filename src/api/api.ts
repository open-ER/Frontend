import axios from 'axios';
import { WineApiResponse, WineRow } from '../types/wine';

const API_BASE_URL = 'https://opener-api.onrender.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getWines = async (limit: number = 100): Promise<WineApiResponse> => {
    try {
        // 1. First request to get total count and first page
        const firstResponse = await apiClient.get<WineApiResponse>(`/wines?page=1&per_page=100`);
        const { total, per_page, wines: firstPageWines } = firstResponse.data;

        // If limit is small, return what we have (or if total is small)
        if (limit <= 100 || total <= 100) {
            return firstResponse.data;
        }

        // 2. Calculate how many pages we need
        // limit is the target number of items we want.
        // If limit is 10000, we want everything up to 10000.
        const targetCount = Math.min(limit, total);
        const totalPages = Math.ceil(targetCount / 100); // server seems to default to 100 per page

        if (totalPages <= 1) {
            return firstResponse.data;
        }

        // 3. Fetch remaining pages in batches to avoid browser throttling
        // We have pages 2 to totalPages
        const BATCH_SIZE = 5;
        const remainingPages = [];
        for (let i = 2; i <= totalPages; i++) {
            remainingPages.push(i);
        }

        console.log(`[API] Total items: ${total}, Limit: ${limit}, Total pages to fetch: ${totalPages}`);
        console.log(`[API] Starting batch fetch with size ${BATCH_SIZE}...`);

        let collectedWines = [...firstPageWines];
        let responses = [];

        // Process in batches
        for (let i = 0; i < remainingPages.length; i += BATCH_SIZE) {
            const batch = remainingPages.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(page =>
                apiClient.get<WineApiResponse>(`/wines?page=${page}&per_page=100`)
                    .then(res => ({ success: true, data: res.data, page }))
                    .catch(e => {
                        console.error(`[API] Failed to fetch page ${page}`, e);
                        return { success: false, data: null, page };
                    })
            );

            // Wait for current batch
            const batchResults = await Promise.all(batchPromises);

            // Collect successful results immediately to update logs/progress if we wanted, 
            // but here we just collect them to matching the previous structure or just accumulate.
            // Let's accumulate to a list to be compatible with existing code structure or just push to collectedWines.
            batchResults.forEach(res => {
                if (res.success && res.data) {
                    responses.push({ data: res.data }); // Adapter to match previous structure
                }
            });

            console.log(`[API] Processed batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(remainingPages.length / BATCH_SIZE)}. Accumulated responses: ${responses.length}`);

            // Small delay to be nice to the network/browser
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 4. Combine all wines
        let allWines = [...firstPageWines];
        responses.forEach(res => {
            allWines = [...allWines, ...res.data.wines];
        });

        console.log(`[API] Total reported by server: ${total}`);
        console.log(`[API] Total fetched: ${allWines.length}`);

        // 5. Trim to limit if necessary (though pages logic mostly handles it)
        if (allWines.length > limit) {
            allWines = allWines.slice(0, limit);
        }

        return {
            ...firstResponse.data,
            wines: allWines
        };

    } catch (error) {
        console.error('Failed to fetch wines:', error);
        throw error;
    }
};
