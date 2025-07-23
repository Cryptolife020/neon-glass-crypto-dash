import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import Index from "./pages/Index";
import MFuturos from "./pages/MFuturos";
import CoinTracker from "./pages/CoinTracker";
import Investments from "./pages/Investments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Renderizar o conteúdo protegido se estiver autenticado
  return isAuthenticated ? <>{children}</> : null;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar para a página inicial se o usuário já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes data-oid="prm2lrq">
      <Route path="/login" element={<LoginScreen data-oid="-nny1wq" />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index data-oid="fgku:1o" />
          </ProtectedRoute>
        }
        data-oid="je0bnhn"
      />
      <Route
        path="/daytrade"
        element={
          <ProtectedRoute>
            <Index data-oid="fgku:1o" />
          </ProtectedRoute>
        }
        data-oid="daytrade-route"
      />
      <Route
        path="/futures"
        element={
          <ProtectedRoute>
            <MFuturos data-oid="mfuturos:1o" />
          </ProtectedRoute>
        }
        data-oid="futures-route"
      />
      <Route
        path="/tracker"
        element={
          <ProtectedRoute>
            <CoinTracker data-oid="cointracker:1o" />
          </ProtectedRoute>
        }
        data-oid="tracker-route"
      />
      <Route
        path="/investments"
        element={
          <ProtectedRoute>
            <Investments />
          </ProtectedRoute>
        }
        data-oid="investments-route"
      />
      <Route
        path="*"
        element={<NotFound data-oid="3wftzn2" />}
        data-oid="p-bxms-"
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient} data-oid="d4p53d-">
    <TooltipProvider data-oid="y_780ci">
      <Toaster data-oid="fnu_rm1" />
      <Sonner data-oid="hm.72gc" />
      <BrowserRouter data-oid="xv3c2q9">
        <AuthProvider data-oid="jrnb8w_">
          <AppContent data-oid="9psvg7x" />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
