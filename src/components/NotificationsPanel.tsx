
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDailyQuote } from "@/hooks/useDailyQuote";

export const NotificationsPanel = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { quote, formattedDate, loading } = useDailyQuote();

  useEffect(() => {
    // Simular contagem de notificações não lidas
    setUnreadCount(3);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      
      <DialogContent className="!bg-transparent glass-card border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-neon-blue-400 to-white bg-clip-text text-transparent">
            Frase do Dia
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">{formattedDate}</p>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue-400"></div>
              </div>
            ) : (
              <blockquote className="text-gray-200 text-base leading-relaxed italic border-l-4 border-neon-blue-400 pl-4 py-2">
                "{quote}"
              </blockquote>
            )}
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Bell className="w-4 h-4" />
              <span>Motivação diária para seus trades</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
