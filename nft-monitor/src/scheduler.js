const cron = require('node-cron');
const { getFloorPrices } = require('./opensea');
const { updatePrices } = require('./data');
const { sendAlertReport, sendDailyReport } = require('./email');
const fs = require('fs');

const EMAIL_RECIPIENTS = JSON.parse(
  fs.readFileSync('email.config.json', 'utf8')
);

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
    'somzies-somnia',
    'invasion-heroes-pfp',
    'mullet-cop',
    'the-sons-of-evil-13141351',
    'capygame-417488844',
    'neuronemesis',
    'op-wearables',
    'mintotaurs-ape',
    'foxyfam',
    'oppass',
    'founder-simulator-genesis',
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
    'otterful-otters',
    'capygame-417488844',
    'oppass',
    'founder-simulator-genesis',
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
  'otterful-otters',
  'mintotaurs-ape',
  'oppass',
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
    const significantChanges = Object.entries(changes || {}).filter(
      ([slug, data]) => {
        return data.fourHourChange && Math.abs(data.fourHourChange) > 10;
      }
    );

    // Отправка персонализированных алертов каждому получателю
    for (const [_baseKey, recipient] of Object.entries(EMAIL_RECIPIENTS)) {
      const { key, email } = recipient;
      const recipientCollections = nft_mapping[key] || [];
      console.log(`Для ${key} (${email}): коллекции`, recipientCollections);
      const filteredSignificantChanges = significantChanges.filter(([slug]) =>
        recipientCollections.includes(slug)
      );
      console.log(
        `Фильтрованные изменения для ${key}:`,
        filteredSignificantChanges
      );
      if (filteredSignificantChanges.length > 0) {
        console.log(`Отправка алерта для ${key}`);
        await sendAlertReport(filteredSignificantChanges, email);
      } else {
        console.log(`Нет значительных изменений для ${key}`);
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
    for (const [_baseKey, recipient] of Object.entries(EMAIL_RECIPIENTS)) {
      const { key, email } = recipient;
      const recipientCollections = nft_mapping[key] || [];
      const filteredChanges = Object.fromEntries(
        Object.entries(changes).filter(([slug]) =>
          recipientCollections.includes(slug)
        )
      );
      if (Object.keys(filteredChanges).length > 0) {
        await sendDailyReport(filteredChanges, email);
      }
    }
    console.log('Ежедневный отчет отправлен');
  } catch (error) {
    console.error('Ошибка в ежедневном отчете:', error);
  }
});

console.log('Scheduler initialized');

module.exports = { updatePricesJob };
