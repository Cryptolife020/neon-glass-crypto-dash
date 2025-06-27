
import { useQuery } from '@tanstack/react-query';

interface GlobalData {
  market_cap_percentage: {
    btc: number;
  };
  total_market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
}

interface CoinGeckoGlobalResponse {
  data: GlobalData;
}

const fetchGlobalData = async (): Promise<GlobalData> => {
  const response = await fetch('https://api.coingecko.com/api/v3/global');
  if (!response.ok) {
    throw new Error('Failed to fetch global data');
  }
  const data: CoinGeckoGlobalResponse = await response.json();
  return data.data;
};

export const useCoinGeckoData = () => {
  return useQuery({
    queryKey: ['coinGeckoGlobal'],
    queryFn: fetchGlobalData,
    refetchInterval: 60000, // Atualiza a cada 1 minuto
    staleTime: 30000, // Considera os dados válidos por 30 segundos
  });
};
