// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Progressive enhancement: remove no-js, add js-enabled
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-enabled');
window.addEventListener('load', () => document.body.classList.add('loaded'));

// Respect reduced motion - skip animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
} else {
  initAnimations();
}

function initAnimations() {
// Easing for premium feel (WME-style)
const easeOutExpo = 'power3.out';
const easeOutQuart = 'power2.out';
const staggerEase = 'power2.inOut';

// ========== HERO: Staggered entrance on load ==========
const heroTimeline = gsap.timeline({ defaults: { ease: easeOutExpo } });

heroTimeline
  .fromTo('#navbar', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: easeOutExpo })
  .fromTo(
    '[data-animate="hero-line"]',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: easeOutExpo },
    '-=0.5'
  )
  .fromTo(
    '[data-animate="hero-subtitle"]',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: easeOutExpo },
    '-=0.4'
  )
  .fromTo(
    '.hero-btn',
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: easeOutExpo },
    '-=0.5'
  )
  .fromTo(
    '.hero-scroll-arrow',
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: easeOutExpo },
    '-=0.3'
  );

// Hero video: subtle fade-in + parallax (reduced on mobile for performance)
const heroVideoWrapper = document.querySelector('.hero-video-wrapper');
const heroVideoEl = document.querySelector('.hero-video');
const isMobileOrReducedMotion = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches;
if (heroVideoWrapper) {
  if (heroVideoEl) {
    gsap.fromTo(heroVideoEl, { opacity: 0 }, { opacity: 0.4, duration: 1.2, delay: 0.3 });
    
    // Seamless looping - restart video BEFORE it ends to avoid grey flash
    heroVideoEl.addEventListener('timeupdate', () => {
      // Restart 0.5 seconds before video ends, skip to 0.1s to avoid any start frame issues
      if (heroVideoEl.duration - heroVideoEl.currentTime < 0.5) {
        heroVideoEl.currentTime = 0.1;
      }
    });
    
    // Fallback: restart if video somehow ends
    heroVideoEl.addEventListener('ended', () => {
      heroVideoEl.currentTime = 0;
      heroVideoEl.play();
    });
    
    // Handle visibility changes (tab switching) to keep video playing
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && heroVideoEl.paused) {
        heroVideoEl.play();
      }
    });
  }
  if (!isMobileOrReducedMotion) {
    gsap.to(heroVideoWrapper, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }
}

// ========== SCROLL-TRIGGERED: Section reveals ==========
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const scrollStart = isMobile ? 'top 88%' : 'top 82%';
gsap.utils.toArray('.animate-on-scroll:not(.athlete-card)').forEach((el) => {
  const delay = parseInt(el.dataset.delay || 0, 10) * 0.12;
  gsap.fromTo(
    el,
    { y: isMobile ? 36 : 50, opacity: 0, visibility: 'hidden' },
    {
      y: 0,
      opacity: 1,
      visibility: 'visible',
      duration: isMobile ? 0.7 : 0.9,
      delay,
      ease: easeOutExpo,
      scrollTrigger: {
        trigger: el.closest('[data-animate-section]') || el,
        start: scrollStart,
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// ========== ATHLETE GRID: Staggered card entrance ==========
const athleteCards = gsap.utils.toArray('.athlete-card');
if (athleteCards.length) {
  gsap.fromTo(
    athleteCards,
    { y: isMobile ? 50 : 80, opacity: 0, visibility: 'hidden' },
    {
      y: 0,
      opacity: 1,
      visibility: 'visible',
      duration: isMobile ? 0.6 : 0.7,
      stagger: {
        amount: isMobile ? 0.4 : 0.6,
        from: 'start',
        ease: staggerEase,
      },
      ease: easeOutExpo,
      scrollTrigger: {
        trigger: '.athletes-grid',
        start: isMobile ? 'top 85%' : 'top 78%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

// ========== CTA Buttons: Premium hover (scale + lift) ==========
document.querySelectorAll('.hero-btn, .work-button-cta').forEach((btn) => {
  if (btn && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.03, y: -4, duration: 0.3, ease: easeOutQuart });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, y: 0, duration: 0.35, ease: easeOutQuart });
    });
  }
});

} // end initAnimations

// ========== SMOOTH SCROLL for anchor links (always active) ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ========== NAVBAR: Refined scroll effect (always active) ==========
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
  const scrollY = window.scrollY;
  if (scrollY > 80) {
    navbar.style.background = '#fafafa';
    navbar.style.boxShadow = '0 2px 24px rgba(0,0,0,0.08)';
  } else {
    navbar.style.background = '#f5f5f5';
    navbar.style.boxShadow = 'none';
  }
  lastScroll = scrollY;
  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  },
  { passive: true }
);

// ========== ACTIVE NAV: Highlight current section ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

function setActiveNav() {
  const scrollY = window.scrollY;
  const headerOffset = 120;
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - headerOffset;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('nav-link-active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('nav-link-active');
    }
  });
}

let navTicking = false;
function onScrollNav() {
  if (!navTicking) {
    requestAnimationFrame(() => {
      setActiveNav();
      navTicking = false;
    });
    navTicking = true;
  }
}

window.addEventListener('scroll', onScrollNav, { passive: true });
window.addEventListener('load', () => {
  setActiveNav();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
