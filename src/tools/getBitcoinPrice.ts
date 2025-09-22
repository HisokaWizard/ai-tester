import axios from 'axios';

interface CmcQuote {
  price: number;
}

interface CmcData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: CmcQuote;
  };
}

interface CmcResponse {
  data: Record<string, CmcData>;
  status: any;
}

const getFromCoinMarketCupUrl = (token: string = 'BTC') =>
  `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${token}&convert=USD`;

export const getBitcoinPrice = async (input: string) => {
  const headers = {
    'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CUP_API_KEY,
    Accept: 'application/json',
  };

  try {
    console.log('Запрос цены Bitcoin к CoinMarketCap API...');
    const response = await axios.get<CmcResponse>(getFromCoinMarketCupUrl(), {
      headers,
    });

    if (response.status !== 200) {
      console.error(`Ошибка HTTP: ${response.status}`);
      return input;
    }

    const data = response.data;

    if (data.status.error_code !== 0) {
      console.error(`Ошибка CoinMarketCap API: ${data.status.error_message}`);
      return input;
    }

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
