document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// PDF via utskriftsdialogen (utskriftsstilen ger en ren pappersversion)
document.getElementById('pdf-btn').addEventListener('click', () => window.print());

// Läsförloppsindikator
const progress = document.getElementById('progress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = max > 0 ? (window.scrollY / max) * 100 + '%' : '0';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Skrivmaskinseffekt i overlinen.
// Hela texten ligger kvar i en sr-only-span så skärmläsare inte får halva ord;
// det animerade är dolt för hjälpmedel.
const overline = document.querySelector('.overline');
if (overline && !reducedMotion) {
  const full = overline.textContent;
  const srText = document.createElement('span');
  srText.className = 'sr-only';
  srText.textContent = full;
  const anim = document.createElement('span');
  anim.setAttribute('aria-hidden', 'true');
  const textNode = document.createTextNode('');
  const caret = document.createElement('span');
  caret.className = 'caret';
  anim.append(textNode, caret);
  overline.textContent = '';
  overline.append(srText, anim);
  let i = 0;
  const timer = setInterval(() => {
    textNode.textContent = full.slice(0, ++i);
    if (i >= full.length) {
      clearInterval(timer);
      setTimeout(() => caret.remove(), 2500);
    }
  }, 55);
}

// Scroll-animationer
const revealEls = document.querySelectorAll('section, .entry');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Terminal (easter egg: tryck T)
(function () {
  // OBS: innehållet nedan duplicerar CV:t i index.html/en/index.html —
  // uppdatera det här när CV:t ändras.
  const COMMANDS = {
    help: () =>
      'available commands:\n' +
      '  whoami      who is this guy?\n' +
      '  experience  career history\n' +
      '  projects    selected projects\n' +
      '  skills      what I bring\n' +
      '  contact     get in touch\n' +
      '  clear       clear terminal\n' +
      '  exit        close terminal (or Esc)',
    whoami: () =>
      'Hugo Hammarstrand\nHead of Digital Construction @ Peab Anläggning AB\nBIM · drones · digital transformation',
    experience: () =>
      '2022–     Head of Digital Construction, Peab Anläggning\n' +
      '2018–22   BIM coordinator / site manager, Peab Air\n' +
      '2016–18   BIM coordinator\n' +
      '2014–16   Surveyor / drone pilot',
    projects: () =>
      'E45 Lilla Bommen–Marieholm   1,023 MSEK   BIM coordination\n' +
      'Peab Air                     group-wide   2 → ~100 pilots\n' +
      'Marieholm ED 2               333 MSEK     CAD/data coordination\n' +
      'AstaZero proving ground      260 MSEK     surveying',
    skills: () =>
      'leadership · portfolio mgmt (PPS) · change mgmt\nbusiness continuity · GDPR · compliance\nBIM · UAS · GIS · AI agents · self-hosting',
    contact: () =>
      'mail      hhammarstrand@gmail.com\nlinkedin  linkedin.com/in/hhammarstrand',
  };

  let term = null;
  let lastFocus = null;

  function print(text, cls) {
    const out = term.querySelector('#term-out');
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function open() {
    lastFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.id = 'term-backdrop';
    backdrop.addEventListener('click', close);

    term = document.createElement('div');
    term.id = 'term';
    term.setAttribute('role', 'dialog');
    term.setAttribute('aria-modal', 'true');
    term.setAttribute('aria-label', 'Terminal');
    term.innerHTML =
      '<header><span>hugo@cv:~</span><span>esc to close</span></header>' +
      '<div id="term-out"></div>' +
      '<form><span class="prompt">$</span><input type="text" autocomplete="off" spellcheck="false" aria-label="Command"></form>';

    document.body.append(backdrop, term);
    print("welcome to hugo's cv — type 'help' to get started");

    const input = term.querySelector('input');
    term.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      if (!cmd) return;
      print('$ ' + cmd, 'cmd-line');
      if (cmd === 'exit') return close();
      if (cmd === 'clear') {
        term.querySelector('#term-out').textContent = '';
        return;
      }
      const fn = COMMANDS[cmd];
      print(fn ? fn() : "command not found: " + cmd + " (try 'help')");
    });
    // Enkel fokusfälla: input är enda fokuserbara elementet i dialogen
    term.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        input.focus();
      }
    });
    input.focus();
  }

  function close() {
    document.getElementById('term-backdrop')?.remove();
    term?.remove();
    term = null;
    lastFocus?.focus?.();
    lastFocus = null;
  }

  document.addEventListener('keydown', e => {
    const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === 'Escape' && term) close();
    if ((e.key === 't' || e.key === 'T') && !typing && !term && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      open();
    }
  });
})();
