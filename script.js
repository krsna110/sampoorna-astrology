// BNN Masterclass - Combined Scripts

document.getElementById('yr').textContent = new Date().getFullYear();

// ─── Countdown with flip animation ───
// Webinar date: July 26, 2026 at 12:00 PM IST
const TARGET = new Date('2026-07-26T12:00:00+05:30');
const pad = n => String(n).padStart(2, '0');
const prev = { d: '', h: '', m: '', s: '' };

function tick() {
  let diff = Math.max(0, TARGET - new Date());
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4); diff -= m * 6e4;
  const s = Math.floor(diff / 1e3);

  for (const [key, val] of Object.entries({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) })) {
    const el = document.getElementById('cd-' + key);
    if (!el || prev[key] === val) continue;
    el.textContent = val;
    el.classList.remove('flip');
    el.offsetWidth; // reflow
    el.classList.add('flip');
    prev[key] = val;
  }
}
tick();
setInterval(tick, 1000);

// ─── Animated counters for hero stats ───
const counterItems = document.querySelectorAll('.counter-number');
if (counterItems.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatCounterValue = (value, decimals, prefix = '', suffix = '') => {
    const fixedValue = Number(value).toFixed(decimals);
    const [whole, frac = ''] = fixedValue.split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${prefix}${formattedWhole}${frac ? `.${frac}` : ''}${suffix}`;
  };

  const animateCounter = (element) => {
    if (prefersReducedMotion) {
      element.textContent = formatCounterValue(
        element.dataset.counter,
        Number(element.dataset.decimals || 0),
        element.dataset.prefix || '',
        element.dataset.suffix || ''
      );
      return;
    }

    const target = Number(element.dataset.counter || 0);
    const decimals = Number(element.dataset.decimals || 0);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 1400;
    const startTime = performance.now();

    const run = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * eased;
      element.textContent = formatCounterValue(currentValue, decimals, prefix, suffix);

      if (progress < 1) {
        requestAnimationFrame(run);
      }
    };

    requestAnimationFrame(run);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterItems.forEach((item) => counterObserver.observe(item));
}

// ─── Sticky bar: show after scrolling past hero ───
const stickyBar = document.getElementById('sticky');
const heroSection = document.querySelector('.hero');
if (stickyBar && heroSection) {
  new IntersectionObserver(([e]) => {
    stickyBar.classList.toggle('show', !e.isIntersecting);
  }).observe(heroSection);
}


// ─── Scroll reveal ───
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const ppContinueBtn = document.querySelector('.pp-continue-btn');
if (ppContinueBtn) {
  ppContinueBtn.addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelector('#learn-section')?.scrollIntoView({ behavior: 'smooth' });
  });
}


// ─── Floating particles ───
function initFloatingParticles(canvasId, count, config = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W = 0;
  let H = 0;
  const particles = [];
  const opts = {
    radius: [0.5, 2.2],
    speedX: 0.3,
    speedY: [0.15, 0.55],
    opacity: [0.2, 0.8],
    freqSpeed: [0.01, 0.03],
    ...config
  };

  function rand(range) {
    return Math.random() * (range[1] - range[0]) + range[0];
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }

  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: rand(opts.radius),
      dx: (Math.random() - 0.5) * opts.speedX,
      dy: -rand(opts.speedY),
      o: rand(opts.opacity),
      f: Math.random() * Math.PI * 2,
      fs: rand(opts.freqSpeed)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      p.f += p.fs;
      const alpha = p.o * (0.5 + 0.5 * Math.sin(p.f));

      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      glow.addColorStop(0, `rgba(232,199,102,${alpha})`);
      glow.addColorStop(1, 'rgba(232,199,102,0)');

      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,240,200,${alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

initFloatingParticles('hero-particles', 35, {
  radius: [0.6, 2.8],
  speedX: 0.3,
  speedY: [0.15, 0.55],
  opacity: [0.2, 0.8],
  freqSpeed: [0.01, 0.03]
});

initFloatingParticles('pp-particles', 28, {
  radius: [0.5, 2.3],
  speedX: 0.2,
  speedY: [0.1, 0.4],
  opacity: [0.15, 0.65],
  freqSpeed: [0.005, 0.02]
});


// â”€â”€â”€ Hero GSAP entrance animations â”€â”€â”€
(function () {
  if (typeof gsap === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Left column staggered entrance
  tl.from("#hero-pill", { opacity: 0, y: 20, duration: 0.6 }, 0.2)
    .from("#hero-title", { opacity: 0, y: 30, duration: 0.8 }, 0.35)
    .from("#hero-subtitle", { opacity: 0, y: 20, duration: 0.6 }, 0.55)
    .from("#hero-desc", { opacity: 0, y: 20, duration: 0.6 }, 0.7)
    .from("#hero-info .hero-info-badge", { opacity: 0, y: 15, duration: 0.5, stagger: 0.08 }, 0.85)
    .from("#hero-cta", { opacity: 0, y: 20, duration: 0.6 }, 1.0)
    .from("#hero-trust .hero-trust-item", { opacity: 0, y: 10, duration: 0.4, stagger: 0.06 }, 1.15);

  // Right column entrance
  tl.from("#hero-portrait-wrap", { opacity: 0, scale: 0.9, duration: 0.8 }, 0.5)
    .from("#hero-price-card", { opacity: 0, y: 40, duration: 0.8 }, 0.8);

  // Continuous floating effects
  gsap.to("#hero-price-card", {
    y: -12, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1
  });

  gsap.to("#hero-portrait-wrap", {
    y: -8, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1
  });
})();

(function () {
  if (typeof gsap === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Left info panel entrance ──
  var ppInfo = gsap.timeline({
    scrollTrigger: {
      trigger: "#pp-info",
      start: "top 82%",
      once: true
    }
  });

  ppInfo
    .from("#pp-eyebrow", { opacity: 0, y: 20, filter: "blur(6px)", duration: 0.6, ease: "power3.out" })
    .from("#pp-heading", { opacity: 0, y: 30, filter: "blur(8px)", duration: 0.8, ease: "power3.out" }, 0.15)
    .from("#pp-subtext", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, 0.4)
    .from("#pp-stat", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, 0.55)
    .from("#pp-celestial-art", { opacity: 0, y: 15, duration: 0.7, ease: "power3.out" }, 0.7);

  // ── Cards staggered reveal ──
  var ppCards = document.querySelectorAll("[data-pp-card]");

  gsap.from(ppCards, {
    scrollTrigger: {
      trigger: "#pp-cards",
      start: "top 80%",
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    ease: "power3.out",
    onComplete: function () {
      ppCards.forEach(function (c) { c.classList.add("revealed"); });
    }
  });

  // ── Card numbers slide up ──
  gsap.from(".pp-card-number", {
    scrollTrigger: {
      trigger: "#pp-cards",
      start: "top 80%",
      once: true
    },
    opacity: 0,
    y: 18,
    duration: 0.6,
    stagger: 0.12,
    ease: "power3.out"
  });

  // ── Transition block ──
  gsap.from("#pp-transition", {
    scrollTrigger: {
      trigger: "#pp-transition",
      start: "top 88%",
      once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out"
  });

  // ── Zodiac wheel continuous rotation ──
  gsap.to("#pp-zodiac svg", {
    rotation: 360,
    duration: 240,
    repeat: -1,
    ease: "none",
    transformOrigin: "50% 50%"
  });

  // ── Mouse move micro-interaction ──
  var cardsContainer = document.getElementById("pp-cards");
  if (cardsContainer && window.innerWidth > 768) {
    cardsContainer.addEventListener("mousemove", function (e) {
      var rect = cardsContainer.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / rect.width - 0.5;
      var cy = (e.clientY - rect.top) / rect.height - 0.5;
      ppCards.forEach(function (card) {
        gsap.to(card, {
          x: cx * 3,
          y: cy * 3,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    });
    cardsContainer.addEventListener("mouseleave", function () {
      ppCards.forEach(function (card) {
        gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
      });
    });
  }
})();

// ═══ Pain Points Floating Particles ═══
(function () {
  var canvas = document.getElementById("pp-particles");
  if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var W, H;
  var COUNT = 28;
  var particles = [];

  function resize() {
    var r = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = r.width;
    H = canvas.height = r.height;
  }
  resize();
  window.addEventListener("resize", resize);

  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      r: Math.random() * 1.8 + 0.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: -(Math.random() * 0.3 + 0.1),
      o: Math.random() * 0.5 + 0.15,
      f: Math.random() * Math.PI * 2,
      fs: Math.random() * 0.015 + 0.005
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var j = 0; j < particles.length; j++) {
      var p = particles[j];
      p.x += p.dx;
      p.y += p.dy;
      p.f += p.fs;
      var a = p.o * (0.5 + 0.5 * Math.sin(p.f));

      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      // Glow halo
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, "rgba(232,199,102," + a + ")");
      g.addColorStop(1, "rgba(232,199,102,0)");
      ctx.beginPath(); ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();

      // Bright center
      ctx.beginPath(); ctx.fillStyle = "rgba(255,240,200," + a + ")";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();



