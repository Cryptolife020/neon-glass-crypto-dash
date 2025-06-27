
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bitcoin, Eye, EyeOff } from "lucide-react";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login com qualquer email/senha
    login({
      id: "1",
      name: "Usuário Demo",
      email: email || "demo@cryptopro.com"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crypto-dark-50 via-crypto-dark-100 to-crypto-dark-200 p-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-xl flex items-center justify-center neon-glow">
                <Bitcoin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue-400 to-white bg-clip-text text-transparent">
                  CryptoPro
                </h1>
                <p className="text-xs text-gray-400">Professional Trading</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-400 text-sm">
              Faça login para acessar sua plataforma de trading
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue-400 focus:border-neon-blue-400 transition-all duration-200"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue-400 focus:border-neon-blue-400 transition-all duration-200 pr-12"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-neon-blue-400 bg-white/5 border-gray-600 rounded focus:ring-neon-blue-400 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-neon-blue-400 hover:text-neon-blue-300 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 text-white font-medium rounded-lg hover:from-neon-blue-500 hover:to-neon-blue-700 focus:outline-none focus:ring-2 focus:ring-neon-blue-400 focus:ring-offset-2 focus:ring-offset-crypto-dark-100 transition-all duration-200 neon-glow"
            >
              Entrar
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <a href="#" className="text-neon-blue-400 hover:text-neon-blue-300 font-medium transition-colors">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            💡 Esta é uma versão demo. Use qualquer email e senha para entrar.
          </p>
        </div>
      </div>
    </div>
  );
};
