/**
 * BookShelf - Brand Identity Website
 * Core interaction scripts and scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('BookShelf Brand Identity Site Initialized.');

  // Initialize Lenis Smooth Scroll Framework
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    root: null, // viewport
    rootMargin: '-5% 0px -5% 0px', // slightly offset margins to ensure clean entry trigger
    threshold: 0.15 // trigger when 15% of the section is visible
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Remove class when exiting the viewport to re-trigger animation on scroll re-entry
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  // Target animatable sections for scroll reveal
  const animatedSections = [
    document.getElementById('brand-video'),
    document.getElementById('mobile-showcase'),
    document.getElementById('reading-moments'),
    document.getElementById('brand-identity'),
    document.getElementById('color-palette'),
    document.getElementById('every-reading-moment')
  ];

  animatedSections.forEach(section => {
    if (section) {
      scrollObserver.observe(section);
    }
  });

  // Scroll-Driven Dual-Row Marquee Dynamics
  const marqueeSection = document.getElementById('marquee-showcase');
  const row1 = document.getElementById('marquee-row-1');
  const row2 = document.getElementById('marquee-row-2');

  if (marqueeSection && row1 && row2) {
    let ticking = false;

    function updateMarqueeScroll() {
      const rect = marqueeSection.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const progress = window.scrollY - sectionTop + window.innerHeight;
      const offset = progress * 0.35;

      // Base shift to center Set 2 of tripled tracks (-1/3 of total track width)
      const row1SetWidth = row1.scrollWidth > 0 ? (row1.scrollWidth / 3) : 2500;
      const row2SetWidth = row2.scrollWidth > 0 ? (row2.scrollWidth / 3) : 2500;

      const baseShift1 = -row1SetWidth;
      const baseShift2 = -row2SetWidth;

      // Row 1 (Top): Moves RIGHT on scroll (baseShift1 + offset)
      // Row 2 (Bottom): Moves LEFT on scroll (baseShift2 - offset)
      row1.style.transform = `translate3d(${baseShift1 + offset}px, 0px, 0px)`;
      row2.style.transform = `translate3d(${baseShift2 - offset}px, 0px, 0px)`;

      ticking = false;
    }

    function onScrollOrResize() {
      if (!ticking) {
        requestAnimationFrame(updateMarqueeScroll);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('load', updateMarqueeScroll);

    // Initial calculation
    updateMarqueeScroll();

    // Hook into Lenis smooth scroll updates if active
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.on('scroll', updateMarqueeScroll);
    }
  }

  // Dedicated Video Play/Pause Control on Section Entry & Exit
  const brandVideoSection = document.getElementById('brand-video');
  const brandVideo = brandVideoSection ? brandVideoSection.querySelector('video') : null;

  if (brandVideoSection && brandVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          brandVideo.currentTime = 0; // Restart video from beginning on section entry
          const playPromise = brandVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.log('Video play caught exception:', err);
            });
          }
        } else {
          brandVideo.pause();
        }
      });
    }, {
      root: null,
      threshold: 0.25
    });

    videoObserver.observe(brandVideoSection);
  }

  // Brand Asset Tab Component Interaction
  const tabButtons = document.querySelectorAll('.brand-tab-btn');
  const previewPanels = document.querySelectorAll('.logo-preview-panel');

  function switchBrandTab(selectedTabBtn) {
    if (!selectedTabBtn || selectedTabBtn.classList.contains('active')) return;

    const targetTabId = selectedTabBtn.getAttribute('data-tab');

    // Update tab buttons state
    tabButtons.forEach(btn => {
      const isActive = (btn === selectedTabBtn);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update preview panels state
    previewPanels.forEach(panel => {
      const isTargetPanel = (panel.id === `panel-${targetTabId}`);
      panel.classList.toggle('active', isTargetPanel);
    });
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => switchBrandTab(btn));

    // Keyboard navigation (Arrow keys)
    btn.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabButtons[targetIndex].focus();
        switchBrandTab(tabButtons[targetIndex]);
      }
    });
  });

  // Section 7: Mobile Screen Carousel Interaction
  const screenImgs = document.querySelectorAll('.phone-screen-img');
  const screenDots = document.querySelectorAll('.screen-dot');
  const prevBtn = document.getElementById('screen-prev-btn');
  const nextBtn = document.getElementById('screen-next-btn');
  let currentScreenIndex = 0;

  function goToScreen(index) {
    if (index < 0) {
      currentScreenIndex = screenImgs.length - 1;
    } else if (index >= screenImgs.length) {
      currentScreenIndex = 0;
    } else {
      currentScreenIndex = index;
    }

    screenImgs.forEach((img, i) => {
      img.classList.toggle('active', i === currentScreenIndex);
    });

    screenDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentScreenIndex);
    });
  }

  if (prevBtn && nextBtn && screenImgs.length > 0) {
    prevBtn.addEventListener('click', () => {
      goToScreen(currentScreenIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      goToScreen(currentScreenIndex + 1);
    });

    screenDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToScreen(index);
      });
    });
  }

  // Interactive Free Dragging for Floating Feature Badges with Spring Release
  const featureBadges = document.querySelectorAll('.feature-badge');

  featureBadges.forEach(badge => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    badge.addEventListener('dragstart', (e) => e.preventDefault());

    function onDragStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      isDragging = true;
      badge.classList.add('dragging');

      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

      startX = clientX - currentX;
      startY = clientY - currentY;

      badge.style.animation = 'none';
      badge.style.transition = 'none';

      document.addEventListener('mousemove', onDragMove, { passive: false });
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();

      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

      currentX = clientX - startX;
      currentY = clientY - startY;

      badge.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) scale(1.05)`;
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      badge.classList.remove('dragging');

      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);

      // Smooth spring release animation back to origin (0, 0)
      badge.style.transition = 'transform 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      badge.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';

      currentX = 0;
      currentY = 0;

      // Re-enable keyframe float animation after spring back completes
      setTimeout(() => {
        if (!isDragging) {
          badge.style.transition = '';
          badge.style.transform = '';
          badge.style.animation = '';
        }
      }, 650);
    }

    badge.addEventListener('mousedown', onDragStart);
    badge.addEventListener('touchstart', onDragStart, { passive: true });
  });

  // ==========================================================================
  // Distraction-Free Reader Modal & Interactivity Logic
  // ==========================================================================
  const readerModal = document.getElementById('reader-modal');
  const launchReaderBtn = document.getElementById('btn-launch-reader');
  const closeReaderBtn = document.getElementById('btn-close-reader');
  const modalContainer = readerModal ? readerModal.querySelector('.reader-modal-container') : null;

  function openReaderModal() {
    if (!readerModal) return;
    readerModal.classList.add('active');
    readerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent page scroll when modal is open

    if (typeof gsap !== 'undefined' && modalContainer) {
      gsap.fromTo(modalContainer, 
        { scale: 0.9, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }

  function closeReaderModal() {
    if (!readerModal) return;

    if (typeof gsap !== 'undefined' && modalContainer) {
      gsap.to(modalContainer, {
        scale: 0.95,
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          readerModal.classList.remove('active');
          readerModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    } else {
      readerModal.classList.remove('active');
      readerModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (launchReaderBtn) {
    launchReaderBtn.addEventListener('click', openReaderModal);
  }

  if (closeReaderBtn) {
    closeReaderBtn.addEventListener('click', closeReaderModal);
  }

  // Close modal when clicking dark backdrop overlay
  if (readerModal) {
    readerModal.addEventListener('click', (e) => {
      if (e.target === readerModal) {
        closeReaderModal();
      }
    });

    // Close modal on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && readerModal.classList.contains('active')) {
        closeReaderModal();
      }
    });
  }

  // Reader Modal Theme Switcher
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme');

      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (modalContainer) {
        modalContainer.setAttribute('data-theme', selectedTheme);
      }
    });
  });

  // Font Size Controls (80% to 140%)
  const fontDecreaseBtn = document.getElementById('font-decrease');
  const fontIncreaseBtn = document.getElementById('font-increase');
  const fontSizeIndicator = document.getElementById('font-size-indicator');
  const readerPaper = document.getElementById('reader-paper');
  let currentFontScale = 100;

  function updateFontSize(newScale) {
    currentFontScale = Math.max(80, Math.min(140, newScale));
    if (fontSizeIndicator) fontSizeIndicator.textContent = `${currentFontScale}%`;
    if (readerPaper) {
      readerPaper.style.fontSize = `${(currentFontScale / 100) * 1.15}rem`;
    }
  }

  if (fontDecreaseBtn && fontIncreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => updateFontSize(currentFontScale - 10));
    fontIncreaseBtn.addEventListener('click', () => updateFontSize(currentFontScale + 10));
  }

  // Reading Progress Bar Calculation
  const contentViewport = document.getElementById('reader-content-viewport');
  const progressBar = document.getElementById('reader-progress-bar');

  if (contentViewport && progressBar) {
    contentViewport.addEventListener('scroll', () => {
      const scrollTop = contentViewport.scrollTop;
      const scrollHeight = contentViewport.scrollHeight - contentViewport.clientHeight;
      const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = `${progressPercent}%`;
    });
  }

  // Text Selection Highlight Toast Notification
  const highlightToast = document.getElementById('highlight-toast');
  let toastTimeout = null;

  if (contentViewport && highlightToast) {
    contentViewport.addEventListener('mouseup', () => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText.length > 5) {
        highlightToast.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          highlightToast.classList.remove('show');
        }, 3200);
      }
    });
  }

  // ==========================================================================
  // GSAP Magnetic Buttons & Newsletter Validation
  // ==========================================================================
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)"
        });
      }
    });
  });
});

