import React from 'react';
import { CryptoSidebar } from './CryptoSidebar';
import { NotificationsPanel } from './NotificationsPanel';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  activeItem?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeItem = "futures" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
  };
  
  const handleItemClick = (item: string) => {
    // Navegar para a página correspondente ao item clicado
    if (item === "dashboard") {
      navigate('/');
    } else if (item === "tracker") {
      navigate('/tracker');
    } else if (item === "daytrade") {
      navigate('/daytrade');
    } else if (item === "futures") {
      navigate('/futures');
    } else if (item === "investments") {
      navigate('/investments');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex w-full glass-background relative overflow-x-hidden">
      <CryptoSidebar
        activeItem={activeItem}
        onItemClick={handleItemClick}
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

      <main className="flex-1 p-3 sm:p-4 lg:p-8 lg:ml-0 ml-0 max-w-full overflow-x-hidden mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;