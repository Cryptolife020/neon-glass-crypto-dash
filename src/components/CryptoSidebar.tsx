import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  BarChart3,
  Zap,
  ArrowLeftRight,
  Bitcoin,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tracker", label: "Rastreador de Moedas", icon: TrendingUp },
  { id: "investments", label: "Meus Investimentos", icon: Briefcase },
  { id: "daytrade", label: "Sistema DayTrade", icon: BarChart3 },
  { id: "futures", label: "M-Futuros", icon: Zap },
  { id: "converter", label: "Conversor de Moedas", icon: ArrowLeftRight },
];

export const CryptoSidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile when sidebar is closed */}
      {!isMobileOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden absolute top-4 left-4 z-50 p-3 glass-card rounded-xl"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar - Always visible on desktop, mobile controlled */}
      <div
        className={`
        w-72
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        transition-all duration-300 ease-in-out
        fixed lg:relative top-0 left-0 h-screen z-[70]
      `}
      >
        <div className="h-screen glass-card m-4 p-4 lg:p-6 flex flex-col sidebar-no-scroll">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-xl flex items-center justify-center neon-glow">
                <Bitcoin className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-neon-blue-400 to-white bg-clip-text text-transparent">
                  CryptoPro
                </h1>
                <p className="text-xs text-gray-400">Professional Trading</p>
              </div>
            </div>

            {/* Close button - Only visible on mobile */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 lg:space-y-2 overflow-y-auto sidebar-no-scroll">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onItemClick(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`sidebar-item group ${isActive ? "active" : ""}`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-neon-blue-400" : "text-gray-400 group-hover:text-white"} transition-colors`}
                  />

                  <span
                    className={`font-medium text-sm lg:text-base ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"} transition-colors`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 lg:pt-6 border-t border-white/10">
            <div className="glass rounded-xl p-3 lg:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs lg:text-sm font-medium text-white">
                    Pro Account
                  </p>
                  <p className="text-xs text-gray-400">Premium Features</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 h-1.5 rounded-full w-4/5"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                API Calls: 8,420/10,000
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
