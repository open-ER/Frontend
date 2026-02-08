
const axios = require('axios');

async function checkTotal() {
    try {
        const response = await axios.get('https://opener-api.ap-northeast-2.elasticbeanstalk.com/wines?page=1&per_page=100');
        console.log('Total wines reported by API:', response.data.total);
        console.log('Wines in first page:', response.data.wines.length);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

checkTotal();
