
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, TrendingUp, Shield, BarChart3 } from "lucide-react";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = login(email, password);
    if (!success) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Análise em Tempo Real",
      description: "Monitore o mercado 24/7 com dados atualizados"
    },
    {
      icon: Shield,
      title: "Trading Seguro",
      description: "Plataforma protegida com tecnologia avançada"
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Acompanhe seu desempenho com métricas precisas"
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-crypto-dark-50 via-crypto-dark-100 to-crypto-dark-200">
      {/* Left Side - Mockup/Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue-500/10 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              CryptoPro
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Sua plataforma profissional de trading
            </p>
          </div>

          {/* Mock Dashboard Preview */}
          <div className="glass-card p-6 mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Portfolio</h3>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">BTC</span>
                <span className="text-white font-medium">$45,230.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">ETH</span>
                <span className="text-white font-medium">$2,845.20</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-neon-blue-400 to-green-400 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-neon-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-neon-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <Card className="glass-card border-white/10 shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue-400 to-neon-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-gray-400">
                Entre na sua conta para acessar o dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-blue-500 focus:ring-neon-blue-500 h-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-blue-500 focus:ring-neon-blue-500 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-blue-500 to-neon-blue-600 hover:from-neon-blue-600 hover:to-neon-blue-700 text-white font-medium h-12 rounded-lg shadow-lg hover:shadow-neon-blue-500/25 transition-all duration-300"
                >
                  Entrar na Plataforma
                </Button>
              </form>

              <div className="pt-4 border-t border-white/10">
                <div className="bg-gradient-to-r from-neon-blue-500/10 to-purple-500/10 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-2">Credenciais de demonstração:</p>
                  <p className="text-neon-blue-400 text-sm font-medium">superadmin@gmail.com</p>
                  <p className="text-neon-blue-400 text-sm font-medium">82014278</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Features - Only show on small screens */}
          <div className="lg:hidden mt-8 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-neon-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                  <p className="text-gray-400 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
