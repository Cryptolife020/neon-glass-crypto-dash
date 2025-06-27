import { useState } from "react";
import { CryptoSidebar } from "@/components/CryptoSidebar";
import { DashboardCards } from "@/components/DashboardCards";
import { TradingChart } from "@/components/TradingChart";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { SpinningCoin } from "@/components/SpinningCoin";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Target, LogOut } from "lucide-react";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="min-h-screen flex w-full bg-gradient-to-br from-crypto-dark-50 via-crypto-dark-100 to-crypto-dark-200 relative"
      data-oid="uvv6cgt"
    >
      <CryptoSidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
        data-oid="hulznow"
      />

      {/* Notifications - Absolute position top right */}
      <div
        className="absolute top-4 right-4 z-50 flex items-center gap-3"
        data-oid="ld0h:4y"
      >
        <NotificationsPanel data-oid="-dq:s3k" />
        <button
          onClick={handleLogout}
          className="px-3 lg:px-4 py-2 glass-card rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 group flex items-center gap-2"
          data-oid="bccqf4y"
        >
          <LogOut
            className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors"
            data-oid="lh08urc"
          />

          <span
            className="text-sm text-gray-400 group-hover:text-red-400 transition-colors"
            data-oid="5d7gqx9"
          >
            Sair
          </span>
        </button>
      </div>

      <main className="flex-1 p-4 lg:p-8 lg:ml-0 ml-0" data-oid="bg7v0:i">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 lg:mb-8 mt-16 lg:mt-0"
          data-oid="vpgxw8g"
        >
          <div className="mb-4 sm:mb-0" data-oid="ngffkei">
            <h1
              className="text-2xl lg:text-3xl font-bold text-white mb-2"
              data-oid="yrub8mu"
            >
              Olá {user?.name}, bem-vindo novamente!
            </h1>
            <p
              className="text-gray-400 text-sm lg:text-base"
              data-oid="hq4fafl"
            >
              Aqui está um resumo do seu portfólio.
            </p>
          </div>

          <div className="flex items-start gap-3 mr-24" data-oid="vsd3myq">
            <div
              className="px-3 lg:px-4 py-2 glass-card rounded-xl h-20 flex flex-col justify-center"
              data-oid="ew-dn-h"
            >
              <div className="flex items-center gap-2 mb-1" data-oid="b6lgqfa">
                <Target
                  className="w-4 h-4 text-yellow-400"
                  data-oid="nao4qoy"
                />

                <span
                  className="text-xs lg:text-sm text-gray-400"
                  data-oid="-qahipe"
                >
                  Meta de Lucro
                </span>
              </div>
              <p
                className="text-lg lg:text-xl font-bold text-yellow-400"
                data-oid="lu.iu:x"
              >
                $30,000.00
              </p>
            </div>

            <div
              className="px-3 lg:px-4 py-2 glass-card rounded-xl h-20 flex flex-col justify-center"
              data-oid="ackey8e"
            >
              <div className="flex items-center gap-2 mb-1" data-oid="y0p9wj3">
                <SpinningCoin data-oid="k414mtw" />
                <span
                  className="text-xs lg:text-sm text-gray-400"
                  data-oid="c.wsxto"
                >
                  Saldo Atual
                </span>
              </div>
              <p
                className="text-lg lg:text-xl font-bold text-green-400"
                data-oid=":400pbp"
              >
                $24,847.52
              </p>
            </div>

            <div
              className="px-3 lg:px-4 py-2 glass-card rounded-xl h-20 flex flex-col justify-center"
              data-oid="aygi00y"
            >
              <div className="flex items-center gap-2 mb-1" data-oid="q15oy02">
                <TrendingUp
                  className="w-4 h-4 text-neon-blue-400"
                  data-oid="e1eqbno"
                />

                <span
                  className="text-xs lg:text-sm text-gray-400"
                  data-oid="fjhly23"
                >
                  Ganhos com DayTrade
                </span>
              </div>
              <p
                className="text-lg lg:text-xl font-bold text-neon-blue-400"
                data-oid="wijoc7c"
              >
                $3,247.18
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-6 lg:mb-8" data-oid="6cmdncu">
          <DashboardCards data-oid="kdwu5e2" />
        </div>

        {/* Trading Chart */}
        <div className="mb-6 lg:mb-8" data-oid="79_74-n">
          <TradingChart data-oid="833:gs5" />
        </div>

        {/* Additional Content for Mobile */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
          data-oid="jejg4oc"
        >
          <div className="glass-card p-4 lg:p-6" data-oid="nlh3bu.">
            <h3
              className="text-lg font-bold text-white mb-4"
              data-oid="k82x:30"
            >
              Últimas Transações
            </h3>
            <div className="space-y-3" data-oid="lhxfehv">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  data-oid="lu3dojf"
                >
                  <div className="flex items-center gap-3" data-oid="6.1obs-">
                    <div
                      className="w-8 h-8 bg-neon-blue-400/20 rounded-full flex items-center justify-center"
                      data-oid="gb6-q7f"
                    >
                      <span
                        className="text-neon-blue-400 text-xs font-bold"
                        data-oid=".gpj5hc"
                      >
                        B
                      </span>
                    </div>
                    <div data-oid="j0dgyay">
                      <p
                        className="text-white text-sm font-medium"
                        data-oid="75:_tsk"
                      >
                        Compra BTC
                      </p>
                      <p className="text-gray-400 text-xs" data-oid="4ajeaeo">
                        {i} horas atrás
                      </p>
                    </div>
                  </div>
                  <div className="text-right" data-oid="kxghfdo">
                    <p
                      className="text-green-400 text-sm font-medium"
                      data-oid=".c_xkh7"
                    >
                      +$1,250.00
                    </p>
                    <p className="text-gray-400 text-xs" data-oid="ejqyzh3">
                      0.027 BTC
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 lg:p-6" data-oid="fc01otz">
            <h3
              className="text-lg font-bold text-white mb-4"
              data-oid="aqipyw7"
            >
              Top Moedas
            </h3>
            <div className="space-y-3" data-oid="yctkc.m">
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
                  data-oid="y8bve8o"
                >
                  <div className="flex items-center gap-3" data-oid="u8x-k2k">
                    <div
                      className="w-8 h-8 bg-neon-blue-400/20 rounded-full flex items-center justify-center"
                      data-oid="1ee:axp"
                    >
                      <span
                        className="text-neon-blue-400 text-xs font-bold"
                        data-oid="2pyrvif"
                      >
                        {coin.symbol[0]}
                      </span>
                    </div>
                    <div data-oid="y8kajgl">
                      <p
                        className="text-white text-sm font-medium"
                        data-oid="erthc3m"
                      >
                        {coin.name}
                      </p>
                      <p className="text-gray-400 text-xs" data-oid="n16p_zt">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right" data-oid="twl8yrq">
                    <p
                      className="text-white text-sm font-medium"
                      data-oid="mt5hp:g"
                    >
                      {coin.price}
                    </p>
                    <p
                      className={`text-xs ${coin.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      data-oid="5h:8h2:"
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
