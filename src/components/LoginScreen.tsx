
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, LogIn, User, Lock, Bitcoin } from "lucide-react";

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError("Credenciais inválidas. Tente novamente.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full relative overflow-hidden p-3 sm:p-4 md:p-6">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/531b3e36-90d1-408f-92e3-da4af9fceac2.png')`,
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Container principal */}
      <div className="glass-card w-full max-w-sm sm:max-w-md z-10 relative p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center neon-glow shadow-lg shadow-neon-blue-400/50">
              <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-neon-blue-400 to-white bg-clip-text text-transparent">
                CryptoPro
              </h1>
              <p className="text-xs text-gray-400">Professional Trading</p>
            </div>
          </div>
          <p className="text-white text-sm sm:text-base md:text-lg mt-1 mb-4 sm:mb-6 text-center">Entre para acessar sua conta</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-black/20 backdrop-blur-md border border-white/20 rounded-lg py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 text-white placeholder-gray-400 text-sm sm:text-base outline-none focus:border-neon-blue-400 focus:ring-2 focus:ring-neon-blue-400/30 hover:bg-black/30 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full bg-black/20 backdrop-blur-md border border-white/20 rounded-lg py-2.5 sm:py-3 pl-8 sm:pl-10 pr-8 sm:pr-10 text-white placeholder-gray-400 text-sm sm:text-base outline-none focus:border-neon-blue-400 focus:ring-2 focus:ring-neon-blue-400/30 hover:bg-black/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-lg py-2.5 sm:py-3 text-white font-medium flex items-center justify-center text-sm sm:text-base transition-all ${
              isLoading ? "opacity-80" : "hover:brightness-110"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            )}
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
            <p className="mb-1">Credenciais de demonstração:</p>
            <p className="mb-0.5">Email: superadmin@gmail.com</p>
            <p>Senha: 82014278</p>
          </div>
        </form>
      </div>
    </div>
  );
}; 
