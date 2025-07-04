import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LottieAnimation from './LottieAnimation';

// Add CSS for tooltips
const tooltipStyles = `
  .tooltip {
    position: absolute;
    top: 10px;
    left: 10px;
    display: inline-block;
    cursor: pointer;
    font-family: "Arial", sans-serif;
    user-select: none;
  }

  .tooltip .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #4caf50;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
    user-select: none;
  }

  .tooltiptext {
    visibility: hidden;
    width: 250px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: left;
    border-radius: 5px;
    padding: 8px;
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 110%;
    margin-top: -10px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    user-select: none;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`;

// Types
interface CoinData {
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface MetaDiaria {
  investimento: number;
  lucro: number;
}

interface HistoricoRegistro {
  data: string;
  caixa: string;
  valor: number;
  observacao: string;
  status: string;
}

interface CaixaStatus {
  status: string;
  color: string;
}

const DayTradeSystem = () => {
  // State declarations
  const [valorCaixa1, setValorCaixa1] = useState<number>(0);
  const [valorCaixa2, setValorCaixa2] = useState<number>(0);
  const [cicloAtual, setCicloAtual] = useState(1);
  const [metasCalculadas, setMetasCalculadas] = useState(false);
  const [todosDiasRegistrados, setTodosDiasRegistrados] = useState(false);
  const [metasPorCiclo, setMetasPorCiclo] = useState<Record<number, MetaDiaria[]>>({});
  const [historico, setHistorico] = useState<HistoricoRegistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [caixa1Input, setCaixa1Input] = useState('');
  const [caixa2Input, setCaixa2Input] = useState('');
  const [modoMercado, setModoMercado] = useState('spot');
  const [statusCaixa1, setStatusCaixa1] = useState<CaixaStatus | null>(null);
  const [statusCaixa2, setStatusCaixa2] = useState<CaixaStatus | null>(null);
  const [totalAbastecido, setTotalAbastecido] = useState(0);
  const [valorInvestido, setValorInvestido] = useState('');
  const [retornoPercentual, setRetornoPercentual] = useState('');
  const [showTabelaJuros, setShowTabelaJuros] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [showModalCelebracao, setShowModalCelebracao] = useState(false);
  const [showModalProximoCiclo, setShowModalProximoCiclo] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [proximoCicloMessage, setProximoCicloMessage] = useState('');
  const [totalOperacoes, setTotalOperacoes] = useState(0);

  // Auth context
  const { user } = useAuth();

  // Helper functions
  const formatarValor = (valor: number): string => {
    return `$${valor.toFixed(2).replace('.', ',')}`;
  };

  const parseValor = (valor: string): number => {
    const valorLimpo = valor.replace('$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(valorLimpo) || 0;
  };

  const handleRegistrarValores = async () => {
    const valorCaixa1Num = parseValor(caixa1Input);
    const valorCaixa2Num = parseValor(caixa2Input);

    if (isNaN(valorCaixa1Num) || isNaN(valorCaixa2Num) || valorCaixa1Num <= 0 || valorCaixa2Num <= 0) {
      // Show error alert
      return;
    }

    try {
      const response = await fetch('backend-setup.php?action=inserirValores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caixa1: valorCaixa1Num,
          caixa2: valorCaixa2Num,
          totalComprometido: valorCaixa1Num + valorCaixa2Num,
          totalAtual: valorCaixa1Num + valorCaixa2Num
        })
      });

      const data = await response.json();
      if (data.success) {
        setValorCaixa1(valorCaixa1Num);
        setValorCaixa2(valorCaixa2Num);
        setCaixa1Input('');
        setCaixa2Input('');
        // Show success alert
      }
    } catch (error) {
      console.error('Erro ao registrar valores:', error);
      // Show error alert
    }
  };

  const carregarDadosIniciais = async () => {
    try {
      const response = await fetch('backend-setup.php?action=obterValoresIniciais');
      const data = await response.json();
      if (data.success && data.data) {
        const { investimento, retorno, ciclo } = data.data;
        // Implementation will be added
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const obterValores = async () => {
    try {
      const response = await fetch('backend-setup.php?action=obterValores');
      const data = await response.json();
      if (data.success) {
        const valores = data.data;
        setValorCaixa1(parseFloat(valores.caixa1) || 0);
        setValorCaixa2(parseFloat(valores.caixa2) || 0);
      }
    } catch (error) {
      console.error('Erro ao obter valores:', error);
    }
  };

  const obterHistorico = async () => {
    try {
      const response = await fetch('backend-setup.php?action=obterHistorico');
      const data = await response.json();
      if (data.success) {
        setHistorico(data.data);
      }
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
    }
  };

  const carregarCicloAtual = async () => {
    try {
      const response = await fetch('backend-setup.php?action=RecuperarCiclo');
      const data = await response.json();
      if (data.success) {
        setCicloAtual(data.ciclo);
      }
    } catch (error) {
      console.error('Erro ao carregar ciclo atual:', error);
    }
  };

  const carregarCoresDoBanco = async () => {
    try {
      const response = await fetch('backend-setup.php?action=obterCores');
      const data = await response.json();
      if (data.success) {
        // Implementation will be added
      }
    } catch (error) {
      console.error('Erro ao carregar cores:', error);
    }
  };

  const recuperarStatusCaixa = async () => {
    try {
      const response = await fetch('backend-setup.php?action=recuperarStatusCaixa');
      const data = await response.json();
      if (data.success && data.data.success) {
        // Implementation will be added
      }
    } catch (error) {
      console.error('Erro ao recuperar status:', error);
    }
  };

  const configurarModoMercado = () => {
    const modoMercadoSalvo = localStorage.getItem('modoMercado');
    if (modoMercadoSalvo) {
      // Implementation will be added
    }
  };

  const atualizarStatusCaixa1 = (valorAtual: number, valorInicial: number) => {
    if (valorAtual === valorInicial) {
      setStatusCaixa1(null);
      return;
    }

    const status = valorInicial >= valorAtual ? 'Caixa 1 positivo' : 'Caixa 1 negativo';
    const cor = valorInicial >= valorAtual ? 'green' : 'red';
    setStatusCaixa1({ status, color: cor });
  };

  const atualizarStatusCaixa2 = (valorAtual: number, valorInicial: number) => {
    if (valorAtual === valorInicial) {
      setStatusCaixa2(null);
      return;
    }

    const status = valorInicial >= valorAtual ? 'Reserva Saudável' : 'Reserva Afetada';
    const cor = valorInicial >= valorAtual ? 'green' : 'orange';
    setStatusCaixa2({ status, color: cor });
  };

  const atualizarAbastecimento = (valorTransferido: number) => {
    setTotalAbastecido(prev => prev + valorTransferido);
  };

  const formatarData = (data: string): string => {
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[0]}`;
    }
    return data;
  };

  const adicionarHistorico = async (caixa: string, valor: number) => {
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`;
    
    const observacao = caixa === 'Caixa 1' 
      ? 'Destinado para operação'
      : 'Reserva para repor stop loss';

    const novoRegistro: HistoricoRegistro = {
      data: dataFormatada,
      caixa,
      valor,
      observacao,
      status: 'Registrado'
    };

    try {
      const response = await fetch('backend-setup.php?action=inserirHistorico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoRegistro)
      });

      const data = await response.json();
      if (data.success) {
        setHistorico(prev => [...prev, novoRegistro]);
      }
    } catch (error) {
      console.error('Erro ao adicionar histórico:', error);
    }
  };

  const calcularJurosCompostos = () => {
    const investimento = parseValor(valorInvestido);
    const retorno = parseFloat(retornoPercentual);

    if (isNaN(investimento) || isNaN(retorno) || investimento <= 0 || retorno <= 0) {
      setErrorMessage('Por favor, insira valores válidos.');
      setShowModalError(true);
      return;
    }

    setShowTabelaJuros(true);
  };

  const handleResetOperacional = async () => {
    try {
      const response = await fetch('backend-setup.php?action=resetarOperacional', {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        setValorCaixa1(0);
        setValorCaixa2(0);
        setHistorico([]);
        setTotalAbastecido(0);
        setStatusCaixa1(null);
        setStatusCaixa2(null);
        setCicloAtual(1);
        setSuccessMessage('Operacional reiniciado com sucesso!');
        setShowModalSuccess(true);
      }
    } catch (error) {
      console.error('Erro ao resetar operacional:', error);
      setErrorMessage('Erro ao resetar operacional. Tente novamente.');
      setShowModalError(true);
    }
  };

  const handleProximoCiclo = async () => {
    try {
      const response = await fetch('backend-setup.php?action=proximoCiclo', {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        setCicloAtual(prev => prev + 1);
        setProximoCicloMessage(`Você finalizou o Ciclo ${cicloAtual}. Bem-vindo ao Ciclo ${cicloAtual + 1}!`);
        setShowModalProximoCiclo(true);
      }
    } catch (error) {
      console.error('Erro ao avançar ciclo:', error);
      setErrorMessage('Erro ao avançar para o próximo ciclo. Tente novamente.');
      setShowModalError(true);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          carregarDadosIniciais(),
          obterValores(),
          obterHistorico(),
          carregarCicloAtual(),
          carregarCoresDoBanco(),
          recuperarStatusCaixa()
        ]);
        configurarModoMercado();
      } catch (error) {
        console.error('Erro ao inicializar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    const intervalo = setInterval(() => {
      obterValores();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const response = await fetch('backend-setup.php?action=obterHistorico');
        const data = await response.json();
        if (data.success) {
          setHistorico(data.historico);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    };

    carregarHistorico();
  }, []);

  // Main render
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crypto-dark-50 via-crypto-dark-100 to-crypto-dark-200">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crypto-dark-50 via-crypto-dark-100 to-crypto-dark-200">
      <style>{tooltipStyles}</style>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold">Setup Operacional</h1>
      </header>
      
      <main className="p-5">
        <section id="registro" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-black">Registro de Valores</h2>
          
          {/* Modo de Mercado */}
          <div className="mb-4">
            <label htmlFor="modoMercado" className="block text-lg mb-2 text-black">
              Modo de Mercado:
            </label>
            <select
              id="modoMercado"
              value={modoMercado}
              onChange={(e) => setModoMercado(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            >
              <option value="spot" className="text-black">Spot</option>
              <option value="futuros" className="text-black">Futuros</option>
            </select>
          </div>
          
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="caixa1" className="block text-lg text-black">
                Valor destinado para OP (Caixa 1):
              </label>
              <input
                type="text"
                id="caixa1"
                value={caixa1Input}
                onChange={(e) => setCaixa1Input(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="Insira o valor"
              />
            </div>
            <div>
              <label htmlFor="caixa2" className="block text-lg text-black">
                Reserva para repor SL (Caixa 2):
              </label>
              <input
                type="text"
                id="caixa2"
                value={caixa2Input}
                onChange={(e) => setCaixa2Input(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="Insira o valor"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRegistrarValores}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg shadow hover:bg-indigo-500 transition duration-200"
          >
            Registrar Valores
          </button>
          
          <button
            onClick={() => {/* Implement reset functionality */}}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg shadow hover:bg-indigo-500 transition duration-200"
          >
            Reiniciar Operacional
          </button>
        </section>

        <section id="caixas" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div id="display-caixa1" className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 relative">
            <h3 id="valor-caixa1" className="text-3xl font-bold text-black">{formatarValor(valorCaixa1)}</h3>
            <p className="text-lg text-black">Caixa 1</p>
            <small className="text-gray-500">Valor destinado para operação</small>
            
            <div className="tooltip">
              <div className="icon">i</div>
              <div className="tooltiptext">
                Ao transferir parte do lucro para o caixa 2, ele não será considerado no seu indicativo de lucro no caixa 1, pois você aceitou usá-lo como reserva para cobrir futuros stop loss.
              </div>
            </div>

            {statusCaixa1 && (
              <div id="status-caixa1" className="mt-2">
                <p style={{ color: statusCaixa1.color, fontWeight: 'bold' }}>
                  {statusCaixa1.status}
                </p>
              </div>
            )}
          </div>

          <div id="display-caixa2" className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105">
            <h3 id="valor-caixa2" className="text-3xl font-bold text-black">{formatarValor(valorCaixa2)}</h3>
            <p className="text-lg text-black">Caixa 2</p>
            <small className="text-gray-500">Reserva para repor StopLoss</small>
            
            {statusCaixa2 && (
              <div id="status-caixa2" className="text-lg font-bold mt-2">
                <p style={{ color: statusCaixa2.color, fontWeight: 'bold' }}>
                  {statusCaixa2.status}
                </p>
              </div>
            )}
            
            {totalAbastecido > 0 && (
              <div id="abastecido-perda" className="text-lg mt-2">
                <p style={{ color: 'green' }}>
                  Abastecido: +{formatarValor(totalAbastecido)}
                </p>
              </div>
            )}
          </div>
        </section>

        <section id="historico-de-registros" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-black">Registro Inicial Fixo</h2>
          
          <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
            <table className="min-w-full bg-white table-auto">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Data</th>
                  <th className="py-3 px-6 text-left">Caixa</th>
                  <th className="py-3 px-6 text-left">Valor</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Observações</th>
                  <th className="py-3 px-6 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {historico.length > 0 ? (
                  historico.map((registro, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{formatarData(registro.data)}</td>
                      <td className="py-3 px-6 text-left font-bold">{registro.caixa}</td>
                      <td className="py-3 px-6 text-left font-bold">{formatarValor(registro.valor)}</td>
                      <td className="py-3 px-6">
                        <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-sm">
                          {registro.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">{registro.observacao}</td>
                      <td className="py-3 px-6 text-center"></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div id="total-comprometido" className="bg-indigo-700 text-white p-6 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-semibold text-white">Total Comprometido</h3>
            <p className="text-lg mt-2 flex justify-between">
              <span className="text-white">Total dos Caixas:</span>
              <span id="total-dos-caixas" className="text-lg text-right text-white">
                {formatarValor(valorCaixa1 + valorCaixa2)}
              </span>
            </p>
          </div>

          <div id="Valores-atuais" className="bg-gradient-to-r from-gray-800 to-black border border-gray-700 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-white">Resultado Atual</h3>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-lg font-medium text-white whitespace-nowrap">Total dos caixas:</p>
              <p className="text-lg text-right font-bold text-white">
                <span id="total-dos-caixas-atual">{formatarValor(valorCaixa1 + valorCaixa2)}</span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-end">
                <p className="text-xs font-medium text-white">Ganho/Perda Líquida:</p>
              </div>
              <div className="flex justify-end">
                <p className="text-xs text-right text-gray-300">
                  <span id="ganho-perda-liquida-valor" className="text-green-400 inline font-bold text-x3">
                    +{formatarValor(0)}
                  </span>
                  <span id="ganho-perda-liquida-percentual" className="text-green-400 inline font-bold text-x3">
                    (+0.00%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="juros-compostos" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-black">Metas Juros Compostos</h2>
          <div>
            <label htmlFor="valor-investido" className="block text-lg text-black">
              Valor Investido (Caixa 1):
            </label>
            <input
              type="text"
              id="valor-investido"
              value={valorInvestido}
              onChange={(e) => setValorInvestido(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Insira o valor"
            />
            <label htmlFor="retorno" className="block text-lg mt-4 text-black">
              Retorno em %:
            </label>
            <input
              type="number"
              id="retorno"
              value={retornoPercentual}
              onChange={(e) => setRetornoPercentual(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              step="0.01"
              placeholder="Insira o percentual"
            />
          </div>
          <button
            onClick={calcularJurosCompostos}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg shadow hover:bg-indigo-500 transition duration-200"
          >
            Calcular Metas
          </button>

          {showTabelaJuros && (
            <div id="tabelas-juros" className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-4 px-6 border-b">Dia</th>
                    <th className="py-4 px-6 border-b">Investimento</th>
                    <th className="py-4 px-6 border-b">Retorno em %</th>
                    <th className="py-4 px-6 border-b">Meta</th>
                    <th className="py-4 px-6 border-b">Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Table rows will be generated dynamically */}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="ciclo-atual" className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-black">Ciclo Atual</h2>
            <p id="ciclo-indicativo" className="text-xl text-black">
              Ciclo:{' '}
              <span id="ciclo-numero" className="bg-indigo-600 text-white font-bold px-1 rounded">
                {cicloAtual}
              </span>
            </p>
          </div>
          <LottieAnimation
            src="https://lottie.host/7185b89d-8d4d-4244-b1ba-ea45abc09061/E4HEcLJCIy.lottie"
            width="80px"
            height="80px"
          />
        </section>

        <section id="interacoes" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-black">Total de Operações</h2>
          <div id="operacoes" className="grid grid-cols-6 gap-2">
            {/* Operation squares will be generated dynamically */}
          </div>
          
          {totalOperacoes > 0 && (
            <button
              onClick={handleProximoCiclo}
              className="mt-4 w-full bg-gray-300 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-400"
            >
              Próximo Ciclo
            </button>
          )}
        </section>

        <section id="planilha" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <footer className="text-center">
            <LottieAnimation
              src="https://lottie.host/875a6142-613e-4753-8bcc-c1e9742e0782/XwcetC116L.lottie"
              width="290px"
              height="290px"
              className="mx-auto"
            />
            <button
              onClick={() => window.open('URL_DA_PLANILHA', '_blank')}
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transition duration-200"
            >
              Planilha de Finanças Pessoais
            </button>
          </footer>
        </section>
      </main>

      {/* Modals */}
      {showModalSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <button
              onClick={() => setShowModalSuccess(false)}
              className="float-right text-lg cursor-pointer"
            >
              &times;
            </button>
            <p>{successMessage}</p>
            <button
              onClick={() => setShowModalSuccess(false)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showModalError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <button
              onClick={() => setShowModalError(false)}
              className="float-right text-lg cursor-pointer"
            >
              &times;
            </button>
            <p>{errorMessage}</p>
            <button
              onClick={() => setShowModalError(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showModalCelebracao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
            <LottieAnimation
              src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie"
              width="450px"
              height="450px"
              className="absolute -top-[100px] left-1/2 -translate-x-1/2 pointer-events-none"
            />
            <img
              src="https://ferramentas.x10.mx/ferramentas/setup/champagne.gif"
              alt="Celebração"
              className="mx-auto mb-4 w-[90px] h-auto z-10"
            />
            <h2 className="text-2xl font-bold text-green-600">Incrível!</h2>
            <p>Você chegou ao final de todos os ciclos. Recomece com um novo gerenciamento!</p>
            <button
              onClick={() => {
                setShowModalCelebracao(false);
                handleResetOperacional();
              }}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200"
            >
              Recomeçar 🥳
            </button>
          </div>
        </div>
      )}

      {showModalProximoCiclo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
            <LottieAnimation
              src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie"
              width="450px"
              height="450px"
              className="absolute -top-[100px] left-1/2 -translate-x-1/2 pointer-events-none"
            />
            <LottieAnimation
              src="https://lottie.host/2a8c8c7e-0563-4916-bef3-55ea76ce5565/amymtVr308.lottie"
              width="120px"
              height="120px"
              className="mx-auto block"
            />
            <h2 className="text-2xl font-bold text-green-600 z-10">Parabéns!</h2>
            <p className="z-10">{proximoCicloMessage}</p>
            <button
              onClick={() => setShowModalProximoCiclo(false)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200 z-10"
            >
              Começar o novo 🥳
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayTradeSystem;
