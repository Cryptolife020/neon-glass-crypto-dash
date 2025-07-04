import React, { useEffect } from 'react';

const DayTradeSystem = () => {
  useEffect(() => {
    // Load all dependencies first
    const loadDependencies = () => {
      return Promise.all([
        // Load SweetAlert2
        new Promise((resolve) => {
          if (window.Swal) {
            resolve(true);
            return;
          }
          const sweetAlert2Script = document.createElement('script');
          sweetAlert2Script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
          sweetAlert2Script.onload = () => resolve(true);
          sweetAlert2Script.onerror = () => resolve(false);
          document.head.appendChild(sweetAlert2Script);
        }),
        
        // Load Lottie web component
        new Promise((resolve) => {
          if (customElements.get('dotlottie-player')) {
            resolve(true);
            return;
          }
          const lottieScript = document.createElement('script');
          lottieScript.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js';
          lottieScript.onload = () => resolve(true);
          lottieScript.onerror = () => resolve(false);
          document.head.appendChild(lottieScript);
        })
      ]);
    };

    // Mock backend functions to prevent errors
    const mockBackendFunctions = () => {
      window.mockBackend = {
        registrarStatusCaixa: () => Promise.resolve({ success: true }),
        recuperarStatusCaixa: () => Promise.resolve({ success: true, data: { success: true, data: [] } }),
        atualizarValoresCaixas: () => Promise.resolve({ success: true }),
        registrarCor: () => Promise.resolve({ success: true }),
        obterCores: () => Promise.resolve({ success: true, data: [] }),
        excluirCores: () => Promise.resolve({ success: true }),
        salvarValoresIniciais: () => Promise.resolve({ success: true }),
        obterValoresIniciais: () => Promise.resolve({ success: false }),
        atualizarCiclo: () => Promise.resolve({ success: true, ciclo: 1 }),
        RecuperarCiclo: () => Promise.resolve({ success: true, ciclo: 1 }),
        reiniciarTudo: () => Promise.resolve({ success: true }),
        inserirHistorico: () => Promise.resolve({ success: true }),
        obterHistorico: () => Promise.resolve({ success: true, data: [] }),
        obterValores: () => Promise.resolve({ success: true, data: { caixa1: 0, caixa2: 0, total_comprometido: 0, total_atual: 0, valorCaixa1: 0, valorCaixa2: 0 } }),
        inserirValores: () => Promise.resolve({ success: true })
      };

      // Override fetch for backend calls
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('backend-setup.php')) {
          const urlParams = new URLSearchParams(url.split('?')[1]);
          const action = urlParams.get('action');
          
          // Return mock responses based on action
          return Promise.resolve({
            ok: true,
            json: () => window.mockBackend[action] ? window.mockBackend[action]() : Promise.resolve({ success: false, message: 'Action not found' })
          });
        }
        return originalFetch.apply(this, arguments);
      };
    };

    // Initialize everything
    const initializeSystem = async () => {
      console.log('Loading dependencies...');
      await loadDependencies();
      
      console.log('Setting up mock backend...');
      mockBackendFunctions();
      
      // Wait a bit more for DOM to be fully ready
      setTimeout(() => {
        console.log('Loading logic script...');
        const script = document.createElement('script');
        script.innerHTML = `
          // Verify dependencies are loaded
          if (!window.Swal) {
            console.error('SweetAlert2 not loaded');
            return;
          }
          
          if (!customElements.get('dotlottie-player')) {
            console.error('Lottie player not loaded');
            return;
          }
          
          console.log('Dependencies verified, initializing logic...');
          
          // Add console logs to verify DOM elements
          const testElements = [
            'calcular', 'proximo-ciclo', 'tabelas-juros', 'operacoes', 
            'registrar-valores', 'valor-caixa1', 'valor-caixa2', 
            'caixa1', 'caixa2', 'valor-investido', 'retorno'
          ];
          
          testElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
              console.warn('Element not found:', id);
            } else {
              console.log('Element found:', id);
            }
          });
        `;
        
        // Load the actual logic script
        fetch('/src/components/logica.js')
          .then(response => response.text())
          .then(scriptContent => {
            // Execute the script content
            const fullScript = document.createElement('script');
            fullScript.innerHTML = script.innerHTML + '\n\n' + scriptContent;
            document.body.appendChild(fullScript);
            console.log('Logic script executed');
          })
          .catch(error => {
            console.error('Failed to load logic script:', error);
          });
      }, 2000); // Increased delay to ensure everything is ready
    };

    initializeSystem();

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="sweetalert2"], script[src*="dotlottie-wc"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      
      // Restore original fetch
      if (window.fetch && window.fetch !== fetch) {
        window.fetch = fetch;
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 font-sans">
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
        
        #modal-celebracao .modal-content {
          width: 300px;
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
        
        table td, table th {
          white-space: nowrap;
        }
        
        table {
          table-layout: auto;
        }
           
        .text-laranja {
          color: #f97316;
          font-weight: bold;
        }
        
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
          background-color:#4caf50;
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
        
        .tooltiptext::after {
          content: none;
        }
        
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
        
        .meta-do-dia {
          font-weight: bold;
          font-size: 0.6em;
          color: #4F46E5;
        }
      `}</style>

      <header className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold">Setup Operacional</h1>
      </header>

      <main className="p-5">
        <section id="fluxograma" className="mb-12 text-center">
          <img src="fluxograma.png" alt="Fluxograma" className="w-full max-w-2xl mx-auto shadow-lg rounded-lg transition-transform transform hover:scale-105" />
        </section>
        
        <section id="registro" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Registro de Valores</h2>
          
          <div className="mb-4">
            <label htmlFor="modoMercado" className="block text-lg mb-2">Modo de Mercado:</label>
            <select id="modoMercado" className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="spot">Spot</option>
              <option value="futuros">Futuros</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="caixa1" className="block text-lg">Valor destinado para OP (Caixa 1):</label>
              <input type="text" id="caixa1" className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Insira o valor" />
            </div>
            <div>
              <label htmlFor="caixa2" className="block text-lg">Reserva para repor SL (Caixa 2):</label>
              <input type="text" id="caixa2" className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Insira o valor" />
            </div>
          </div>
          <button id="registrar-valores" className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg shadow hover:bg-indigo-500 transition duration-200">Registrar Valores</button>
          <button id="apagar-preenchimentos" className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg shadow hover:bg-indigo-500 transition duration-200">Reiniciar Operacional</button>
        </section> 
        
        <section id="caixas" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div id="display-caixa1" className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 relative">
            <h3 id="valor-caixa1" className="text-3xl font-bold">$0,00</h3>
            <p className="text-lg">Caixa 1</p>
            <small className="text-gray-500">Valor destinado para operação</small>
            
            <div className="tooltip">
              <div className="icon">i</div>
              <div className="tooltiptext">
                Ao transferir parte do lucro para o caixa 2, ele não será considerado no seu indicativo de lucro no caixa 1, pois você aceitou usá-lo como reserva para cobrir futuros stop loss.
              </div>
            </div>

            <div id="status-caixa1"></div>
          </div>

          <div id="display-caixa2" className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105">
            <h3 id="valor-caixa2" className="text-3xl font-bold">$0,00</h3>
            <p className="text-lg">Caixa 2</p>
            <small className="text-gray-500">Reserva para repor StopLoss</small>
            
            <div id="status-caixa2" className="text-lg font-bold mt-2"></div>
            <div id="abastecido-perda" className="text-lg mt-2"></div>
          </div>
        </section>

        <section id="historico-de-registros" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Registro Inicial Fixo</h2>
          
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
              </tbody>
            </table>
          </div>

          <div id="total-comprometido" className="bg-indigo-700 text-white p-6 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-semibold text-white">Total Comprometido</h3>
            <p className="text-lg mt-2 flex justify-between">
              <span className="text-white">Total dos Caixas:</span>
              <span id="total-dos-caixas" className="text-lg text-right text-white">$0,00</span>
            </p>
          </div>

          <div id="Valores-atuais" className="bg-gradient-to-r from-gray-800 to-black border border-gray-700 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-white">Resultado Atual</h3>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-lg font-medium text-white whitespace-nowrap">Total dos caixas:</p>
              <p className="text-lg text-right font-bold text-white"><span id="total-dos-caixas-atual">$0,00</span></p>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-end">
                <p className="text-xs font-medium text-white">Ganho/Perda Líquida:</p>
              </div>
              <div className="flex justify-end">
                <p className="text-xs text-right text-gray-300"> 
                  <span id="ganho-perda-liquida-valor" className="text-green-400 inline font-bold text-x3">+$0,00</span>
                  <span id="ganho-perda-liquida-percentual" className="text-green-400 inline font-bold text-x3">(+0.00%)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="juros-compostos" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Metas Juros Compostos</h2>
          <div>
            <label htmlFor="valor-investido" className="block text-lg">Valor Investido (Caixa 1):</label>
            <input type="text" id="valor-investido" className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Insira o valor" />
            <label htmlFor="retorno" className="block text-lg mt-4">Retorno em %:</label>
            <input type="number" id="retorno" className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" step="0.01" placeholder="Insira o percentual" />
          </div>
          <button id="calcular" className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg shadow hover:bg-indigo-500 transition duration-200">Calcular Metas</button>

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
              </tbody>
            </table>
          </div>
        </section>
        
        <section id="ciclo-atual" className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center justify-between">
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
            style={{width: '80px', height: '80px'}}
            loop 
            autoplay>
          </dotlottie-player>
        </section>

        <section id="interacoes" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-4">Total de Operações</h2>
          <div id="operacoes" className="grid grid-cols-6 gap-2"></div>
          
          <button id="proximo-ciclo" className="mt-4 w-full bg-gray-300 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-400 hidden">Próximo Ciclo</button>
        </section>

        <section id="planilha" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <footer className="text-center">
            <dotlottie-player 
              src="https://lottie.host/875a6142-613e-4753-8bcc-c1e9742e0782/XwcetC116L.lottie" 
              background="transparent" 
              speed="1" 
              style={{width:'290px', height: '290px', margin: '0 auto'}}
              loop 
              autoplay>
            </dotlottie-player>
            <button id="link-planilha" className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transition duration-200">
              Planilha de Finanças Pessoais
            </button>
          </footer> 
        </section>
      </main>

      <div id="modal-success" className="modal hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <span className="close-btn float-right cursor-pointer text-lg">&times;</span>
          <p id="success-message">Mensagem de sucesso aqui.</p>
          <button id="success-ok" className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200">OK</button>
        </div>
      </div>

      <div id="modal-error" className="modal hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <span className="close-btn float-right cursor-pointer text-lg">&times;</span>
          <p id="error-message">Mensagem de erro aqui.</p>
          <button id="error-ok" className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">OK</button>
        </div>
      </div>
      
      <div id="modal-celebracao" className="modal hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
          <dotlottie-player src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie" 
            background="transparent" 
            speed="1" 
            style={{width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none'}}
            loop 
            autoplay>
          </dotlottie-player>

          <img src="https://ferramentas.x10.mx/ferramentas/setup/champagne.gif" alt="Celebração" className="mx-auto mb-4" style={{width: '90px', height: 'auto', zIndex: 10}} />
          <h2 className="text-2xl font-bold text-green-600">Incrível!</h2>
          <p>Você chegou ao final de todos os ciclos. Recomece com um novo gerenciamento!</p>
          <button id="celebracao-ok" className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200">Recomeçar 🥳</button>
        </div>
      </div>

      <div id="modal-proximociclo" className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
          <dotlottie-player src="https://lottie.host/ed60e6fe-0ca2-4d7d-881b-c6dd669585d0/26rt0SBXCs.lottie" 
            background="transparent" 
            speed="1" 
            style={{width: '450px', height: '450px', position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none'}}
            loop 
            autoplay>
          </dotlottie-player>
          
          <dotlottie-player src="https://lottie.host/2a8c8c7e-0563-4916-bef3-55ea76ce5565/amymtVr308.lottie" 
            background="transparent" 
            speed="1" 
            style={{width: '120px', height: '120px', margin: '0 auto', display: 'block'}}
            loop 
            autoplay> 
          </dotlottie-player>
          
          <h2 className="text-2xl font-bold text-green-600" style={{zIndex: 10}}>Parabéns!</h2>
          <p id="mensagem-proximociclo" style={{zIndex: 10}}>Você finalizou o Ciclo. Bem-vindo ao novo!</p>
          <button id="celebracao-proximociclo" className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200" style={{zIndex: 10}}>Começar o novo 🥳</button>
        </div>
      </div>

      <audio id="myAudio" src="https://ferramentas.x10.mx/ferramentas/setup/audio_473a42432c.mp3"></audio>

      <div id="inputModal" className="modal hidden">
        <div className="modal-content">
          <span className="close" id="modalClose">&times;</span>
          <h2 id="modalTitle"></h2>
          <input type="text" id="modalInput" placeholder="Digite aqui..." />
          <button id="modalSubmit">Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default DayTradeSystem;
