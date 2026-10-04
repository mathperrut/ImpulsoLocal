// troca os preços entre mensal e anual
// cada preço tem os dois valores guardados em data-mensal e data-anual
const botoesCobranca = document.querySelectorAll('[data-cobranca]');

function mostrarPrecos(tipo) {
  document.querySelectorAll('.plan-card').forEach((card) => {
    const valor = card.querySelector('.valor');
    const cobranca = card.querySelector('.plan-cobranca');

    valor.textContent = tipo === 'anual' ? valor.dataset.anual : valor.dataset.mensal;
    cobranca.textContent = tipo === 'anual' ? cobranca.dataset.anualTexto : 'cobrança mensal';
  });

  botoesCobranca.forEach((btn) => {
    if (btn.dataset.cobranca === tipo) {
      btn.classList.add('ativo');
    } else {
      btn.classList.remove('ativo');
    }
  });
}

botoesCobranca.forEach((btn) => {
  btn.addEventListener('click', () => mostrarPrecos(btn.dataset.cobranca));
});

// botão "ver todos os recursos": mostra ou esconde a lista .extra
document.querySelectorAll('.btn-ver-mais').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lista = document.getElementById(btn.getAttribute('aria-controls'));
    const aberto = lista.classList.toggle('aberto');

    btn.setAttribute('aria-expanded', String(aberto));
    btn.querySelector('span').textContent = aberto ? 'Mostrar menos' : 'Ver todos os recursos';
  });
});
