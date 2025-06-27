
import { useQuery } from '@tanstack/react-query';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface CoinGeckoResponse {
  data: CoinData[];
}

const fetchCoinData = async (coinId: string): Promise<CoinData> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=true&price_change_percentage=24h`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch coin data');
  }
  
  const data: CoinData[] = await response.json();
  return data[0];
};

export const useCoinData = (coinId: string) => {
  return useQuery({
    queryKey: ['coinData', coinId],
    queryFn: () => fetchCoinData(coinId),
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 15000, // Considera os dados válidos por 15 segundos
  });
};
