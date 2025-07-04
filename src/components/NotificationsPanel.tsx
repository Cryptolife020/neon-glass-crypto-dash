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
        return <Quote className="w-4 h-4 text-neon-blue-400" data-oid="qvz5v_s" />;
      case "success":
        return (
          <TrendingUp className="w-4 h-4 text-neon-blue-500" data-oid="cd00np-" />
        );

      case "warning":
        return (
          <AlertTriangle
            className="w-4 h-4 text-neon-blue-300"
            data-oid=":uognxl"
          />
        );

      default:
        return (
          <Info className="w-4 h-4 text-neon-blue-400" data-oid="iwq2ik4" />
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quote":
        return "glass-card border-neon-blue-400/30 hover:border-neon-blue-400/50";
      case "success":
        return "glass-card border-neon-blue-500/30 hover:border-neon-blue-500/50";
      case "warning":
        return "glass-card border-neon-blue-300/30 hover:border-neon-blue-300/50";
      default:
        return "glass-card border-neon-blue-400/30 hover:border-neon-blue-400/50";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} data-oid=":0e0h:c">
      <DialogTrigger asChild data-oid="b-a8msr">
        <div
          className="px-3 lg:px-4 py-2 glass-card rounded-xl relative cursor-pointer hover:bg-neon-blue-400/10 transition-all duration-300 group"
          data-oid="yvokeua"
        >
          <button className="flex items-center gap-2" data-oid="oko6tqi">
            <Bell
              className="w-5 h-5 text-gray-300 group-hover:text-neon-blue-400 transition-colors"
              data-oid="yd:ha9e"
            />

            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 bg-neon-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg"
                data-oid=".kf-8ki"
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </DialogTrigger>

      <DialogContent
        className="max-w-md bg-black/40 backdrop-blur-3xl border border-neon-blue-400/20 text-white shadow-2xl rounded-2xl glass-card"
        data-oid="ju5kc:q"
      >
        <div className="relative z-10" data-oid="1y9wpxd">
          <DialogHeader
            className="pb-4 border-b border-neon-blue-400/20"
            data-oid="p:pd_wu"
          >
            <DialogTitle
              className="text-xl font-bold bg-gradient-to-r from-neon-blue-400 via-neon-blue-500 to-neon-blue-600 bg-clip-text text-transparent flex items-center gap-2"
              data-oid="lj9h69j"
            >
              <Sparkles
                className="w-5 h-5 text-neon-blue-400"
                data-oid="-g_2az1"
              />
              Notificações
            </DialogTitle>
          </DialogHeader>

          <div
            className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide py-4"
            data-oid="nkzz_:z"
          >
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all duration-300 hover:bg-neon-blue-400/5 backdrop-blur-md ${
                  notification.read
                    ? "border-white/10 opacity-60"
                    : `${getTypeColor(notification.type)} border shadow-xl`
                }`}
                data-oid="gjve:8v"
              >
                <div className="flex items-start gap-3" data-oid="igm1frm">
                  <div
                    className={`p-2 rounded-lg ${
                      notification.type === "quote"
                        ? "bg-gradient-to-r from-neon-blue-500/30 to-neon-blue-600/30"
                        : "bg-neon-blue-400/10 glass-card"
                    }`}
                    data-oid="mxaur_x"
                  >
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0" data-oid="ewl_9gr">
                    <div
                      className="flex items-center gap-2 mb-1"
                      data-oid="f4-319s"
                    >
                      <h4
                        className={`font-medium text-sm ${
                          notification.type === "quote"
                            ? "bg-gradient-to-r from-neon-blue-300 to-neon-blue-500 bg-clip-text text-transparent"
                            : "text-gray-50"
                        }`}
                        data-oid="tt42ci1"
                      >
                        {notification.title}
                      </h4>
                      {notification.type === "quote" && notification.date && (
                        <span
                          className="text-xs text-neon-blue-200 bg-neon-blue-500/20 px-2 py-1 rounded-full glass-card"
                          data-oid="9o770kz"
                        >
                          {notification.date}
                        </span>
                      )}
                      {!notification.read && (
                        <span
                          className="w-2 h-2 bg-neon-blue-400 rounded-full animate-pulse shadow-lg"
                          data-oid="9i.zve4"
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm mb-2 leading-relaxed ${
                        notification.type === "quote"
                          ? "text-neon-blue-100 font-medium italic"
                          : "text-gray-100"
                      }`}
                      data-oid="u:q2gh7"
                    >
                      {notification.type === "quote" && !loading && '"'}
                      {notification.message}
                      {notification.type === "quote" && !loading && '"'}
                    </p>
                    <span className="text-neon-blue-300 text-xs" data-oid="43y0ked">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-neon-blue-400/20 pt-4 px-4">
              <button
                onClick={markAllAsRead}
                className="w-full text-sm text-neon-blue-400 hover:bg-neon-blue-400/10 py-2 rounded-lg transition-all glass-card"
              >
                <CheckCheck className="inline-block w-4 h-4 mr-2" />
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
