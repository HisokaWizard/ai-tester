const cron = require('node-cron');
const { getFloorPrices } = require('./opensea');
const { updatePrices } = require('./data');
const { sendAlertReport, sendDailyReport } = require('./email');

// Список коллекций для мониторинга (не более 25)
const COLLECTIONS = [
  'mutant-ape-yacht-club',
  'variance-collection',
  'otherdeed-expanded',
  'otherside-koda',
  'quills-adventure-somnia',
  'grillzgang',
  'bambilands',
  'pepeverse-drop',
];

// Основная функция обновления цен
async function updatePricesJob() {
  try {
    console.log('Запуск обновления цен...');

    // Получение цен
    const newPrices = await getFloorPrices(COLLECTIONS);
    console.log('Цены получены:', newPrices);

    // Обновление данных
    const changes = await updatePrices(newPrices);
    console.log('Изменения рассчитаны:', changes);

    // Отправка алерта при изменениях >10%
    const significantChanges = Object.entries(changes).filter(
      ([slug, data]) => {
        return data.fourHourChange && Math.abs(data.fourHourChange) > 10;
      }
    );

    await sendAlertReport(significantChanges);

    console.log('Обновление завершено');
  } catch (error) {
    console.error('Ошибка в updatePricesJob:', error);
  }
}

// Настройка cron job для запуска каждые 4 часа
cron.schedule('0 */4 * * *', () => {
  updatePricesJob();
});

// Настройка cron job для запуска каждые 2 минуты
// cron.schedule('*/2 * * * *', () => {
//   updatePricesJob();
// });

// Настройка cron job для ежедневного отчета в 9:00 утра
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Запуск ежедневного отчета...');
    const { loadData } = require('./data');
    const data = await loadData();
    const now = new Date().toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const changes = {};

    for (const [slug, collectionData] of Object.entries(data)) {
      const history = collectionData.history.filter(
        (entry) => entry.timestamp >= oneDayAgo
      );
      if (history.length === 0) continue;

      const oldestPrice = history[0].price;
      const latestPrice = history[history.length - 1].price;
      const dailyChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;

      changes[slug] = {
        current: latestPrice,
        dailyChange,
      };
    }

    await sendDailyReport(changes);
    console.log('Ежедневный отчет отправлен');
  } catch (error) {
    console.error('Ошибка в ежедневном отчете:', error);
  }
});

console.log(
  'Планировщик запущен. Обновление цен каждые 4 часа и каждые 2 минуты. Ежедневный отчет в 9:00.'
);

module.exports = { updatePricesJob };
