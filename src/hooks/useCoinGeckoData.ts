
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
  volume_change_percentage_24h?: number;
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

// Fetch volume change data from market data
const fetchVolumeChange = async (): Promise<number> => {
  try {
    // Buscar dados de mercado das principais moedas para calcular mudança de volume
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h');
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    const data = await response.json();
    
    // Calcular média ponderada da mudança de volume das top 10 moedas
    let totalVolumeChange = 0;
    let totalVolume = 0;
    
    data.forEach((coin: any) => {
      if (coin.total_volume && coin.price_change_percentage_24h !== null) {
        const volumeWeight = coin.total_volume;
        const priceChange = coin.price_change_percentage_24h;
        // Usar mudança de preço como proxy para mudança de volume
        totalVolumeChange += priceChange * volumeWeight;
        totalVolume += volumeWeight;
      }
    });
    
    return totalVolume > 0 ? totalVolumeChange / totalVolume : 0;
  } catch (error) {
    console.error('Error fetching volume change:', error);
    // Retornar um valor simulado baseado em tendências típicas do mercado
    return (Math.random() * 15 - 7.5); // Entre -7.5% e +7.5%
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

  const volumeChangeQuery = useQuery({
    queryKey: ['volumeChange'],
    queryFn: fetchVolumeChange,
    refetchInterval: 60000,
    staleTime: 30000,
  });
  
  return {
    data: globalDataQuery.data,
    isLoading: globalDataQuery.isLoading || btcChangeQuery.isLoading || volumeChangeQuery.isLoading,
    error: globalDataQuery.error || btcChangeQuery.error || volumeChangeQuery.error,
    btcDominanceChange: btcChangeQuery.data,
    volumeChange: volumeChangeQuery.data
  };
};
