const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;

const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress span');
const glow = document.querySelector('.cursor-glow');

function scrollUI(){
  nav?.classList.toggle('scrolled', window.scrollY > 18);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if(progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener('scroll', scrollUI, {passive:true});
scrollUI();

// Scroll reveal.
const revealItems = document.querySelectorAll('.reveal-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
revealItems.forEach(item => observer.observe(item));

// Animated counters.
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.count);
    const start = performance.now(), duration = 900;
    function tick(now){
      const p = Math.min((now-start)/duration,1);
      el.textContent = Math.floor((1-Math.pow(1-p,3))*target);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
},{threshold:.7});
counters.forEach(c=>counterObserver.observe(c));

// Cursor glow.
if(glow && finePointer && !reduceMotion){
  window.addEventListener('pointermove', e=>{
    glow.style.opacity='1';
    glow.style.left=e.clientX+'px';
    glow.style.top=e.clientY+'px';
  }, {passive:true});
  document.addEventListener('mouseleave',()=>glow.style.opacity='0');
}

// Magnetic CTA.
const magnetic = document.querySelector('.magnetic');
if(magnetic && finePointer && !reduceMotion){
  magnetic.addEventListener('pointermove', e=>{
    const r=magnetic.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.08;
    const y=(e.clientY-r.top-r.height/2)*.08;
    magnetic.style.transform=`translate(${x}px,${y-3}px)`;
  });
  magnetic.addEventListener('pointerleave',()=>magnetic.style.transform='');
}

// Hero tilt.
const visual=document.querySelector('.hero-visual');
if(visual && finePointer && !reduceMotion){
  visual.addEventListener('pointermove',e=>{
    const r=visual.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5;
    const py=(e.clientY-r.top)/r.height-.5;
    visual.style.transform=`perspective(1000px) rotateY(${px*4}deg) rotateX(${py*-4}deg) translateY(-4px)`;
  });
  visual.addEventListener('pointerleave',()=>visual.style.transform='');
}

// Toolkit spotlight.
if(finePointer && !reduceMotion){
  document.querySelectorAll('.tool-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)+'px');
      card.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
}

// Active navigation.
const links=[...document.querySelectorAll('.nav nav a')];
const sections=links.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+entry.target.id));
    }
  });
},{rootMargin:'-38% 0px -52% 0px'});
sections.forEach(s=>activeObserver.observe(s));
