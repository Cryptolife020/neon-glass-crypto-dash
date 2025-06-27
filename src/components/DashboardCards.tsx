import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { useCoinGeckoData } from "@/hooks/useCoinGeckoData";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ElementType;
  description?: string;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  isLoading,
}: StatCardProps) => {
  return (
    <div
      className="glass-card p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 group"
      data-oid="fh5u0qy"
    >
      <div
        className="flex items-start justify-between mb-3 lg:mb-4"
        data-oid="9q_cp:a"
      >
        <div className="flex items-center gap-2 lg:gap-3" data-oid="ofg4vmo">
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-neon-blue-400/20 to-neon-blue-600/20 rounded-xl flex items-center justify-center border border-neon-blue-400/30"
            data-oid="g:j21_6"
          >
            <Icon
              className="w-5 h-5 lg:w-6 lg:h-6 text-neon-blue-400"
              data-oid="-m5edhq"
            />
          </div>
          <div data-oid=".bt4owi">
            <h3
              className="text-gray-400 text-xs lg:text-sm font-medium"
              data-oid="a9bty38"
            >
              {title}
            </h3>
            {description && (
              <p
                className="text-gray-500 text-xs mt-1 hidden sm:block"
                data-oid="lq1ayiu"
              >
                {description}
              </p>
            )}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            changeType === "up"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
          data-oid="asv69mc"
        >
          {changeType === "up" ? (
            <TrendingUp className="w-3 h-3" data-oid="iodq_8_" />
          ) : (
            <TrendingDown className="w-3 h-3" data-oid="eab2sup" />
          )}
          <span className="text-xs font-medium" data-oid="rxh1pim">
            {change}
          </span>
        </div>
      </div>

      <div className="space-y-2" data-oid="i0h_oaf">
        <p
          className="text-xl lg:text-2xl font-bold text-white group-hover:text-neon-blue-400 transition-colors"
          data-oid="678i1_u"
        >
          {isLoading ? (
            <span
              className="animate-pulse bg-gray-600 rounded h-6 w-20 block"
              data-oid=".qeh3kl"
            ></span>
          ) : (
            value
          )}
        </p>
        {description && (
          <p className="text-gray-500 text-xs sm:hidden" data-oid="ycvszq4">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export const DashboardCards = () => {
  const { data, isLoading, error } = useCoinGeckoData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else {
      return formatCurrency(value);
    }
  };

  // Valores padrão em caso de erro ou carregamento
  const btcDominance = data?.market_cap_percentage.btc || 52.8;
  const marketCap = data?.total_market_cap.usd || 1850000000000;
  const volume24h = data?.total_volume.usd || 85000000000;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      data-oid="oug46_m"
    >
      <StatCard
        title="Dominância do BTC"
        value={`${btcDominance.toFixed(1)}%`}
        change="+2.4%"
        changeType="up"
        icon={Activity}
        description="Participação no mercado total"
        isLoading={isLoading}
        data-oid="eok12ox"
      />

      <StatCard
        title="Market Cap Total"
        value={formatVolume(marketCap)}
        change="+8.7%"
        changeType="up"
        icon={DollarSign}
        description="Capitalização de mercado"
        isLoading={isLoading}
        data-oid="5t53dv."
      />

      <StatCard
        title="Volume 24h"
        value={formatVolume(volume24h)}
        change="+5.2%"
        changeType="up"
        icon={TrendingUp}
        description="Volume de negociação"
        isLoading={isLoading}
        data-oid="y.ej9c1"
      />
    </div>
  );
};
