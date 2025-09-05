import { AgentState } from '../agent-template/agent-template';
import axios from 'axios';
import { NodeCallback } from './types';

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

export const getBitcoinPrice: NodeCallback = async (state: AgentState) => {
  const input: string = state.messages[state.messages.length - 1]
    .content as string;
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
      return input;
    }

    const data = response.data;

    // Проверяем статус ответа от CoinMarketCap
    if (data.status.error_code !== 0) {
      console.error(`Ошибка CoinMarketCap API: ${data.status.error_message}`);
      return input;
    }

    // Извлекаем цену
    // data.data - это объект, где ключи - это символы (или ID). Для 'BTC' ключ будет 'BTC'.
    const btcData = data.data['BTC'];
    if (!btcData) {
      console.error('Данные для BTC не найдены в ответе.');
      return input;
    }

    const price = btcData.quote.USD.price;
    console.log(`Текущая цена Bitcoin (BTC): $${price.toFixed(2)}`);
    return `${input}, Цена биткоина: ${price} в подарок!`;
  } catch (error: any) {
    console.log(error);
    return `${input}, Ошибка: ${error}`;
  }
};
