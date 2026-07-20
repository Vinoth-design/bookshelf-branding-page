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
    document.getElementById('color-palette')
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
});
