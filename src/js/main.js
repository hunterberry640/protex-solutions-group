/* ===================================================
   HERO SLIDER
   =================================================== */
const slides = document.querySelectorAll('.hero-slide');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
let currentSlide = 0;
let autoSlideTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

function startAutoSlide() {
  autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

if (prevBtn && nextBtn && slides.length > 1) {
  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoSlide();
  });

  startAutoSlide();
}

/* ===================================================
   HERO TEXT ANIMATION — staggered fade-in on load
   =================================================== */
function triggerHeroAnimations() {
  const animatedEls = document.querySelectorAll('.animate-line');
  animatedEls.forEach((el) => el.classList.add('visible'));
}

if (document.readyState === 'complete') {
  triggerHeroAnimations();
} else {
  window.addEventListener('load', triggerHeroAnimations);
}

/* ===================================================
   NAVBAR — shrink on scroll
   =================================================== */
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ===================================================
   SCROLL REVEAL — staggered card animation
   =================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.scroll-reveal, .scroll-reveal-truck').forEach((el) => {
  revealObserver.observe(el);
});

/* ===================================================
   STATS COUNTER ANIMATION
   =================================================== */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach((counter) => {
          const target = +counter.dataset.target;
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const statsBar = document.querySelector('.contact-stats-grid');
if (statsBar) counterObserver.observe(statsBar);

/* ===================================================
   TESTIMONIALS CAROUSEL
   =================================================== */
const testimonialTrack = document.querySelector('.testimonials-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('testimonialDots');
let activeTestimonial = 0;
let testimonialTimer;

if (testimonialTrack && testimonialCards.length) {
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });

  function showTestimonial(index) {
    activeTestimonial = index;
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function nextTestimonial() {
    showTestimonial((activeTestimonial + 1) % testimonialCards.length);
  }

  function startTestimonialTimer() {
    testimonialTimer = setInterval(nextTestimonial, 3000);
  }

  function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    startTestimonialTimer();
  }

  dotsContainer.addEventListener('click', resetTestimonialTimer);
  startTestimonialTimer();
}

/* ===================================================
   MOBILE MENU TOGGLE
   =================================================== */
const mobileToggle = document.getElementById('mobileToggle');
const navbarNav = document.getElementById('navbarNav');

if (mobileToggle && navbarNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = navbarNav.classList.toggle('mobile-open');
    mobileToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navbarNav.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navbarNav.classList.remove('mobile-open');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ===================================================
   PROJECTS CAROUSEL
   =================================================== */
const projTrack = document.getElementById('projCarouselTrack');
const projPrev = document.querySelector('.proj-carousel-prev');
const projNext = document.querySelector('.proj-carousel-next');

if (projTrack && projPrev && projNext) {
  let projIndex = 0;

  function getProjSlidesVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getProjSlideWidth() {
    const slide = projTrack.querySelector('.proj-carousel-slide');
    if (!slide) return 0;
    return slide.offsetWidth + 20;
  }

  function updateProjCarousel() {
    const slides = projTrack.querySelectorAll('.proj-carousel-slide');
    const visible = getProjSlidesVisible();
    const max = Math.max(slides.length - visible, 0);
    if (projIndex > max) projIndex = max;
    if (projIndex < 0) projIndex = 0;
    projTrack.style.transform = `translateX(-${projIndex * getProjSlideWidth()}px)`;
  }

  projNext.addEventListener('click', () => {
    const slides = projTrack.querySelectorAll('.proj-carousel-slide');
    const visible = getProjSlidesVisible();
    if (projIndex < slides.length - visible) {
      projIndex++;
      updateProjCarousel();
    }
  });

  projPrev.addEventListener('click', () => {
    if (projIndex > 0) {
      projIndex--;
      updateProjCarousel();
    }
  });

  window.addEventListener('resize', updateProjCarousel);
}
