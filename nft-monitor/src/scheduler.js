const cron = require('node-cron');
const { getFloorPrices } = require('./opensea');
const { updatePrices } = require('./data');
const { sendAlertReport, sendDailyReport } = require('./email');

// Парсинг переменной окружения EMAIL_RECIPIENTS как JSON-объекта
const EMAIL_RECIPIENTS = JSON.parse(process.env.EMAIL_RECIPIENTS || '{}');

// Объект nft_mapping с примерами
const nft_mapping = {
  hisoka: [
    'mutant-ape-yacht-club',
    'variance-collection',
    'otherdeed-expanded',
    'otherside-koda',
    'quills-adventure-somnia',
    'grillzgang',
    'pepeverse-drop',
    'pudgypenguins',
    'lilpudgys',
    'boredapeyachtclub',
    'uprising-genesis-origins',
    'somzies-somnia',
    'pixcape-genesis-pass-somnia',
    'invasion-heroes-pfp',
  ],
  fedor: [
    'mutant-ape-yacht-club',
    'variance-collection',
    'otherdeed-expanded',
    'otherside-koda',
    'quills-adventure-somnia',
    'grillzgang',
    'pudgypenguins',
    'lilpudgys',
    'boredapeyachtclub',
    'hv-mtl',
    'clonex',
    'uprising-genesis-origins',
    'gemesis',
    'new-eden-keycard',
    'sr-bounty-hunters',
    'marsaliencats',
    'somzies-somnia',
    'neuronemesis',
    'mullet-cop',
    'pixcape-genesis-pass-somnia',
    'the-sons-of-evil-13141351',
    'invasion-heroes-pfp',
    'gs-on-ape',
    'jnkyz',
    'nightglyders',
    'allopass',
    'not-a-punks-cult',
    'stargirl-salon',
    'degen-ape',
    'op-wearables',
    'foxyfits',
    'dawn-of-the-duck-2',
    'foxyfam',
    'yuppie-apes',
    'ngmi-goobs',
  ],
};

// Список коллекций для мониторинга (не более 25)
const COLLECTIONS = [
  'mutant-ape-yacht-club',
  'variance-collection',
  'otherdeed-expanded',
  'otherside-koda',
  'quills-adventure-somnia',
  'grillzgang',
  'pepeverse-drop',
  'pudgypenguins',
  'lilpudgys',
  'boredapeyachtclub',
  'hv-mtl',
  'clonex',
  'uprising-genesis-origins',
  'gemesis',
  'new-eden-keycard',
  'sr-bounty-hunters',
  'marsaliencats',
  'somzies-somnia',
  'neuronemesis',
  'mullet-cop',
  'pixcape-genesis-pass-somnia',
  'the-sons-of-evil-13141351',
  'invasion-heroes-pfp',
  'gs-on-ape',
  'jnkyz',
  'nightglyders',
  'allopass',
  'not-a-punks-cult',
  'stargirl-salon',
  'degen-ape',
  'op-wearables',
  'foxyfits',
  'dawn-of-the-duck-2',
  'foxyfam',
  'yuppie-apes',
  'ngmi-goobs',
];

// Основная функция обновления цен
async function updatePricesJob() {
  try {
    console.log('Запуск обновления цен...');
    console.log('COLLECTIONS:', COLLECTIONS);
    console.log('EMAIL_RECIPIENTS:', EMAIL_RECIPIENTS);

    // Получение цен
    const newPrices = await getFloorPrices(COLLECTIONS);
    console.log('Цены получены:', newPrices);

    // Обновление данных
    const changes = await updatePrices(newPrices);
    console.log('Изменения рассчитаны:', changes);

    // Отправка алерта при изменениях >10%
    const significantChanges = Object.entries(changes || {}).filter(
      ([slug, data]) => {
        return data.fourHourChange && Math.abs(data.fourHourChange) > 10;
      }
    );

    // Отправка персонализированных алертов каждому получателю
    for (const [recipientKey, recipientEmail] of Object.entries(
      EMAIL_RECIPIENTS
    )) {
      const recipientCollections = nft_mapping[recipientKey] || [];
      console.log(
        `Для ${recipientKey} (${recipientEmail}): коллекции`,
        recipientCollections
      );
      const filteredSignificantChanges = significantChanges.filter(([slug]) =>
        recipientCollections.includes(slug)
      );
      console.log(
        `Фильтрованные изменения для ${recipientKey}:`,
        filteredSignificantChanges
      );
      if (filteredSignificantChanges.length > 0) {
        console.log(`Отправка алерта для ${recipientKey}`);
        await sendAlertReport(filteredSignificantChanges, recipientEmail);
      } else {
        console.log(`Нет значительных изменений для ${recipientKey}`);
      }
    }

    console.log('Обновление завершено');
  } catch (error) {
    console.error('Ошибка в updatePricesJob:', error);
  }
}

// Настройка cron job для запуска каждые 4 часа
cron.schedule('0 */4 * * *', () => {
  updatePricesJob();
});

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

    // Отправка персонализированных ежедневных отчетов каждому получателю
    for (const [recipientKey, recipientEmail] of Object.entries(
      EMAIL_RECIPIENTS
    )) {
      const recipientCollections = nft_mapping[recipientKey] || [];
      const filteredChanges = Object.fromEntries(
        Object.entries(changes).filter(([slug]) =>
          recipientCollections.includes(slug)
        )
      );
      if (Object.keys(filteredChanges).length > 0) {
        await sendDailyReport(filteredChanges, recipientEmail);
      }
    }
    console.log('Ежедневный отчет отправлен');
  } catch (error) {
    console.error('Ошибка в ежедневном отчете:', error);
  }
});

console.log('Scheduler initialized');

module.exports = { updatePricesJob };
