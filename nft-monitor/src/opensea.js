const axios = require('axios');

async function getFloorPrices(collections) {
  if (collections.length > 25) {
    throw new Error('Максимум 25 коллекций');
  }

  const results = {};

  const promises = collections.map(async (slug) => {
    try {
      const response = await axios.get(
        `https://api.opensea.io/api/v2/collections/${slug}/stats`,
        {
          headers: {
            'X-API-KEY': process.env.OPENSEA_API_KEY,
          },
        }
      );
      const floorPrice = response.data.total.floor_price;
      results[slug] = floorPrice;
    } catch (error) {
      console.error(`Ошибка при получении данных для ${slug}:`, error.message);
      results[slug] = null;
    }
  });

  await Promise.all(promises);
  return results;
}

module.exports = { getFloorPrices };
