import axios from 'axios';

interface CmcQuote {
  price: number;
  // ... другие поля котировки
}

interface CmcData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: CmcQuote; // Или другая валюта, если указана
  };
  // ... другие поля данных
}

interface CmcResponse {
  data: Record<string, CmcData>; // Обычно ключ - это ID или символ криптовалюты
  status: any; // Информация о статусе запроса
}

const getFromCoinMarketCupUrl = (token: string = 'BTC') =>
  `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${token}&convert=USD`;

export const getBitcoinPrice = async (state: any) => {
  const originalInput = `Оригинальный запрос пользователя: ${state.messages[state.messages.length - 1].content}`;
  const headers = {
    'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CUP_API_KEY,
    Accept: 'application/json',
  };

  try {
    console.log('Запрос цены Bitcoin к CoinMarketCap API...');
    const response = await axios.get<CmcResponse>(getFromCoinMarketCupUrl(), {
      headers,
    });

    // Проверяем успешность запроса на уровне HTTP
    if (response.status !== 200) {
      console.error(`Ошибка HTTP: ${response.status}`);
      return originalInput;
    }

    const data = response.data;

    // Проверяем статус ответа от CoinMarketCap
    if (data.status.error_code !== 0) {
      console.error(`Ошибка CoinMarketCap API: ${data.status.error_message}`);
      return originalInput;
    }

    // Извлекаем цену
    // data.data - это объект, где ключи - это символы (или ID). Для 'BTC' ключ будет 'BTC'.
    const btcData = data.data['BTC'];
    if (!btcData) {
      console.error('Данные для BTC не найдены в ответе.');
      return originalInput;
    }

    const price = btcData.quote.USD.price;
    console.log(`Текущая цена Bitcoin (BTC): $${price.toFixed(2)}`);
    return `${originalInput}, Цена биткоина: ${price}`;
  } catch (error: any) {
    console.log(error);
    return `${originalInput}, Ошибка: ${error}`;
  }
};
