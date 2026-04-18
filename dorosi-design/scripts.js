/* ============================================
   GENERIC MINI CANVAS (process, portfolio etc.)
   ============================================ */
function miniNetwork(canvas, opts){
  opts = opts || {};
  const ctx = canvas.getContext('2d');
  const color = opts.color || '0, 229, 255';
  const count = opts.count || 14;
  let W, H, dpr, nodes;
  function resize(){
    dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
  }
  function init(){
    resize();
    nodes = [];
    for(let i=0;i<count;i++){
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25,
        r: Math.random()*1.2+0.6
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j];
        const d = Math.hypot(a.x-b.x,a.y-b.y);
        if(d<80){
          ctx.strokeStyle = `rgba(${color},${(1-d/80)*0.35})`;
          ctx.lineWidth=0.5;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
      ctx.fillStyle=`rgba(${color},0.9)`;
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  init();
  requestAnimationFrame(draw);
}
window.miniNetwork = miniNetwork;

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
(function(){
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  });
})();

/* ============================================
   CARD MOUSE TRACKING (radial hover)
   ============================================ */
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.card').forEach(card => {
    const r = card.getBoundingClientRect();
    if(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom){
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
  });
});

/* ============================================
   LIVE TIME + COUNTER (hero meta)
   ============================================ */
(function(){
  function tick(){
    const now = new Date();
    const pad = (n) => String(n).padStart(2,'0');
    const t = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
    const el = document.getElementById('liveTime');
    if(el) el.textContent = t;
  }
  setInterval(tick, 1000); tick();
})();

/* Counter animation for stats */
function animateCounter(el, target, suffix){
  suffix = suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(t){
    const p = Math.min(1, (t - start)/duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.floor(eased * target);
    el.textContent = v + suffix;
    if(p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
});

/* ============================================
   SERVICE PICKER + FORM
   ============================================ */
document.addEventListener('click', (e) => {
  const pick = e.target.closest('.service-pick-item');
  if(pick){ pick.classList.toggle('on'); }
});

document.addEventListener('submit', (e) => {
  if(e.target.id === 'contactForm'){
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Transmitting…';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '✓ 메시지가 전송되었습니다';
      btn.style.background = 'var(--accent)';
      btn.style.color = 'var(--bg)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        e.target.reset();
      }, 2800);
    }, 1200);
  }
});

/* ============================================
   TWEAKS
   ============================================ */
(function(){
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroVariant": "neurons",
    "accentColor": "cyan"
  }/*EDITMODE-END*/;

  let tweakPanel = null;
  let current = Object.assign({}, TWEAK_DEFAULTS);

  const HERO_VARIANTS = [
    { id: 'neurons', label: 'AI 뉴런 네트워크' },
    { id: 'constellation', label: '성운 / 별자리' },
    { id: 'waves', label: '전파 파동' },
    { id: 'matrix', label: '코드 레인' },
    { id: 'particles', label: '파티클 폭발' }
  ];
  const ACCENT_COLORS = [
    { id: 'cyan',   label: 'CYAN',   main: '#00E5FF', sec: '#3B82FF', rgb: '0, 229, 255' },
    { id: 'magenta',label: 'MAGENTA',main: '#FF3BE5', sec: '#A020F0', rgb: '255, 59, 229' },
    { id: 'lime',   label: 'LIME',   main: '#B7FF2A', sec: '#4AE3A8', rgb: '183, 255, 42' },
    { id: 'amber',  label: 'AMBER',  main: '#FFB020', sec: '#FF6A00', rgb: '255, 176, 32' }
  ];

  function buildPanel(){
    tweakPanel = document.createElement('div');
    tweakPanel.className = 'tweaks';
    tweakPanel.innerHTML = `
      <div class="tweaks-head">
        <span>⟡ TWEAKS</span>
        <span style="color:var(--ink-dim)">DOROTHY.CTRL</span>
      </div>
      <div class="tweak-row">
        <span class="k">Hero Animation</span>
        <div class="tweak-opts" id="twHero">
          ${HERO_VARIANTS.map(v => `<button class="tweak-opt ${v.id===current.heroVariant?'on':''}" data-h="${v.id}">${v.label}</button>`).join('')}
        </div>
      </div>
      <div class="tweak-row">
        <span class="k">Accent Color</span>
        <div class="tweak-opts" id="twColor">
          ${ACCENT_COLORS.map(c => `<button class="tweak-opt ${c.id===current.accentColor?'on':''}" data-c="${c.id}">${c.label}</button>`).join('')}
        </div>
      </div>
      <div style="font-size:10px;color:var(--ink-ghost);margin-top:8px;letter-spacing:0.1em">TOGGLE TWEAKS TO HIDE</div>
    `;
    document.body.appendChild(tweakPanel);

    tweakPanel.addEventListener('click', (e) => {
      const h = e.target.closest('[data-h]');
      if(h){
        tweakPanel.querySelectorAll('#twHero .tweak-opt').forEach(b => b.classList.remove('on'));
        h.classList.add('on');
        current.heroVariant = h.dataset.h;
        applyHeroVariant(current.heroVariant);
        persist();
      }
      const c = e.target.closest('[data-c]');
      if(c){
        tweakPanel.querySelectorAll('#twColor .tweak-opt').forEach(b => b.classList.remove('on'));
        c.classList.add('on');
        current.accentColor = c.dataset.c;
        applyAccent(current.accentColor);
        persist();
      }
    });
  }

  function persist(){
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: current }, '*');
  }

  function applyAccent(id){
    const c = ACCENT_COLORS.find(x => x.id === id) || ACCENT_COLORS[0];
    document.documentElement.style.setProperty('--accent', c.main);
    document.documentElement.style.setProperty('--accent-2', c.sec);
    document.documentElement.style.setProperty('--line-strong', `rgba(${c.rgb}, 0.25)`);
    document.documentElement.style.setProperty('--glow', `0 0 40px rgba(${c.rgb}, 0.35)`);
    document.documentElement.style.setProperty('--glow-sm', `0 0 18px rgba(${c.rgb}, 0.35)`);
    window.__accentRGB = c.rgb;
    if(window.__rebuildHero) window.__rebuildHero();
  }

  function applyHeroVariant(id){
    window.__heroVariant = id;
    if(window.__rebuildHero) window.__rebuildHero();
  }

  window.addEventListener('message', (e) => {
    if(!e.data || !e.data.type) return;
    if(e.data.type === '__activate_edit_mode'){
      if(!tweakPanel) buildPanel();
      tweakPanel.classList.add('show');
    }
    if(e.data.type === '__deactivate_edit_mode'){
      if(tweakPanel) tweakPanel.classList.remove('show');
    }
  });

  window.__applyAccent = applyAccent;
  window.__applyHero = applyHeroVariant;
  window.__currentTweaks = current;

  // Initial apply
  setTimeout(() => {
    applyAccent(current.accentColor);
    applyHeroVariant(current.heroVariant);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  }, 200);
})();
