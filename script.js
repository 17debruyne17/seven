/** JavaScript é uma linguagem de programação que roda no navegador e permite criar interações e comportamentos dinâmicos em páginas web, como cliques, animações e mudanças em tempo real.
 * SEVEN Consultoria Empresarial — script.js
 * Responsabilidades:
 *  1. Navbar: scroll e hambúrguer mobile
 *  2. Animações de entrada com IntersectionObserver
 *  3. Link ativo na navbar conforme scroll
 *  4. Validação e envio do formulário de contato
 *  5. Ano dinâmico no rodapé
 */

/* ──────────────────────────────────────────────────────────────
   1. ELEMENTOS DO DOM
────────────────────────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navLinkEls  = document.querySelectorAll('.nav-link');
const animEls     = document.querySelectorAll('[data-animate]');
const form        = document.getElementById('contatoForm');
const anoAtual    = document.getElementById('anoAtual');


/* ──────────────────────────────────────────────────────────────
   2. ANO DINÂMICO NO RODAPÉ
────────────────────────────────────────────────────────────── */
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}


/* ──────────────────────────────────────────────────────────────
   3. NAVBAR — SCROLL
   Adiciona classe .scrolled ao passar de 50px de rolagem
────────────────────────────────────────────────────────────── */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Executa na carga para caso já esteja rolado


/* ──────────────────────────────────────────────────────────────
   4. NAVBAR — HAMBÚRGUER MOBILE
────────────────────────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);

  // Impede scroll do body enquanto menu estiver aberto
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Fecha o menu ao clicar em um link
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});

// Fecha o menu ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});


/* ──────────────────────────────────────────────────────────────
   5. LINK ATIVO NA NAVBAR (baseado na seção visível)
   Observa seções e destaca o link correspondente
────────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute('id');

    navLinkEls.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${id}`
      );
    });
  });
}, {
  threshold: 0.35, // Seção precisa estar 35% visível
});

sections.forEach((sec) => sectionObserver.observe(sec));


/* ──────────────────────────────────────────────────────────────
   6. ANIMAÇÕES DE ENTRADA COM IntersectionObserver
   Elementos com [data-animate] ganham .is-visible ao entrar na tela
────────────────────────────────────────────────────────────── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      animObserver.unobserve(entry.target); // Anima apenas uma vez
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px', // Começa um pouco antes do fim da tela
});

animEls.forEach((el) => animObserver.observe(el));


/* ──────────────────────────────────────────────────────────────
   7. FORMULÁRIO DE CONTATO — VALIDAÇÃO E ENVIO SIMULADO
────────────────────────────────────────────────────────────── */

/**
 * Valida o campo informado e exibe/limpa a mensagem de erro.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - O campo a validar
 * @param {string} errorId - ID do elemento de erro correspondente
 * @returns {boolean} true se válido, false se inválido
 */
function validateField(field, errorId) {
  const errorEl = document.getElementById(errorId);
  const value   = field.value.trim();
  let   message = '';

  // Regras por campo
  if (field.id === 'nome') {
    if (!value) {
      message = 'Por favor, informe seu nome.';
    } else if (value.length < 3) {
      message = 'O nome deve ter ao menos 3 caracteres.';
    }
  }

  if (field.id === 'email') {
    // RFC5322 simplificado
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      message = 'Por favor, informe seu e-mail.';
    } else if (!emailRegex.test(value)) {
      message = 'Informe um e-mail válido (ex: nome@empresa.com).';
    }
  }

  if (field.id === 'mensagem') {
    if (!value) {
      message = 'Por favor, escreva sua mensagem.';
    } else if (value.length < 10) {
      message = 'A mensagem deve ter ao menos 10 caracteres.';
    }
  }

  // Aplica estado visual
  if (message) {
    field.classList.add('has-error');
    errorEl.textContent = message;
    return false;
  } else {
    field.classList.remove('has-error');
    errorEl.textContent = '';
    return true;
  }
}

// Validação em tempo real (ao sair do campo)
const formFields = [
  { field: document.getElementById('nome'),     errorId: 'erroNome'     },
  { field: document.getElementById('email'),    errorId: 'erroEmail'    },
  { field: document.getElementById('mensagem'), errorId: 'erroMensagem' },
];

formFields.forEach(({ field, errorId }) => {
  // Valida ao perder o foco
  field.addEventListener('blur', () => validateField(field, errorId));
  // Limpa erro enquanto digita
  field.addEventListener('input', () => {
    if (field.classList.contains('has-error')) {
      validateField(field, errorId);
    }
  });
});


/**
 * Handler de envio do formulário.
 * Valida todos os campos e, se OK, simula o envio.
 */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Valida todos os campos
  const isValid = formFields.every(({ field, errorId }) =>
    validateField(field, errorId)
  );

  if (!isValid) return;

  // Desabilita botão e exibe estado de carregamento
  const btn     = document.getElementById('btnEnviar');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');

  btn.disabled       = true;
  btnText.textContent = 'Enviando…';
  btnIcon.textContent = '⟳';

  // Simulação de chamada assíncrona (substitua pela integração real)
  setTimeout(() => {
    // Sucesso
    form.reset();
    formFields.forEach(({ field }) => field.classList.remove('has-error'));

    const successEl = document.getElementById('formSucesso');
    successEl.hidden = false;

    // Restaura botão após 4s
    setTimeout(() => {
      btn.disabled       = false;
      btnText.textContent = 'Enviar mensagem';
      btnIcon.textContent = '→';
      successEl.hidden    = true;
    }, 4000);
  }, 1500);
});


/* ──────────────────────────────────────────────────────────────
   8. SCROLL SUAVE PARA LINKS INTERNOS
   (Complementa o scroll-behavior CSS com ajuste da navbar fixa)
────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);

    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});