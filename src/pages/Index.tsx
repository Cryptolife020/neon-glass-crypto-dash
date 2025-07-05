import { useState } from "react";
import { CryptoSidebar } from "@/components/CryptoSidebar";
import { DashboardCards } from "@/components/DashboardCards";
import { TradingChart } from "@/components/TradingChart";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { SpinningCoin } from "@/components/SpinningCoin";
import DayTradeSystem from "@/components/DayTradeSystem";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Target, LogOut } from "lucide-react";


const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Render the DayTradeSystem component when the activeItem is "daytrade"
  if (activeItem === "daytrade") {
    return (
      <div className="min-h-screen flex w-full glass-background relative overflow-x-hidden">
        <CryptoSidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
        
        {/* Notifications - Absolute position top right */}
        <div className="absolute top-2 right-4 z-50 flex items-center gap-3">
          <NotificationsPanel />
          <button
            onClick={handleLogout}
            className="px-3 lg:px-4 py-2 glass-card rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 group flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-red-400 transition-colors hidden sm:inline">
              Sair
            </span>
          </button>
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 lg:ml-0 ml-0 max-w-full overflow-x-hidden">
          <DayTradeSystem />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full glass-background relative overflow-x-hidden">
      <CryptoSidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />

      {/* Notifications - Absolute position top right */}
      <div className="absolute top-2 right-4 z-50 flex items-center gap-3">
        <NotificationsPanel />
        <button
          onClick={handleLogout}
          className="px-3 lg:px-4 py-2 glass-card rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 group flex items-center gap-2"
        >
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
          <span className="text-sm text-gray-400 group-hover:text-red-400 transition-colors hidden sm:inline">
            Sair
          </span>
        </button>
      </div>

      <main className="flex-1 p-3 sm:p-4 lg:p-8 lg:ml-0 ml-0 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 lg:mb-8 mt-16 lg:mt-0">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              Olá {user?.name}, bem-vindo novamente!
            </h1>
            <p className="text-gray-400 text-sm lg:text-base">
              Aqui está um resumo do seu portfólio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:grid lg:grid-cols-3 items-start gap-2 sm:gap-3 lg:gap-4 mr-0 sm:mr-16 lg:mr-24 w-full sm:w-auto lg:w-auto overflow-x-auto lg:overflow-x-visible mt-4 lg:mt-6">
            <div className="px-3 lg:px-4 py-2 glass-card rounded-xl h-16 sm:h-20 flex flex-col justify-center min-w-0 flex-shrink-0 lg:flex-shrink">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
                  Meta de Lucro
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-400">
                $30,000.00
              </p>
            </div>

            <div className="px-3 lg:px-4 py-2 glass-card rounded-xl h-16 sm:h-20 flex flex-col justify-center min-w-0 flex-shrink-0 lg:flex-shrink">
              <div className="flex items-center gap-2 mb-1">
                <SpinningCoin />
                <span className="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
                  Saldo Atual
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-green-400">
                $24,847.52
              </p>
            </div>

            <div className="px-3 lg:px-4 py-2 glass-card rounded-xl h-16 sm:h-20 flex flex-col justify-center min-w-0 lg:min-w-[220px] flex-shrink-0 lg:flex-shrink">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-neon-blue-400" />
                <span className="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
                  Ganhos com DayTrade
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-neon-blue-400">
                $3,247.18
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-6 lg:mb-8">
          <DashboardCards />
        </div>

        {/* Trading Chart */}
        <div className="mb-6 lg:mb-8">
          <TradingChart />
        </div>

        {/* Additional Content for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="glass-card p-4 lg:p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Últimas Transações
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neon-blue-400/20 rounded-full flex items-center justify-center">
                      <span className="text-neon-blue-400 text-xs font-bold">
                        B
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        Compra BTC
                      </p>
                      <p className="text-gray-400 text-xs">
                        {i} horas atrás
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-medium">
                      +$1,250.00
                    </p>
                    <p className="text-gray-400 text-xs">
                      0.027 BTC
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 lg:p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Top Moedas
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Bitcoin",
                  symbol: "BTC",
                  price: "$45,230.50",
                  change: "+2.4%",
                },
                {
                  name: "Ethereum",
                  symbol: "ETH",
                  price: "$2,845.20",
                  change: "+1.8%",
                },
                {
                  name: "Cardano",
                  symbol: "ADA",
                  price: "$0.52",
                  change: "-0.5%",
                },
              ].map((coin) => (
                <div
                  key={coin.symbol}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neon-blue-400/20 rounded-full flex items-center justify-center">
                      <span className="text-neon-blue-400 text-xs font-bold">
                        {coin.symbol[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {coin.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">
                      {coin.price}
                    </p>
                    <p
                      className={`text-xs ${coin.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                    >
                      {coin.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
