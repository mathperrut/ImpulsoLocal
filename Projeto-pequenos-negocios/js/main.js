/* =========================================================
   main.js · comportamentos comuns a TODAS as páginas
   1. Menu hambúrguer (celular)
   2. Ano atual no rodapé
   ========================================================= */

// ---------- 1. Menu hambúrguer ----------
// No celular os links somem e aparece um botão. Ao clicar, o menu abre/fecha.
// aria-expanded informa aos leitores de tela se o menu está aberto.
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function fecharMenu() {
  navLinks.classList.remove('aberto');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const aberto = navLinks.classList.toggle('aberto');
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha ao escolher um link ou apertar Esc (controle do usuário)
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('aberto')) {
      fecharMenu();
      menuToggle.focus();
    }
  });

  // Se a tela for aumentada (girar o celular, por ex.), garante o menu fechado
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) fecharMenu();
  });
}

// ---------- 2. Ano no rodapé ----------
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();
