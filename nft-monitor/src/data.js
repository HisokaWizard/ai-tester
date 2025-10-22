const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function updatePrices(newPrices) {
  const data = await loadData();
  const now = new Date().toISOString();
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const changes = {};

  for (const [slug, price] of Object.entries(newPrices)) {
    if (!data[slug]) {
      data[slug] = { history: [] };
    }

    data[slug].history.push({ timestamp: now, price });

    // Очистка старых записей (старше 24 часов)
    data[slug].history = data[slug].history.filter(
      (entry) => entry.timestamp > oneDayAgo
    );

    const history = data[slug].history;

    // Расчет изменений за 4 часа
    const fourHourEntries = history.filter(
      (entry) => entry.timestamp >= fourHoursAgo
    );
    const oldestFourHour =
      fourHourEntries.length > 0 ? fourHourEntries[0].price : null;
    const fourHourChange = oldestFourHour
      ? ((price - oldestFourHour) / oldestFourHour) * 100
      : null;

    // Расчет суточных изменений
    const oldestEntry = history.length > 0 ? history[0].price : null;
    const dailyChange = oldestEntry
      ? ((price - oldestEntry) / oldestEntry) * 100
      : null;

    changes[slug] = {
      current: price,
      fourHourChange,
      dailyChange,
    };
  }

  await saveData(data);
  return changes;
}

module.exports = { loadData, saveData, updatePrices };
