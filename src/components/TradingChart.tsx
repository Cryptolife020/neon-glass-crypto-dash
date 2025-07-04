import { useState } from "react";
import {
  TrendingUp,
  Maximize2,
  Settings,
  LineChart,
  CandlestickChart,
  BarChart3,
} from "lucide-react";
import { TradingViewWidget } from "./TradingViewWidget";
import { useCoinData } from "@/hooks/useCoinData";

export const TradingChart = () => {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [chartMode, setChartMode] = useState<"area" | "candles">("area");
  const [logarithmicScale, setLogarithmicScale] = useState(false);

  const tradingPairs = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "ADA/USDT"];

  // Map trading pairs to CoinGecko IDs
  const getCoinId = (pair: string) => {
    const coinMap: { [key: string]: string } = {
      "BTC/USDT": "bitcoin",
      "ETH/USDT": "ethereum",
      "BNB/USDT": "binancecoin",
      "ADA/USDT": "cardano",
    };
    return coinMap[pair] || "bitcoin";
  };

  const { data: coinData, isLoading } = useCoinData(getCoinId(selectedPair));

  const getTradingViewSymbol = (pair: string) => {
    const symbolMap: { [key: string]: string } = {
      "BTC/USDT": "BINANCE:BTCUSDT",
      "ETH/USDT": "BINANCE:ETHUSDT",
      "BNB/USDT": "BINANCE:BNBUSDT",
      "ADA/USDT": "BINANCE:ADAUSDT",
    };
    return symbolMap[pair] || "BINANCE:BTCUSDT";
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num?.toFixed(2) || "0.00"}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price || 0);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6" data-oid="55_wz7d">
        <div
          className="flex items-center justify-center h-80"
          data-oid="-a-p.km"
        >
          <div className="text-white" data-oid="xfxneh5">
            Carregando dados...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6" data-oid="p0qyb:z">
      <div
        className="flex items-center justify-between mb-6"
        data-oid="otnunkf"
      >
        <div className="flex items-center gap-4" data-oid="ug97.i-">
          <div className="flex items-center gap-2" data-oid="tkna6_b">
            {coinData?.image && (
              <img
                src={coinData.image}
                alt={coinData.name}
                className="w-8 h-8 rounded-full"
                data-oid="uxy6:d_"
              />
            )}
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-transparent text-white font-semibold text-lg focus:outline-none cursor-pointer"
              data-oid="5hhp20:"
            >
              {tradingPairs.map((pair) => (
                <option
                  key={pair}
                  value={pair}
                  className="bg-crypto-dark-200 text-white"
                  data-oid="paji6tn"
                >
                  {pair}
                </option>
              ))}
            </select>
          </div>

          <div
            className="flex items-center gap-2 text-white"
            data-oid="637eg_v"
          >
            <span className="text-2xl font-bold" data-oid=":azavet">
              {formatPrice(coinData?.current_price || 0)}
            </span>
            <div
              className={`flex items-center gap-1 ${
                (coinData?.price_change_percentage_24h || 0) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
              data-oid="z55m8jx"
            >
              <TrendingUp className="w-4 h-4" data-oid="9z2.-hp" />
              <span className="text-sm" data-oid="a9q_:wn">
                {(coinData?.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
                {coinData?.price_change_percentage_24h?.toFixed(2) || "0.00"}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3" data-oid="i718ais">
          {/* Chart Mode Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1" data-oid="u.h5.kp">
            <button
              onClick={() => setChartMode("area")}
              className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-2 ${
                chartMode === "area"
                  ? "bg-neon-blue-400 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              data-oid=":isjv_e"
            >
              <LineChart className="w-4 h-4" data-oid="sr0rl5r" />
              Linha
            </button>
            <button
              onClick={() => setChartMode("candles")}
              className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-2 ${
                chartMode === "candles"
                  ? "bg-neon-blue-400 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              data-oid="xsz33il"
            >
              <CandlestickChart className="w-4 h-4" data-oid="tt.:en0" />
              Velas
            </button>
          </div>

          {/* Scale Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1" data-oid="o9.rkv8">
            <button
              onClick={() => setLogarithmicScale(!logarithmicScale)}
              className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-2 ${
                logarithmicScale
                  ? "bg-yellow-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              data-oid="mm:v_yq"
            >
              <BarChart3 className="w-4 h-4" data-oid="6.exp9v" />
              Log
            </button>
          </div>

          <div className="flex gap-2" data-oid="0s-1x8c">
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              data-oid="66z421z"
            >
              <Settings className="w-4 h-4 text-gray-400" data-oid="7606c0y" />
            </button>
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              data-oid="9:bbd4o"
            >
              <Maximize2 className="w-4 h-4 text-gray-400" data-oid="gmd9v4j" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6" data-oid="xl_aq:u">
        <h2
          className="text-lg lg:text-xl font-bold text-white mb-4"
          data-oid=".c-1gfq"
        >
          Análise de Mercado
        </h2>
      </div>

      <TradingViewWidget
        symbol={getTradingViewSymbol(selectedPair)}
        theme="dark"
        chartType={chartMode}
        allowFullscreen={true}
        logarithmicScale={logarithmicScale}
        data-oid="ns1o648"
      />

      <div
        className="flex justify-between items-center mt-4 text-xs text-gray-400"
        data-oid="bheia4p"
      >
        <span data-oid="9ej3y52">
          Volume: {formatNumber(coinData?.total_volume || 0)}
        </span>
        <span data-oid="mej7lrp">
          24h Change:{" "}
          {(coinData?.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
          {coinData?.price_change_percentage_24h?.toFixed(2) || "0.00"}%
        </span>
        <span data-oid="5q831l1">
          Market Cap: {formatNumber(coinData?.market_cap || 0)}
        </span>
      </div>
    </div>
  );
};
