import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen data-oid="-nny1wq" />;
  }

  return (
    <BrowserRouter data-oid="xv3c2q9">
      <Routes data-oid="prm2lrq">
        <Route
          path="/"
          element={<Index data-oid="fgku:1o" />}
          data-oid="je0bnhn"
        />

        <Route
          path="*"
          element={<NotFound data-oid="3wftzn2" />}
          data-oid="p-bxms-"
        />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient} data-oid="d4p53d-">
    <TooltipProvider data-oid="y_780ci">
      <Toaster data-oid="fnu_rm1" />
      <Sonner data-oid="hm.72gc" />
      <AuthProvider data-oid="jrnb8w_">
        <AppContent data-oid="9psvg7x" />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
