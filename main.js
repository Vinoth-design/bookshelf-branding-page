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
    document.getElementById('reading-moments')
  ];

  animatedSections.forEach(section => {
    if (section) {
      scrollObserver.observe(section);
    }
  });
});
