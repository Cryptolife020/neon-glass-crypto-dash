
import {
  Bell,
  Quote,
  TrendingUp,
  Info,
  AlertTriangle,
  Sparkles,
  CheckCheck,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useDailyQuote } from "@/hooks/useDailyQuote";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "quote";
  read: boolean;
  date?: string;
}

export const NotificationsPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { quote, formattedDate, loading } = useDailyQuote();

  // Inicializar notificações
  useEffect(() => {
    const baseNotifications: Notification[] = [
      {
        id: "daily-quote",
        title: "Frase do Dia",
        message: loading ? "Carregando frase inspiradora..." : quote,
        time: "Hoje",
        type: "quote",
        read: false,
        date: formattedDate,
      },
      {
        id: "1",
        title: "BTC Alert",
        message: "Bitcoin ultrapassou $45,000",
        time: "2 min atrás",
        type: "success",
        read: false,
      },
      {
        id: "2",
        title: "Portfolio Update",
        message: "Seu portfolio aumentou 5.2% hoje",
        time: "15 min atrás",
        type: "info",
        read: false,
      },
      {
        id: "3",
        title: "Price Alert",
        message: "ETH caiu abaixo de $2,800",
        time: "1h atrás",
        type: "warning",
        read: true,
      },
      {
        id: "4",
        title: "Sistema",
        message: "Manutenção programada para 02:00",
        time: "3h atrás",
        type: "info",
        read: true,
      },
    ];

    setNotifications(baseNotifications);
  }, [quote, formattedDate, loading]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quote":
        return <Quote className="w-4 h-4 text-blue-400" />;
      case "success":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeStyle = (type: string, read: boolean) => {
    const baseStyle = "relative overflow-hidden rounded-xl backdrop-blur-xl border transition-all duration-300 hover:shadow-lg";
    
    if (read) {
      return `${baseStyle} bg-black/20 border-white/10 opacity-70`;
    }

    switch (type) {
      case "quote":
        return `${baseStyle} bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-400/30 shadow-blue-500/20`;
      case "success":
        return `${baseStyle} bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-400/30 shadow-emerald-500/20`;
      case "warning":
        return `${baseStyle} bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-400/30 shadow-amber-500/20`;
      default:
        return `${baseStyle} bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/30 shadow-blue-500/20`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <div className="px-4 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:bg-black/30 hover:border-white/20 hover:shadow-lg">
            <Bell className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
            
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="pb-6 border-b border-white/10">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Notificações
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto py-2 scrollbar-hide">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={getTypeStyle(notification.type, notification.read)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-black/20 backdrop-blur-sm">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-white/90">
                        {notification.title}
                      </h4>
                      
                      {notification.type === "quote" && notification.date && (
                        <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full backdrop-blur-sm">
                          {notification.date}
                        </span>
                      )}
                      
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 leading-relaxed ${
                      notification.type === "quote" 
                        ? "text-blue-100 font-medium italic" 
                        : "text-white/80"
                    }`}>
                      {notification.type === "quote" && !loading && '"'}
                      {notification.message}
                      {notification.type === "quote" && !loading && '"'}
                    </p>
                    
                    <span className="text-xs text-white/60">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={markAllAsRead}
              className="w-full text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-blue-500/20 flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como lidas
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
