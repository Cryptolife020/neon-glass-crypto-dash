
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";

export const NotificationsPanel = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simular contagem de notificações não lidas
    setUnreadCount(3);
  }, []);

  return (
    <div className="px-3 lg:px-4 py-2 glass-card rounded-xl relative cursor-pointer hover:bg-neon-blue-400/10 transition-all duration-300 group">
      <button className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-gray-300 group-hover:text-neon-blue-400 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
