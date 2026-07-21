/**
 * BookShelf - Brand Identity Website
 * Core interaction scripts and scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('BookShelf Brand Identity Site Initialized.');

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
});
