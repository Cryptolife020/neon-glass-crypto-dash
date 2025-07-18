
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
  market_cap_change_percentage_24h_usd: number;
  market_cap_change_24h: number;
  volume_change_percentage_24h: number;
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

// Fetch BTC data to get 24h change percentage for dominance
const fetchBtcData = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false');
    if (!response.ok) {
      throw new Error('Failed to fetch BTC data');
    }
    const data = await response.json();
    return data.market_data.market_cap_change_percentage_24h || 0;
  } catch (error) {
    console.error('Error fetching BTC dominance change:', error);
    return 0;
  }
};

export const useCoinGeckoData = () => {
  const globalDataQuery = useQuery({
    queryKey: ['coinGeckoGlobal'],
    queryFn: fetchGlobalData,
    refetchInterval: 60000, // Atualiza a cada 1 minuto
    staleTime: 30000, // Considera os dados válidos por 30 segundos
  });
  
  const btcChangeQuery = useQuery({
    queryKey: ['btcDominanceChange'],
    queryFn: fetchBtcData,
    refetchInterval: 60000,
    staleTime: 30000,
  });
  
  return {
    data: globalDataQuery.data,
    isLoading: globalDataQuery.isLoading || btcChangeQuery.isLoading,
    error: globalDataQuery.error || btcChangeQuery.error,
    btcDominanceChange: btcChangeQuery.data
  };
};
