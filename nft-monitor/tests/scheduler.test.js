const cron = require('node-cron');
const { getFloorPrices } = require('../src/opensea');
const { updatePrices } = require('../src/data');
const { sendAlertReport } = require('../src/email');

// Импортируем модуль после установки переменных окружения

// Мокаем переменные окружения перед импортом модуля
process.env.EMAIL_RECIPIENTS = JSON.stringify({
  hisoka: 'hisoka@example.com',
  fedor: 'fedor@example.com',
});

process.env.EMAIL_FROM = 'test@example.com';

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

    await updatePricesJob();

    expect(mockedGetFloorPrices).toHaveBeenCalledWith([
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
    ]);
    expect(mockedUpdatePrices).toHaveBeenCalledWith(mockPrices);
    expect(mockedSendAlertReport).not.toHaveBeenCalled();
  });

  it('должен отправлять алерты только для коллекций получателя', async () => {
    const mockPrices = {
      'mutant-ape-yacht-club': 1.5,
      'otherside-koda': 2.0,
      'variance-collection': 3.0,
    };
    const mockChanges = {
      'mutant-ape-yacht-club': {
        current: 1.5,
        fourHourChange: 15,
        dailyChange: 5,
      },
      'otherside-koda': { current: 2.0, fourHourChange: 12, dailyChange: 2 },
      'variance-collection': {
        current: 3.0,
        fourHourChange: 5,
        dailyChange: 1,
      },
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    // Проверяем, что алерты отправлены только для соответствующих получателей
    expect(mockedSendAlertReport).toHaveBeenCalledTimes(2);

    // Для hisoka: только mutant-ape-yacht-club
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'mutant-ape-yacht-club',
          { current: 1.5, fourHourChange: 15, dailyChange: 5 },
        ],
      ],
      'hisoka@example.com'
    );

    // Для fedor: только otherside-koda
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'otherside-koda',
          { current: 2.0, fourHourChange: 12, dailyChange: 2 },
        ],
      ],
      'fedor@example.com'
    );
  });

  it('должен отправлять алерты только для коллекций получателя', async () => {
    const mockPrices = {
      'mutant-ape-yacht-club': 1.5,
      'otherside-koda': 2.0,
      'variance-collection': 3.0,
    };
    const mockChanges = {
      'mutant-ape-yacht-club': {
        current: 1.5,
        fourHourChange: 15,
        dailyChange: 5,
      },
      'otherside-koda': { current: 2.0, fourHourChange: 12, dailyChange: 2 },
      'variance-collection': {
        current: 3.0,
        fourHourChange: 5,
        dailyChange: 1,
      },
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    // Проверяем, что алерты отправлены только для соответствующих получателей
    expect(mockedSendAlertReport).toHaveBeenCalledTimes(2);

    // Для hisoka: только mutant-ape-yacht-club
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'mutant-ape-yacht-club',
          { current: 1.5, fourHourChange: 15, dailyChange: 5 },
        ],
      ],
      'hisoka@example.com'
    );

    // Для fedor: только otherside-koda
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'otherside-koda',
          { current: 2.0, fourHourChange: 12, dailyChange: 2 },
        ],
      ],
      'fedor@example.com'
    );
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

    expect(mockedSendAlertReport).not.toHaveBeenCalled();
  });

  it('должен отправлять алерт только для значительных изменений', async () => {
    const mockPrices = { 'mutant-ape-yacht-club': 1.5, 'otherside-koda': 2.0 };
    const mockChanges = {
      'mutant-ape-yacht-club': {
        current: 1.5,
        fourHourChange: 15,
        dailyChange: 5,
      }, // > 10%
      'otherside-koda': { current: 2.0, fourHourChange: 8, dailyChange: 2 }, // < 10%
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    // Проверяем, что алерт отправлен для hisoka, так как mutant-ape-yacht-club входит в его коллекции
    expect(mockedSendAlertReport).toHaveBeenCalledTimes(1);
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'mutant-ape-yacht-club',
          { current: 1.5, fourHourChange: 15, dailyChange: 5 },
        ],
      ],
      'hisoka@example.com'
    );
  });

  it('не должен отправлять алерты если нет получателей', async () => {
    // Временно изменяем EMAIL_RECIPIENTS
    const originalRecipients = process.env.EMAIL_RECIPIENTS;
    process.env.EMAIL_RECIPIENTS = '{}';

    // Перезагружаем модуль scheduler
    jest.resetModules();
    const { updatePricesJob: newUpdatePricesJob } = require('../src/scheduler');

    const mockPrices = { 'mutant-ape-yacht-club': 1.5 };
    const mockChanges = {
      'mutant-ape-yacht-club': {
        current: 1.5,
        fourHourChange: 15,
        dailyChange: 5,
      },
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await newUpdatePricesJob();

    expect(mockedSendAlertReport).not.toHaveBeenCalled();

    // Восстанавливаем оригинальные настройки
    process.env.EMAIL_RECIPIENTS = originalRecipients;
  });

  it('должен корректно фильтровать изменения по получателям', async () => {
    const mockPrices = {
      'mutant-ape-yacht-club': 1.5,
      'otherside-koda': 2.0,
      'variance-collection': 3.0,
      grillzgang: 4.0,
    };
    const mockChanges = {
      'mutant-ape-yacht-club': {
        current: 1.5,
        fourHourChange: 15,
        dailyChange: 5,
      },
      'otherside-koda': { current: 2.0, fourHourChange: 12, dailyChange: 2 },
      'variance-collection': {
        current: 3.0,
        fourHourChange: 8,
        dailyChange: 1,
      },
      grillzgang: { current: 4.0, fourHourChange: 25, dailyChange: 3 },
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    // Проверяем, что алерты отправлены только для соответствующих коллекций
    expect(mockedSendAlertReport).toHaveBeenCalledTimes(2);

    // Для hisoka: mutant-ape-yacht-club (15% > 10%)
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'mutant-ape-yacht-club',
          { current: 1.5, fourHourChange: 15, dailyChange: 5 },
        ],
      ],
      'hisoka@example.com'
    );

    // Для fedor: otherside-koda (12% > 10%) и grillzgang (25% > 10%)
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'otherside-koda',
          { current: 2.0, fourHourChange: 12, dailyChange: 2 },
        ],
        ['grillzgang', { current: 4.0, fourHourChange: 25, dailyChange: 3 }],
      ],
      'fedor@example.com'
    );
  });

  it('должен отправлять персонализированные алерты каждому получателю', async () => {
    const mockPrices = {
      'mutant-ape-yacht-club': 1.5,
      'otherside-koda': 2.0,
      'variance-collection': 3.0,
    };
    const mockChanges = {
      'mutant-ape-yacht-club': {
        current: 1.5,
        fourHourChange: 15,
        dailyChange: 5,
      },
      'otherside-koda': { current: 2.0, fourHourChange: 12, dailyChange: 2 },
      'variance-collection': {
        current: 3.0,
        fourHourChange: 5,
        dailyChange: 1,
      }, // < 10%
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    // Проверяем вызовы для каждого получателя
    expect(mockedSendAlertReport).toHaveBeenCalledTimes(2);

    // Для hisoka: mutant-ape-yacht-club (15% > 10%)
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'mutant-ape-yacht-club',
          { current: 1.5, fourHourChange: 15, dailyChange: 5 },
        ],
      ],
      'hisoka@example.com'
    );

    // Для fedor: otherside-koda (12% > 10%)
    expect(mockedSendAlertReport).toHaveBeenCalledWith(
      [
        [
          'otherside-koda',
          { current: 2.0, fourHourChange: 12, dailyChange: 2 },
        ],
      ],
      'fedor@example.com'
    );
  });

  it('не должен отправлять алерты, если нет значительных изменений для получателя', async () => {
    const mockPrices = { 'variance-collection': 3.0 };
    const mockChanges = {
      'variance-collection': {
        current: 3.0,
        fourHourChange: 5,
        dailyChange: 1,
      }, // < 10%
    };

    mockedGetFloorPrices.mockResolvedValue(mockPrices);
    mockedUpdatePrices.mockResolvedValue(mockChanges);

    await updatePricesJob();

    // Нет значительных изменений, алерты не отправляются
    expect(mockedSendAlertReport).not.toHaveBeenCalled();
  });
});

// Тесты для cron job настроек можно добавить, но они требуют мокинга cron.schedule
// Поскольку cron job запускаются автоматически при импорте модуля, тестирование может быть сложным
