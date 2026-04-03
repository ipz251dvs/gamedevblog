/* ============================================================
   СМУЖКА ПРОГРЕСУ ПРОКРУТКИ
   ============================================================ */
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
  document.getElementById('scrollLine').style.width = pct + '%';
});

/* ============================================================
   ПІДПИСКА НА РОЗСИЛКУ
   ============================================================ */
function subscribe() {
  const email = document.getElementById('emailInput').value;
  const msg   = document.getElementById('subMsg');

  if (!email || !email.includes('@')) {
    msg.style.color = '#b52b2b';
    msg.textContent = '⚠ Введіть коректну email-адресу';
    return;
  }

  msg.style.color = '#4a7a3a';
  msg.textContent = '✓ Дякуємо! Ви підписані на PIXELFORGE BLOG';
  document.getElementById('emailInput').value = '';
}

/* ============================================================
   ВІДКРИТТЯ ОВЕРЛЕЮ ЗІ СТАТТЕЮ
   ============================================================ */
function openArt(id) {
  const art = ARTICLES[id];
  if (!art) return;

  document.getElementById('artContent').innerHTML = `
    <div class="af-tag">${art.tag}</div>
    <h1 class="af-title">${art.title}</h1>
    <div class="af-meta">${art.meta.map(m => `<span>${m}</span>`).join('')}</div>
    <div class="abody">${art.body}</div>
  `;

  document.getElementById('overlay').classList.add('open');
  document.getElementById('overlay').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

/* ============================================================
   ЗАКРИТТЯ ОВЕРЛЕЮ
   ============================================================ */
function closeArt() {
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeArt();
});

/* ============================================================
   АНІМАЦІЯ ШКАЛ ДВИЖКІВ (IntersectionObserver)
   ============================================================ */
const engineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.eng-fill').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = targetWidth; }, 80);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.eng-card').forEach(card => engineObserver.observe(card));
