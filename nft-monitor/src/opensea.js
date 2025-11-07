const axios = require('axios');

async function getFloorPrices(collections) {
  if (collections.length > 50) {
    throw new Error('Максимум 50 коллекций');
  }

  const results = {};

  // Функция для задержки
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const promises = collections.map(async (slug) => {
    try {
      // Искусственная задержка 1-2 секунды перед каждым запросом
      await delay(Math.random() * 1000 + 1000);
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
