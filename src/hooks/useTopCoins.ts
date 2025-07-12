import { useQuery } from '@tanstack/react-query';

interface TopCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

const fetchTopCoins = async (): Promise<TopCoin[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h'
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch top coins data');
  }
  
  return response.json();
};

export const useTopCoins = () => {
  return useQuery({
    queryKey: ['topCoins'],
    queryFn: fetchTopCoins,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 15000, // Considera os dados válidos por 15 segundos
  });
};