const fs = require('fs').promises;
const path = require('path');
const { loadData, saveData, updatePrices } = require('../src/data');

// Мокаем fs
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockedFs = fs;

describe('loadData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать распарсенный JSON', async () => {
    const mockData = { collection1: { history: [] } };
    mockedFs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const result = await loadData();

    expect(result).toEqual(mockData);
    expect(mockedFs.readFile).toHaveBeenCalledWith(
      path.join(__dirname, '..', 'data.json'),
      'utf8'
    );
  });

  it('должен возвращать пустой объект при ошибке', async () => {
    mockedFs.readFile.mockRejectedValue(new Error('File not found'));

    const result = await loadData();

    expect(result).toEqual({});
  });
});

describe('saveData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен сохранять данные в JSON формате', async () => {
    const data = { collection1: { history: [] } };

    await saveData(data);

    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      path.join(__dirname, '..', 'data.json'),
      JSON.stringify(data, null, 2)
    );
  });
});

describe('updatePrices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('должен обновлять цены и рассчитывать изменения', async () => {
    const existingData = {
      collection1: {
        history: [
          { timestamp: '2023-01-01T08:00:00.000Z', price: 1.0 },
          { timestamp: '2023-01-01T10:00:00.000Z', price: 1.2 },
        ],
      },
    };
    const newPrices = { collection1: 1.5 };

    mockedFs.readFile.mockResolvedValue(JSON.stringify(existingData));

    const result = await updatePrices(newPrices);

    expect(result).toEqual({
      collection1: {
        current: 1.5,
        fourHourChange: 50, // (1.5 - 1.0) / 1.0 * 100 (первый в истории)
        dailyChange: 50, // (1.5 - 1.0) / 1.0 * 100
      },
    });

    expect(mockedFs.writeFile).toHaveBeenCalled();
  });

  it('должен создавать новую коллекцию если её нет', async () => {
    mockedFs.readFile.mockResolvedValue(JSON.stringify({}));

    const newPrices = { collection1: 1.0 };

    const result = await updatePrices(newPrices);

    expect(result).toEqual({
      collection1: {
        current: 1.0,
        fourHourChange: 0,
        dailyChange: 0,
      },
    });
  });

  it('должен очищать старые записи (старше 24 часов)', async () => {
    const existingData = {
      collection1: {
        history: [
          { timestamp: '2022-12-31T12:00:00.000Z', price: 1.0 }, // старше 24 часов
          { timestamp: '2023-01-01T10:00:00.000Z', price: 1.2 },
        ],
      },
    };
    const newPrices = { collection1: 1.5 };

    mockedFs.readFile.mockResolvedValue(JSON.stringify(existingData));

    await updatePrices(newPrices);

    const savedData = JSON.parse(mockedFs.writeFile.mock.calls[0][1]);
    expect(savedData.collection1.history).toHaveLength(2); // старый удален, новый добавлен
    expect(savedData.collection1.history[0].timestamp).toBe(
      '2023-01-01T10:00:00.000Z'
    );
    expect(savedData.collection1.history[1].timestamp).toBe(
      '2023-01-01T12:00:00.000Z'
    );
  });
});
