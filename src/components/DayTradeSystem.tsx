import { useEffect, useRef, useState } from 'react';

export const DayTradeSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFluxograma, setShowFluxograma] = useState(false);

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

  // Adicionar useEffect para manipulação dos valores dos caixas
  useEffect(() => {
    const registrarValoresBtn = document.getElementById('registrar-valores');
    const valorCaixa1Input = document.getElementById('caixa1') as HTMLInputElement;
    const valorCaixa2Input = document.getElementById('caixa2') as HTMLInputElement;
    const displayValorCaixa1 = document.getElementById('valor-caixa1');
    const displayValorCaixa2 = document.getElementById('valor-caixa2');
    const tabelaRegistros = document.getElementById('historico-registros-body');
    const totalDosCaixas = document.getElementById('total-dos-caixas');
    const totalDosCaixasAtual = document.getElementById('total-dos-caixas-atual');

    const formatarValor = (valor: string) => {
      // Remove qualquer caractere que não seja número, ponto ou vírgula
      const valorLimpo = valor.replace(/[^\d,\.]/g, '');
      
      // Substitui vírgula por ponto se necessário
      const valorFormatado = valorLimpo.replace(',', '.');
      
      // Converte para número e formata como moeda
      const valorNumerico = parseFloat(valorFormatado);
      
      return isNaN(valorNumerico) 
        ? '$0,00' 
        : `$${new Intl.NumberFormat('pt-BR', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(valorNumerico)}`;
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
              // Acumula apenas os valores iniciais fixos
              if (observacao === 'Valor inicial') {
                valorInicialFixoTotal += valor;
              }
            } else if (tipoCaixa === 'Caixa 2') {
              totalCaixa2 += valor;
              // Acumula apenas os valores iniciais fixos
              if (observacao === 'Reserva Stop Loss') {
                valorInicialFixoTotal += valor;
              }
            }
          }
        });

        const totalCaixas = totalCaixa1 + totalCaixa2;

        // Total Comprometido = Valor inicial fixo + Total atual dos caixas
        const totalComprometido = valorInicialFixoTotal + totalCaixas;

        // Atualiza o elemento "Total Comprometido" com valor inicial fixo + valores dos caixas
        totalDosCaixas.textContent = `$${new Intl.NumberFormat('pt-BR', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(totalComprometido)}`;

        // Atualiza o "Resultado Atual" apenas com os valores atuais dos caixas
        totalDosCaixasAtual.textContent = `$${new Intl.NumberFormat('pt-BR', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(totalCaixas)}`;
      }
    };

    registrarValoresBtn?.addEventListener('click', () => {
      if (valorCaixa1Input && valorCaixa2Input && displayValorCaixa1 && displayValorCaixa2 && tabelaRegistros) {
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

        // Limpar os inputs após registrar
        valorCaixa1Input.value = '';
        valorCaixa2Input.value = '';
      }
    });

    // Calcular total dos caixas inicialmente
    calcularTotalCaixas();
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
      return `$${new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(valor)}`;
    };

    calcularBtn?.addEventListener('click', () => {
      if (valorInvestidoInput && retornoInput && tabelasJuros && tabelaCorpo && cicloNumero && operacoesContainer) {
        // Limpar tabela anterior e container de operações
        tabelaCorpo.innerHTML = '';
        operacoesContainer.innerHTML = '';

        // Converter valores
        const valorInicial = parseFloat(valorInvestidoInput.value.replace(/[^\d,\.]/g, '').replace(',', '.'));
        const taxaRetorno = parseFloat(retornoInput.value);

        if (isNaN(valorInicial) || isNaN(taxaRetorno)) {
          alert('Por favor, insira valores válidos');
          return;
        }

        // Atualizar Ciclo Atual
        cicloNumero.textContent = '1';
        cicloNumero.classList.add('bg-indigo-600', 'text-white', 'px-1', 'rounded');

        // Calcular juros compostos
        let valorAcumulado = valorInicial;
        let metasDias: number[] = [];

        for (let dia = 1; dia <= 30; dia++) {
          // Calcular o valor do dia
          valorAcumulado *= (1 + (taxaRetorno / 100));
          
          // Criar linha da tabela
          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td class="py-3 px-6 text-center">${dia}</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorInicial)}</td>
            <td class="py-3 px-6 text-center">${taxaRetorno.toFixed(2)}%</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorAcumulado)}</td>
            <td class="py-3 px-6 text-center">${formatarValor(valorAcumulado - valorInicial)}</td>
          `;
          
          tabelaCorpo.appendChild(linha);

          // Armazenar metas para os quadradinhos
          metasDias.push(valorAcumulado);
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
            const modalMeta = document.getElementById('modal-operacao-meta');
            const modalTipoOperacao = document.getElementById('modal-operacao-resultado');

            if (modalOperacao && modalTitulo && modalDiaNumero && modalMeta && modalTipoOperacao) {
              const diaNumero = quadradinho.textContent || '';
              const metaValor = quadradinho.getAttribute('data-meta') || '';

              modalTitulo.textContent = `Operação Dia ${diaNumero}`;
              modalDiaNumero.textContent = diaNumero;
              modalMeta.textContent = metaValor;
              
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
        const modalMeta = document.getElementById('modal-operacao-meta');
        const modalTipoOperacao = document.getElementById('modal-operacao-resultado');

        if (modalOperacao && modalTitulo && modalDiaNumero && modalMeta && modalTipoOperacao) {
          const diaNumero = quadradinho.textContent || '';
          const metaValor = quadradinho.getAttribute('data-meta') || '';

          modalTitulo.textContent = `Operação Dia ${diaNumero}`;
          modalDiaNumero.textContent = diaNumero;
          modalMeta.textContent = metaValor;
          
          modalOperacao.classList.remove('hidden');
          modalOperacao.classList.add('show');
          
          // Limpar input anterior
          (modalTipoOperacao as HTMLInputElement).value = '';
        }
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="day-trade-system">
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
                {/* Registros serão adicionados aqui via JavaScript */}
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
                  <th className="py-4 px-6 border-b">Dia</th>
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
            speed={1} 
            style={{ width: '80px', height: '80px' }} 
            loop autoplay>
          </dotlottie-player>
        </section>

        <section id="interacoes" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Total de Operações</h2>
          <div id="operacoes" className="grid grid-cols-6 gap-2"></div>
          
          <button id="proximo-ciclo" className="mt-4 w-full bg-gray-300 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-400 hidden">Próximo Ciclo</button>
        </section>

        <section id="planilha" className="glass-card p-6 rounded-lg shadow-md mb-8">
          <footer className="text-center">
            <dotlottie-player 
              src="https://lottie.host/875a6142-613e-4753-8bcc-c1e9742e0782/XwcetC116L.lottie" 
              background="transparent" 
              speed={1} 
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
            speed={1} 
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

      <div id="modal-proximociclo" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
          
          {/* Animação de confetti */}
          <dotlottie-player src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie" 
            background="transparent" 
            speed={1} 
            style={{ width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} 
            loop 
            autoplay>
          </dotlottie-player>
          
          
          {/* Animação principal substituindo a tag img */}
          <dotlottie-player src="https://lottie.host/2a8c8c7e-0563-4916-bef3-55ea76ce5565/amymtVr308.lottie" 
            background="transparent" 
            speed={1} 
            style={{ width: '120px', height: '120px', margin: '0 auto', display: 'block' }} 
            loop 
            autoplay> 
          </dotlottie-player>
          
          <h2 className="text-2xl font-bold text-green-600" style={{ zIndex: 10 }}>Parabéns!</h2>
          <p id="mensagem-proximociclo" style={{ zIndex: 10 }}>Você finalizou o Ciclo. Bem-vindo ao novo!</p>
          <button id="celebracao-proximociclo" className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200" style={{ zIndex: 10 }}>Começar o novo 🥳</button>
        </div>
      </div>

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
          
          <h2 id="modal-operacao-titulo" className="text-2xl font-bold mb-4 text-indigo-500">Operação Dia</h2>
          
          <div className="mb-4">
            <p className="text-gray-200 mt-2 hidden">
              Dia: <span id="modal-operacao-dia" className="font-bold"></span>
            </p>
            <p className="text-gray-200 mt-2 flex items-center justify-center gap-2">
              Meta do Dia: 
              <span 
                id="modal-operacao-meta" 
                className="font-bold text-white bg-indigo-600 px-3 py-1 rounded-full text-sm"
              ></span>
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
                      const metaValor = document.getElementById('modal-operacao-meta')?.textContent || '';
                      
                      modalValorLucroTitulo.textContent = `Quanto você lucrou no Dia ${diaNumero}`;
                      modalValorLucroDia.textContent = diaNumero;
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
                        const metaValor = document.getElementById('modal-operacao-meta')?.textContent || '';
                        
                        modalValorPrejuizoTitulo.textContent = `Quanto você perdeu no Dia ${diaNumero}`;
                        modalValorPrejuizoDia.textContent = diaNumero;
                        modalValorPrejuizoMeta.textContent = metaValor;
                        
                        modalOperacao.classList.add('hidden');
                        modalOperacao.classList.remove('show');
                        
                        modalValorPrejuizo.classList.remove('hidden');
                        modalValorPrejuizo.classList.add('show');
                      }
                    }
                  
                  resultadoInput.value = ''; // Limpar o input após processar
                } else {
                  alert('Por favor, digite "lucro", "prejuízo" ou "preju".');
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
          
          <h2 id="modal-valor-lucro-titulo" className="text-2xl font-bold mb-4 text-indigo-500">Quanto você lucrou no Dia</h2>
          
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
                        return `$${new Intl.NumberFormat('pt-BR', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(valor)}`;
                      };

                      // Atualizar os inputs e displays dos caixas
                      valorCaixa1Input.value = novoValorCaixa1.toString();
                      valorCaixa2Input.value = valorAtualCaixa2.toString(); // Manter valor atual do Caixa 2
                      displayValorCaixa1.textContent = formatarValor(novoValorCaixa1);
                      displayValorCaixa2.textContent = formatarValor(valorAtualCaixa2);

                      registrarValoresBtn.click();

                      // Mostrar modal de parabéns quando bater a meta exata
                      if (valorLucro === metaValor) {
                        const modalParabens = document.getElementById('modal-parabens');
                        if (modalParabens) {
                          modalParabens.classList.remove('hidden');
                          modalParabens.classList.add('show');
                        }
                      }

                      modalValorLucro.classList.add('hidden');
                      modalValorLucro.classList.remove('show');
                    }
                  }
                } else {
                  alert('Por favor, digite um valor de lucro válido.');
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
                    return `$${new Intl.NumberFormat('pt-BR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(valor)}`;
                  };

                  // Atualizar os inputs e displays dos caixas
                  valorCaixa1Input.value = novoValorCaixa1.toString();
                  valorCaixa2Input.value = novoValorCaixa2.toString();
                  displayValorCaixa1.textContent = formatarValor(novoValorCaixa1);
                  displayValorCaixa2.textContent = formatarValor(novoValorCaixa2);

                  registrarValoresBtn.click();

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
                  valorCaixa1Input.value = valorLucro.toString();
                  registrarValoresBtn.click();

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
            speed={1} 
            style={{ width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} 
            loop 
            autoplay>
          </dotlottie-player>

          <h2 className="text-3xl font-bold text-green-400 mb-4" style={{ zIndex: 10 }}>🎉 Parabéns! 🎉</h2>
          <p className="text-white text-lg mb-6" style={{ zIndex: 10 }}>Você bateu a meta do dia continue assim você vai longe!</p>
          
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
                  alert('Por favor, digite um valor de perda válido.');
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
                      return `$${new Intl.NumberFormat('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(valor)}`;
                    };

                    // Atualizar os inputs e displays dos caixas
                    valorCaixa1Input.value = novoValorCaixa1.toString();
                    valorCaixa2Input.value = novoValorCaixa2.toString();
                    displayValorCaixa1.textContent = formatarValor(novoValorCaixa1);
                    displayValorCaixa2.textContent = formatarValor(novoValorCaixa2);

                    registrarValoresBtn.click();
                  } else {
                    alert('Fundos insuficientes no Caixa 2 para repor a perda.');
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
                    return `$${new Intl.NumberFormat('pt-BR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(valor)}`;
                  };

                  // Atualizar os inputs e displays dos caixas
                  valorCaixa1Input.value = Math.max(0, novoValorCaixa1).toString(); // Evita valores negativos
                  valorCaixa2Input.value = valorAtualCaixa2.toString(); // Manter Caixa 2 inalterado
                  displayValorCaixa1.textContent = formatarValor(Math.max(0, novoValorCaixa1));
                  displayValorCaixa2.textContent = formatarValor(valorAtualCaixa2);

                  registrarValoresBtn.click();

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

export default DayTradeSystem;