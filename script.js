/* ══════════════════════════════════════════════════════════
   script.js — Through the Years (Bilingual Hinglish Edition)
   Cinematic interactions: hearts, word-particles, scramble,
   curtain reveals, parallax, typewriter, slideshow
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. HEART PARTICLES
   ────────────────────────────────────────────────────────── */
function createHeartParticles(containerId, count = 18) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const symbols = ['♥', '❤', '♡', '❥', '💛'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.setAttribute('aria-hidden', 'true');

    const size    = 0.6 + Math.random() * 1.4;
    const left    = 2 + Math.random() * 96;
    const dur     = 7 + Math.random() * 8;
    const delay   = Math.random() * 10;

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      --dur: ${dur}s;
      --delay: ${delay}s;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
      color: hsl(${340 + Math.random() * 20}deg, 60%, ${40 + Math.random() * 20}%);
    `;
    container.appendChild(el);
  }
}

/* ──────────────────────────────────────────────────────────
   2. FLOATING WORD PARTICLES (Hinglish dust motes)
   ────────────────────────────────────────────────────────── */
const WORD_PARTICLES = [
  'pyaar', 'yaadein', 'पापा', 'खुशी', 'junoon',
  'mohabbat', 'dil', 'pal', 'सपने', 'khwaab',
  'safar', 'yaadon', 'waqt', 'प्यार', 'साथ',
  'zindagi', 'dua', 'हँसी', 'khushi', 'aashirwad',
];

function createWordParticles(count = 22) {
  const container = document.getElementById('word-particles');
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'word-particle';
    el.textContent = WORD_PARTICLES[Math.floor(Math.random() * WORD_PARTICLES.length)];
    el.setAttribute('aria-hidden', 'true');

    const left  = 2 + Math.random() * 96;
    const dur   = 16 + Math.random() * 20;
    const delay = Math.random() * 25;
    const size  = 0.6 + Math.random() * 0.5;
    const opacity = 0.07 + Math.random() * 0.12;

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      --wdur: ${dur}s;
      --wdelay: ${delay}s;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;
    // Override max opacity via a custom property
    el.style.setProperty('--max-opacity', opacity);
    container.appendChild(el);
  }
}

/* ──────────────────────────────────────────────────────────
   3. INTRO SUBTITLE — typed-out Hinglish line
   ────────────────────────────────────────────────────────── */
const INTRO_SUBTITLE_TEXT = 'Papa — meri pehli pehchaan, mera pehla pyaar, mera pehla superhero.';

function typeIntroSubtitle() {
  const el = document.getElementById('intro-subtitle-typed');
  if (!el) return;

  // Wait for the element's fade-in animation before typing
  setTimeout(() => {
    const chars = [...INTRO_SUBTITLE_TEXT]; // spread handles multi-byte correctly
    let i = 0;

    function type() {
      if (i < chars.length) {
        el.textContent += chars[i++];
        const delay = chars[i - 1] === '—' || chars[i - 1] === ',' ? 200 : 55;
        setTimeout(type, delay + Math.random() * 20 - 10);
      }
    }

    el.textContent = '';
    type();
  }, 5200); // wait for the animation fade-in at 4.8s
}

/* ──────────────────────────────────────────────────────────
   4. FRAME CROSSFADE SLIDESHOW (intro desk)
   ────────────────────────────────────────────────────────── */
function initFrameSlideshow() {
  const photos = document.querySelectorAll('.frame-photo');
  if (!photos.length) return;

  let current = 0;

  function nextPhoto() {
    photos[current].classList.remove('active');
    current = (current + 1) % photos.length;
    photos[current].classList.add('active');
  }

  setTimeout(() => {
    setInterval(nextPhoto, 3000);
  }, 3000);
}

/* ──────────────────────────────────────────────────────────
   5. SCRAMBLE TEXT — chapter titles
   ────────────────────────────────────────────────────────── */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!?';

function scrambleText(el) {
  const target = el.dataset.text || el.textContent.trim();
  const totalFrames = 28;
  let frame = 0;

  el.textContent = '';

  const interval = setInterval(() => {
    el.textContent = target
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < Math.floor((frame / totalFrames) * target.length)) {
          return char;
        }
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    frame++;
    if (frame >= totalFrames) {
      clearInterval(interval);
      el.textContent = target;
    }
  }, 55);
}

/* ──────────────────────────────────────────────────────────
   6. INTERSECTION OBSERVER — chapters, curtains, Hindi quotes
   ────────────────────────────────────────────────────────── */
function initScrollReveal() {
  // Chapter dividers
  const chapterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const divider = entry.target;
        divider.classList.add('revealed');
        const title = divider.querySelector('.scramble-text');
        if (title && !title.dataset.scrambled) {
          title.dataset.scrambled = '1';
          setTimeout(() => scrambleText(title), 300);
        }
        chapterObs.unobserve(divider);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.chapter-divider').forEach(el => chapterObs.observe(el));

  // Curtain photo reveals
  const curtainObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.25) {
        entry.target.classList.add('curtain-open');
        curtainObs.unobserve(entry.target);
      }
    });
  }, { threshold: [0, 0.1, 0.25, 0.5] });

  document.querySelectorAll('.photo-card').forEach(card => {
    curtainObs.observe(card);
  });

  // Hindi floating quotes reveal
  const quoteObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // slight delay for dramatic entrance after the curtain
        setTimeout(() => entry.target.classList.add('visible'), 400);
        quoteObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hindi-float-quote').forEach(q => quoteObs.observe(q));
}

/* ──────────────────────────────────────────────────────────
   7. PARALLAX — background layers
   ────────────────────────────────────────────────────────── */
function initParallax() {
  const sections = document.querySelectorAll('.parallax-section');
  if (!sections.length) return;

  function update() {
    sections.forEach(section => {
      const bg = section.querySelector('.parallax-bg');
      if (!bg) return;

      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (center - viewportCenter) * 0.18;

      bg.style.transform = `translateY(${offset}px)`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ──────────────────────────────────────────────────────────
   8. TYPEWRITER — finale message (Unicode-safe)
   The message uses a mix of Latin + Devanagari.
   We use Intl.Segmenter if available (grapheme clusters),
   otherwise fall back to Array.from() spread (still handles
   most Unicode code points including Devanagari correctly).
   ────────────────────────────────────────────────────────── */
const TYPEWRITER_MESSAGE =
  'Manik Chandra Das — aapne mujhe zindagi jeena sikhaya.\n\n' +
  'Maa ne janam diya, par aapne zindagi di.\n\n' +
  'आज भी आपके कंधों पर मैं खड़ा हूँ, बस नज़रिया बदल गया है।\n\n' +
  'Happy Father\'s Day, Papa — aap mera superhero ho, bas cape nahi pehente.\n\n' +
  'प्यार आपका, हमेशा। ❤️';

function getGraphemes(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('hi', { granularity: 'grapheme' });
    return [...seg.segment(str)].map(s => s.segment);
  }
  // Fallback: spread handles most Unicode including Devanagari matras
  return [...str];
}

function startTypewriter() {
  const textEl   = document.getElementById('typewriter-text');
  const cursorEl = document.getElementById('typewriter-cursor');
  if (!textEl) return;

  textEl.textContent = '';
  const graphemes = getGraphemes(TYPEWRITER_MESSAGE);
  let idx = 0;

  function typeNext() {
    if (idx >= graphemes.length) {
      setTimeout(() => {
        if (cursorEl) cursorEl.style.display = 'none';
      }, 2500);
      return;
    }

    const g = graphemes[idx++];

    if (g === '\n') {
      textEl.innerHTML += '<br />';
    } else {
      textEl.textContent += g;
    }

    // Punctuation pauses + natural jitter
    const isPause = ['.', ',', '।', '—', '!', '?'].includes(g);
    const baseDelay = isPause ? 260 : 48;
    const jitter    = Math.random() * 30 - 15;
    setTimeout(typeNext, baseDelay + jitter);
  }

  if (cursorEl) cursorEl.style.display = 'inline-block';
  setTimeout(typeNext, 600);
}

function initTypewriter() {
  const finale = document.getElementById('finale');
  if (!finale) return;

  let started = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      startTypewriter();
      obs.disconnect();
    }
  }, { threshold: 0.35 });

  obs.observe(finale);
}

/* ──────────────────────────────────────────────────────────
   9. SLIDESHOW MODAL — Ken Burns + cross-dissolve
   ────────────────────────────────────────────────────────── */
const SLIDESHOW_DATA = [
  {
    src: '5C455562-AFD9-4888-B370-4254DA6B8B68.jpeg',
    caption: 'Papa aur main — pehli mulakaat, pehli mohabbat',
    ken: 'a'
  },
  {
    src: 'IMG_8150.jpeg',
    caption: 'Har jashan mein papa ki muskaan — wahi thi jo sabse pyari thi',
    ken: 'b'
  },
  {
    src: 'IMG_3167.jpeg',
    caption: 'Hum teen — ek ghar, ek dil, ek zindagi',
    ken: 'c'
  },
  {
    src: 'IMG_7343.jpeg',
    caption: 'Har raah, papa ke saath — adhoori thi koi bhi manzil unke bina',
    ken: 'd'
  },
  {
    src: 'IMG_4881.jpeg',
    caption: 'Sabse bada adventure? Papa ke saath zindagi jeena',
    ken: 'a'
  },
  {
    src: 'IMG_3271.jpeg',
    caption: 'Sone jaisi yaadein — in palOn ko koi nahi chura sakta',
    ken: 'b'
  },
  {
    src: 'IMG_6538.jpeg',
    caption: 'Hamesha patient, hamesha saath — yahi hai papa ki asli taakat',
    ken: 'c'
  },
  {
    src: 'IMG_6759.jpeg',
    caption: 'Manik Chandra Das — zindagi ka sabse bada teacher, mera papa',
    ken: 'd'
  },
  {
    src: 'IMG_3891.jpeg',
    caption: 'Har safar mein woh muskaan — ghar ki sabse pyari yaad',
    ken: 'a'
  },
  {
    src: 'IMG_4899.jpeg',
    caption: 'Hamesha, hamesha pyaar — aapka, sirf aapka ❤️',
    ken: 'b'
  },
];

let slideshowTimer   = null;
let currentSlide     = 0;
let slideshowRunning = false;

function buildSlideshow() {
  const container = document.getElementById('slideshow-slides');
  const dotsEl    = document.getElementById('slideshow-dots');
  if (!container || !dotsEl) return;

  SLIDESHOW_DATA.forEach((data, i) => {
    // Slide
    const slide = document.createElement('div');
    slide.className = `slide-item ken-${data.ken}`;
    slide.dataset.index = i;

    const img = document.createElement('img');
    img.src = data.src;
    img.alt = data.caption;
    img.loading = i === 0 ? 'eager' : 'lazy';
    slide.appendChild(img);
    container.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'slide-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1} dekho`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  });
}

function goToSlide(index) {
  const slides  = document.querySelectorAll('.slide-item');
  const dots    = document.querySelectorAll('.slide-dot');
  const caption = document.getElementById('slideshow-caption');

  if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) {
    dots[currentSlide].classList.remove('active-dot');
    dots[currentSlide].setAttribute('aria-selected', 'false');
  }

  currentSlide = index;

  const slide = slides[currentSlide];
  if (slide) {
    const img = slide.querySelector('img');
    if (img) {
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
    }
    slide.classList.add('active');
  }

  if (dots[currentSlide]) {
    dots[currentSlide].classList.add('active-dot');
    dots[currentSlide].setAttribute('aria-selected', 'true');
  }

  if (caption) {
    caption.style.opacity = '0';
    setTimeout(() => {
      caption.textContent = SLIDESHOW_DATA[currentSlide]?.caption || '';
      caption.style.opacity = '1';
    }, 400);
  }
}

function startSlideshowAuto() {
  clearInterval(slideshowTimer);
  slideshowTimer = setInterval(() => {
    const next = (currentSlide + 1) % SLIDESHOW_DATA.length;
    goToSlide(next);
  }, 6000);
}

function openSlideshow() {
  const modal = document.getElementById('slideshow-modal');
  if (!modal) return;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  currentSlide = 0;
  goToSlide(0);
  startSlideshowAuto();
  slideshowRunning = true;

  setTimeout(() => {
    document.getElementById('slideshow-close')?.focus();
  }, 100);
}

function closeSlideshow() {
  const modal = document.getElementById('slideshow-modal');
  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = '';
  clearInterval(slideshowTimer);
  slideshowRunning = false;

  document.querySelectorAll('.slide-item').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.slide-dot').forEach(d => {
    d.classList.remove('active-dot');
    d.setAttribute('aria-selected', 'false');
  });

  document.getElementById('watch-story-btn')?.focus();
}

function initSlideshow() {
  buildSlideshow();

  document.getElementById('watch-story-btn')?.addEventListener('click', openSlideshow);
  document.getElementById('slideshow-close')?.addEventListener('click', closeSlideshow);
  document.querySelector('.slideshow-backdrop')?.addEventListener('click', closeSlideshow);

  document.addEventListener('keydown', e => {
    if (!slideshowRunning) return;
    if (e.key === 'Escape') { closeSlideshow(); return; }
    if (e.key === 'ArrowRight') {
      clearInterval(slideshowTimer);
      goToSlide((currentSlide + 1) % SLIDESHOW_DATA.length);
      startSlideshowAuto();
    }
    if (e.key === 'ArrowLeft') {
      clearInterval(slideshowTimer);
      goToSlide((currentSlide - 1 + SLIDESHOW_DATA.length) % SLIDESHOW_DATA.length);
      startSlideshowAuto();
    }
  });
}

/* ──────────────────────────────────────────────────────────
   10. CINEMATIC INTRO — manage body scroll lock
   ────────────────────────────────────────────────────────── */
function initIntroSequence() {
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 5000);
}

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initIntroSequence();
  createHeartParticles('heart-particles',   16);
  createHeartParticles('heart-particles-2', 20);
  createWordParticles(28);
  typeIntroSubtitle();
  initFrameSlideshow();
  initScrollReveal();
  initParallax();
  initTypewriter();
  initSlideshow();

  // Smooth anchor navigation helper
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
