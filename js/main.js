/* ============================================================
   NANKU TROPICAL BAR & STEAKHOUSE — Vanilla JS
   ============================================================ */

/* ---------- SVG Icons (inline helpers) ---------- */
const SVG = {
  menu:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  x:       `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevD:   `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`,
  chevL:   `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevR:   `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
  zoomIn:  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  xLg:     `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  wa:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  msgCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  phone:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.97-1.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  music:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  mapPin:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#E8751A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  nav:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  extLink: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  check:   `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  alert:   `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  cookie:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#E8751A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/></svg>`,
  ig:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  fb:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  tw:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
  waIcon:  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  mail:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  musicLg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  clockSm: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  star:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
};

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNav() {
    if (window.scrollY > 80) {
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.remove('solid');
      navbar.classList.add('transparent');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobileOverlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => overlay.classList.add('open'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  document.getElementById('drawerClose')?.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => overlay.classList.remove('open')));
}

/* ============================================================
   SCROLL FADE-UP ANIMATIONS
   ============================================================ */
function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const els = entry.target.classList.contains('fade-up')
          ? [entry.target]
          : entry.target.querySelectorAll('.fade-up');
        els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 100));
      }
    });
  }, { threshold: 0.1 });

  // Group by sections for staggered reveal
  const sections = document.querySelectorAll('section, .menu-category');
  sections.forEach(sec => observer.observe(sec));

  // Also observe individual fade-up elements not in sections
  elements.forEach(el => {
    if (!el.closest('section') && !el.closest('.menu-category')) {
      observer.observe(el);
    }
  });

  // Also handle review section which uses opacity directly
  const reviewSection = document.querySelector('.reviews-inner');
  if (reviewSection) {
    const revObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revObs.disconnect();
      }
    }, { threshold: 0.15 });
    revObs.observe(reviewSection);
  }
}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', alt: 'Restaurant ambiance' },
  { src: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1200&q=80', alt: 'Cocktails' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', alt: 'Signature steak' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80', alt: 'Tropical dishes' },
  { src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80', alt: 'Live music night' },
  { src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80', alt: 'Bar area' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80', alt: 'Outdoor dining' },
  { src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&q=80', alt: 'Chef at work' },
];

let currentLightbox = null;

function openLightbox(idx) {
  currentLightbox = idx;
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  const img     = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  img.src = galleryImages[idx].src;
  img.alt = galleryImages[idx].alt;
  counter.textContent = `${idx + 1} / ${galleryImages.length}`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  currentLightbox = null;
  const overlay = document.getElementById('lightbox');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}
function lightboxPrev() {
  if (currentLightbox === null) return;
  currentLightbox = (currentLightbox - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentLightbox);
}
function lightboxNext() {
  if (currentLightbox === null) return;
  currentLightbox = (currentLightbox + 1) % galleryImages.length;
  openLightbox(currentLightbox);
}

function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));

  document.getElementById('lightbox')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxClose')?.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  document.getElementById('lightboxPrev')?.addEventListener('click', (e) => { e.stopPropagation(); lightboxPrev(); });
  document.getElementById('lightboxNext')?.addEventListener('click', (e) => { e.stopPropagation(); lightboxNext(); });
  document.getElementById('lightboxImg')?.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (currentLightbox === null) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });
}

/* ============================================================
   RESERVATION FORM
   ============================================================ */
function initReservationForm() {
  const form      = document.getElementById('reservationForm');
  const formWrap  = document.getElementById('resFormWrap');
  const success   = document.getElementById('resSuccess');
  const resetBtn  = document.getElementById('resReset');
  const dateInput = document.getElementById('resDate');
  if (!form) return;

  // Set min date to today
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Party size buttons
  let selectedParty = '';
  document.querySelectorAll('.res-party-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedParty = btn.dataset.size;
      document.querySelectorAll('.res-party-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      clearError('partyError');
    });
  });

  // Clear errors on input
  document.getElementById('resName')?.addEventListener('input',  () => clearError('nameError'));
  document.getElementById('resEmail')?.addEventListener('input', () => clearError('emailError'));
  document.getElementById('resPhone')?.addEventListener('input', () => clearError('phoneError'));
  document.getElementById('resDate')?.addEventListener('input',  () => clearError('dateError'));
  document.getElementById('resTime')?.addEventListener('change', () => clearError('timeError'));

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `${SVG.alert} ${msg}`;
    if (el) el.style.display = 'flex';
  }
  function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }
  function clearAllErrors() {
    ['nameError','emailError','phoneError','dateError','timeError','partyError'].forEach(clearError);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    const name  = document.getElementById('resName')?.value.trim();
    const email = document.getElementById('resEmail')?.value.trim();
    const phone = document.getElementById('resPhone')?.value.trim();
    const phoneCode = document.getElementById('resPhoneCode')?.value.replace('-CA','') || '';
    const date  = document.getElementById('resDate')?.value;
    const time  = document.getElementById('resTime')?.value;
    let valid = true;

    if (!name) { showError('nameError', 'Name is required'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('emailError', 'Please enter a valid email'); valid = false; }
    if (!phone) { showError('phoneError', 'Phone number is required'); valid = false; }
    if (!date) { showError('dateError', 'Please select a date'); valid = false; }
    if (!time) { showError('timeError', 'Please select a time'); valid = false; }
    if (!selectedParty) { showError('partyError', 'Please select party size'); valid = false; }
    if (!valid) return;

    if (formWrap) formWrap.classList.add('hidden');
    if (success)  success.classList.add('show');

    const msg = encodeURIComponent(
      `Hi! I'd like to reserve a table at Nanku.\nName: ${name}\nEmail: ${email}\nPhone: ${phoneCode} ${phone}\nDate: ${date}\nTime: ${time}\nParty size: ${selectedParty}`
    );
    setTimeout(() => window.open(`https://wa.me/50624790707?text=${msg}`, '_blank'), 800);
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    selectedParty = '';
    document.querySelectorAll('.res-party-btn').forEach(b => b.classList.remove('selected'));
    clearAllErrors();
    if (formWrap) formWrap.classList.remove('hidden');
    if (success)  success.classList.remove('show');
  });
}

/* ============================================================
   COOKIE CONSENT
   ============================================================ */
function initCookieConsent() {
  const bar = document.getElementById('cookieBar');
  if (!bar) return;
  if (localStorage.getItem('nanku-cookie-consent')) return;

  setTimeout(() => bar.classList.add('show'), 1500);

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('nanku-cookie-consent', '1');
    bar.classList.remove('show');
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    bar.classList.remove('show');
  });
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initYear() {
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ============================================================
   MENU PAGE — STICKY TABS + SCROLL SPY
   ============================================================ */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  if (!tabs.length) return;

  const OFFSET = 140;

  function getActiveCategory() {
    const scrollPos = window.scrollY + OFFSET;
    const cats = document.querySelectorAll('.menu-category');
    let active = null;
    cats.forEach(cat => {
      const top    = cat.offsetTop;
      const bottom = top + cat.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) active = cat.id;
    });
    return active;
  }

  function setActiveTab(id) {
    tabs.forEach(btn => {
      btn.classList.toggle('active',   btn.dataset.cat === id);
      btn.classList.toggle('inactive', btn.dataset.cat !== id);
    });
    const activeBtn = document.getElementById(`tab-${id}`);
    activeBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  window.addEventListener('scroll', () => {
    const active = getActiveCategory();
    if (active) setActiveTab(active);
  }, { passive: true });

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const id  = btn.dataset.cat;
      const sec = document.getElementById(id);
      if (sec) window.scrollTo({ top: sec.offsetTop - OFFSET, behavior: 'smooth' });
      setActiveTab(id);
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFadeUp();
  initGallery();
  initReservationForm();
  initCookieConsent();
  initYear();
  initMenuTabs();
});
