# CryptoPro - Professional Trading Dashboard

Um dashboard moderno para trading de criptomoedas com interface de vidro neon.

## Características

- Design moderno com efeito de vidro e elementos neon
- Dashboard principal com visão geral do portfólio
- Rastreador de moedas em tempo real
- Sistema DayTrade integrado
- Conversor de moedas
- Módulo de futuros

## Sistema DayTrade

O Sistema DayTrade é uma ferramenta de gerenciamento operacional para traders, oferecendo:

- Registro de valores em caixas separadas (operacional e reserva)
- Acompanhamento de operações de ganho e perda
- Cálculo de juros compostos para metas
- Sistema de ciclos operacionais
- Histórico de registros
- Indicadores de desempenho

Para acessar o Sistema DayTrade, clique na opção "Sistema DayTrade" no menu lateral.

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Vite

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/neon-glass-crypto-dash.git

# Entre no diretório
cd neon-glass-crypto-dash

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
neon-glass-crypto-dash/
├── public/
│   ├── fluxograma.png
│   ├── logica.js
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CryptoSidebar.tsx
│   │   ├── DashboardCards.tsx
│   │   ├── DayTradeSystem.tsx
│   │   ├── NotificationsPanel.tsx
│   │   ├── SpinningCoin.tsx
│   │   └── TradingChart.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Licença

Este projeto está licenciado sob a licença MIT.
