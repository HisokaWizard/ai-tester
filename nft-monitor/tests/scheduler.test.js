const cron = require('node-cron');
const { getFloorPrices } = require('../src/opensea');
const { updatePrices } = require('../src/data');
const { sendAlertReport } = require('../src/email');
const { updatePricesJob } = require('../src/scheduler');

// Мокаем зависимости
jest.mock('node-cron');
jest.mock('../src/opensea');
jest.mock('../src/data');
jest.mock('../src/email');

const mockedCron = cron;
const mockedGetFloorPrices = getFloorPrices;
const mockedUpdatePrices = updatePrices;
const mockedSendAlertReport = sendAlertReport;

describe('updatePricesJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен успешно обновлять цены и отправлять алерты', async () => {
    const mockPrices = { collection1: 1.5, collection2: 2.0 };
    const mockChanges = {
      collection1: { current: 1.5, fourHourChange: 10, dailyChange: 5 },
      collection2: { current: 2.0, fourHourChange: -5, dailyChange: 2 },
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await updatePricesJob();

    expect(mockedGetFloorPrices).toHaveBeenCalledWith([
      'mutant-ape-yacht-club',
      'variance-collection',
      'otherdeed-expanded',
      'otherside-koda',
      'quills-adventure-somnia',
      'grillzgang',
      'bambilands',
      'pepeverse-drop',
    ]);
    expect(mockedUpdatePrices).toHaveBeenCalledWith(mockPrices);
    expect(mockedSendAlertReport).toHaveBeenCalledWith([]);
    expect(consoleSpy).toHaveBeenCalledWith('Запуск обновления цен...');
    expect(consoleSpy).toHaveBeenCalledWith('Цены получены:', mockPrices);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Изменения рассчитаны:',
      mockChanges
    );
    expect(consoleSpy).toHaveBeenCalledWith('Обновление завершено');

    consoleSpy.mockRestore();
  });

  it('должен логировать ошибку при неудаче', async () => {
    mockedGetFloorPrices.mockRejectedValue(new Error('API error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await updatePricesJob();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Ошибка в updatePricesJob:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('не должен отправлять алерт если нет значительных изменений', async () => {
    const mockPrices = { collection1: 1.5 };
    const mockChanges = {
      collection1: { current: 1.5, fourHourChange: 5, dailyChange: 2 }, // < 10%
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    expect(mockedSendAlertReport).toHaveBeenCalledWith([]);
  });

  it('должен отправлять алерт только для значительных изменений', async () => {
    const mockPrices = { collection1: 1.5, collection2: 2.0 };
    const mockChanges = {
      collection1: { current: 1.5, fourHourChange: 15, dailyChange: 5 }, // > 10%
      collection2: { current: 2.0, fourHourChange: 8, dailyChange: 2 }, // < 10%
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    expect(mockedSendAlertReport).toHaveBeenCalledWith([
      ['collection1', { current: 1.5, fourHourChange: 15, dailyChange: 5 }],
    ]);
  });
});

// Тесты для cron job настроек можно добавить, но они требуют мокинга cron.schedule
// Поскольку cron job запускаются автоматически при импорте модуля, тестирование может быть сложным
// Для простоты пропустим детальное тестирование cron настроек
