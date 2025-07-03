Explicação para Integração da Interface

Precisamos integrar a interface do código abaixo exatamente como está, sem realizar alterações nos estilos, classes CSS ou estrutura de elementos. É essencial que todos os IDs, classes e atributos sejam mantidos inalterados, garantindo total compatibilidade com o novo sistema. Esta interface será incorporada na nova seção chamada "Sistema DayTrade", e qualquer modificação poderá comprometer o funcionamento ou o alinhamento visual dentro do sistema.



  CÓDIGO DA LÓGICA JAVASCRIPT:

  document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcular');
    const proximoCicloBtn = document.getElementById('proximo-ciclo');
    const tabelasJuros = document.getElementById('tabelas-juros');
    const operacoesDiv = document.getElementById('operacoes');
    const registrarValoresBtn = document.getElementById('registrar-valores');
    const valorCaixa1 = document.getElementById('valor-caixa1');
    const valorCaixa2 = document.getElementById('valor-caixa2');
    const caixa1Input = document.getElementById('caixa1');
    const caixa2Input = document.getElementById('caixa2');
    const valorInvestidoInput = document.getElementById('valor-investido');
    const retornoInput = document.getElementById('retorno');
    const linkPlanilhaBtn = document.getElementById('link-planilha');
    const cicloIndicativo = document.getElementById('ciclo-indicativo');

    let metasPorCiclo = {};
    let lucroAcumulado = [0, 0, 0, 0, 0, 0];
    let metasCalculadas = false;
    let lucrosPorDia = {};
    let todosDiasRegistrados = false; // Nova variável para rastrear o registro dos dias
    
// Função para exibir o SweetAlert2 de confirmação
document.getElementById('apagar-preenchimentos').addEventListener('click', () => {
    // Exibir o modal de confirmação com SweetAlert2
    Swal.fire({
        title: 'Atenção',
        text: 'Tem certeza que deseja apagar o preenchimento operacional atual?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true, // Inverte a ordem dos botões (Sim à direita, Não à esquerda)
        customClass: {
            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400',
            cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400'
        }
    }).then((result) => {
        // Verifica se o usuário confirmou (clicou em "Sim")
        if (result.isConfirmed) {
            reiniciarTudo(); // Chama a função para reiniciar os dados (você já está chamando essa função)
        }
    });
});    
    
function formatarInput(input) {
    input.dataset.rawValue = input.dataset.rawValue || '';

    input.addEventListener('input', () => {
        let valor = input.value.replace(/[^0-9,.]/g, '');  // Remove caracteres não numéricos
        input.dataset.rawValue = valor;
    });

    input.addEventListener('blur', () => {
        let valor = input.dataset.rawValue || '';

        if (valor) {
            const partes = valor.split(',');
            partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');  // Formatação de milhares
            const valorFormatado = partes.length > 1 ? partes.join(',') : partes[0];  // Junta as partes
            input.value = valorFormatado;
        } else {
            input.value = '';
        }
    });

    input.addEventListener('focus', () => {
        input.value = input.dataset.rawValue || '';
    });
}


    // Chamada para formatar os inputs
    formatarInput(caixa1Input);
    formatarInput(caixa2Input);
    formatarInput(valorInvestidoInput);
    formatarInput(retornoInput);



// Função para formatar o valor com o estilo original
function formatarValor(valor) {
    const valorNumerico = parseFloat(valor); // Garantir que o valor seja numérico
    
    if (isNaN(valorNumerico)) {
        return "0,00"; // Retorna um valor padrão se não for numérico
    }
    return `$${valorNumerico.toFixed(2).replace('.', ',')}`; // Formatação com vírgula como separador decimal
}

function parseValor(valor) {
    // Remove o símbolo "$", substitui vírgulas por ponto e remove pontos de milhar
    const valorLimpo = valor.replace('$', '').replace(/\./g, '').replace(',', '.').trim();

    // Converte para número e retorna, se não for um número válido, retorna 0
    return parseFloat(valorLimpo) || 0;
} 

function arredondar(valor, casasDecimais = 2) {
        const fator = Math.pow(10, casasDecimais);
        return Math.round(valor * fator) / fator;
    }
    
function mostrarAlerta(titulo, texto, sucesso = true, aviso = false) {
    let lottieUrl;
    let lottieSize = '150px';  // Tamanho padrão
    let marginTop = '0px'; // Margem padrão para sucesso

    // Definindo os Lottie URLs e tamanhos específicos
    if (sucesso) {
        lottieUrl = 'https://lottie.host/5e031bab-6bf8-4e3d-9560-35c3a47eb5d9/qmSPntbTuM.lottie'; // Sucesso
        lottieSize = '200px';  // Tamanho para sucesso
    } else if (aviso) {
        lottieUrl = 'https://lottie.host/68cae588-3765-4eda-a390-0d23cffed683/xsUOEhallu.lottie'; // Warning
        lottieSize = '150px';  // Tamanho para warning
    } else {
        lottieUrl = 'https://lottie.host/e1cbf5b2-02a7-4b52-8b02-c656f7af2c8f/fkg4ATHYbw.lottie'; // Erro
        lottieSize = '100px';  // Tamanho para erro
        marginTop = '17px'; // Maior margem para o título no caso de erro
    }

    Swal.fire({
        title: '',  // Deixa o título em branco, pois vamos manipular a posição da animação
        html: `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <dotlottie-player src="${lottieUrl}" background="transparent" speed="1" style="width: ${lottieSize}; height: ${lottieSize};" loop autoplay></dotlottie-player>
                <h2 style="font-size: 1.875rem; color: #333; font-family: Helvetica, Arial, sans-serif; font-weight: 600; margin-top: ${marginTop}; text-align: center;">
                    ${titulo}
                </h2>  <!-- Título abaixo da animação -->
            </div>
            <div style="text-align: center; margin-top: 5px;">
                <p>${texto}</p>
            </div>
        `,
        confirmButtonText: 'Ok',
        customClass: {
            title: 'custom-title', // Customização do título
            content: 'custom-content' // Customização do conteúdo
        }
    });
}
    
function mostrarAlertaInput(titulo, texto) {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: 'warning',
        confirmButtonText: 'Ok'
    });
}


function verificarValoresCaixas() {
    const valorCaixa1Atual = parseValor(caixa1Input.value);
    const valorCaixa2Atual = parseValor(caixa2Input.value);

    // Verifica se os campos estão vazios ou os valores são inválidos
    if (!valorCaixa1Atual && !valorCaixa2Atual) {
        return false;
    }

    // Verifica se os valores são números válidos e maiores ou iguais a 0
    return !(isNaN(valorCaixa1Atual) || isNaN(valorCaixa2Atual) || valorCaixa1Atual < 0 || valorCaixa2Atual < 0);
}
    
function confirmarAcao(message, callbackYes, callbackNo) {
    Swal.fire({
        title: message,
        text: "Escolha uma opção.",
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        customClass: {
            confirmButton: 'btn-sim',   // Classe personalizada para o botão "Sim"
            cancelButton: 'btn-nao'     // Classe personalizada para o botão "Não"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            callbackYes();
        } else if (callbackNo) {
            callbackNo();
        }
    });
}

function mostrarModalInput(titulo, callback) {
    Swal.fire({
        title: titulo,
        input: 'text',
        inputPlaceholder: 'Digite seu valor',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn-enviar',  // Classe personalizada para o botão "Enviar"
            cancelButton: 'btn-cancelar', // Classe personalizada para o botão "Cancelar"
            input: 'custom-input'  // Classe personalizada para o input
        },
        didOpen: () => {
            // Adiciona o estilo direto via JS, caso prefira usar aqui
            document.querySelector('.swal2-input').style.borderColor = '#4c51bf'; // Define a cor roxa do foco
        }
    }).then((result) => {
        if (result.isConfirmed) {
            callback(result.value);
        }
    });
}

// CSS para customizar os botões e o foco do input
const style = document.createElement('style');
style.innerHTML = `
    /* Foco do input com cor roxa */
    .swal2-input:focus {
        border-color: #4c51bf;  /* Roxo (#4c51bf) */
        box-shadow: 0 0 5px 0 #4c51bf; /* Brilho ao redor do input */
    }

    /* Botão Enviar (Confirmar) - Roxo */
    .swal2-confirm.btn-enviar {
        background-color: #4c51bf; /* Roxo (#4c51bf) */
        border-color: #4c51bf;
    }
    .swal2-confirm.btn-enviar:hover {
        background-color: #434190; /* Roxo escuro para hover */
        border-color: #3b3885;
    }

    /* Botão Cancelar - Cinza escuro */
    .swal2-cancel.btn-cancelar {
        background-color: #4a4a4a; /* Cinza escuro */
        border-color: #4a4a4a;
    }
    .swal2-cancel.btn-cancelar:hover {
        background-color: #6c6c6c; /* Cinza mais claro para hover */
        border-color: #6c6c6c;
    }

    /* Botão Sim - Roxo */
    .swal2-confirm.btn-sim {
        background-color: #4c51bf; /* Roxo (#4c51bf) */
        border-color: #4c51bf;
    }
    .swal2-confirm.btn-sim:hover {
        background-color: #434190; /* Roxo escuro para hover */
        border-color: #3b3885;
    }

    /* Botão Não - Cinza escuro */
    .swal2-cancel.btn-nao {
        background-color: #4a4a4a; /* Cinza escuro */
        border-color: #4a4a4a;
    }
    .swal2-cancel.btn-nao:hover {
        background-color: #6c6c6c; /* Cinza mais claro para hover */
        border-color: #6c6c6c;
    }
`;

document.head.appendChild(style);



function registrarStatusCaixa(caixa, status, cor) {
    // Verifica se todos os parâmetros necessários foram fornecidos
    if (!caixa || !status || !cor) {
        alert('Todos os parâmetros são necessários!');
        return;
    }

    // Cria o objeto de dados que será enviado
    const data = {
        action: 'registrarStatusCaixa',
        caixa: caixa,
        status: status,
        cor: cor
    };

    // Faz a requisição para o backend
    fetch('backend-setup.php?action=registrarStatusCaixa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())  // Converte a resposta para JSON
    .then(data => {
        // Verifica a resposta do servidor
        if (!data.success) {
            alert('Erro ao registrar status da caixa: ' + data.message);
        }
    })
    .catch(error => {
        alert('Ocorreu um erro ao enviar os dados.');
    });
}


function recuperarStatusCaixa() {
    // Faz a requisição GET para recuperar o status das caixas
    fetch('backend-setup.php?action=recuperarStatusCaixa')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.success) {
                // Status recuperado com sucesso
                const statusData = data.data.data; // Acessa a resposta corretamente

                // Loop para atualizar o status das caixas
                statusData.forEach(status => {
                    if (status.caixa === 'caixa1') {
                        const caixa1Element = document.getElementById('status-caixa1');
                        if (!caixa1Element) {
                            const novoElemento = document.createElement('div');
                            novoElemento.id = 'status-caixa1';
                            novoElemento.classList.add('status-caixa1');
                            document.getElementById('display-caixa1').appendChild(novoElemento);
                        }
                        caixa1Element.innerHTML = `
                            <p style="color: ${status.cor}; font-weight: bold;">
                                ${status.status}
                            </p>
                        `;
                    }

                    if (status.caixa === 'caixa2') {
                        const caixa2Element = document.getElementById('status-caixa2');
                        if (!caixa2Element) {
                            const novoElemento = document.createElement('div');
                            novoElemento.id = 'status-caixa2';
                            novoElemento.classList.add('status-caixa2');
                            document.getElementById('display-caixa2').appendChild(novoElemento);
                        }
                        caixa2Element.innerHTML = `
                            <p style="color: ${status.cor}; font-weight: bold;">
                                ${status.status}
                            </p>
                        `;
                    }
                });
            }
        })
        .catch(error => {
            // O log de erro foi removido conforme solicitado
        });
}



function statusCaixa1() {
    const caixa1Element = document.getElementById('status-caixa1');
    const valorRegistradoCaixa1 = parseValor(caixa1Input.dataset.rawValue);

    if (valorCaixa1Inicial === valorRegistradoCaixa1) {
        if (caixa1Element) {
            caixa1Element.innerHTML = '';
        }
        return;
    }

    const status = valorCaixa1Inicial >= valorRegistradoCaixa1 ? 'Caixa 1 positivo' : 'Caixa 1 negativo';
    const cor = valorCaixa1Inicial >= valorRegistradoCaixa1 ? 'green' : 'red';

    if (!caixa1Element) {
        const novoElemento = document.createElement('div');
        novoElemento.id = 'status-caixa1';
        novoElemento.classList.add('status-caixa1');
        document.getElementById('display-caixa1').appendChild(novoElemento);
    }

    caixa1Element.innerHTML = `
        <p style="color: ${cor}; font-weight: bold;">${status}</p>
    `;
    registrarStatusCaixa('caixa1', status, cor);
}

function statusCaixa2() {
    const caixa2Element = document.getElementById('status-caixa2');
    const valorRegistradoCaixa2 = parseValor(caixa2Input.dataset.rawValue);

    if (valorCaixa2Inicial === valorRegistradoCaixa2) {
        if (caixa2Element) {
            caixa2Element.innerHTML = '';
        }
        return;
    }

    const status = valorCaixa2Inicial >= valorRegistradoCaixa2 ? 'Reserva Saudável' : 'Reserva Afetada';
    const cor = valorCaixa2Inicial >= valorRegistradoCaixa2 ? 'green' : 'orange';

    if (!caixa2Element) {
        const novoElemento = document.createElement('div');
        novoElemento.id = 'status-caixa2';
        novoElemento.classList.add('status-caixa2');
        document.getElementById('display-caixa2').appendChild(novoElemento);
    }

    caixa2Element.innerHTML = `
        <p style="color: ${cor}; font-weight: bold;">${status}</p>
    `;
    registrarStatusCaixa('caixa2', status, cor);
}



let totalAbastecido = 0; 

function atualizarAbastecimento(valorTransferido) {
    const abastecimentoElement = document.getElementById('abastecido-perda'); // Elemento onde o status será exibido

    // Soma o valor transferido ao total abastecido
    totalAbastecido += valorTransferido;

    // Exibe a mensagem de abastecimento em verde com o total acumulado
    abastecimentoElement.innerHTML = `
        <p style="color: green;">Abastecido:+ ${formatarValor(totalAbastecido)}</p>
    `;
}

function atualizarValoresCaixas(caixa1, caixa2) {
    fetch('backend-setup.php?action=atualizarValoresCaixas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            caixa1: caixa1,
            caixa2: caixa2
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            alert('Erro ao atualizar valores: ' + data.message);
        }
    })
    .catch(error => {
        alert('Erro na requisição.');
    });
}

// Inicialização das operações
for (let i = 1; i <= 30; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    div.dataset.index = i;
    div.className = 'dia-operacao'; // Classe para o estilo do quadrado

    // Estilo básico para os quadrados
    div.style.width = '40px';
    div.style.height = '40px';
    div.style.border = '1px solid #ccc';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';

    div.addEventListener('click', () => {
    if (!verificarValoresCaixas()) {
        mostrarAlerta('Erro!', 'Você não registrou valores dos caixas ainda.', false);
        return;
    }

    if (!metasCalculadas) {
        mostrarAlerta('Erro!', 'É essencial calcular suas metas de juros compostos.', false);
        return;
    }
    
mostrarModalInput("Foi Lucro ou Preju?", (escolha) => {
    const dia = parseInt(div.dataset.index);
    if (escolha === "Lucro") {
mostrarModalInput(`Quanto você lucrou no dia ${dia}? <br><span class="meta-do-dia">Meta do dia: ${formatarMoeda(obterMetaDoDia(dia))}</span>`, (lucro) => {
            const lucroValor = parseValor(lucro);
            if (lucroValor > 0) {
                const metaDia = obterMetaDoDia(dia);
                const excedente = lucroValor - metaDia;
              // Verifique o valor do excedente

                // Atualiza Caixa 1
                valorCaixa1Inicial += lucroValor;
                caixa1Input.value = formatarValor(valorCaixa1Inicial);
                valorCaixa1.textContent = formatarValor(valorCaixa1Inicial);
                
                // Atualiza o banco de dados
                atualizarValoresCaixas(valorCaixa1Inicial, valorCaixa2Inicial);
                
                 
                // Chama a função de atualização para refletir o novo valor do total dos caixas
                statusCaixa1();
            
        // <-- Chama a função para atualizar o total dos caixas

                // Define a cor do quadrado
                div.classList.add('quadrado-verde');
                registrarCorNoBanco(dia, 'verde');

                if (excedente > 0) {
                    confirmarAcao('Parabéns, seu lucro ultrapassou a meta! Deseja transferir o valor excedente para o Caixa 2?', () => {
                        const valorTransferido = arredondar(excedente);
                     // Verifique o valor transferido

                        if (valorCaixa1Inicial >= valorTransferido) {
                            valorCaixa1Inicial -= valorTransferido;
                            valorCaixa2Inicial += valorTransferido;

                            caixa1Input.value = formatarValor(valorCaixa1Inicial);
                            valorCaixa1.textContent = formatarValor(valorCaixa1Inicial);
                            valorCaixa2.textContent = formatarValor(valorCaixa2Inicial);
                            
                                                        // Atualiza o banco de dados após a transferência
                           atualizarValoresCaixas(valorCaixa1Inicial, valorCaixa2Inicial);

                            // Chama a função de atualização após a transferência para refletir o novo total dos caixas
                    
                        

                          mostrarAlerta('Prontinho!', 'O valor foi transferido com sucesso para o Caixa 2.');

                            // Atualiza o status do Caixa 2 após a transferência
                            statusCaixa1();
                            statusCaixa2();

                            // Atualiza o status de abastecimento abaixo do Caixa 2
                           atualizarAbastecimento(valorTransferido); // Passa o valor transferido
                        } else {
                            mostrarAlerta('Não foi possível!','Caixa 1 não tem saldo suficiente para transferir o excedente.', false);
                        }
                    });
                    
               } else if (lucroValor < metaDia) {
                    mostrarAlerta(
                        'Quase lá!',
                        ` Você não atingiu a meta para o dia <strong>${dia}</strong>. Mas não tem problema, o importante é continuar lucrando! O valor foi registrado no Caixa 1.`);
                } else {
                    mostrarAlerta('Tirou onda!','Sua meta do dia foi batida. O valor foi registrado no Caixa 1');
                  }
                
            } else {
                mostrarAlerta('Erro!', 'Por favor, insira um valor válido.', false);
               }
        });
        
} else if (escolha === "Preju") {
    mostrarModalInput(`Quanto foi a perda no dia ${dia}?`, (perda) => {
        const perdaValor = parseValor(perda);
        if (perdaValor > 0) {
            valorCaixa1Inicial -= perdaValor;
            valorCaixa1.textContent = formatarValor(valorCaixa1Inicial);
            
             // Atualiza o banco de dados após a perda
               atualizarValoresCaixas(valorCaixa1Inicial, valorCaixa2Inicial);

            // Marca o dia como vermelho inicialmente
            div.classList.add('quadrado-vermelho');
            registrarCorNoBanco(dia, 'vermelho');
            
            // Aqui, chamamos statusCaixa2 e atualizarTotalAtual antes de confirmar a ação
            statusCaixa2();
    

            // Confirma se deseja repor a perda com os fundos do Caixa 2
            confirmarAcao('Deseja repor a perda com os fundos do Caixa 2?', () => {
                if (valorCaixa2Inicial >= perdaValor) {
                    // Se o Caixa 2 tem fundos suficientes, repõe a perda
                    valorCaixa1Inicial += perdaValor;
                    valorCaixa2Inicial -= perdaValor;

                    valorCaixa1.textContent = formatarValor(valorCaixa1Inicial);
                    valorCaixa2.textContent = formatarValor(valorCaixa2Inicial);
                    
                    // Atualiza o banco de dados após a reposição
                    atualizarValoresCaixas(valorCaixa1Inicial, valorCaixa2Inicial);

                    // Chama a função de atualização após a reposição para refletir o novo total dos caixas
                    statusCaixa2();
        

                    // Muda o quadrado para laranja se a perda for reposta
                    div.classList.remove('quadrado-vermelho');
                    div.classList.add('quadrado-laranja');
                    
                    // Envia para o banco a cor laranja
                    registrarCorNoBanco(dia, 'laranja');

                    mostrarAlerta('Excelente!', 'A perda foi reposta com sucesso.');

                    // Atualiza o status do Caixa 2 após a reposição
                    statusCaixa2();
                } else {
                    mostrarAlerta('Não foi possível!','O Caixa 2 não tem fundos suficientes para repor a perda.', false);
                }
              statusCaixa1();
              
            }, () => {
                mostrarAlerta(
                    'Atenção!', 
                    'Você optou por não repor a perda com os fundos do Caixa 2.',  
                    false,  
                    true 
                );
            
            statusCaixa1();
    
            });
            
        } else {
            mostrarAlerta('Erro!', 'Por favor, insira um valor válido para a perda.', false);
        }
    });
    
} else {
    mostrarAlerta('Erro!', 'Escolha inválida. Digite "Lucro" ou "Preju".', false);
}

    });
    
        
   });

operacoesDiv.appendChild(div);

}


function registrarCorNoBanco(dia, cor) {
    const data = {
        dia: dia,  // Enviar 'dia' como número
        cor: cor   // Cor a ser registrada (verde, vermelho, laranja)
    };

    fetch('backend-setup.php?action=registrarCor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            alert('Erro ao registrar cor: ' + data.message);
        }
    })
    .catch(error => {
        alert('Erro ao fazer requisição.');
    });
}

function carregarCoresDoBanco() {
    fetch('backend-setup.php?action=obterCores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json()) // Converte a resposta em JSON
    .then(response => {
        if (response.success) {  // Verifique se a resposta foi bem-sucedida
            const cores = response.data;  // Acessa o array de cores
            // Para cada quadradinho, definir a cor com base no que foi retornado
            cores.forEach(corInfo => {
                const diaQuadradinho = document.querySelector(`[data-index='${corInfo.dia}']`);
                if (diaQuadradinho) {
                    // Aplica a cor diretamente ao quadradinho
                    diaQuadradinho.style.backgroundColor = corInfo.cor;
                    // Também pode adicionar a classe correspondente se precisar do estilo extra
                    diaQuadradinho.classList.add(`quadrado-${corInfo.cor}`);
                }
            });
        }
    })
    .catch(error => {
        alert('Erro ao carregar as cores do banco.');
    });
}

function excluirCoresNoBanco() {
    fetch('backend-setup.php?action=excluirCores', {
        method: 'GET',  // Mudança para GET
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            alert('Erro ao excluir as cores: ' + data.message);
        }
    })
    .catch(error => {
        alert('Erro ao fazer requisição de exclusão.');
    });
}


function calcularMetasDiarias(investimentoInicial, retorno, ciclo) {
    let metas = [];
    let investimentoAtual = parseFloat(investimentoInicial); // Garantir que seja um número

    for (let dia = 1; dia <= 30; dia++) {
        const lucroDia = parseFloat((investimentoAtual * retorno / 100).toFixed(2)); // Calcular lucro
        metas.push({ 
            investimento: investimentoAtual.toFixed(2), 
            lucro: lucroDia 
        }); // Adicionar valores corretamente formatados
        investimentoAtual += lucroDia; // Atualizar investimento
    }

    metasPorCiclo[ciclo - 1] = metas; // Armazenar as metas no ciclo atual

    return { metas, acumuladoFinal: investimentoAtual };
}

function obterMetaDoDia(dia) {
    if (metasPorCiclo[cicloAtual - 1]) {
        const meta = metasPorCiclo[cicloAtual - 1][dia - 1];
        return meta ? parseFloat(meta.lucro.toFixed(2)) : 0;
    }
    return 0;
}

let dadosSalvos = false;

function calcularMetasEExibirTabela() {
    const valorInvestido = parseFloat(valorInvestidoInput.value);
    const retorno = parseFloat(retornoInput.value);

    if (isNaN(valorInvestido) || isNaN(retorno)) {
        mostrarAlerta('Erro!', 'Por favor, preencha todos os campos.', false);
        return;
    }

    valorInvestidoInput.disabled = true;
    retornoInput.disabled = true;
    calcularBtn.disabled = true;

    let resultadoHTML = '';

    // Ciclo começa do valor inicial, não somando os acumulados dos ciclos anteriores
    for (let ciclo = 1; ciclo <= 6; ciclo++) {
        // Para cada ciclo, o investimento começa como o valor inicial
        const { metas, acumuladoFinal } = calcularMetasDiarias(valorInvestido, retorno, ciclo);

        resultadoHTML += `<div id="tabela-ciclo-${ciclo}" class="tabela-juros" style="display: ${ciclo === cicloAtual ? 'block' : 'none'};">`;
        resultadoHTML += `<h3 class="text-xl font-semibold mt-4">Ciclo ${ciclo}</h3>`;
        resultadoHTML += `
            <div class="overflow-x-auto mt-2">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead class="bg-indigo-600 text-white">
                        <tr>
                            <th class="py-4 px-6 border-b">Dia</th>
                            <th class="py-4 px-6 border-b">Investimento</th>
                            <th class="py-4 px-6 border-b">Retorno em %</th>
                            <th class="py-4 px-6 border-b">Meta</th>
                            <th class="py-4 px-6 border-b">Acumulado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let acumulado = valorInvestido; // Inicializa o acumulado com o valor investido inicial

        metas.forEach((meta, index) => {
            acumulado += meta.lucro; // Soma o lucro do dia ao acumulado

            resultadoHTML += `
                <tr class="hover:bg-gray-100 transition duration-200">
                    <td class="py-4 px-6 border-b">${index + 1}</td>
                    <td class="py-4 px-6 border-b">${formatarValor(meta.investimento)}</td>
                    <td class="py-4 px-6 border-b">${retorno.toFixed(2).replace('.', ',')}%</td>
                    <td class="py-4 px-6 border-b">${formatarValor(meta.lucro)}</td>
                    <td class="py-4 px-6 border-b">${formatarValor(acumulado)}</td> <!-- Exibe o acumulado correto -->
                </tr>
            `;
        });

        resultadoHTML += `
                    </tbody>
                </table>
                <div class="bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-lg p-6 pb-8 mt-6 mb-8 hover:scale-105 hover:shadow-xl hover:bg-green-50">
                    <div class="flex flex-col items-start">
                        <span class="text-lg font-semibold text-green-800 mb-2">Acumulado final do ciclo:</span>
                        <span class="text-2xl font-extrabold text-green-700">${formatarValor(acumuladoFinal)}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    tabelasJuros.classList.remove('hidden');
    tabelasJuros.innerHTML = resultadoHTML;
    metasCalculadas = true;

    if (!dadosSalvos) {
        salvarDadosIniciais(valorInvestido, retorno, cicloAtual);
    }
}


function formatarComVirgula(valor) {
    return valor.toString().replace('.', ',');
}


function carregarDadosIniciais() {
    // Carregar os dados iniciais do backend
    fetch('backend-setup.php?action=obterValoresIniciais')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                // Dados encontrados, carregar e recalcular a tabela
                const { investimento, retorno, ciclo } = data.data;

                // Preencher os inputs com os dados carregados
                    // Preencher os inputs com os dados carregados
                    valorInvestidoInput.value = investimento;
                    retornoInput.value = retorno;
                    
                       // Ocultar o valor nos inputs (empurrando o texto para fora da área visível)
            valorInvestidoInput.style.textIndent = '-9999px';
            retornoInput.style.textIndent = '-9999px';

                // Recalcular as metas com os dados carregados
                calcularMetasDiarias(investimento, retorno, ciclo);

                // Atualizar o ciclo atual com o valor carregado do banco
                cicloAtual = ciclo;
                atualizarIndicadorCiclo(cicloAtual);  // Atualiza o indicador de ciclo

                // Não chamar salvarDadosIniciais aqui, pois já foi salvo
                dadosSalvos = true;

                // Agora, chama a função para calcular e exibir a tabela automaticamente
                calcularMetasEExibirTabela();
            }
        })
        .catch(error => {
            // O log de erro foi removido conforme solicitado
        });
}


calcularBtn.addEventListener('click', () => {
    if (!verificarValoresCaixas()) {
        mostrarAlerta('Erro!', 'Você precisa registrar os valores dos caixas primeiro.', false);
        return;
    }

    dadosSalvos = false;
    calcularMetasEExibirTabela();
    setTimeout(() => {
        location.reload();
    }, 2000); 
});


function salvarDadosIniciais(valorInvestido, retorno, cicloAtual) {
    fetch('backend-setup.php?action=salvarValoresIniciais', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            valor_investido: valorInvestido,
            retorno: retorno,
            ciclo: cicloAtual, // Passa o ciclo atual
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            dadosSalvos = true;  // Marca como dados salvos
            // Sucesso no registro
            mostrarAlerta(
                'Sucesso!',
                'Os valores foram salvos com sucesso.',
                true // Passa true para sucesso
            );
        } else {
            // Caso o backend retorne erro
            mostrarAlerta(
                'Erro!',
                'Ocorreu um erro ao salvar os valores. Tente novamente.',
                false // Passa false para erro
            );
            console.error('Erro ao salvar valores:', data.message);
        }
    })
    .catch(error => {
        // Exibe SweetAlert2 com erro de comunicação
        mostrarAlerta(
            'Erro!',
            'Erro de comunicação com o servidor. Tente novamente.',
            false // Passa false para erro
        );
        console.error('Erro de comunicação com o servidor:', error);
    });
}




let cicloAtual = 1; 
let acumuladoAnterior = 0; 


function atualizarIndicadorCiclo(ciclo) {
    const cicloNumero = document.getElementById('ciclo-numero');
    if (cicloNumero) {
        cicloNumero.textContent = ciclo; // Atualiza apenas o número
    } else {
        console.error('Elemento ciclo-numero não encontrado!');
    }
}

function atualizarCicloNoBanco(ciclo, acumuladoAnterior) {
    return fetch('backend-setup.php?action=atualizarCiclo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ciclo, investimento: acumuladoAnterior }) // Envia o valor de acumuladoAnterior como investimento
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cicloAtual = data.ciclo;
                atualizarIndicadorCiclo(cicloAtual);
            }
        })
        .catch(error => {
            // O log de erro foi removido conforme solicitado
        });
}


function carregarCicloAtual() {
    fetch('backend-setup.php?action=RecuperarCiclo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Atualiza o ciclo atual com o valor do banco
                cicloAtual = data.ciclo;
                atualizarIndicadorCiclo(cicloAtual);
            }
        })
        .catch(error => {
            // O log de erro foi removido conforme solicitado
        });
}

proximoCicloBtn.addEventListener('click', () => {
    if (!todosDiasRegistrados) return;

    if (cicloAtual <= 5) {
        mostrarModalProximoCiclo(cicloAtual); // Chama a função que exibe o modal
    }


    limparQuadradinhos();
    excluirCoresNoBanco();

    // Incrementa o ciclo atual
    cicloAtual += 1;

    // Obter o valor final acumulado do ciclo anterior
    let acumuladoAnterior = parseFloat(valorInvestidoInput.value);
    if (metasPorCiclo[cicloAtual - 2]) {
        const ultimoCiclo = metasPorCiclo[cicloAtual - 2];
        acumuladoAnterior = parseFloat(ultimoCiclo[29].investimento) + parseFloat(ultimoCiclo[29].lucro);
    }

    // Atualiza o ciclo e acumuladoAnterior no banco
    atualizarCicloNoBanco(cicloAtual, acumuladoAnterior).then(() => {
        carregarCicloAtual(); // Certifica-se de carregar o ciclo mais atualizado
        carregarDadosIniciais();
    });

    const tabelaAtual = document.getElementById(`tabela-ciclo-${cicloAtual - 1}`);
    const tabelaProximo = document.getElementById(`tabela-ciclo-${cicloAtual}`);

    if (tabelaAtual) tabelaAtual.style.display = 'none';
    if (tabelaProximo) tabelaProximo.style.display = 'block';

    if (cicloAtual > 6) {
        proximoCicloBtn.style.display = 'none';
        mostrarModalCelebracao();
    } else {
        // Chama a função de cálculo com o valor atualizado (acumulado)
        calcularMetasDiarias(acumuladoAnterior, parseFloat(retornoInput.value), cicloAtual);
    }

    todosDiasRegistrados = false;
    proximoCicloBtn.innerHTML = '';
    proximoCicloBtn.style.display = 'none';
});





function limparQuadradinhos() {
    const quadradinhos = document.querySelectorAll('.dia-operacao'); // Seleciona todos os quadradinhos

    quadradinhos.forEach(quadradinho => {
        // Remove as classes de cor (sem remover o conteúdo, ou estrutura)
        quadradinho.classList.remove('quadrado-verde', 'quadrado-laranja', 'quadrado-vermelho');
        
        // Não removemos o conteúdo, então os números do dia permanecem
    });
}


setInterval(() => {
    const quadradinhoDia30 = document.querySelector('[data-index="30"]'); // Pega o quadradinho do dia 30

    // Verifica se o quadradinho do dia 30 foi colorido
    if (quadradinhoDia30 && (quadradinhoDia30.classList.contains('quadrado-verde') || 
                              quadradinhoDia30.classList.contains('quadrado-laranja') || 
                              quadradinhoDia30.classList.contains('quadrado-vermelho'))) {
        todosDiasRegistrados = true; // Marca todos os dias como registrados
        
        // Verifica se o Lottie já foi adicionado para evitar recriação repetida
        if (!proximoCicloBtn.querySelector('dotlottie-player')) {
            proximoCicloBtn.innerHTML = `
                <div style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%;">
                    <dotlottie-player src="https://lottie.host/7a8384b8-0529-4b49-99d5-a8c3b7e60ab0/WR2wgoFpAj.lottie" background="transparent" speed="1" style="width: 25px; height: 25px;" loop autoplay></dotlottie-player> 
                    <span>Próximo Ciclo</span>
                </div>
            `;
            proximoCicloBtn.style.display = 'inline-flex'; // Define o botão como flexível para centralizar
            proximoCicloBtn.style.alignItems = 'center'; // Alinha verticalmente os itens no botão
            proximoCicloBtn.style.justifyContent = 'center'; // Alinha horizontalmente os itens no botão
            proximoCicloBtn.style.padding = '10px 20px'; // Define o tamanho do botão
            proximoCicloBtn.disabled = false; // Desbloqueia o botão
        }
    }
}, 1000); 


function mostrarModalCelebracao() {
    const modalCelebracao = document.getElementById('modal-celebracao');
    modalCelebracao.classList.remove('hidden'); // Remove a classe 'hidden'
    modalCelebracao.classList.add('show'); // Adiciona a classe 'show'

    // Tocar áudio
    const audio = document.getElementById('myAudio');
    audio.play();

    document.getElementById('celebracao-ok').addEventListener('click', () => {
        modalCelebracao.classList.remove('show'); // Remove a classe 'show' ao fechar
        modalCelebracao.classList.add('hidden'); // Adiciona a classe 'hidden'
        reiniciarTudo();
    }, { once: true }); // Para evitar múltiplos listeners
}



function mostrarModalProximoCiclo(cicloAtual) {
    const modalProximoCiclo = document.getElementById('modal-proximociclo');
    modalProximoCiclo.classList.remove('hidden'); // Remove a classe 'hidden'
    modalProximoCiclo.classList.add('show'); // Adiciona a classe 'show'

    // Atualiza o texto do modal com a cor e negrito para o cicloAtual
    modalProximoCiclo.querySelector('p').innerHTML = `
        Você finalizou o Ciclo 
        <span class="bg-indigo-600 text-white font-bold px-1 rounded">${cicloAtual}</span>. 
        Bem-vindo ao novo!
    `;

    // Evento para fechar o modal
    document.getElementById('celebracao-proximociclo').addEventListener('click', () => {
        modalProximoCiclo.classList.remove('show'); // Remove a classe 'show'
        modalProximoCiclo.classList.add('hidden'); // Adiciona a classe 'hidden'
    }, { once: true }); // Evita múltiplos listeners
}



function reiniciarTudo() {
    fetch('backend-setup.php?action=reiniciarTudo', {
        method: 'GET',  // Usando o método GET para a requisição
        headers: {
            'Content-Type': 'application/json',  // Definindo o tipo de conteúdo como JSON
        }
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.success) {
            // Atualiza a página apenas quando os dados foram excluídos com sucesso
            window.location.reload(); // Recarrega a página
        } else {
            alert('Erro ao reiniciar os dados: ' + data.message);
        }
    })
    .catch(error => {
        alert('Erro na requisição. Tente novamente.');
    });
}

function verificarSeparadorDecimal(valor) {
    return valor.includes('.') && !valor.includes(',');
}

function mostrarAlertaInput(titulo, texto) {
    Swal.fire({
        title: titulo,
        text: texto.replace('.', ','),
        icon: 'warning',
        confirmButtonText: 'Ok'
    });
}




function adicionarHistorico(caixa, valor) {
    const historicoBody = document.getElementById('historico-registros-body');
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`;
    
    // Definir as classes de estilo com base no tipo de caixa
    const classeCaixa = caixa === 'Caixa 1' 
        ? 'text-black font-bold'    // Caixa 1 preto e negrito
        : 'text-black font-bold';   // Caixa 2 também preto e negrito

    const classeValor = caixa === 'Caixa 1' 
        ? 'text-black font-bold'    // Valor do Caixa 1 preto e negrito
        : 'text-black font-bold';   // Valor do Caixa 2 também preto e negrito

    const observacao = caixa === 'Caixa 1' 
        ? 'Destinado para operação' 
        : 'Reserva para repor stop loss';

    const status = "Registrado";  // Status fixo, pode ser alterado conforme lógica de negócio

    // Criar a linha da tabela
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td class="py-3 px-6 text-left">${dataFormatada}</td>
        <td class="py-3 px-6 text-left ${classeCaixa}">${caixa}</td>
        <td class="py-3 px-6 text-left ${classeValor}">${formatarValor(valor)}</td>
        <td class="py-3 px-6">
            <span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-sm">${status}</span>
        </td>
        <td class="py-3 px-6 text-left">${observacao}</td> <!-- Nova célula para observação -->
        <td class="py-3 px-6 text-center">
        
        </td>
    `;
    
    // Adicionar a linha ao corpo da tabela
    historicoBody.appendChild(novaLinha);

    // Enviar os dados para o servidor
    fetch('backend-setup.php?action=inserirHistorico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caixa: caixa,
            valor: valor,
            observacao: observacao,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Sucesso ao registrar histórico
        } else {
            // Erro ao registrar histórico
        }
    })
    .catch(error => {
        // Erro na comunicação com o servidor
    });
}

function obterHistorico() {
    const url = 'backend-setup.php?action=obterHistorico';  // URL para o backend sem user_id

    fetch(url, {
        method: 'GET',  // Requisição GET
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            preencherTabelaHistorico(data.data);  // Função para preencher a tabela com os dados
        }
    })
    .catch(error => {
        // O log de erro foi removido conforme solicitado
    });
}

function formatarMoeda(valor) {
    if (isNaN(valor)) {
        return '';  // Retorna uma string vazia se o valor não for um número
    }
    return '$' + valor.toFixed(2).replace('.', ','); // Adiciona o símbolo $ e formata o valor
}

function formatarData(data) {
    const partes = data.split('-');  // Divide a data no formato yyyy-mm-dd
    if (partes.length === 3) {
        const dia = partes[2].padStart(2, '0');  // Preenche com 0 à esquerda se necessário
        const mes = partes[1].padStart(2, '0');  // Preenche com 0 à esquerda se necessário
        const ano = partes[0];  // O ano já está no formato correto
        return `${dia}/${mes}/${ano}`;
    }
    return data;  // Se a data não estiver no formato esperado, retorna como está
}

function preencherTabelaHistorico(historico) {
    const tabelaBody = document.getElementById('historico-registros-body');
    tabelaBody.innerHTML = ''; // Limpa o conteúdo da tabela

    // Verifica se há registros
    if (!historico || historico.length === 0) {
        // Exibir mensagem "Nenhum registro encontrado"
        const trVazio = document.createElement('tr');
        trVazio.innerHTML = `
            <td colspan="6" class="text-center py-4 text-gray-500">
                Nenhum registro encontrado
            </td>
        `;
        tabelaBody.appendChild(trVazio);
        return; // Sai da função
    }

    // Ordena os registros para que "Caixa 1" fique sempre primeiro
    historico.sort((a, b) => (a.caixa === 'Caixa 1' ? -1 : 1));

    // Caso haja registros, preenche a tabela
    historico.forEach(registro => {
        const tr = document.createElement('tr');

        const classeCaixa = registro.caixa === 'Caixa 1' 
            ? 'text-black font-bold'
            : 'text-black font-bold';

        const classeValor = registro.caixa === 'Caixa 1' 
            ? 'text-black font-bold'
            : 'text-black font-bold';

        const observacao = registro.caixa === 'Caixa 1' 
            ? 'Destinado para operação'
            : 'Reserva para repor stop loss';

        const status = "Registrado";

        tr.innerHTML = `
            <td class="py-3 px-6 text-left">${formatarData(registro.data)}</td>
            <td class="py-3 px-6 text-left ${classeCaixa}">${registro.caixa}</td>
            <td class="py-3 px-6 text-left ${classeValor}">${formatarMoeda(parseFloat(registro.valor))}</td>
            <td class="py-3 px-6">
                <span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-sm">${status}</span>
            </td>
            <td class="py-3 px-6 text-left">${observacao}</td>
            <td class="py-3 px-6 text-center"></td>
        `;

        tabelaBody.appendChild(tr);
    });
}







let totalComprometidoInicial = 0;
let valorCaixa1Inicial = 0; 
let valorCaixa2Inicial = 0; 
let caixasSalvos = false; 


function obterValores() {
    fetch('backend-setup.php?action=obterValores', {
        method: 'GET' // Garantindo que o método GET seja usado
    })
    .then(response => {
        // Verificar se a resposta é OK
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const valores = data.data;

            valorCaixa1Inicial = parseFloat(valores.caixa1) || 0;
            valorCaixa2Inicial = parseFloat(valores.caixa2) || 0;
            totalComprometidoInicial = parseFloat(valores.total_comprometido) || 0;
            const totalAtual = parseFloat(valores.total_atual) || 0;

            // Verificar se os valores do caixa 1 e caixa 2 estão presentes e marcar como 'salvo'
            if (valorCaixa1Inicial > 0 && valorCaixa2Inicial > 0) {
                caixasSalvos = true; // Dados estão salvos
            }

            // Atualizando os elementos HTML com os valores formatados
            document.getElementById("valor-caixa1").innerText = formatarMoeda(valorCaixa1Inicial);
            document.getElementById("valor-caixa2").innerText = formatarMoeda(valorCaixa2Inicial);
            document.getElementById("total-dos-caixas").innerText = formatarMoeda(totalComprometidoInicial);
            document.getElementById("total-dos-caixas-atual").innerText = formatarMoeda(totalAtual);

            // Atualizando os valores nos inputs com os valores de valorCaixa1 e valorCaixa2
            caixa1Input.dataset.rawValue = formatarValor(valores.valorCaixa1);
            caixa2Input.dataset.rawValue = formatarValor(valores.valorCaixa2);

            caixa1Input.value = formatarValor(valores.valorCaixa1);
            caixa2Input.value = formatarValor(valores.valorCaixa2);

            // Empurrar o texto para fora da área visível
            caixa1Input.style.textIndent = '-9999px';
            caixa2Input.style.textIndent = '-9999px';

            // Bloquear inputs e botões se os dados já foram salvos
            if (caixasSalvos) {
                caixa1Input.disabled = true;
                caixa2Input.disabled = true;
                registrarValoresBtn.disabled = true;
            }

            // Chama a função para atualizar o cálculo de ganho/perda líquida
            atualizarGanhoPerdaLiquida(totalComprometidoInicial, totalAtual);
        }
    })
    .catch(error => {
        console.error('Erro ao obter valores: ', error);  // Log de erro para facilitar o diagnóstico
    });
}




window.onload = function() {
    // Chama as funções logo ao carregar a página
    
    
    obterValores(); 
    obterHistorico();
    preencherTabelaHistorico([]);
    carregarDadosIniciais();
    carregarCicloAtual();
    atualizarTotal(); // Atualiza o total comprometido
    atualizarTotalAtual(); // Atualiza o total atual
    carregarCoresDoBanco();
    recuperarStatusCaixa();
    configurarModoMercado();


    const intervalo = 3000; // 5 segundos
    // Chama 'obterValores' e 'carregarCicloAtual' a cada 5 segundos
        setInterval(() => {
            obterValores(); // Atualiza os valores 
    
        
        }, intervalo);

};




function atualizarGanhoPerdaLiquida(totalComprometido, totalAtual) {
    // Verifica se os valores são válidos
    if (isNaN(totalComprometido) || isNaN(totalAtual)) {
        console.error("Valores inválidos para o cálculo do ganho/perda líquida");
        return;  // Se não for numérico, não faz o cálculo
    }

    // Calcula a diferença (lucro ou prejuízo)
    const diferenca = totalAtual - totalComprometido;

    // Calcula o percentual de ganho ou perda
    const percentual = ((diferenca / totalComprometido) * 100).toFixed(2);

    // Atualiza o valor de Ganho/Perda Líquida
    const ganhoPerdaValor = document.getElementById('ganho-perda-liquida-valor');
    const ganhoPerdaPercentual = document.getElementById('ganho-perda-liquida-percentual');

    // Verifica a diferença para determinar lucro, prejuízo ou zero
    if (diferenca > 0) {
        ganhoPerdaValor.textContent = `+${formatarMoeda(diferenca)}`; // Lucro, mostra positivo
        ganhoPerdaValor.classList.add('text-green-400');  // Cor verde para lucro
        ganhoPerdaValor.classList.remove('text-red-400');
        ganhoPerdaPercentual.textContent = `(+${percentual}%)`; // Percentual de lucro
        ganhoPerdaPercentual.classList.add('text-green-400'); // Cor verde para lucro
        ganhoPerdaPercentual.classList.remove('text-red-400');
    } else if (diferenca < 0) {
        ganhoPerdaValor.textContent = `${formatarMoeda(diferenca)}`; // Prejuízo, sem o sinal de "+"
        ganhoPerdaValor.classList.add('text-red-400');  // Cor vermelha para prejuízo
        ganhoPerdaValor.classList.remove('text-green-400');
        ganhoPerdaPercentual.textContent = `(${percentual}%)`; // Percentual de prejuízo
        ganhoPerdaPercentual.classList.add('text-red-400'); // Cor vermelha para prejuízo
        ganhoPerdaPercentual.classList.remove('text-green-400');
    } else {
        // Caso seja exatamente 0
        ganhoPerdaValor.textContent = `${formatarMoeda(diferenca)}`; // Mostra "0" ou equivalente
        ganhoPerdaValor.classList.add('text-green-400');  // Cor verde para zero
        ganhoPerdaValor.classList.remove('text-red-400');
        ganhoPerdaPercentual.textContent = `(0.00%)`; // Percentual é zero
        ganhoPerdaPercentual.classList.add('text-green-400'); // Cor verde para zero
        ganhoPerdaPercentual.classList.remove('text-red-400');
    }
}

function formatarMoeda(valor) {
    return '$' + valor.toFixed(2).replace('.', ','); // Adiciona o símbolo $ e formata o valor
}


function atualizarTotal() {
    totalComprometidoInicial = valorCaixa1Inicial + valorCaixa2Inicial; // Registra o valor inicial de comprometido

    // Atualiza o conteúdo do Total Comprometido no HTML
    const totalComprometido = document.getElementById('total-dos-caixas');
    totalComprometido.textContent = formatarMoeda(totalComprometidoInicial); // Atualiza com a formatação correta
}


function atualizarTotalAtual() {
    const totalAtual = valorCaixa1Inicial + valorCaixa2Inicial;

    // Atualiza o conteúdo do Total Atual no HTML
    const totalAtualElemento = document.getElementById('total-dos-caixas-atual');
    totalAtualElemento.textContent = formatarMoeda(totalAtual); // Formatação da moeda
}

// Função para salvar a seleção do seletor no localStorage e aplicar ao carregar a página
function configurarModoMercado() {
    const modoMercadoSelect = document.getElementById('modoMercado');

    // Recupera o valor salvo do localStorage
    const modoMercadoSalvo = localStorage.getItem('modoMercado');

    // Se houver um valor salvo, aplica no seletor
    if (modoMercadoSalvo) {
        modoMercadoSelect.value = modoMercadoSalvo;
    }

    // Salva o valor da seleção no localStorage sempre que houver uma mudança
    modoMercadoSelect.addEventListener('change', function() {
        localStorage.setItem('modoMercado', modoMercadoSelect.value);
    });
}





registrarValoresBtn.addEventListener('click', () => {
    const valorCaixa1Atual = caixa1Input.dataset.rawValue; 
    const valorCaixa2Atual = caixa2Input.dataset.rawValue;

    // Verificação de separador decimal (vírgula)
    if (verificarSeparadorDecimal(valorCaixa1Atual)) {
        mostrarAlertaInput('Erro!', 'Por favor, use vírgula como separador decimal em Caixa 1');
        return;
    }
    if (verificarSeparadorDecimal(valorCaixa2Atual)) {
        mostrarAlertaInput('Erro!', 'Por favor, use vírgula como separador decimal em Caixa 2');
        return;
    }

    // Parse e validação dos valores
    const valorCaixa1Num = parseValor(valorCaixa1Atual);
    const valorCaixa2Num = parseValor(valorCaixa2Atual);

    if (isNaN(valorCaixa1Num) || isNaN(valorCaixa2Num) || valorCaixa1Num <= 0 || valorCaixa2Num <= 0) {
        mostrarAlerta('Erro!', 'Por favor, insira valores válidos para ambos os caixas.', false);
        return;
    }

    // Armazenamento dos valores nos campos
    valorCaixa1Inicial = valorCaixa1Num;
    valorCaixa2Inicial = valorCaixa2Num;

    valorCaixa1.textContent = formatarValor(valorCaixa1Inicial);
    valorCaixa2.textContent = formatarValor(valorCaixa2Inicial);

    // Limpar os campos de input
    caixa1Input.value = '';
    caixa2Input.value = '';

    // Adiciona os valores registrados ao histórico
    adicionarHistorico('Caixa 1', valorCaixa1Inicial);
    adicionarHistorico('Caixa 2', valorCaixa2Inicial);

    // Atualiza os totais após adicionar os valores
    
    preencherTabelaHistorico([]);
    atualizarTotal(); 
    atualizarTotalAtual();

    // Exibe o alerta de sucesso
    mostrarAlerta('Sucesso!', 'Valores registrados com sucesso.');

    // Calcular os totais (total comprometido e total atual)
    const totalComprometido = valorCaixa1Inicial + valorCaixa2Inicial;
    const totalAtual = totalComprometido; // Ou alguma outra fórmula para o total atual

    // Enviar as requisições simultaneamente para atualizar os valores no backend
    const request1 = fetch('backend-setup.php?action=inserirValores', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        caixa1: valorCaixa1Inicial,
        caixa2: valorCaixa2Inicial,
        totalComprometido: totalComprometido,  // Enviar o total comprometido
        totalAtual: totalAtual, // Enviar o total atual
        valorCaixa1: valorCaixa1Atual, 
        valorCaixa2: valorCaixa2Atual  
    })
});

    const request2 = fetch('backend-setup.php?action=inserirHistorico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            historico: true,
            caixa1: valorCaixa1Inicial,
            caixa1Observacao: 'Destinado para operação',
            caixa2: valorCaixa2Inicial,
            caixa2Observacao: 'Reserva para repor stop loss',
            status: 'Registrado' // Status fixo
        })
    });

    // Aguardar ambas as requisições terminarem simultaneamente
    Promise.all([request1, request2])
        .then(responses => {
            // Aqui você pode verificar cada resposta de forma individual
            return Promise.all(responses.map(response => response.json()));
        })
        .then(data => {
            data.forEach(responseData => {
                if (responseData.success) {
                  // Após o sucesso das requisições
setTimeout(() => {
    location.reload(); // Recarregar a página após 5 segundos
}, 2000); // 5000 milissegundos = 5 segundos
                    // Sucesso ao processar as requisições
                } else {
                    // Erro ao processar as requisições
                }
            });
        })
        .catch(error => {
            // Erro de comunicação com o backend
        });


});


 

 linkPlanilhaBtn.addEventListener('click', () => {
        window.open('https://docs.google.com/spreadsheets/d/1Zy.../edit', '_blank');
    });
});