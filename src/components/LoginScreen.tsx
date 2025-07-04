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
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-crypto-dark-50 via-crypto-dark-100 to-crypto-dark-200 relative overflow-hidden p-4">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue-400/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-yellow-400/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Container principal */}
      <div className="glass-card w-full max-w-md p-8 z-10 relative">
        <div className="flex flex-col items-center mb-8">
          {/* Logo igual ao da sidebar */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-xl flex items-center justify-center neon-glow shadow-lg shadow-neon-blue-400/50">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue-400 to-white bg-clip-text text-transparent">
                CryptoPro
              </h1>
              <p className="text-xs text-gray-400">Professional Trading</p>
            </div>
          </div>
          <p className="text-white text-lg mt-1 mb-6">Entre para acessar sua conta</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white/5 border-0 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 hover:bg-white/10 focus:bg-white/10 transition-all [-webkit-appearance:none] [appearance:none]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full bg-white/5 border-0 rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 hover:bg-white/10 focus:bg-white/10 transition-all [-webkit-appearance:none] [appearance:none]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-lg py-3 text-white font-medium flex items-center justify-center transition-all ${
              isLoading ? "opacity-80" : "hover:brightness-110"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center text-xs text-gray-500 mt-6">
            <p>Credenciais de demonstração:</p>
            <p className="mt-1">Email: superadmin@gmail.com</p>
            <p>Senha: 82014278</p>
          </div>
        </form>
      </div>
    </div>
  );
}; 