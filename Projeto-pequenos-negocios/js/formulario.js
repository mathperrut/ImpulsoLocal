/* =========================================================
   formulario.js · só é carregado em contato.html
   1. Máscaras (WhatsApp e CNPJ)
   2. Regras de validação de cada campo
   3. Exibição de erros ao lado do campo (substitui o antigo alert)
   4. Envio simulado com opção de cancelar
   5. Tela de sucesso: "Corrigir meus dados" e "Enviar outro pedido"
   6. Lembrar os dados do último pedido (visitante recorrente)
   7. Plano vindo da página de planos (?plano=...)
   ========================================================= */

const form = document.getElementById('leadForm');
const telaSucesso = document.getElementById('formSuccess');
const btnEnviar = document.getElementById('btnEnviar');
const btnCancelar = document.getElementById('btnCancelar');
const TEXTO_BOTAO = btnEnviar.textContent;
const CHAVE_STORAGE = 'impulsolocal-ultimo-pedido';

const campos = {
  nome: document.getElementById('nome'),
  whatsapp: document.getElementById('whatsapp'),
  email: document.getElementById('email'),
  empresa: document.getElementById('empresa'),
  cnpj: document.getElementById('cnpj'),
  segmento: document.getElementById('segmento'),
  plano: document.getElementById('plano'),
  meta: document.getElementById('meta'),
};

/* ---------- 1. Máscaras ---------- */

// Impede digitar o sinal de menos (proteção contra erros)
function bloquearNegativo(event) {
  if (event.key === '-' || event.key === 'Subtract') {
    event.preventDefault();
  }
}

// (24) 99999-9999 ou (24) 3333-3333
function mascaraTelefone(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 11); // só números, no máximo 11

  if (n.length <= 2) return n;
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

// 00.000.000/0000-00
function mascaraCnpj(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 14);

  return n
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

campos.whatsapp.addEventListener('keydown', bloquearNegativo);
campos.whatsapp.addEventListener('input', () => {
  campos.whatsapp.value = mascaraTelefone(campos.whatsapp.value);
});

campos.cnpj.addEventListener('keydown', bloquearNegativo);
campos.cnpj.addEventListener('input', () => {
  campos.cnpj.value = mascaraCnpj(campos.cnpj.value);
});

// Contador de caracteres da meta
const contadorMeta = document.getElementById('contador-meta');
function atualizarContador() {
  contadorMeta.textContent = `${campos.meta.value.length}/500`;
}
campos.meta.addEventListener('input', atualizarContador);

/* ---------- 2. Regras de validação ----------
   Cada função recebe o valor e devolve:
   - '' (texto vazio) se estiver tudo certo
   - a mensagem de erro, explicando COMO corrigir */

// Confere os dígitos verificadores do CNPJ
function cnpjValido(cnpj) {
  const n = cnpj.replace(/\D/g, '');
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false;

  const calcularDigito = (base) => {
    let pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split('').reduce((total, digito, i) => total + Number(digito) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcularDigito(n.slice(0, 12));
  const d2 = calcularDigito(n.slice(0, 12) + d1);
  return n.endsWith(`${d1}${d2}`);
}

const regras = {
  nome(valor) {
    if (!valor.trim()) return 'Informe seu nome.';
    if (valor.trim().length < 3) return 'O nome precisa ter pelo menos 3 letras.';
    if (/\d/.test(valor)) return 'O nome não pode ter números.';
    return '';
  },
  whatsapp(valor) {
    const n = valor.replace(/\D/g, '');
    if (!n) return 'Informe seu WhatsApp para podermos falar com você.';
    if (n.length < 10) return 'Informe o DDD e os 9 dígitos, ex.: (24) 99999-9999.';
    if (Number(n.slice(0, 2)) < 11) return 'DDD inválido. Use o DDD da sua cidade, ex.: 24.';
    return '';
  },
  email(valor) {
    if (!valor.trim()) return ''; // opcional
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return formato.test(valor.trim()) ? '' : 'E-mail incompleto. Confira o formato, ex.: nome@empresa.com.br.';
  },
  empresa(valor) {
    return valor.trim().length >= 2 ? '' : 'Informe o nome do seu negócio.';
  },
  cnpj(valor) {
    if (!valor.trim()) return ''; // opcional
    if (valor.replace(/\D/g, '').length < 14) return 'O CNPJ tem 14 números. Confira ou deixe em branco.';
    return cnpjValido(valor) ? '' : 'Esse CNPJ não existe. Confira os números ou deixe em branco.';
  },
  segmento(valor) {
    return valor ? '' : 'Escolha o segmento que mais combina com o seu negócio.';
  },
  meta(valor) {
    if (!valor.trim()) return 'Conte qual é a sua principal meta.';
    if (valor.trim().length < 10) return 'Escreva um pouco mais (pelo menos 10 caracteres).';
    return '';
  },
};

/* ---------- 3. Mostrar / limpar erros ---------- */

function mostrarErro(nomeCampo, mensagem) {
  const campo = campos[nomeCampo];
  const grupo = campo.closest('.form-group');
  const areaErro = document.getElementById(`erro-${nomeCampo}`);

  areaErro.textContent = mensagem;
  grupo.classList.toggle('com-erro', Boolean(mensagem));
  grupo.classList.toggle('valido', !mensagem && campo.value.trim() !== '');
  campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

function validarCampo(nomeCampo) {
  const mensagem = regras[nomeCampo](campos[nomeCampo].value);
  mostrarErro(nomeCampo, mensagem);
  return mensagem === '';
}

// Depois que um campo mostrou erro, ele é conferido de novo a cada digitação,
// assim a mensagem some assim que o usuário corrige.
Object.keys(regras).forEach((nomeCampo) => {
  const evento = campos[nomeCampo].tagName === 'SELECT' ? 'change' : 'input';
  campos[nomeCampo].addEventListener(evento, () => {
    if (campos[nomeCampo].closest('.form-group').classList.contains('com-erro')) {
      validarCampo(nomeCampo);
    }
  });
});

/* ---------- 4. Envio (simulado) com cancelar ---------- */
let envioEmAndamento = null;

form.addEventListener('submit', (e) => {
  e.preventDefault(); // nada é enviado sem passar pela validação

  // Valida todos os campos e guarda o primeiro com erro
  const invalidos = Object.keys(regras).filter((nomeCampo) => !validarCampo(nomeCampo));

  if (invalidos.length > 0) {
    campos[invalidos[0]].focus(); // leva o cursor direto ao primeiro erro
    return;
  }

  // Feedback imediato: botão muda e aparece a opção de cancelar
  btnEnviar.textContent = 'Enviando...';
  btnEnviar.disabled = true;
  btnCancelar.classList.add('visivel');

  envioEmAndamento = setTimeout(concluirEnvio, 1800);
});

btnCancelar.addEventListener('click', () => {
  clearTimeout(envioEmAndamento);
  restaurarBotao();
  btnEnviar.focus();
});

function restaurarBotao() {
  btnEnviar.textContent = TEXTO_BOTAO;
  btnEnviar.disabled = false;
  btnCancelar.classList.remove('visivel');
}

function concluirEnvio() {
  salvarDados();

  document.getElementById('nomeSucesso').textContent = campos.nome.value.trim().split(' ')[0];
  document.getElementById('zapSucesso').textContent = campos.whatsapp.value;

  restaurarBotao();
  form.style.display = 'none';
  telaSucesso.classList.add('visivel');
  telaSucesso.focus();
}

/* ---------- 5. Depois do envio: o usuário continua no controle ---------- */

// Volta para o formulário AINDA PREENCHIDO
document.getElementById('btnCorrigir').addEventListener('click', () => {
  telaSucesso.classList.remove('visivel');
  form.style.display = 'block';
  campos.nome.focus();
});

// Volta para o formulário para um novo pedido (mantém os dados de contato)
document.getElementById('btnNovo').addEventListener('click', () => {
  campos.meta.value = '';
  campos.plano.value = '';
  atualizarContador();
  telaSucesso.classList.remove('visivel');
  form.style.display = 'block';
  campos.meta.focus();
});

/* ---------- 6. Lembrar dados do último pedido ---------- */
// O localStorage guarda informações no navegador do próprio visitante.
// try/catch: em aba anônima ou com bloqueio, o site continua funcionando.
const CAMPOS_LEMBRADOS = ['nome', 'whatsapp', 'email', 'empresa', 'cnpj', 'segmento'];

function salvarDados() {
  const dados = {};
  CAMPOS_LEMBRADOS.forEach((nomeCampo) => (dados[nomeCampo] = campos[nomeCampo].value));
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
  } catch (erro) {
    /* sem armazenamento disponível: apenas não lembra */
  }
}

function carregarDados() {
  let dados = null;
  try {
    dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
  } catch (erro) {
    return;
  }
  if (!dados) return;

  CAMPOS_LEMBRADOS.forEach((nomeCampo) => {
    if (dados[nomeCampo]) campos[nomeCampo].value = dados[nomeCampo];
  });
  document.getElementById('avisoDados').classList.add('visivel');
}

document.getElementById('limparDados').addEventListener('click', () => {
  form.reset();
  atualizarContador();
  Object.keys(regras).forEach((nomeCampo) => mostrarErro(nomeCampo, ''));
  try {
    localStorage.removeItem(CHAVE_STORAGE);
  } catch (erro) { /* ignora */ }
  document.getElementById('avisoDados').classList.remove('visivel');
  campos.nome.focus();
});

/* ---------- 7. Plano escolhido na página de planos ---------- */
// planos.html envia para contato.html?plano=crescimento
const planoDaUrl = new URLSearchParams(window.location.search).get('plano');

carregarDados();
if (planoDaUrl && campos.plano.querySelector(`option[value="${planoDaUrl}"]`)) {
  campos.plano.value = planoDaUrl;
}
