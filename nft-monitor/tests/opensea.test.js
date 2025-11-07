const axios = require('axios');
const { getFloorPrices } = require('../src/opensea');

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios;

describe('getFloorPrices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать цены для коллекций', async () => {
    const collections = ['mutant-ape-yacht-club', 'variance-collection'];
    const mockResponse1 = { data: { total: { floor_price: 1.5 } } };
    const mockResponse2 = { data: { total: { floor_price: 2.0 } } };

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('mutant-ape-yacht-club'))
        return Promise.resolve(mockResponse1);
      if (url.includes('variance-collection'))
        return Promise.resolve(mockResponse2);
    });

    const result = await getFloorPrices(collections);

    expect(result).toEqual({
      'mutant-ape-yacht-club': 1.5,
      'variance-collection': 2.0,
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('должен возвращать null для коллекций с ошибкой', async () => {
    const collections = ['mutant-ape-yacht-club', 'variance-collection'];

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('mutant-ape-yacht-club'))
        return Promise.reject(new Error('API error'));
      if (url.includes('variance-collection'))
        return Promise.resolve({ data: { total: { floor_price: 2.0 } } });
    });

    const result = await getFloorPrices(collections);

    expect(result).toEqual({
      'mutant-ape-yacht-club': null,
      'variance-collection': 2.0,
    });
  });

  it('должен выбрасывать ошибку если коллекций больше 50', async () => {
    const collections = new Array(51).fill('collection');

    await expect(getFloorPrices(collections)).rejects.toThrow(
      'Максимум 50 коллекций'
    );
  });

  it('должен использовать правильный API ключ', async () => {
    process.env.OPENSEA_API_KEY = 'test-key';
    const collections = ['collection1'];

    mockedAxios.get.mockResolvedValue({
      data: { total: { floor_price: 1.0 } },
    });

    await getFloorPrices(collections);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.opensea.io/api/v2/collections/collection1/stats',
      {
        headers: {
          'X-API-KEY': 'test-key',
        },
      }
    );
  });
});
