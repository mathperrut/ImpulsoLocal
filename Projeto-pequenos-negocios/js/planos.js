/* =========================================================
   planos.js · só é carregado em planos.html
   1. Alternador de cobrança mensal / anual
   2. Botão "Ver todos os recursos" (reduz a densidade de informação)
   ========================================================= */

// ---------- 1. Mensal / anual ----------
// Cada preço guarda os dois valores em atributos data-*:
//   <span class="valor" data-mensal="497" data-anual="414">
// Ao trocar a opção, o JS só escolhe qual dos dois mostrar.
const botoesCobranca = document.querySelectorAll('[data-cobranca]');

function mostrarPrecos(tipo) {
  document.querySelectorAll('.plan-card').forEach((card) => {
    const valor = card.querySelector('.valor');
    const cobranca = card.querySelector('.plan-cobranca');

    valor.textContent = tipo === 'anual' ? valor.dataset.anual : valor.dataset.mensal;
    cobranca.textContent = tipo === 'anual' ? cobranca.dataset.anualTexto : 'cobrança mensal';
  });

  botoesCobranca.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.cobranca === tipo));
  });
}

botoesCobranca.forEach((btn) => {
  btn.addEventListener('click', () => mostrarPrecos(btn.dataset.cobranca));
});

// ---------- 2. Ver todos os recursos ----------
// Por padrão cada plano mostra só o que o diferencia dos outros.
// Os recursos em comum ficam numa segunda lista (.extra), escondida pelo CSS.
document.querySelectorAll('.btn-ver-mais').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lista = document.getElementById(btn.getAttribute('aria-controls'));
    const aberto = lista.classList.toggle('aberto');

    btn.setAttribute('aria-expanded', String(aberto));
    btn.querySelector('span').textContent = aberto ? 'Mostrar menos' : 'Ver todos os recursos';
  });
});
