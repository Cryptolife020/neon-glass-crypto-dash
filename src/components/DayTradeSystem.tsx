import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  lucroMetaMessages,
  lucroExcedenteMessages,
  transferirExcedenteMessages,
  manterLucroMessages,
  prejuizoMessages,
  reporPerdaCaixa2Messages,
  naoReporPerdaMessages,
  proximoCicloMessages,
  ciclosCompletosMessages,
  getRandomMessage,
  getRandomParametrizedMessage
} from '@/data/motivationalMessages';

export const DayTradeSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFluxograma, setShowFluxograma] = useState(false);
  const [cicloAtual, setCicloAtual] = useState(1);
  const [valoresAcumulados, setValoresAcumulados] = useState<number[]>([]);
  const [historicoValoresCiclos, setHistoricoValoresCiclos] = useState<number[][]>([]);
  const [showModalProximoCiclo, setShowModalProximoCiclo] = useState(false);
  const [showModalLucroAbaixoMeta, setShowModalLucroAbaixoMeta] = useState(false);
  const [mensagemMotivacionalParabens, setMensagemMotivacionalParabens] = useState('');
  const [mensagemMotivacionalCiclo, setMensagemMotivacionalCiclo] = useState('');
  const [mensagemMetaBatida, setMensagemMetaBatida] = useState('');
  const [mensagemLucroAbaixoMeta, setMensagemLucroAbaixoMeta] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Create a script element for the dotlottie player
    const dotLottieScript = document.createElement('script');
    dotLottieScript.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    dotLottieScript.type = "module";
    document.head.appendChild(dotLottieScript);

    // Create a script element for SweetAlert2
    const sweetAlert2Script = document.createElement('script');
    sweetAlert2Script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    document.head.appendChild(sweetAlert2Script);

    // Create a link element for Tailwind CSS
    const tailwindLink = document.createElement('link');
    tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    tailwindLink.rel = "stylesheet";
    document.head.appendChild(tailwindLink);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.head.removeChild(dotLottieScript);
      document.head.removeChild(sweetAlert2Script);
      document.head.removeChild(tailwindLink);
    };
  }, []);

  // Função para verificar se todos os quadradinhos foram coloridos
  const verificarCicloCompleto = () => {
    const operacoesContainer = document.getElementById('operacoes');
    const proximoCicloBtn = document.getElementById('proximo-ciclo');

    if (operacoesContainer && proximoCicloBtn) {
      const quadradinhos = operacoesContainer.querySelectorAll('div[data-meta]');
      let todosColoridos = true;

      quadradinhos.forEach((quadradinho) => {
        const elemento = quadradinho as HTMLElement;
        const backgroundColor = elemento.style.backgroundColor;
        if (!backgroundColor || backgroundColor === 'transparent' || backgroundColor === '') {
          todosColoridos = false;
        }
      });

      // Mostrar botão se todos os quadradinhos estão coloridos
      if (todosColoridos && quadradinhos.length === 30) {
        proximoCicloBtn.classList.remove('hidden');
        proximoCicloBtn.classList.add('bg-gradient-to-r', 'from-green-500', 'to-green-600', 'text-white');
        proximoCicloBtn.classList.remove('bg-gray-300', 'text-gray-700');
        // Adicionar efeito de pulsar para chamar atenção
        proximoCicloBtn.classList.add('animate-pulse');
      } else {
        proximoCicloBtn.classList.add('hidden');
        proximoCicloBtn.classList.remove('animate-pulse');
      }
    }
  };

  // Adicionar useEffect para manipulação dos valores dos caixas
  useEffect(() => {
    const registrarValoresBtn = document.getElementById('registrar-valores');
    const apagarPreenchimentosBtn = document.getElementById('apagar-preenchimentos');
    const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
    const valorCaixa2Input = document.getElementById('caixa2') as HTMLInputElement;
    const displayValorCaixa1 = document.getElementById('valor-caixa1');
    const displayValorCaixa2 = document.getElementById('valor-caixa2');
    const tabelaRegistros = document.getElementById('historico-registros-body');
    const totalDosCaixas = document.getElementById('total-dos-caixas');
    const totalDosCaixasAtual = document.getElementById('total-dos-caixas-atual');

    const formatarValor = (valor: string) => {
      // Remove qualquer caractere que não seja número, ponto, vírgula ou sinal negativo
      const valorLimpo = valor.replace(/[^\d,\.\-]/g, '');

      // Substitui vírgula por ponto se necessário
      const valorFormatado = valorLimpo.replace(',', '.');

      // Converte para número e formata como moeda
      const valorNumerico = parseFloat(valorFormatado);

      if (isNaN(valorNumerico)) {
        return '$0,00';
      }
      // Novo formato: -$1,00
      const valorAbs = Math.abs(valorNumerico);
      const valorFormatadoBR = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(valorAbs);
      return `${valorNumerico < 0 ? '-' : ''}$${valorFormatadoBR}`;
    };

    const obterDataAtual = () => {
      const data = new Date();
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const calcularTotalCaixas = () => {
      if (tabelaRegistros && totalDosCaixas && totalDosCaixasAtual) {
        let totalCaixa1 = 0;
        let totalCaixa2 = 0;
        let valorInicialFixoTotal = 0;

        // Percorre todas as linhas da tabela para somar os valores
        const linhas = tabelaRegistros.querySelectorAll('tr');
        linhas.forEach((linha) => {
          const colunas = linha.querySelectorAll('td');
          if (colunas.length >= 3) {
            const tipoCaixa = colunas[1].textContent?.trim();
            const valorTexto = colunas[2].textContent?.trim() || '$0,00';
            const observacao = colunas[4].textContent?.trim();
            const valor = parseFloat(
              valorTexto.replace(/[^\d,\.]/g, '').replace(',', '.')
            );

            if (tipoCaixa === 'Caixa 1') {
              totalCaixa1 += valor;
              // Acumula apenas os valores iniciais fixos para o Total Comprometido
              if (observacao === 'Valor inicial') {
                valorInicialFixoTotal += valor;
              }
            } else if (tipoCaixa === 'Caixa 2') {
              totalCaixa2 += valor;
              // Acumula apenas os valores iniciais fixos para o Total Comprometido
              if (observacao === 'Reserva Stop Loss') {
                valorInicialFixoTotal += valor;
              }
            }
          }
        });

        // Obter os valores atuais dos caixas DIRETAMENTE dos displays
        const displayValorCaixa1 = document.getElementById('valor-caixa1');
        const displayValorCaixa2 = document.getElementById('valor-caixa2');

        const valorAtualCaixa1 = displayValorCaixa1
          ? parseFloat(
            displayValorCaixa1.textContent?.replace(/[^\d,\.\-]/g, '').replace(',', '.') || '0'
          )
          : totalCaixa1;

        const valorAtualCaixa2 = displayValorCaixa2
          ? parseFloat(
            displayValorCaixa2.textContent?.replace(/[^\d,\.\-]/g, '').replace(',', '.') || '0'
          )
          : totalCaixa2;

        const totalCaixasAtual = valorAtualCaixa1 + valorAtualCaixa2;

        // Total Comprometido = APENAS valores iniciais fixos
        totalDosCaixas.textContent = `$${new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(valorInicialFixoTotal)}`;

        // Atualiza o "Resultado Atual" com os valores ATUAIS dos caixas
        totalDosCaixasAtual.textContent = `$${new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(totalCaixasAtual)}`;

        // Calcular e atualizar Ganho/Perda Líquida
        const ganhoPerda = totalCaixasAtual - valorInicialFixoTotal;
        const percentualGanhoPerda = valorInicialFixoTotal > 0 ? (ganhoPerda / valorInicialFixoTotal) * 100 : 0;

        const ganhoLiquidaValor = document.getElementById('ganho-perda-liquida-valor');
        const ganhoLiquidaPercentual = document.getElementById('ganho-perda-liquida-percentual');

        if (ganhoLiquidaValor && ganhoLiquidaPercentual) {
          const valorFormatado = `${ganhoPerda >= 0 ? '+' : '-'}$${new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(Math.abs(ganhoPerda))}`;

          const percentualFormatado = `(${percentualGanhoPerda >= 0 ? '+' : ''}${percentualGanhoPerda.toFixed(2)}%)`;

          ganhoLiquidaValor.textContent = valorFormatado;
          ganhoLiquidaPercentual.textContent = percentualFormatado;

          // Atualizar cores baseado no ganho/perda
          if (ganhoPerda >= 0) {
            ganhoLiquidaValor.className = 'text-green-400 inline font-bold text-x3';
            ganhoLiquidaPercentual.className = 'text-green-400 inline font-bold text-x3';
          } else {
            ganhoLiquidaValor.className = 'text-red-400 inline font-bold text-x3';
            ganhoLiquidaPercentual.className = 'text-red-400 inline font-bold text-x3';
          }
        }
      }
    };

    // Função para verificar mudanças nos displays e atualizar automaticamente
    const verificarMudancasDisplays = () => {
      const displayValorCaixa1 = document.getElementById('valor-caixa1');
      const displayValorCaixa2 = document.getElementById('valor-caixa2');

      if (displayValorCaixa1 && displayValorCaixa2) {
        // Verificar se os valores mudaram comparando com os valores anteriores
        const valorAtualCaixa1 = displayValorCaixa1.textContent || '$0,00';
        const valorAtualCaixa2 = displayValorCaixa2.textContent || '$0,00';

        // Armazenar valores anteriores para comparação
        if (!verificarMudancasDisplays.valoresAnteriores) {
          verificarMudancasDisplays.valoresAnteriores = {
            caixa1: valorAtualCaixa1,
            caixa2: valorAtualCaixa2
          };
        }

        // Se os valores mudaram, recalcular
        if (verificarMudancasDisplays.valoresAnteriores.caixa1 !== valorAtualCaixa1 ||
          verificarMudancasDisplays.valoresAnteriores.caixa2 !== valorAtualCaixa2) {

          // Atualizar valores anteriores
          verificarMudancasDisplays.valoresAnteriores.caixa1 = valorAtualCaixa1;
          verificarMudancasDisplays.valoresAnteriores.caixa2 = valorAtualCaixa2;

          // Recalcular totais
          calcularTotalCaixas();
        }
      }
    };

    // Inicializar a propriedade para armazenar valores anteriores
    verificarMudancasDisplays.valoresAnteriores = null;

    // Configurar o setInterval para verificar mudanças a cada 500ms
    const intervalId = setInterval(verificarMudancasDisplays, 500);

    // Add mostrarAlerta function
    const mostrarAlerta = (titulo: string, mensagem: string, sucesso: boolean = true) => {
      const modalSuccess = document.getElementById('modal-success');
      const modalError = document.getElementById('modal-error');
      const successMessage = document.getElementById('success-message');
      const errorMessage = document.getElementById('error-message');

      if (sucesso && modalSuccess && successMessage) {
        successMessage.textContent = mensagem;
        modalSuccess.classList.remove('hidden');
        modalSuccess.classList.add('show');
      } else if (!sucesso && modalError && errorMessage) {
        errorMessage.textContent = mensagem;
        modalError.classList.remove('hidden');
        modalError.classList.add('show');
      }
    };

    // Função para resetar todo o sistema
    const resetarSistema = () => {
      // Reset React state
      setCicloAtual(1);
      setValoresAcumulados([]);
      setHistoricoValoresCiclos([]);
      setShowModalProximoCiclo(false);
      setShowModalLucroAbaixoMeta(false);
      setMensagemMotivacionalParabens('');
      setMensagemMotivacionalCiclo('');
      setMensagemMetaBatida('');
      setMensagemLucroAbaixoMeta('');

      // Reset inputs
      if (valorCaixa1Input) valorCaixa1Input.value = '';
      if (valorCaixa2Input) valorCaixa2Input.value = '';
      const valorInvestidoInput = document.getElementById('valor-investido') as HTMLInputElement;
      const retornoInput = document.getElementById('retorno') as HTMLInputElement;
      if (valorInvestidoInput) valorInvestidoInput.value = '';
      if (retornoInput) retornoInput.value = '';

      // Reset displays
      if (displayValorCaixa1) {
        displayValorCaixa1.textContent = '$0,00';
        displayValorCaixa1.style.color = '';
        displayValorCaixa1.style.fontWeight = '';
      }
      if (displayValorCaixa2) {
        displayValorCaixa2.textContent = '$0,00';
        displayValorCaixa2.style.color = '';
        displayValorCaixa2.style.fontWeight = '';
      }

      // Reset tabela de registros
      if (tabelaRegistros) {
        tabelaRegistros.innerHTML = `
          <tr id="sem-registros" class="text-center">
            <td colspan="6" class="py-8 px-6 text-gray-500 italic">
              Nenhum registro encontrado
            </td>
          </tr>
        `;
      }

      // Reset totais
      if (totalDosCaixas) totalDosCaixas.textContent = '$0,00';
      if (totalDosCaixasAtual) totalDosCaixasAtual.textContent = '$0,00';

      const ganhoLiquidaValor = document.getElementById('ganho-perda-liquida-valor');
      const ganhoLiquidaPercentual = document.getElementById('ganho-perda-liquida-percentual');
      if (ganhoLiquidaValor) {
        ganhoLiquidaValor.textContent = '+$0,00';
        ganhoLiquidaValor.className = 'text-green-400 inline font-bold text-x3';
      }
      if (ganhoLiquidaPercentual) {
        ganhoLiquidaPercentual.textContent = '(+0.00%)';
        ganhoLiquidaPercentual.className = 'text-green-400 inline font-bold text-x3';
      }

      // Reset ciclo
      const cicloNumero = document.getElementById('ciclo-numero');
      if (cicloNumero) {
        cicloNumero.textContent = '0';
        cicloNumero.className = '';
      }

      // Reset operações
      const operacoesContainer = document.getElementById('operacoes');
      if (operacoesContainer) {
        operacoesContainer.innerHTML = `
          <div id="aguardando-registros" class="col-span-6 text-center py-8">
            <p class="text-gray-500 italic text-lg">Aguardando registros iniciais do setup</p>
          </div>
        `;
      }

      // Reset tabela de juros
      const tabelasJuros = document.getElementById('tabelas-juros');
      const tabelaCorpo = tabelasJuros?.querySelector('tbody');
      if (tabelaCorpo) tabelaCorpo.innerHTML = '';
      if (tabelasJuros) tabelasJuros.classList.add('hidden');

      // Reset botão próximo ciclo
      const proximoCicloBtn = document.getElementById('proximo-ciclo');
      if (proximoCicloBtn) {
        proximoCicloBtn.classList.add('hidden');
        proximoCicloBtn.classList.remove('bg-gradient-to-r', 'from-green-500', 'to-green-600', 'text-white', 'animate-pulse');
        proximoCicloBtn.classList.add('bg-gray-300', 'text-gray-700');
      }

      // Re-enable registration button
      if (registrarValoresBtn) {
        (registrarValoresBtn as HTMLButtonElement).disabled = false;
      }
    };

    // Event listener para o botão de resetar
    apagarPreenchimentosBtn?.addEventListener('click', () => {
      resetarSistema();
      toast({
        title: "🔄 Setup Resetado",
        description: "O sistema operacional foi resetado com sucesso!",
        variant: "default",
        className: "bg-black text-white border-gray-700"
      });
    });

    registrarValoresBtn?.addEventListener('click', () => {
      // Verificação: impedir registro se algum input estiver vazio ou igual a zero
      if (valorCaixa1Input && valorCaixa2Input) {
        const valor1 = valorCaixa1Input.value.replace(/[^\d,\.\-]/g, '').replace(',', '.');
        const valor2 = valorCaixa2Input.value.replace(/[^\d,\.\-]/g, '').replace(',', '.');
        const num1 = parseFloat(valor1);
        const num2 = parseFloat(valor2);
        if (!valorCaixa1Input.value.trim() || !valorCaixa2Input.value.trim() || isNaN(num1) || isNaN(num2) || num1 === 0 || num2 === 0) {
          toast({
            title: '⚠️ Preencha os valores corretamente',
            description: 'Os campos dos caixas não podem estar vazios ou com valor zero.',
            variant: 'destructive'
          });
          return;
        }
      }

      // Check if initial registration has already been done
      const existingRegistros = tabelaRegistros?.querySelectorAll('tr');

      // Verificar se existem registros reais (excluindo a linha da mensagem "Nenhum registro encontrado")
      const registrosReais = Array.from(existingRegistros || []).filter(linha => {
        const colunas = linha.querySelectorAll('td');
        // Se tem 6 colunas e não é a linha da mensagem "Nenhum registro encontrado"
        return colunas.length === 6 && !linha.id?.includes('sem-registros');
      });

      if (registrosReais.length > 0) {
        toast({
          title: "❌ Registro Duplicado",
          description: "Já existe um registro inicial. Não é possível adicionar novos registros.",
          variant: "destructive"
        });
        return;
      }

      if (valorCaixa1Input && valorCaixa2Input && displayValorCaixa1 && displayValorCaixa2 && tabelaRegistros && registrarValoresBtn) {
        // Remover a mensagem "Nenhum registro encontrado" se existir
        const semRegistros = document.getElementById('sem-registros');
        if (semRegistros) {
          semRegistros.remove();
        }

        const valorCaixa1 = formatarValor(valorCaixa1Input.value);
        const valorCaixa2 = formatarValor(valorCaixa2Input.value);

        displayValorCaixa1.textContent = valorCaixa1;
        displayValorCaixa2.textContent = valorCaixa2;

        // Criar nova linha na tabela de registros para Caixa 1
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
          <td class="py-3 px-6 text-left">${obterDataAtual()}</td>
          <td class="py-3 px-6 text-left">Caixa 1</td>
          <td class="py-3 px-6 text-left">${valorCaixa1}</td>
          <td class="py-3 px-6 text-left">
            <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Registrado</span>
          </td>
          <td class="py-3 px-6 text-left">Valor inicial</td>
          <td class="py-3 px-6 text-center">
            <button class="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </td>
        `;
        tabelaRegistros.appendChild(novaLinha);

        // Criar nova linha na tabela de registros para Caixa 2
        const novaLinhaCaixa2 = document.createElement('tr');
        novaLinhaCaixa2.innerHTML = `
          <td class="py-3 px-6 text-left">${obterDataAtual()}</td>
          <td class="py-3 px-6 text-left">Caixa 2</td>
          <td class="py-3 px-6 text-left">${valorCaixa2}</td>
          <td class="py-3 px-6 text-left">
            <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Registrado</span>
          </td>
          <td class="py-3 px-6 text-left">Reserva Stop Loss</td>
          <td class="py-3 px-6 text-center">
            <button class="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </td>
        `;
        tabelaRegistros.appendChild(novaLinhaCaixa2);

        // Calcular e atualizar o total dos caixas
        calcularTotalCaixas();

        toast({
          title: "✅ Valores Registrados",
          description: `Caixa 1: ${valorCaixa1} | Caixa 2: ${valorCaixa2} registrados com sucesso!`,
          variant: "default"
        });

        // Limpar os inputs após registrar
        valorCaixa1Input.value = '';
        valorCaixa2Input.value = '';

        // Disable the registration button after initial registration
        (registrarValoresBtn as HTMLButtonElement).disabled = true;
      }
    });

    // Calcular total dos caixas inicialmente
    calcularTotalCaixas();

    // Cleanup function para limpar o interval quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const valorInvestidoInput = document.getElementById('valor-investido') as HTMLInputElement;
    const retornoInput = document.getElementById('retorno') as HTMLInputElement;
    const calcularBtn = document.getElementById('calcular');
    const tabelasJuros = document.getElementById('tabelas-juros');
    const tabelaCorpo = tabelasJuros?.querySelector('tbody');
    const cicloNumero = document.getElementById('ciclo-numero');
    const operacoesContainer = document.getElementById('operacoes');

    const formatarValor = (valor: number) => {
      const valorFormatado = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Math.abs(valor));
      return valor < 0 ? `-$${valorFormatado}` : `$${valorFormatado}`;
    };

    calcularBtn?.addEventListener('click', () => {
      // NOVA VERIFICAÇÃO: impedir cálculo se não houver valores registrados nos caixas
      const displayValorCaixa1 = document.getElementById('valor-caixa1');
      const displayValorCaixa2 = document.getElementById('valor-caixa2');
      const valorCaixa1 = displayValorCaixa1?.textContent || '$0,00';
      const valorCaixa2 = displayValorCaixa2?.textContent || '$0,00';
      // Se ambos ainda estão no valor inicial, impedir cálculo
      if (valorCaixa1 === '$0,00' && valorCaixa2 === '$0,00') {
        toast({
          title: '⚠️ Registre os Caixas',
          description: 'Por favor, registre os valores do Caixa 1 e Caixa 2 antes de calcular as metas.',
          variant: 'destructive'
        });
        return;
      }

      if (valorInvestidoInput && retornoInput && tabelasJuros && tabelaCorpo && cicloNumero && operacoesContainer) {
        // Limpar tabela anterior e container de operações
        tabelaCorpo.innerHTML = '';
        operacoesContainer.innerHTML = '';

        // Remover a mensagem "Aguardando registros iniciais do setup" se existir
        const aguardandoRegistros = document.getElementById('aguardando-registros');
        if (aguardandoRegistros) {
          aguardandoRegistros.remove();
        }

        // Converter valores
        const valorInicial = parseFloat(valorInvestidoInput.value.replace(/[^\d,\.]/g, '').replace(',', '.'));
        const taxaRetorno = parseFloat(retornoInput.value);

        if (isNaN(valorInicial) || isNaN(taxaRetorno)) {
          toast({
            title: "❌ Erro de Validação",
            description: "Por favor, insira valores válidos para continuar o cálculo.",
            variant: "destructive"
          });
          return;
        }

        // Atualizar Ciclo Atual
        cicloNumero.textContent = '1';
        cicloNumero.classList.add('bg-indigo-600', 'text-white', 'px-1', 'rounded');

        // Calcular juros compostos
        let valorAcumulado = valorInicial;
        let metasDias: number[] = [];

        for (let dia = 1; dia <= 30; dia++) {
          // Armazenar o valor antes do crescimento (investimento do dia)
          const valorInvestimentoDia = valorAcumulado;

          // Calcular o valor do dia
          valorAcumulado *= (1 + (taxaRetorno / 100));

          // Criar linha da tabela
          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td class="py-3 px-6 text-center">${dia}</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorInvestimentoDia)}</td>
            <td class="py-3 px-6 text-center">${taxaRetorno.toFixed(2)}%</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorAcumulado - valorInvestimentoDia)}</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorAcumulado)}</td>
          `;

          tabelaCorpo.appendChild(linha);

          // Armazenar metas para os quadradinhos (lucro do dia, não valor total)
          metasDias.push(valorAcumulado - valorInicial);
        }

        // Gerar quadradinhos de Operações
        operacoesContainer.className = '';
        operacoesContainer.classList.add(
          'grid',
          'grid-cols-6',
          'grid-flow-row',
          'gap-0',
          'w-full',
          'max-w-md',
          'mx-auto'
        );

        metasDias.forEach((meta, index) => {
          const quadradinho = document.createElement('div');
          quadradinho.className = '';
          quadradinho.classList.add(
            'w-full',
            'aspect-square',
            'border',
            'border-white/20',
            'bg-transparent',
            'flex',
            'items-center',
            'justify-center',
            'text-white',
            'text-xs',
            'font-light',
            'select-none',
            'p-0',
            'm-0',
            'transition',
            'duration-200',
            'hover:bg-white/10',
            'cursor-pointer'  // Adiciona cursor de ponteiro para indicar que é clicável
          );
          quadradinho.textContent = (index + 1).toString();
          quadradinho.setAttribute('data-meta', formatarValor(meta));
          quadradinho.setAttribute('title', `Dia ${index + 1}`);

          // Adicionar evento de clique para abrir modal
          quadradinho.addEventListener('click', () => {
            const modalOperacao = document.getElementById('modal-operacao');
            const modalTitulo = document.getElementById('modal-operacao-titulo');
            const modalDiaNumero = document.getElementById('modal-operacao-dia');
            const modalTipoOperacao = document.getElementById('modal-operacao-resultado');

            if (modalOperacao && modalTitulo && modalDiaNumero && modalTipoOperacao) {
              const diaNumero = quadradinho.textContent || '';
              const metaValor = quadradinho.getAttribute('data-meta') || '';

              // Função para buscar meta correta da tabela
              const buscarMetaDaTabela = (diaOperacao: string) => {
                const tabelasJuros = document.getElementById('tabelas-juros');
                const tabelaCorpo = tabelasJuros?.querySelector('tbody');

                if (tabelaCorpo) {
                  const linhas = tabelaCorpo.querySelectorAll('tr');
                  const diaIndex = parseInt(diaOperacao) - 1; // Converter para índice (dia 1 = índice 0)

                  if (linhas[diaIndex]) {
                    const colunas = linhas[diaIndex].querySelectorAll('td');
                    if (colunas.length >= 4) {
                      // Coluna 3 (índice 3) contém a META do dia
                      return colunas[3].textContent?.trim() || '$0,00';
                    }
                  }
                }
                return '$0,00';
              };

              // Buscar meta correta da tabela baseada no dia
              const metaCorreta = buscarMetaDaTabela(diaNumero);

              // Armazenar o valor da meta e referência do quadradinho globalmente
              (window as any).metaValorAtual = metaCorreta;
              (window as any).quadradinhoAtual = quadradinho;

              // Get current date from WorldTimeAPI for Brasilia, Brazil
              // Agora, usaremos apenas a data local do sistema
              let day, month, year, formattedDate;

              const localDate = new Date();
              const saoPauloDate = new Date(localDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
              day = String(saoPauloDate.getDate()).padStart(2, '0');
              month = String(saoPauloDate.getMonth() + 1).padStart(2, '0');
              year = saoPauloDate.getFullYear();
              formattedDate = `${day}/${month}/${year}`;

              // Store full date info in uma variável global para futura integração de métricas
              (window as any).brasiliaDate = {
                day,
                month,
                year,
                formatted: formattedDate
              };

              modalTitulo.setAttribute('data-full-date', formattedDate);
              modalTitulo.textContent = `Operação ${diaNumero} - Dia ${day}`;
              modalDiaNumero.textContent = diaNumero;

              modalOperacao.classList.remove('hidden');
              modalOperacao.classList.add('show');

              // Limpar input anterior
              (modalTipoOperacao as HTMLInputElement).value = '';
            }
          });

          operacoesContainer.appendChild(quadradinho);
        });

        // Mostrar tabela
        tabelasJuros.classList.remove('hidden');

        toast({
          title: "🎯 Metas Calculadas",
          description: `Plano de 30 dias criado com sucesso! Meta diária: ${taxaRetorno.toFixed(2)}%`,
          variant: "default"
        });
      }
    });
  }, []);

  useEffect(() => {
    const operacoesContainer = document.getElementById('operacoes');

    if (!operacoesContainer) {
      return;
    }

    // Adicionar um event listener ao container para usar event delegation
    operacoesContainer.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const quadradinho = target.closest('div[data-meta]');

      if (quadradinho) {
        const modalOperacao = document.getElementById('modal-operacao');
        const modalTitulo = document.getElementById('modal-operacao-titulo');
        const modalDiaNumero = document.getElementById('modal-operacao-dia');
        const modalTipoOperacao = document.getElementById('modal-operacao-resultado');

        if (modalOperacao && modalTitulo && modalDiaNumero && modalTipoOperacao) {
          const diaNumero = quadradinho.textContent || '';
          const metaValor = quadradinho.getAttribute('data-meta') || '';

          // Get current date from WorldTimeAPI for Brasilia, Brazil
          // Agora, usaremos apenas a data local do sistema
          let day, month, year, formattedDate;

          const localDate = new Date();
          const saoPauloDate = new Date(localDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
          day = String(saoPauloDate.getDate()).padStart(2, '0');
          month = String(saoPauloDate.getMonth() + 1).padStart(2, '0');
          year = saoPauloDate.getFullYear();
          formattedDate = `${day}/${month}/${year}`;

          // Store full date info in uma variável global para futura integração de métricas
          (window as any).brasiliaDate = {
            day,
            month,
            year,
            formatted: formattedDate
          };

          modalTitulo.setAttribute('data-full-date', formattedDate);
          modalTitulo.textContent = `Operação ${diaNumero} - Dia ${day}`;
          modalDiaNumero.textContent = diaNumero;

          modalOperacao.classList.remove('hidden');
          modalOperacao.classList.add('show');

          // Limpar input anterior
          (modalTipoOperacao as HTMLInputElement).value = '';
        }
      }
    });
  }, []);

  // Função para recalcular tabela de juros compostos para novo ciclo
  const recalcularTabelaProximoCiclo = () => {
    const valorInvestidoInput = document.getElementById('valor-investido') as HTMLInputElement;
    const retornoInput = document.getElementById('retorno') as HTMLInputElement;
    const tabelasJuros = document.getElementById('tabelas-juros');
    const tabelaCorpo = tabelasJuros?.querySelector('tbody');
    const cicloNumero = document.getElementById('ciclo-numero');
    const operacoesContainer = document.getElementById('operacoes');

    if (valorInvestidoInput && retornoInput && tabelaCorpo && cicloNumero && operacoesContainer) {
      // Pegar o valor da última meta (dia 30) da tabela atual como novo investimento base
      let novoValorInicial = 0;

      // Buscar na tabela atual o valor da meta do dia 30 (última linha)
      const linhasTabela = tabelaCorpo.querySelectorAll('tr');
      if (linhasTabela.length >= 30) {
        const ultimaLinha = linhasTabela[29]; // Linha do dia 30 (índice 29)
        const colunas = ultimaLinha.querySelectorAll('td');
        if (colunas.length >= 5) {
          // A coluna 4 (índice 4) contém o valor ACUMULADO do dia 30
          const valorAcumuladoTexto = colunas[4].textContent?.trim() || '$0,00';
          novoValorInicial = parseFloat(
            valorAcumuladoTexto.replace(/[^\d,\.]/g, '').replace(',', '.')
          );
        }
      }

      // Se não conseguiu pegar da tabela, usar valores acumulados como fallback
      if (novoValorInicial === 0 && valoresAcumulados && valoresAcumulados.length === 30) {
        novoValorInicial = valoresAcumulados[29]; // Índice 29 = dia 30
      }

      // Se ainda não tem valor, usar o valor atual do Caixa 1 como último recurso
      if (novoValorInicial === 0) {
        const displayValorCaixa1 = document.getElementById('valor-caixa1');
        novoValorInicial = displayValorCaixa1
          ? parseFloat(displayValorCaixa1.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0')
          : 0;
      }

      const taxaRetorno = parseFloat(retornoInput.value);

      if (novoValorInicial > 0 && !isNaN(taxaRetorno)) {
        // Limpar tabela e operações anteriores
        tabelaCorpo.innerHTML = '';
        operacoesContainer.innerHTML = '';

        // Atualizar número do ciclo - usando o próximo ciclo (cicloAtual + 1)
        cicloNumero.textContent = (cicloAtual + 1).toString();

        // Calcular juros compostos para o novo ciclo
        let valorAcumulado = novoValorInicial;
        let metasDias: number[] = [];

        const formatarValor = (valor: number) => {
          return (valor < 0 ? '-' : '') + '$' + new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(Math.abs(valor));
        };

        for (let dia = 1; dia <= 30; dia++) {
          // Armazenar o valor antes do crescimento (investimento do dia)
          const valorInvestimentoDia = valorAcumulado;

          valorAcumulado *= (1 + (taxaRetorno / 100));

          // Criar linha da tabela
          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td class="py-3 px-6 text-center">${dia}</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorInvestimentoDia)}</td>
            <td class="py-3 px-6 text-center">${taxaRetorno.toFixed(2)}%</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorAcumulado - valorInvestimentoDia)}</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorAcumulado)}</td>
          `;

          tabelaCorpo.appendChild(linha);
          metasDias.push(valorAcumulado - valorInvestimentoDia);
        }

        // Gerar novos quadradinhos de operações
        operacoesContainer.className = '';
        operacoesContainer.classList.add(
          'grid',
          'grid-cols-6',
          'grid-flow-row',
          'gap-0',
          'w-full',
          'max-w-md',
          'mx-auto'
        );

        metasDias.forEach((meta, index) => {
          const quadradinho = document.createElement('div');
          quadradinho.className = '';
          quadradinho.classList.add(
            'w-full',
            'aspect-square',
            'border',
            'border-white/20',
            'bg-transparent',
            'flex',
            'items-center',
            'justify-center',
            'text-white',
            'text-xs',
            'font-light',
            'select-none',
            'p-0',
            'm-0',
            'transition',
            'duration-200',
            'hover:bg-white/10',
            'cursor-pointer'
          );
          quadradinho.textContent = (index + 1).toString();
          quadradinho.setAttribute('data-meta', formatarValor(meta));
          quadradinho.setAttribute('title', `Dia ${index + 1}`);

          // Adicionar evento de clique para abrir modal
          quadradinho.addEventListener('click', () => {
            const modalOperacao = document.getElementById('modal-operacao');
            const modalTitulo = document.getElementById('modal-operacao-titulo');
            const modalDiaNumero = document.getElementById('modal-operacao-dia');
            const modalTipoOperacao = document.getElementById('modal-operacao-resultado');

            if (modalOperacao && modalTitulo && modalDiaNumero && modalTipoOperacao) {
              const diaNumero = quadradinho.textContent || '';

              // Função para buscar meta correta da tabela
              const buscarMetaDaTabela = (diaOperacao: string) => {
                const tabelasJuros = document.getElementById('tabelas-juros');
                const tabelaCorpo = tabelasJuros?.querySelector('tbody');

                if (tabelaCorpo) {
                  const linhas = tabelaCorpo.querySelectorAll('tr');
                  const diaIndex = parseInt(diaOperacao) - 1; // Converter para índice (dia 1 = índice 0)

                  if (linhas[diaIndex]) {
                    const colunas = linhas[diaIndex].querySelectorAll('td');
                    if (colunas.length >= 4) {
                      // Coluna 3 (índice 3) contém a META do dia
                      return colunas[3].textContent?.trim() || '$0,00';
                    }
                  }
                }
                return '$0,00';
              };

              // Buscar meta correta da tabela baseada no dia
              const metaCorreta = buscarMetaDaTabela(diaNumero);

              (window as any).metaValorAtual = metaCorreta;
              (window as any).quadradinhoAtual = quadradinho;

              modalTitulo.textContent = `Operação ${diaNumero}`;
              modalDiaNumero.textContent = diaNumero;

              modalOperacao.classList.remove('hidden');
              modalOperacao.classList.add('show');

              (modalTipoOperacao as HTMLInputElement).value = '';
            }
          });

          operacoesContainer.appendChild(quadradinho);
        });

        // Armazenar valores do ciclo anterior no histórico
        setHistoricoValoresCiclos(prev => [...prev, valoresAcumulados]);
        setValoresAcumulados(metasDias);

        // Atualizar valor investido para o próximo cálculo com o valor da última meta
        valorInvestidoInput.value = novoValorInicial.toFixed(2);
      }
    }
  };

  // useEffect para gerenciar o botão próximo ciclo
  useEffect(() => {
    const proximoCicloBtn = document.getElementById('proximo-ciclo');

    const handleProximoCiclo = () => {
      // Gerar mensagens motivacionais uma única vez quando o modal é aberto
      if (cicloAtual >= 6) {
        // Gerar mensagem para ciclo completo
        setMensagemMotivacionalCiclo(getRandomMessage(ciclosCompletosMessages));
        // Modal de finalização de todos os ciclos (6 ciclos completos)
        setShowModalProximoCiclo(true);
        return;
      }

      // Gerar mensagem para próximo ciclo
      setMensagemMotivacionalCiclo(getRandomMessage(proximoCicloMessages));
      // Mostrar modal de parabéns e avançar para próximo ciclo
      setShowModalProximoCiclo(true);
    };

    proximoCicloBtn?.addEventListener('click', handleProximoCiclo);

    return () => {
      proximoCicloBtn?.removeEventListener('click', handleProximoCiclo);
    };
  }, [cicloAtual]);

  // Função para confirmar próximo ciclo
  const confirmarProximoCiclo = () => {
    if (cicloAtual >= 6) {
      // Reiniciar sistema após 6 ciclos
      setCicloAtual(1);
      setValoresAcumulados([]);
      setHistoricoValoresCiclos([]);

      // Limpar interface
      const operacoesContainer = document.getElementById('operacoes');
      const tabelaCorpo = document.getElementById('tabelas-juros')?.querySelector('tbody');
      const cicloNumero = document.getElementById('ciclo-numero');

      if (operacoesContainer) operacoesContainer.innerHTML = '<div id="aguardando-registros" class="col-span-6 text-center py-8"><p class="text-gray-500 italic text-lg">Aguardando registros iniciais do setup</p></div>';
      if (tabelaCorpo) tabelaCorpo.innerHTML = '';
      if (cicloNumero) cicloNumero.textContent = '0';

      toast({
        title: "🎉 Sistema Reiniciado",
        description: "Parabéns! Você completou 6 ciclos. O sistema foi reiniciado para um novo gerenciamento.",
        variant: "default"
      });
    } else {
      // Avançar para próximo ciclo
      setCicloAtual(prev => prev + 1);
      recalcularTabelaProximoCiclo();

      // Esconder botão próximo ciclo
      const proximoCicloBtn = document.getElementById('proximo-ciclo');
      if (proximoCicloBtn) {
        proximoCicloBtn.classList.add('hidden');
        proximoCicloBtn.classList.remove('bg-gradient-to-r', 'from-green-500', 'to-green-600', 'text-white');
        proximoCicloBtn.classList.add('bg-gray-300', 'text-gray-700');
      }

      toast({
        title: "🚀 Novo Ciclo Iniciado",
        description: `Bem-vindo ao Ciclo ${cicloAtual + 1}! As metas foram recalculadas com base no seu progresso.`,
        variant: "default"
      });
    }

    setShowModalProximoCiclo(false);
  };

  // Função para desenvolvimento - colorir todos os quadradinhos aleatoriamente
  const colorirTodosQuadradinhos = () => {
    const operacoesContainer = document.getElementById('operacoes');
    if (operacoesContainer) {
      const quadradinhos = operacoesContainer.querySelectorAll('div[data-meta]');

      // Cores disponíveis: verde (lucro), laranja (perda reposta), vermelho (perda não reposta)
      const cores = ['#16a34a', '#ea580c', '#dc2626']; // Verde, Laranja, Vermelho

      quadradinhos.forEach((quadradinho) => {
        const elemento = quadradinho as HTMLElement;
        // Escolher cor aleatória
        const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

        // Aplicar cor
        elemento.style.backgroundColor = corAleatoria;
        elemento.style.color = 'white';
      });

      // Verificar se o ciclo está completo após colorir todos
      setTimeout(() => verificarCicloCompleto(), 200);

      toast({
        title: "🎨 Quadradinhos Coloridos",
        description: "Todos os quadradinhos foram coloridos aleatoriamente para teste de desenvolvimento.",
        variant: "default"
      });
    }
  };

  return (
    <div ref={containerRef} className="day-trade-system relative z-20">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-6 text-center shadow-lg mt-6 rounded-2xl">
        <h1 className="text-3xl font-bold">Setup Operacional</h1>
      </header>
      <main className="p-5">
        <section id="fluxograma" className="mb-12 flex justify-center items-center">
          <div className="glass-card flex flex-col items-center justify-center p-4 w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-full shadow hover:bg-indigo-500 transition duration-200 focus:outline-none"
              onClick={() => setShowFluxograma(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">Preview Fluxograma</span>
            </button>
            <span className="text-xs text-gray-400 mt-2">Clique para visualizar o fluxograma em tela cheia</span>
          </div>
          {/* Modal de preview do fluxograma */}
          {showFluxograma && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
              <div className="relative w-full h-full flex items-center justify-center">
                <button
                  className="absolute top-6 right-8 z-50 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 shadow-lg focus:outline-none"
                  onClick={() => setShowFluxograma(false)}
                  aria-label="Fechar preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src="/fluxograma.png"
                  alt="Fluxograma em tela cheia"
                  className="w-auto h-auto max-w-[98vw] max-h-[96vh] rounded-xl shadow-2xl border-4 border-white/20 bg-white/10"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </section>

        <section id="registro" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Registro de Valores</h2>

          {/* Seletor "Modo de Mercado" */}
          <div className="mb-4">
            <label htmlFor="modoMercado" className="block text-lg mb-2">Modo de Mercado:</label>
            <select id="modoMercado" className="mt-1 block w-full border border-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400" style={{ backgroundColor: 'rgba(20,20,20,0.85)', color: '#fff' }}>
              <option value="spot" style={{ backgroundColor: '#18181b', color: '#fff' }}>Spot</option>
              <option value="futuros" style={{ backgroundColor: '#18181b', color: '#fff' }}>Futuros</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="caixa1" className="block text-lg">Valor destinado para OP (Caixa 1):</label>
              <input type="text" id="caixa1" className="mt-1 block w-full border border-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400" placeholder="Insira o valor" />
            </div>
            <div>
              <label htmlFor="caixa2" className="block text-lg">Reserva para repor SL (Caixa 2):</label>
              <input type="text" id="caixa2" className="mt-1 block w-full border border-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400" placeholder="Insira o valor" />
            </div>
          </div>
          <button id="registrar-valores" className="mt-6 w-1/2 mx-auto block bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2 px-4 text-base rounded-full shadow hover:bg-indigo-500 transition duration-200">Registrar Valores</button>

          <button id="apagar-preenchimentos" className="mt-4 w-1/2 mx-auto block bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white py-2 px-4 text-base rounded-full shadow hover:bg-orange-500 transition duration-200">Reiniciar Operacional</button>
        </section>

        <section id="caixas" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div id="display-caixa1" className="glass-card shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 relative">
            <h3 id="valor-caixa1" className="text-3xl font-bold">$0,00</h3>
            <p className="text-lg">Caixa 1</p>
            <small className="text-gray-500">Valor destinado para operação</small>

            {/* Tooltip com bolinha */}
            <div className="tooltip">
              <div className="icon">i</div>
              <div className="tooltiptext">
                Ao transferir parte do lucro para o caixa 2, ele não será considerado no seu indicativo de lucro no caixa 1, pois você aceitou usá-lo como reserva para cobrir futuros stop loss.
              </div>
            </div>

            {/* Elemento para exibir o lucro ou perda */}
            <div id="status-caixa1"></div>
          </div>


          <div id="display-caixa2" className="glass-card shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105">
            <h3 id="valor-caixa2" className="text-3xl font-bold">$0,00</h3>
            <p className="text-lg">Caixa 2</p>
            <small className="text-gray-500">Reserva para repor StopLoss</small>

            {/* Elemento para exibir o status da reserva */}
            <div id="status-caixa2" className="text-lg font-bold mt-2"></div> {/* Status do Caixa 2 */}

            {/* Novo elemento para exibir o status de abastecimento de perda */}
            <div id="abastecido-perda" className="text-lg mt-2"></div> {/* Removido o 'font-bold' para não ter negrito */}
          </div>
        </section>

        {/* Tabela para exibir registros */}
        <section id="historico-de-registros" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Registro Inicial Fixo</h2>

          {/* Tabela para exibir os valores registrados */}
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
              <tbody id="historico-registros-body">
                {/* Mensagem quando não há registros */}
                <tr id="sem-registros" className="text-center">
                  <td colSpan={6} className="py-8 px-6 text-gray-500 italic">
                    Nenhum registro encontrado
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          {/* Área de Total Comprometido abaixo da tabela */}
          <div id="total-comprometido" className="bg-indigo-700 text-white p-6 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-semibold text-white">Total Comprometido</h3>
            <p className="text-lg mt-2 flex justify-between">
              <span className="text-white">Total dos Caixas:</span>
              <span id="total-dos-caixas" className="text-lg text-right text-white">$0,00</span>
            </p>
          </div>


          <div id="Valores-atuais" className="bg-gradient-to-r from-gray-800 to-black border border-gray-700 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-white">Resultado Atual</h3>
            {/* Total Atual */}
            <div className="grid grid-cols-2 gap-4">
              <p className="text-lg font-medium text-white whitespace-nowrap">Total dos caixas:</p>
              <p className="text-lg text-right font-bold text-white"><span id="total-dos-caixas-atual">$0,00</span></p> {/* Mudança aqui */}
            </div>
            {/* Ganho/Perda Líquida */}
            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-end"> {/* Flexbox para alinhar o título à direita */}
                <p className="text-xs font-medium text-white">Ganho/Perda Líquida:</p>
              </div>
              <div className="flex justify-end"> {/* Flexbox para alinhar o valor à direita */}
                <p className="text-xs text-right text-gray-300">
                  <span id="ganho-perda-liquida-valor" className="text-green-400 inline font-bold text-x3">+$0,00</span>
                  <span id="ganho-perda-liquida-percentual" className="text-green-400 inline font-bold text-x3">(+0.00%)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="juros-compostos" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Metas Juros Compostos</h2>
          <div>
            <label htmlFor="valor-investido" className="block text-lg">Valor Investido (Caixa 1):</label>
            <input type="text" id="valor-investido" className="mt-1 block w-full border border-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400" placeholder="Insira o valor" />
            <label htmlFor="retorno" className="block text-lg mt-4">Retorno em %:</label>
            <input type="number" id="retorno" className="mt-1 block w-full border border-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400" step="0.01" placeholder="Insira o percentual" />
          </div>
          <button id="calcular" className="mt-6 w-1/2 mx-auto block bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2 rounded-full shadow hover:bg-indigo-500 transition duration-200">Calcular Metas</button>

          <div id="tabelas-juros" className="mt-4 overflow-x-auto hidden">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-4 px-6 border-b">Operação</th>
                  <th className="py-4 px-6 border-b">Investimento</th>
                  <th className="py-4 px-6 border-b">Retorno em %</th>
                  <th className="py-4 px-6 border-b">Meta</th>
                  <th className="py-4 px-6 border-b">Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {/* As linhas da tabela serão geradas aqui pelo JavaScript */}
              </tbody>
            </table>
          </div>
        </section>

        <section id="ciclo-atual" className="glass-card p-6 rounded-lg shadow-md mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Ciclo Atual</h2>
            <p id="ciclo-indicativo" className="text-xl">
              Ciclo:
              <span id="ciclo-numero" className="bg-indigo-600 text-white font-bold px-1 rounded">
                0
              </span>
            </p>
          </div>
          <dotlottie-player
            src="https://lottie.host/7185b89d-8d4d-4244-b1ba-ea45abc09061/E4HEcLJCIy.lottie"
            background="transparent"
            speed="1"
            style={{ width: '80px', height: '80px' }}
            loop autoplay>
          </dotlottie-player>
        </section>

        <section id="interacoes" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Total de Operações</h2>

          {/* Botão de desenvolvimento para colorir quadradinhos */}
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-yellow-400">🔧 Desenvolvimento</h3>
                <p className="text-xs text-yellow-300">Botão para facilitar testes - colorir todos os quadradinhos</p>
              </div>
              <button
                onClick={colorirTodosQuadradinhos}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition duration-200 text-sm font-semibold"
              >
                Colorir Todos os Quadradinhos
              </button>
            </div>
          </div>

          <div id="operacoes" className="grid grid-cols-6 gap-2">
            {/* Mensagem quando não há registros iniciais */}
            <div id="aguardando-registros" className="col-span-6 text-center py-8">
              <p className="text-gray-500 italic text-lg">Aguardando registros iniciais do setup</p>
            </div>
          </div>

          {/* Explicação das cores dos quadradinhos - pequeno, alinhado à esquerda, formação vertical, compacto e elegante */}
          <div className="w-full flex justify-start mt-2">
            <div className="text-[9px] text-gray-400 text-left leading-tight" style={{ maxWidth: 260, lineHeight: '1.2' }}>
              <span className="font-semibold text-white">Cores dos Quadradinhos</span><br />
              <span className="block">🟢 <span className="align-middle">Verde:</span> Quando o lucro bate ou ultrapassa a meta</span>
              <span className="block">🟡 <span className="align-middle">Amarelo:</span> Quando o lucro não atinge a meta</span>
              <span className="block">🟠 <span className="align-middle">Laranja:</span> Quando há prejuízo reposto com fundos do Caixa 2</span>
              <span className="block">🔴 <span className="align-middle">Vermelho:</span> Quando há prejuízo não reposto (debitado apenas do Caixa 1)</span>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button id="proximo-ciclo" className="px-8 py-2.5 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition-all duration-300 font-medium text-sm flex items-center gap-2 hidden">
              <span>Próximo Ciclo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>

        <section id="planilha" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <footer className="text-center">
            <dotlottie-player
              src="https://lottie.host/875a6142-613e-4753-8bcc-c1e9742e0782/XwcetC116L.lottie"
              background="transparent"
              speed="1"
              style={{ width: '290px', height: '290px', margin: '0 auto' }}
              loop autoplay>
            </dotlottie-player>
            <button id="link-planilha" className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transition duration-200">
              Planilha de Finanças Pessoais
            </button>
          </footer>
        </section>
      </main>

      {/* Modal de sucesso */}
      <div id="modal-success" className="modal hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <span className="close-btn float-right cursor-pointer text-lg">&times;</span>
          <p id="success-message">Mensagem de sucesso aqui.</p>
          <button id="success-ok" className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200">OK</button>
        </div>
      </div>

      {/* Modal de erro */}
      <div id="modal-error" className="modal hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <span className="close-btn float-right cursor-pointer text-lg">&times;</span>
          <p id="error-message">Mensagem de erro aqui.</p>
          <button id="error-ok" className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">OK</button>
        </div>
      </div>

      {/* Modal de celebração */}
      <div id="modal-celebracao" className="modal hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">

          {/* Animação de confetti */}
          <dotlottie-player src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie"
            background="transparent"
            speed="1"
            style={{ width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
            loop
            autoplay>
          </dotlottie-player>

          {/* Conteúdo do modal */}
          <img src="https://ferramentas.x10.mx/ferramentas/setup/champagne.gif" alt="Celebração" className="mx-auto mb-4" style={{ width: '90px', height: 'auto', zIndex: 10 }} />
          <h2 className="text-2xl font-bold text-green-600">Incrível!</h2>
          <p>Você chegou ao final de todos os ciclos. Recomece com um novo gerenciamento!</p>
          <button id="celebracao-ok" className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200">Recomeçar 🥳</button>
        </div>
      </div>

      {/* Modal de Lucro Abaixo da Meta */}
      {showModalLucroAbaixoMeta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4" style={{ zIndex: 10 }}>
              ⚠️ Meta Não Atingida
            </h2>

            {/* Mensagem de lucro abaixo da meta */}
            <p className="text-white text-lg mb-6" style={{ zIndex: 10 }}>
              {mensagemLucroAbaixoMeta}
            </p>

            <button
              onClick={() => setShowModalLucroAbaixoMeta(false)}
              className="mt-4 w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition duration-200 font-semibold"
              style={{ zIndex: 10 }}
            >
              Entendi, vou melhorar! 💪
            </button>
          </div>
        </div>
      )}

      {/* Modal de Próximo Ciclo */}
      {showModalProximoCiclo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">

            {/* Animação de confetti */}
            <dotlottie-player src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie"
              background="transparent"
              speed="1"
              style={{ width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
              loop
              autoplay>
            </dotlottie-player>

            {/* Animação principal */}
            <dotlottie-player src="https://lottie.host/2a8c8c7e-0563-4916-bef3-55ea76ce5565/amymtVr308.lottie"
              background="transparent"
              speed="1"
              style={{ width: '120px', height: '120px', margin: '0 auto', display: 'block' }}
              loop
              autoplay>
            </dotlottie-player>

            <h2 className="text-2xl font-bold text-green-400 mb-4" style={{ zIndex: 10 }}>
              {cicloAtual >= 6 ? 'Parabéns! Sistema Completo!' : 'Parabéns!'}
            </h2>

            {/* Mensagem motivacional */}
            <p className="text-white text-lg mb-6" style={{ zIndex: 10 }}>
              {mensagemMotivacionalCiclo}
            </p>
            <button
              onClick={confirmarProximoCiclo}
              className="mt-4 w-full bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 transition duration-200 backdrop-blur-sm font-semibold"
              style={{ zIndex: 10 }}
            >
              {cicloAtual >= 6 ? 'Reiniciar Sistema 🎉' : 'Começar Novo Ciclo 🥳'}
            </button>
          </div>
        </div>
      )}

      <audio id="myAudio" src="https://ferramentas.x10.mx/ferramentas/setup/audio_473a42432c.mp3"></audio>

      {/* Modal de entrada */}
      <div id="inputModal" className="modal hidden">
        <div className="modal-content">
          <span className="close" id="modalClose">&times;</span>
          <h2 id="modalTitle"></h2>
          <input type="text" id="modalInput" placeholder="Digite aqui..." />
          <button id="modalSubmit">Enviar</button>
        </div>
      </div>

      {/* Modal de Operação */}
      <div id="modal-operacao" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => {
              const modalOperacao = document.getElementById('modal-operacao');
              if (modalOperacao) {
                modalOperacao.classList.add('hidden');
                modalOperacao.classList.remove('show');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 id="modal-operacao-titulo" className="text-2xl font-bold mb-4 text-indigo-500">Operação</h2>

          <div className="mb-4">
            <p className="text-gray-200 mt-2 hidden">
              Dia: <span id="modal-operacao-dia" className="font-bold"></span>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-lg mb-2 text-gray-200">Resultado da Operação</p>
            <input
              type="text"
              id="modal-operacao-resultado"
              placeholder="Digite lucro ou prejuízo"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/10 text-white placeholder-gray-300"
            />
          </div>

          <button
            className="mt-6 w-full bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition duration-200 backdrop-blur-sm"
            onClick={() => {
              const modalOperacao = document.getElementById('modal-operacao');
              const resultadoInput = document.getElementById('modal-operacao-resultado') as HTMLInputElement;

              if (modalOperacao && resultadoInput) {
                const resultado = resultadoInput.value.trim().toLowerCase();

                if (resultado === 'lucro' || resultado === 'prejuízo' || resultado === 'prejuizo' || resultado === 'preju') {
                  if (resultado === 'lucro') {
                    const modalValorLucro = document.getElementById('modal-valor-lucro');
                    const modalValorLucroTitulo = document.getElementById('modal-valor-lucro-titulo');
                    const modalValorLucroDia = document.getElementById('modal-valor-lucro-dia');
                    const modalValorLucroMeta = document.getElementById('modal-valor-lucro-meta');

                    if (modalValorLucro && modalValorLucroTitulo && modalValorLucroDia && modalValorLucroMeta) {
                      const diaNumero = document.getElementById('modal-operacao-dia')?.textContent || '';
                      // Obter o valor da meta da variável global
                      const metaValor = (window as any).metaValorAtual || '';

                      // Use the day from Brasilia date if available, otherwise use the operation number
                      const brasiliaDay = (window as any).brasiliaDate?.day || diaNumero;
                      modalValorLucroTitulo.textContent = `Quanto você lucrou no Dia ${brasiliaDay}`;
                      modalValorLucroDia.textContent = brasiliaDay;
                      modalValorLucroMeta.textContent = metaValor;

                      modalOperacao.classList.add('hidden');
                      modalOperacao.classList.remove('show');

                      modalValorLucro.classList.remove('hidden');
                      modalValorLucro.classList.add('show');
                    }
                  } else {
                    // Lógica para prejuízo
                    const modalValorPrejuizo = document.getElementById('modal-valor-prejuizo');
                    const modalValorPrejuizoTitulo = document.getElementById('modal-valor-prejuizo-titulo');
                    const modalValorPrejuizoDia = document.getElementById('modal-valor-prejuizo-dia');
                    const modalValorPrejuizoMeta = document.getElementById('modal-valor-prejuizo-meta');

                    if (modalValorPrejuizo && modalValorPrejuizoTitulo && modalValorPrejuizoDia && modalValorPrejuizoMeta) {
                      const diaNumero = document.getElementById('modal-operacao-dia')?.textContent || '';
                      // Obter o valor da meta da variável global
                      const metaValor = (window as any).metaValorAtual || '';

                      // Use the day from Brasilia date if available, otherwise use the operation number
                      const brasiliaDay = (window as any).brasiliaDate?.day || diaNumero;
                      modalValorPrejuizoTitulo.textContent = `Quanto você perdeu no Dia ${brasiliaDay}`;
                      modalValorPrejuizoDia.textContent = brasiliaDay;
                      modalValorPrejuizoMeta.textContent = metaValor;

                      modalOperacao.classList.add('hidden');
                      modalOperacao.classList.remove('show');

                      modalValorPrejuizo.classList.remove('hidden');
                      modalValorPrejuizo.classList.add('show');
                    }
                  }

                  resultadoInput.value = ''; // Limpar o input após processar
                } else {
                  toast({
                    title: "❌ Entrada Inválida",
                    description: 'Digite "lucro", "prejuízo" ou "preju" para registrar o resultado da operação.',
                    variant: "destructive"
                  });
                }
              }
            }}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal de Valor do Lucro */}
      <div id="modal-valor-lucro" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => {
              const modalValorLucro = document.getElementById('modal-valor-lucro');
              if (modalValorLucro) {
                modalValorLucro.classList.add('hidden');
                modalValorLucro.classList.remove('show');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 id="modal-valor-lucro-titulo" className="text-2xl font-bold mb-4 text-indigo-500">Quanto você lucrou na operação</h2>

          <div className="mb-4">
            <p className="text-gray-200 mt-2 hidden">
              Dia: <span id="modal-valor-lucro-dia" className="font-bold"></span>
            </p>
            <p className="text-gray-200 mt-2 flex items-center justify-center gap-2">
              Meta do Dia:
              <span
                id="modal-valor-lucro-meta"
                className="font-bold text-white bg-indigo-600 px-3 py-1 rounded-full text-sm"
              ></span>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-lg mb-2 text-gray-200">Valor do Lucro</p>
            <input
              type="text"
              id="modal-valor-lucro-input"
              placeholder="Digite o valor do lucro"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/10 text-white placeholder-gray-300"
            />
          </div>

          <button
            className="mt-6 w-full bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition duration-200 backdrop-blur-sm"
            onClick={() => {
              const modalValorLucro = document.getElementById('modal-valor-lucro');
              const valorLucroInput = document.getElementById('modal-valor-lucro-input') as HTMLInputElement;

              if (modalValorLucro && valorLucroInput) {
                const valorLucro = parseFloat(valorLucroInput.value.replace(/[^\d,\.]/g, '').replace(',', '.'));
                const metaValor = parseFloat(
                  document.getElementById('modal-valor-lucro-meta')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );

                if (!isNaN(valorLucro) && valorLucro > 0) {
                  if (valorLucro > metaValor) {
                    // Modal de confirmação para enviar excedente
                    const modalExcedente = document.getElementById('modal-excedente-lucro');
                    const modalExcedenteValor = document.getElementById('modal-excedente-valor');
                    const modalExcedenteMeta = document.getElementById('modal-excedente-meta');
                    const modalExcedenteExcesso = document.getElementById('modal-excedente-excesso');

                    if (modalExcedente && modalExcedenteValor && modalExcedenteMeta && modalExcedenteExcesso) {
                      const excesso = valorLucro - metaValor;

                      modalExcedenteValor.textContent = `$${valorLucro.toFixed(2)}`;
                      modalExcedenteMeta.textContent = `$${metaValor.toFixed(2)}`;
                      modalExcedenteExcesso.textContent = `$${excesso.toFixed(2)}`;

                      modalValorLucro.classList.add('hidden');
                      modalValorLucro.classList.remove('show');

                      modalExcedente.classList.remove('hidden');
                      modalExcedente.classList.add('show');
                    }
                  } else {
                    // Lucro menor ou igual à meta
                    const displayValorCaixa1 = document.getElementById('valor-caixa1');
                    const displayValorCaixa2 = document.getElementById('valor-caixa2');
                    const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
                    const valorCaixa2Input = document.getElementById('caixa2') as HTMLInputElement;
                    const registrarValoresBtn = document.getElementById('registrar-valores');

                    if (displayValorCaixa1 && displayValorCaixa2 && valorCaixa1Input && valorCaixa2Input && registrarValoresBtn) {
                      // Converter os valores atuais dos caixas para número
                      const valorAtualCaixa1 = parseFloat(
                        displayValorCaixa1.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                      );
                      const valorAtualCaixa2 = parseFloat(
                        displayValorCaixa2.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                      );

                      // Somar o lucro ao Caixa 1 mantendo o Caixa 2 como estava
                      const novoValorCaixa1 = valorAtualCaixa1 + valorLucro;

                      // Formatar os valores para exibição
                      const formatarValor = (valor: number) => {
                        return (valor < 0 ? '-' : '') + '$' + new Intl.NumberFormat('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(Math.abs(valor));
                      };

                      // Atualizar apenas os displays dos caixas
                      displayValorCaixa1.textContent = formatarValor(novoValorCaixa1);
                      displayValorCaixa2.textContent = formatarValor(valorAtualCaixa2);

                      registrarValoresBtn.click();

                      // Obter o número do dia do quadradinho atual
                      const diaNumero = document.getElementById('modal-valor-lucro-dia')?.textContent || '';

                      // Não exibir toast, a mensagem será mostrada no modal

                      // Mostrar modal de parabéns quando bater a meta exata
                      if (valorLucro === metaValor) {
                        // Gerar mensagem motivacional uma única vez quando o modal é aberto
                        setMensagemMotivacionalParabens(getRandomMessage(lucroMetaMessages));

                        // Obter o número do dia do quadradinho atual
                        const diaNumero = (window as any).quadradinhoAtual?.textContent || document.getElementById('modal-valor-lucro-dia')?.textContent || '';
                        // Obter o dia do mês de Brasília
                        const brasiliaDay = (window as any).brasiliaDate?.day || diaNumero;

                        // Toast: usar diaNumero
                        setMensagemMetaBatida(`Meta da operação ${brasiliaDay} batida com sucesso! Valor $${valorLucro.toFixed(2)} registrado no Caixa 1.`);
                        toast({
                          title: "✅ Meta Batida!",
                          description: `Meta da operação ${diaNumero} batida com sucesso! Valor $${valorLucro.toFixed(2)} registrado no Caixa 1.`,
                          variant: "default"
                        });

                        const modalParabens = document.getElementById('modal-parabens');
                        if (modalParabens) {
                          modalParabens.classList.remove('hidden');
                          modalParabens.classList.add('show');
                        }
                      }
                      // Mostrar modal de lucro abaixo da meta
                      else if (valorLucro < metaValor) {
                        // Garantir que diaNumero é o número da operação, não o dia do mês
                        const diaNumero = (window as any).quadradinhoAtual?.textContent || '';
                        const diferenca = metaValor - valorLucro;
                        // Usar a função getRandomParametrizedMessage para obter uma mensagem dinâmica
                        setMensagemLucroAbaixoMeta(getRandomParametrizedMessage(parseInt(diaNumero) || 0, valorLucro, metaValor));

                        // Toast informando que o valor foi registrado no Caixa 1
                        toast({
                          title: `⚠️ Meta não atingida na operação ${diaNumero}`,
                          description: `Valor de $${valorLucro.toFixed(2)} registrado no Caixa 1.`,
                          variant: "default"
                        });

                        // Mostrar o modal de lucro abaixo da meta
                        setShowModalLucroAbaixoMeta(true);
                      }

                      // Mudar cor do quadradinho com base no resultado
                      const quadradinhoAtual = (window as any).quadradinhoAtual;
                      if (quadradinhoAtual) {
                        if (valorLucro >= metaValor) {
                          quadradinhoAtual.style.backgroundColor = '#16a34a'; // Verde quando bate ou ultrapassa a meta
                        } else {
                          quadradinhoAtual.style.backgroundColor = '#eab308'; // Amarelo quando o lucro é menor que a meta
                        }
                        quadradinhoAtual.style.color = 'white';

                        // Verificar se o ciclo está completo após colorir o quadradinho
                        setTimeout(() => verificarCicloCompleto(), 100);
                      }

                      modalValorLucro.classList.add('hidden');
                      modalValorLucro.classList.remove('show');
                    }
                  }
                } else {
                  toast({
                    title: "❌ Valor Inválido",
                    description: "Digite um valor de lucro válido em formato numérico.",
                    variant: "destructive"
                  });
                }
              }
            }}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal de Excedente de Lucro */}
      <div id="modal-excedente-lucro" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">
          <h2 className="text-2xl font-bold mb-4 text-indigo-500">Parabéns!</h2>

          <p className="text-gray-200 mb-4">Você ultrapassou a meta do dia.</p>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">Valor Total:</p>
              <p id="modal-excedente-valor" className="text-white font-bold"></p>
            </div>
            <div>
              <p className="text-gray-300">Meta do Dia:</p>
              <p id="modal-excedente-meta" className="text-white font-bold"></p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-300">Valor Excedente:</p>
            <p id="modal-excedente-excesso" className="text-indigo-400 font-bold text-xl"></p>
          </div>

          <p className="text-gray-200 mb-4">Deseja enviar o excedente para o Caixa 2?</p>

          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
              onClick={() => {
                const modalExcedente = document.getElementById('modal-excedente-lucro');
                const valorTotalLucro = parseFloat(
                  document.getElementById('modal-excedente-valor')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );
                const metaDia = parseFloat(
                  document.getElementById('modal-excedente-meta')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );
                const valorExcedente = parseFloat(
                  document.getElementById('modal-excedente-excesso')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );

                const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
                const valorCaixa2Input = document.getElementById('caixa2') as HTMLInputElement;
                const displayValorCaixa1 = document.getElementById('valor-caixa1');
                const displayValorCaixa2 = document.getElementById('valor-caixa2');
                const registrarValoresBtn = document.getElementById('registrar-valores');

                if (valorCaixa1Input && valorCaixa2Input && displayValorCaixa1 && displayValorCaixa2 && registrarValoresBtn) {
                  // Converter os valores atuais dos caixas para número
                  const valorAtualCaixa1 = parseFloat(
                    displayValorCaixa1.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                  );
                  const valorAtualCaixa2 = parseFloat(
                    displayValorCaixa2.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                  );

                  // Somar apenas a meta ao Caixa 1 e o excedente ao Caixa 2
                  const novoValorCaixa1 = valorAtualCaixa1 + metaDia;
                  const novoValorCaixa2 = valorAtualCaixa2 + valorExcedente;

                  // Formatar os novos valores para exibição
                  const formatarValor = (valor: number) => {
                    return (valor < 0 ? '-' : '') + '$' + new Intl.NumberFormat('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(Math.abs(valor));
                  };

                  // Atualizar os inputs e displays dos caixas
                  // valorCaixa1Input.value = novoValorCaixa1.toFixed(2);
                  // valorCaixa2Input.value = novoValorCaixa2.toFixed(2);
                  displayValorCaixa1.textContent = formatarValor(novoValorCaixa1);
                  displayValorCaixa2.textContent = formatarValor(novoValorCaixa2);

                  // Mudar cor do quadradinho para verde quando envia excedente para caixa 2
                  const quadradinhoAtual = (window as any).quadradinhoAtual;
                  if (quadradinhoAtual) {
                    quadradinhoAtual.style.backgroundColor = '#16a34a'; // Verde
                    quadradinhoAtual.style.color = 'white';

                    // Verificar se o ciclo está completo após colorir o quadradinho
                    setTimeout(() => verificarCicloCompleto(), 100);
                  }

                  // registrarValoresBtn.click();

                  toast({
                    title: "💰 Excedente Transferido",
                    description: `Excedente de $${valorExcedente.toFixed(2)} enviado para o Caixa 2 com sucesso!`,
                    variant: "default"
                  });

                  if (modalExcedente) {
                    modalExcedente.classList.add('hidden');
                    modalExcedente.classList.remove('show');
                  }
                }
              }}
            >
              Sim, enviar para Caixa 2
            </button>
            <button
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
              onClick={() => {
                const modalExcedente = document.getElementById('modal-excedente-lucro');
                const valorLucro = parseFloat(
                  document.getElementById('modal-excedente-valor')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );

                const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
                const registrarValoresBtn = document.getElementById('registrar-valores');

                if (valorCaixa1Input && registrarValoresBtn) {
                  // valorCaixa1Input.value = valorLucro.toFixed(2);
                  // registrarValoresBtn.click();

                  // Mudar cor do quadradinho para verde quando mantém tudo no caixa 1
                  const quadradinhoAtual = (window as any).quadradinhoAtual;
                  if (quadradinhoAtual) {
                    quadradinhoAtual.style.backgroundColor = '#16a34a'; // Verde
                    quadradinhoAtual.style.color = 'white';

                    // Verificar se o ciclo está completo após colorir o quadradinho
                    setTimeout(() => verificarCicloCompleto(), 100);
                  }

                  toast({
                    title: "💎 Lucro Mantido",
                    description: `Lucro de $${valorLucro.toFixed(2)} mantido integralmente no Caixa 1!`,
                    variant: "default"
                  });

                  if (modalExcedente) {
                    modalExcedente.classList.add('hidden');
                    modalExcedente.classList.remove('show');
                  }
                }
              }}
            >
              Não, manter tudo no Caixa 1
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Parabéns */}
      <div id="modal-parabens" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">

          {/* Animação de confetti */}
          <dotlottie-player src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie"
            background="transparent"
            speed="1"
            style={{ width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
            loop
            autoplay>
          </dotlottie-player>

          <h2 className="text-3xl font-bold text-green-400 mb-4" style={{ zIndex: 10 }}>🎉 Parabéns! 🎉</h2>

          {/* Mensagem motivacional */}
          <p className="text-white text-lg mb-2" style={{ zIndex: 10 }}>
            {mensagemMotivacionalParabens}
          </p>

          {/* Mensagem de meta batida */}
          {mensagemMetaBatida && (
            <p className="text-green-400 text-sm mb-6" style={{ zIndex: 10 }}>
              {/* Removendo a mensagem do modal */}
            </p>
          )}

          <button
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
            style={{ zIndex: 10 }}
            onClick={() => {
              const modalParabens = document.getElementById('modal-parabens');
              if (modalParabens) {
                modalParabens.classList.add('hidden');
                modalParabens.classList.remove('show');
              }
            }}
          >
            Continue Assim! 🚀
          </button>
        </div>
      </div>

      {/* Modal de Valor do Prejuízo */}
      <div id="modal-valor-prejuizo" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => {
              const modalValorPrejuizo = document.getElementById('modal-valor-prejuizo');
              if (modalValorPrejuizo) {
                modalValorPrejuizo.classList.add('hidden');
                modalValorPrejuizo.classList.remove('show');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 id="modal-valor-prejuizo-titulo" className="text-2xl font-bold mb-4 text-red-500">Quanto você perdeu no Dia</h2>

          <div className="mb-4">
            <p className="text-gray-200 mt-2 hidden">
              Dia: <span id="modal-valor-prejuizo-dia" className="font-bold"></span>
            </p>
            <p className="text-gray-200 mt-2 flex items-center justify-center gap-2">
              Meta do Dia:
              <span
                id="modal-valor-prejuizo-meta"
                className="font-bold text-white bg-indigo-600 px-3 py-1 rounded-full text-sm"
              ></span>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-lg mb-2 text-gray-200">Valor da Perda</p>
            <input
              type="text"
              id="modal-valor-prejuizo-input"
              placeholder="Digite o valor da perda"
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/10 text-white placeholder-gray-300"
            />
          </div>

          <button
            className="mt-6 w-full bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition duration-200 backdrop-blur-sm"
            onClick={() => {
              const modalValorPrejuizo = document.getElementById('modal-valor-prejuizo');
              const valorPrejuizoInput = document.getElementById('modal-valor-prejuizo-input') as HTMLInputElement;

              if (modalValorPrejuizo && valorPrejuizoInput) {
                const valorPerda = parseFloat(valorPrejuizoInput.value.replace(/[^\d,\.]/g, '').replace(',', '.'));

                if (!isNaN(valorPerda) && valorPerda > 0) {
                  const modalConfirmacaoCaixa2 = document.getElementById('modal-confirmacao-caixa2');
                  const modalConfirmacaoValorPerda = document.getElementById('modal-confirmacao-valor-perda');

                  if (modalConfirmacaoCaixa2 && modalConfirmacaoValorPerda) {
                    modalConfirmacaoValorPerda.textContent = `$${valorPerda.toFixed(2)}`;

                    modalValorPrejuizo.classList.add('hidden');
                    modalValorPrejuizo.classList.remove('show');

                    modalConfirmacaoCaixa2.classList.remove('hidden');
                    modalConfirmacaoCaixa2.classList.add('show');
                  }
                } else {
                  toast({
                    title: "❌ Valor Inválido",
                    description: "Digite um valor de perda válido em formato numérico.",
                    variant: "destructive"
                  });
                }
              }
            }}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal de Confirmação para usar Caixa 2 */}
      <div id="modal-confirmacao-caixa2" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden w-[500px]">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Repor Perda</h2>

          <p className="text-gray-200 mb-4">Você perdeu <span id="modal-confirmacao-valor-perda" className="text-red-400 font-bold"></span></p>

          <p className="text-gray-200 mb-6">Deseja repor a perda com fundos do Caixa 2?</p>

          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
              onClick={() => {
                const modalConfirmacaoCaixa2 = document.getElementById('modal-confirmacao-caixa2');
                const valorPerda = parseFloat(
                  document.getElementById('modal-confirmacao-valor-perda')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );

                const displayValorCaixa1 = document.getElementById('valor-caixa1');
                const displayValorCaixa2 = document.getElementById('valor-caixa2');
                const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
                const valorCaixa2Input = document.getElementById('caixa2') as HTMLInputElement;
                const registrarValoresBtn = document.getElementById('registrar-valores');

                if (displayValorCaixa1 && displayValorCaixa2 && valorCaixa1Input && valorCaixa2Input && registrarValoresBtn && valorPerda > 0) {
                  // Converter os valores atuais dos caixas para número
                  const valorAtualCaixa1 = parseFloat(
                    displayValorCaixa1.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                  );
                  const valorAtualCaixa2 = parseFloat(
                    displayValorCaixa2.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                  );

                  // Verificar se há fundos suficientes no Caixa 2
                  if (valorAtualCaixa2 >= valorPerda) {
                    // Debitar do Caixa 2 e repor no Caixa 1
                    const novoValorCaixa1 = valorAtualCaixa1 - valorPerda + valorPerda; // Remove perda e repõe
                    const novoValorCaixa2 = valorAtualCaixa2 - valorPerda;

                    // Formatar os valores para exibição
                    const formatarValor = (valor: number) => {
                      return (valor < 0 ? '-' : '') + '$' + new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(Math.abs(valor));
                    };

                    // Atualizar os inputs e displays dos caixas
                    // valorCaixa1Input.value = novoValorCaixa1.toFixed(2);
                    // valorCaixa2Input.value = novoValorCaixa2.toFixed(2);
                    displayValorCaixa1.textContent = formatarValor(novoValorCaixa1);
                    displayValorCaixa2.textContent = formatarValor(novoValorCaixa2);

                    // Mudar cor do quadradinho para laranja quando repõe a perda com caixa 2
                    const quadradinhoAtual = (window as any).quadradinhoAtual;
                    if (quadradinhoAtual) {
                      quadradinhoAtual.style.backgroundColor = '#ea580c'; // Laranja
                      quadradinhoAtual.style.color = 'white';

                      // Verificar se o ciclo está completo após colorir o quadradinho
                      setTimeout(() => verificarCicloCompleto(), 100);
                    }

                    registrarValoresBtn.click();

                    toast({
                      title: "🔄 Perda Reposta",
                      description: `Perda de $${valorPerda.toFixed(2)} foi coberta com fundos do Caixa 2.`,
                      variant: "default"
                    });
                  } else {
                    // Fundos insuficientes: debitar do Caixa 1 e quadradinho vermelho
                    const novoValorCaixa1 = valorAtualCaixa1 - valorPerda;
                    // Formatar os valores para exibição
                    const formatarValor = (valor: number) => {
                      return (valor < 0 ? '-' : '') + '$' + new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(Math.abs(valor));
                    };
                    displayValorCaixa1.textContent = formatarValor(novoValorCaixa1); // Permite valores negativos
                    displayValorCaixa2.textContent = formatarValor(valorAtualCaixa2);

                    // Aplicar cor vermelha se o valor for negativo
                    if (novoValorCaixa1 < 0) {
                      displayValorCaixa1.style.color = '#dc2626'; // Vermelho
                      displayValorCaixa1.style.fontWeight = 'bold';
                    } else {
                      displayValorCaixa1.style.color = ''; // Cor padrão
                      displayValorCaixa1.style.fontWeight = '';
                    }
                    // Quadradinho vermelho
                    const quadradinhoAtual = (window as any).quadradinhoAtual;
                    if (quadradinhoAtual) {
                      quadradinhoAtual.style.backgroundColor = '#dc2626'; // Vermelho
                      quadradinhoAtual.style.color = 'white';
                      setTimeout(() => verificarCicloCompleto(), 100);
                    }
                    registrarValoresBtn.click();
                    toast({
                      title: "❌ Fundos Insuficientes",
                      description: `Não há fundos suficientes no Caixa 2 para repor a perda. Perda de $${valorPerda.toFixed(2)} foi debitada do Caixa 1.`,
                      variant: "destructive"
                    });
                  }

                  if (modalConfirmacaoCaixa2) {
                    modalConfirmacaoCaixa2.classList.add('hidden');
                    modalConfirmacaoCaixa2.classList.remove('show');
                  }
                }
              }}
            >
              Sim, usar Caixa 2
            </button>
            <button
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
              onClick={() => {
                const modalConfirmacaoCaixa2 = document.getElementById('modal-confirmacao-caixa2');
                const valorPerda = parseFloat(
                  document.getElementById('modal-confirmacao-valor-perda')?.textContent
                    ?.replace(/[^\d,\.]/g, '')
                    .replace(',', '.') || '0'
                );

                const displayValorCaixa1 = document.getElementById('valor-caixa1');
                const displayValorCaixa2 = document.getElementById('valor-caixa2');
                const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
                const valorCaixa2Input = document.getElementById('caixa2') as HTMLInputElement;
                const registrarValoresBtn = document.getElementById('registrar-valores');

                if (displayValorCaixa1 && displayValorCaixa2 && valorCaixa1Input && valorCaixa2Input && registrarValoresBtn && valorPerda > 0) {
                  // Converter os valores atuais dos caixas para número
                  const valorAtualCaixa1 = parseFloat(
                    displayValorCaixa1.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                  );
                  const valorAtualCaixa2 = parseFloat(
                    displayValorCaixa2.textContent?.replace(/[^\d,\.]/g, '').replace(',', '.') || '0'
                  );

                  // Debitar apenas do Caixa 1
                  const novoValorCaixa1 = valorAtualCaixa1 - valorPerda;

                  // Formatar os valores para exibição
                  const formatarValor = (valor: number) => {
                    return (valor < 0 ? '-' : '') + '$' + new Intl.NumberFormat('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(Math.abs(valor));
                  };

                  // Atualizar os inputs e displays dos caixas
                  displayValorCaixa1.textContent = formatarValor(novoValorCaixa1); // Permite valores negativos
                  displayValorCaixa2.textContent = formatarValor(valorAtualCaixa2);

                  // Aplicar cor vermelha se o valor for negativo
                  if (novoValorCaixa1 < 0) {
                    displayValorCaixa1.style.color = '#dc2626'; // Vermelho
                    displayValorCaixa1.style.fontWeight = 'bold';
                  } else {
                    displayValorCaixa1.style.color = ''; // Cor padrão
                    displayValorCaixa1.style.fontWeight = '';
                  }

                  // Mudar cor do quadradinho para vermelho quando não aceita repor com caixa 2
                  const quadradinhoAtual = (window as any).quadradinhoAtual;
                  if (quadradinhoAtual) {
                    quadradinhoAtual.style.backgroundColor = '#dc2626'; // Vermelho
                    quadradinhoAtual.style.color = 'white';

                    // Verificar se o ciclo está completo após colorir o quadradinho
                    setTimeout(() => verificarCicloCompleto(), 100);
                  }

                  registrarValoresBtn.click();

                  toast({
                    title: "💔 Perda Registrada",
                    description: `Perda de $${valorPerda.toFixed(2)} registrada. Fundos debitados do Caixa 1.`,
                    variant: "destructive"
                  });

                  if (modalConfirmacaoCaixa2) {
                    modalConfirmacaoCaixa2.classList.add('hidden');
                    modalConfirmacaoCaixa2.classList.remove('show');
                  }
                }
              }}
            >
              Não, debitar apenas do Caixa 1
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal {
          display: none; 
          position: fixed; 
          z-index: 1; 
          left: 0;
          top: 0;
          width: 100%; 
          height: 100%; 
          overflow: auto; 
          background-color: rgba(0, 0, 0, 0.4); 
          transition: opacity 0.3s ease;
        }
        
        .modal.show {
          display: flex;
          opacity: 1;
        }
        
        .modal.hidden {
          display: none;
          opacity: 0;
        }
        
        .modal-content {
          background-color: #fefefe;
          margin: 15% auto; 
          padding: 20px;
          border: 1px solid #888;
          width: 80%; 
        }
        
        /* Estilo específico para o modal de celebração */
        #modal-celebracao .modal-content {
          width: 300px; /* Ajuste conforme necessário */
        }
        
        .quadrado-verde {
          background-color: green;
          color: white;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
        }
        
        .quadrado-laranja {
          background-color: orange;
          color: white;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
        }
        
        .quadrado-vermelho {
          background-color: red;
          color: white;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
        }
        
        /* Evitar quebra de linha nas células da tabela */
        table td, table th {
          white-space: nowrap;
        }
        
        /* Forçar que a tabela aumente de tamanho se necessário */
        table {
          table-layout: auto; /* Permite que as colunas aumentem de tamanho automaticamente */
          background-color: #000; /* Preto sólido */
          border-radius: 0.75rem; /* Arredondamento de bordas */
          overflow: hidden; /* Garante que o border-radius seja aplicado */
          border: none; /* Remove qualquer borda */
          width: 100%; /* Ocupa toda a largura */
        }
        
        table thead {
          background-color: #4F46E5; /* Cor indigo-600 original */
        }
        
        table thead th {
          background-color: #4F46E5; /* Fundo roxo para células do cabeçalho */
          color: white; /* Texto branco */
          border: none; /* Remove completamente as bordas do cabeçalho */
        }
        
        table tbody {
          background-color: #000; /* Corpo da tabela preto */
        }
        
        table tbody tr {
          background-color: #000; /* Linhas pretas */
          border: none; /* Remove bordas das linhas */
          border-bottom: 1px solid #333; /* Linha horizontal cinza */
        }
        
        table tbody tr:last-child {
          border-bottom: none; /* Remove a última linha horizontal */
        }
        
        table tbody td {
          background-color: #000; /* Células pretas */
          border: none; /* Remove bordas das células */
          border-right: 1px solid #333; /* Linha vertical cinza escuro */
          color: white; /* Texto branco */
        }
        
        table tbody td:last-child {
          border-right: none; /* Remove a última borda vertical */
        }
        
        table tbody tr:hover {
          background-color: #1a1a1a; /* Efeito hover levemente mais claro */
        }
        
        /* CSS customizado para garantir que o texto do Caixa 2 e valor fiquem laranja */
        .text-laranja {
          color: #f97316; /* Laranja do Tailwind */
          font-weight: bold;
        }
        
        /* Tooltip Container */
        .tooltip {
          position: absolute;   /* Agora, usamos posição absoluta para controlar melhor */
          top: 10px;            /* Ajusta para o canto superior */
          left: 10px;           /* Ajusta para o lado esquerdo */
          display: inline-block;
          cursor: pointer;
          font-family: "Arial", sans-serif;
          user-select: none;  /* Impede a seleção do texto na bolinha e na tooltip */
        }
        
        .tooltip .icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          background-color:#4caf50; /* Verde */
          color: #fff;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          font-size: 14px;  /* Tamanho da letra na bolinha */
          user-select: none;  /* Impede a seleção do texto na bolinha */
        }
        
        .tooltiptext {
          visibility: hidden;
          width: 250px;  /* Largura da tooltip */
          background-color: rgba(0, 0, 0, 0.8);  /* Fundo escuro com opacidade de 70% */
          color: #fff;
          text-align: left;  /* Alinha o texto à esquerda */
          border-radius: 5px;
          padding: 8px;  /* Menos padding para deixar mais compacta */
          position: absolute;
          z-index: 1;
          top: 50%;           /* Centraliza a tooltip verticalmente em relação à bolinha */
          left: 110%;         /* Posiciona a tooltip à direita da bolinha */
          margin-top: -10px;  /* Ajuste para centralizar verticalmente em relação à bolinha */
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 12px;  /* Tamanho da fonte dentro da tooltip */
          user-select: none;  /* Impede a seleção do texto na tooltip */
        }
        
        /* Remover a setinha */
        .tooltiptext::after {
          content: none;  /* Remove a setinha */
        }
        
        /* Tooltip visível quando o mouse passa por cima ou ao clicar (hover) */
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
        
        .meta-do-dia {
          font-weight: bold; /* Deixa a fonte em negrito */
          font-size: 0.6em; /* Ajusta o tamanho da fonte */
          color: #4F46E5; /* Cor roxa próximo ao bg-indigo-600 */
        }
        
        /* Corrige o fundo branco no autofill dos inputs */
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgba(20,20,20,0.85) inset !important;
          box-shadow: 0 0 0 1000px rgba(20,20,20,0.85) inset !important;
          -webkit-text-fill-color: #fff !important;
          color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};
