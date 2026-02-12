// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Progressive enhancement
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-enabled');
window.addEventListener('load', () => document.body.classList.add('loaded'));

// Respect reduced motion
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
  const easeOutExpo = 'power3.out';
  const easeOutQuart = 'power2.out';
  const staggerEase = 'power2.inOut';
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // ========== HERO: Cinematic entrance ==========
  const heroTimeline = gsap.timeline({ defaults: { ease: easeOutExpo } });

  heroTimeline
    .fromTo('#navbar',
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(isMobile ? '.hero-word' : '[data-animate="hero-word"]',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: isMobile ? 0.1 : 0.15, duration: 0.9, ease: 'power4.out' },
      '-=0.4'
    )
    .fromTo('[data-animate="hero-btn"]',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      '-=0.4'
    )
    .fromTo('.hero-scroll-arrow',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    );

  // Hero video fade-in + parallax
  const heroVideoWrapper = document.querySelector('.hero-video-wrapper');
  const heroVideoEl = document.querySelector('.hero-video');
  const isMobileOrReduced = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches;

  if (heroVideoWrapper && heroVideoEl) {
    const videoOpacity = 0.55;
    gsap.fromTo(heroVideoEl, { opacity: 0 }, { opacity: videoOpacity, duration: 1.5, delay: 0.2 });

    // Seamless looping (desktop + mobile)
    heroVideoEl.addEventListener('timeupdate', () => {
      if (heroVideoEl.duration && heroVideoEl.duration - heroVideoEl.currentTime < 0.5) {
        heroVideoEl.currentTime = 0.1;
      }
    });
    heroVideoEl.addEventListener('ended', () => {
      heroVideoEl.currentTime = 0.1;
      heroVideoEl.play();
    });
    heroVideoEl.addEventListener('canplay', () => {
      if (heroVideoEl.paused) heroVideoEl.play();
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && heroVideoEl.paused) heroVideoEl.play();
    });

    if (!isMobileOrReduced) {
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
  const scrollStart = isMobile ? 'top 90%' : 'top 85%';

  gsap.utils.toArray('.animate-on-scroll:not(.athlete-card):not(.statement-line):not(.story-right .animate-on-scroll):not(.cta-title):not(.cta-button):not(.footer-top)').forEach((el) => {
    const delay = parseInt(el.dataset.delay || 0, 10) * 0.15;
    gsap.fromTo(
      el,
      { y: isMobile ? 30 : 50, opacity: 0, visibility: 'hidden' },
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

  // ========== STATEMENT + STORY: Swipe-in reveals ==========
  const storySection = document.querySelector('.story-section');
  const storyLeft = document.querySelector('.story-left');
  const storyRight = document.querySelector('.story-right');

  if (storySection && storyLeft) {
    // Left side: Statement title swipes in from left
    const statementLines = gsap.utils.toArray('.statement-line');
    if (statementLines.length) {
      gsap.fromTo(
        statementLines,
        { x: -80, y: 0, opacity: 0, visibility: 'hidden' },
        {
          x: 0,
          y: 0,
          opacity: 1,
          visibility: 'visible',
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: storySection,
            start: isMobile ? 'top 85%' : 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Right side: Story content swipes in from right
    if (storyRight) {
      const storyElements = gsap.utils.toArray('.story-right .animate-on-scroll');
      gsap.fromTo(
        storyElements,
        { x: isMobile ? 0 : 60, y: isMobile ? 30 : 0, opacity: 0, visibility: 'hidden' },
        {
          x: 0,
          y: 0,
          opacity: 1,
          visibility: 'visible',
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: storySection,
            start: isMobile ? 'top 80%' : 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }

  // ========== ATHLETE GRID: Staggered cards ==========
  const athleteCards = gsap.utils.toArray('.athlete-card');
  if (athleteCards.length) {
    gsap.fromTo(
      athleteCards,
      { y: isMobile ? 40 : 60, opacity: 0, visibility: 'hidden' },
      {
        y: 0,
        opacity: 1,
        visibility: 'visible',
        duration: isMobile ? 0.5 : 0.65,
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

  // ========== FOOTER: Staggered reveal ==========
  const footerSection = document.querySelector('.footer[data-animate-section]');
  if (footerSection) {
    const footerElements = gsap.utils.toArray('.footer-top, .footer-divider, .footer-bottom');
    gsap.fromTo(
      footerElements,
      { y: 24, opacity: 0, visibility: 'hidden' },
      {
        y: 0,
        opacity: 1,
        visibility: 'visible',
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerSection,
          start: isMobile ? 'top 92%' : 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // ========== CTA SECTION: Scroll-triggered reveal ==========
  const ctaTitle = document.querySelector('.cta-title');
  const ctaBtn = document.querySelector('.cta-button');
  if (ctaTitle && ctaBtn) {
    gsap.fromTo(
      [ctaTitle, ctaBtn],
      { y: 40, opacity: 0, visibility: 'hidden' },
      {
        y: 0,
        opacity: 1,
        visibility: 'visible',
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: isMobile ? 'top 85%' : 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // ========== ATHLETE CARDS: 3D tilt on mouse move (desktop) ==========
  if (!window.matchMedia('(max-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.athlete-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * 6;
        const tiltY = (x - 0.5) * -6;
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 1000,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    });
  }

  // ========== CTA BUTTONS: Premium hover (desktop only) ==========
  if (!window.matchMedia('(max-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero-btn, .cta-button, .work-button-cta').forEach((btn) => {
      if (btn) {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, { scale: 1.02, y: -3, duration: 0.3, ease: easeOutQuart });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { scale: 1, y: 0, duration: 0.35, ease: easeOutQuart });
        });
      }
    });
  }

  // ========== HERO BUTTON: Subtle magnetic effect (desktop) ==========
  const heroBtn = document.querySelector('.hero-btn');
  if (heroBtn && !window.matchMedia('(max-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroBtn.addEventListener('mousemove', (e) => {
      const rect = heroBtn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      gsap.to(heroBtn, {
        x: x * 6,
        y: y * 3 - 3,
        scale: 1.02,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
    heroBtn.addEventListener('mouseleave', () => {
      gsap.to(heroBtn, { x: 0, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  }

} // end initAnimations

// ========== SCROLL PROGRESS ==========
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
if (scrollProgressBar) {
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    scrollProgressBar.style.width = progress + '%';
    scrollProgressBar.setAttribute('aria-valuenow', Math.round(progress));
  }
  window.addEventListener('scroll', () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });
  updateScrollProgress();
}

// ========== BACK TO TOP ==========
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
  const hero = document.querySelector('.hero');
  const scrollThreshold = hero ? hero.offsetHeight * 0.6 : 400;
  function toggleBackToTop() {
    if (window.scrollY > scrollThreshold) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', () => {
    requestAnimationFrame(toggleBackToTop);
  }, { passive: true });
  toggleBackToTop();
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== STICKY CTA BAR (MOBILE) ==========
const stickyCtaBar = document.querySelector('.sticky-cta-bar');
if (stickyCtaBar && window.matchMedia('(max-width: 768px)').matches) {
  const hero = document.querySelector('.hero');
  const ctaSection = document.querySelector('.cta-section');
  function toggleStickyCta() {
    const scrollY = window.scrollY;
    const heroBottom = hero ? hero.offsetHeight : 400;
    const ctaTop = ctaSection ? ctaSection.offsetTop - 200 : 9999;
    if (scrollY > heroBottom && scrollY < ctaTop) {
      stickyCtaBar.classList.add('visible');
    } else {
      stickyCtaBar.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', () => {
    requestAnimationFrame(toggleStickyCta);
  }, { passive: true });
  toggleStickyCta();
}

// ========== SMOOTH SCROLL ==========
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

// ========== NAVBAR: Scroll effect ==========
const navbar = document.getElementById('navbar');
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
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
}, { passive: true });

// ========== ACTIVE NAV ==========
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
  // Highlight Work Together when in CTA section
  document.querySelectorAll('.nav-link-work').forEach((link) => {
    link.classList.toggle('nav-link-active', current === 'work-together');
  });
}

let navTicking = false;
window.addEventListener('scroll', () => {
  if (!navTicking) {
    requestAnimationFrame(() => { setActiveNav(); navTicking = false; });
    navTicking = true;
  }
}, { passive: true });

window.addEventListener('load', () => {
  setActiveNav();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

// Refresh ScrollTrigger on resize for responsive accuracy
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }, 150);
});
