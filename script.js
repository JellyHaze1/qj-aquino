// Small interaction: reveal elements as they enter the viewport.
const items = document.querySelectorAll('.job, .skill, .tool-card, .about-grid div');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
items.forEach(item => {
  item.classList.add('reveal');
  observer.observe(item);
});
