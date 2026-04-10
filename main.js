/* ============================================================
   AstroCET — main.js
   Astronomy Club · College of Engineering Trivandrum
   ============================================================ */

/* ── Custom cursor ── */
const cur = document.getElementById('cur');
const r   = document.getElementById('cur2');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animateCursor() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  r.style.left = rx + 'px';
  r.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

const hoverEls = 'a,button,.member,.proj-card,.event-row,.pillar,.dh-card,.comp-item,.ws-card,.outreach-card,.ostat';
document.querySelectorAll(hoverEls).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform  = 'translate(-50%,-50%) scale(2.2)';
    cur.style.background = 'transparent';
    cur.style.border     = '1px solid rgba(245,197,24,.9)';
    r.style.transform    = 'translate(-50%,-50%) scale(1.5)';
    r.style.borderColor  = 'rgba(245,197,24,.9)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform  = 'translate(-50%,-50%) scale(1)';
    cur.style.background = 'var(--yellow)';
    cur.style.border     = 'none';
    r.style.transform    = 'translate(-50%,-50%) scale(1)';
    r.style.borderColor  = 'rgba(245,197,24,.38)';
  });
});


/* ── Star canvas ── */
let scrollSpeed = 0;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  scrollSpeed = Math.abs(window.scrollY - lastScrollY) * 0.2;
  lastScrollY = window.scrollY;
});
const cv  = document.getElementById('bg');
const ctx = cv.getContext('2d');

function resizeCanvas() {
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = Array.from({ length: 380 }, () => ({
  x:   Math.random(),
  y:   Math.random(),
  r:   Math.random() * 1.35 + .25,
  o:   Math.random() * .55  + .08,
  sp:  Math.random() * .01  + .002,
  ph:  Math.random() * Math.PI * 2,
  col: Math.random() > .9  ? '245,197,24'
     : Math.random() > .78 ? '180,140,255'
     : '225,220,240'
}));

let t = 0;
(function drawStars() {
  stars.forEach(s => {
  s.y += (s.sp + (scrollSpeed * 0.001)); // Stars move faster when scrolling
  if (s.y > 1) s.y = 0; // Reset star position
});
  ctx.clearRect(0, 0, cv.width, cv.height);
  t += .008;
  stars.forEach(s => {
    const op = s.o * (0.45 + 0.55 * Math.sin(t * s.sp * 60 + s.ph));
    ctx.beginPath();
    ctx.arc(s.x * cv.width, s.y * cv.height, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.col},${op})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
})();


/* ── Scroll progress bar ── */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct + '%';
}, { passive: true });


/* ── Sticky nav ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));


/* ── Mobile menu ── */
function toggleMobile() {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  const spans     = hamburger.querySelectorAll('span');

  menu.classList.toggle('open');

  if (menu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(4.5px,4.5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4.5px,-4.5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger')
    .querySelectorAll('span')
    .forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}
