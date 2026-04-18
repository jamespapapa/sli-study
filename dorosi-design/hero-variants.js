/* ============================================
   HERO VARIANTS SYSTEM
   ============================================ */
(function(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  let raf;
  let state = {};
  let mouse = { x: -9999, y: -9999 };

  function resize(){
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
  }

  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', () => { resize(); });

  function accentRGB(){ return window.__accentRGB || '0, 229, 255'; }

  // --- NEURONS ---
  function initNeurons(){
    state.nodes = [];
    const count = 80;
    for(let i=0;i<count;i++){
      state.nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.35,
        vy: (Math.random()-0.5)*0.35,
        r: Math.random()*1.6 + 0.6,
        pulse: Math.random()*Math.PI*2
      });
    }
  }
  function drawNeurons(){
    ctx.clearRect(0,0,W,H);
    const rgb = accentRGB();
    const MAX = 160;
    for(let i=0;i<state.nodes.length;i++){
      const a = state.nodes[i];
      for(let j=i+1;j<state.nodes.length;j++){
        const b = state.nodes[j];
        const dx = a.x-b.x, dy=a.y-b.y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if(d<MAX){
          const alpha = (1-d/MAX)*0.22;
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      const mdx=a.x-mouse.x, mdy=a.y-mouse.y;
      const md=Math.sqrt(mdx*mdx+mdy*mdy);
      if(md<220){
        ctx.strokeStyle = `rgba(${rgb}, ${(1-md/220)*0.6})`;
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
      }
    }
    for(const n of state.nodes){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
      n.pulse+=0.02;
      const pulseR = Math.max(0.1, n.r + Math.sin(n.pulse)*0.8);
      const grd = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,14);
      grd.addColorStop(0, `rgba(${rgb}, 0.7)`);
      grd.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(n.x,n.y,14,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(n.x,n.y,pulseR,0,Math.PI*2); ctx.fill();
    }
  }

  // --- CONSTELLATION (stars) ---
  function initConstellation(){
    state.stars = [];
    for(let i=0;i<240;i++){
      state.stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.5+0.2,
        tw: Math.random()*Math.PI*2,
        s: Math.random()*0.02+0.005
      });
    }
    state.constLines = [];
    // connect nearest neighbors to form constellations
    const bright = state.stars.filter(s => s.r > 1.1);
    for(const s of bright){
      let best = null, bd = 9999;
      for(const o of bright){
        if(o===s) continue;
        const d = Math.hypot(s.x-o.x, s.y-o.y);
        if(d<bd && d < 240){ bd = d; best = o; }
      }
      if(best) state.constLines.push([s, best]);
    }
  }
  function drawConstellation(){
    ctx.clearRect(0,0,W,H);
    const rgb = accentRGB();
    for(const [a,b] of state.constLines){
      ctx.strokeStyle = `rgba(${rgb}, 0.18)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    }
    for(const s of state.stars){
      s.tw += s.s;
      const a = (Math.sin(s.tw)+1)*0.5;
      ctx.fillStyle = s.r > 1.1 ? `rgba(${rgb}, ${0.4+a*0.6})` : `rgba(255,255,255,${0.2+a*0.5})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      if(s.r > 1.2){
        const g = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,10);
        g.addColorStop(0, `rgba(${rgb}, ${a*0.4})`);
        g.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x,s.y,10,0,Math.PI*2); ctx.fill();
      }
    }
  }

  // --- WAVES ---
  function initWaves(){ state.t = 0; }
  function drawWaves(){
    ctx.clearRect(0,0,W,H);
    const rgb = accentRGB();
    state.t += 0.015;
    for(let row=0; row<12; row++){
      const phase = state.t + row*0.3;
      ctx.strokeStyle = `rgba(${rgb}, ${0.08 + row*0.015})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for(let x=0; x<=W; x+=8){
        const y = H/2
          + Math.sin(x*0.008 + phase) * (40 + row*6)
          + Math.sin(x*0.02 + phase*1.6) * 14
          + (row-6)*28;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    // radial pulses from mouse
    if(mouse.x > -100){
      for(let i=1;i<=4;i++){
        const r = ((state.t*50) + i*60) % 240;
        ctx.strokeStyle = `rgba(${rgb}, ${(1 - r/240)*0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, r, 0, Math.PI*2); ctx.stroke();
      }
    }
  }

  // --- MATRIX ---
  function initMatrix(){
    state.cols = Math.floor(W/16);
    state.drops = [];
    const chars = '01ドロシーDOROTHY∆ΨΩ//<>{}#$%&*▓▒░';
    state.chars = chars;
    for(let i=0;i<state.cols;i++){
      state.drops.push({ y: Math.random()*-H, s: Math.random()*2+1 });
    }
  }
  function drawMatrix(){
    const rgb = accentRGB();
    ctx.fillStyle = 'rgba(3, 5, 16, 0.12)';
    ctx.fillRect(0,0,W,H);
    ctx.font = '14px "JetBrains Mono", monospace';
    for(let i=0;i<state.drops.length;i++){
      const d = state.drops[i];
      const x = i*16;
      // trail
      for(let k=0;k<18;k++){
        const y = d.y - k*16;
        if(y<0||y>H) continue;
        const ch = state.chars[Math.floor(Math.random()*state.chars.length)];
        const alpha = Math.max(0, 1 - k/18);
        if(k===0){
          ctx.fillStyle = `rgba(255,255,255, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${rgb}, ${alpha*0.8})`;
        }
        ctx.fillText(ch, x, y);
      }
      d.y += d.s;
      if(d.y > H + 80) { d.y = -Math.random()*200; d.s = Math.random()*2+1; }
    }
  }

  // --- PARTICLES ---
  function initParticles(){
    state.parts = [];
    const cx = W/2, cy = H/2;
    for(let i=0;i<180;i++){
      const a = Math.random()*Math.PI*2;
      const sp = Math.random()*0.8 + 0.2;
      state.parts.push({
        x: cx, y: cy,
        vx: Math.cos(a)*sp, vy: Math.sin(a)*sp,
        life: Math.random()*200,
        max: 200 + Math.random()*120,
        r: Math.random()*1.5+0.5
      });
    }
  }
  function drawParticles(){
    ctx.fillStyle = 'rgba(3, 5, 16, 0.15)';
    ctx.fillRect(0,0,W,H);
    const rgb = accentRGB();
    const cx = W/2, cy = H/2;
    for(const p of state.parts){
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 1.005; p.vy *= 1.005;
      p.life++;
      const alpha = Math.max(0, 1 - p.life/p.max);
      const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,4);
      grd.addColorStop(0, `rgba(${rgb}, ${alpha})`);
      grd.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255, ${alpha})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      if(p.life > p.max){
        const a = Math.random()*Math.PI*2;
        const sp = Math.random()*0.8 + 0.2;
        p.x = cx; p.y = cy;
        p.vx = Math.cos(a)*sp; p.vy = Math.sin(a)*sp;
        p.life = 0; p.max = 200 + Math.random()*120;
      }
    }
    // center glow
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,60);
    g.addColorStop(0, `rgba(${rgb}, 0.5)`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx,cy,60,0,Math.PI*2); ctx.fill();
  }

  const variants = {
    neurons:       { init: initNeurons,       draw: drawNeurons },
    constellation: { init: initConstellation, draw: drawConstellation },
    waves:         { init: initWaves,         draw: drawWaves },
    matrix:        { init: initMatrix,        draw: drawMatrix },
    particles:     { init: initParticles,     draw: drawParticles }
  };

  let current = 'neurons';

  function loop(){
    variants[current].draw();
    raf = requestAnimationFrame(loop);
  }

  function rebuild(){
    const v = window.__heroVariant || 'neurons';
    if(!variants[v]) return;
    current = v;
    resize();
    variants[v].init();
    if(!raf) raf = requestAnimationFrame(loop);
  }

  window.__rebuildHero = rebuild;
  resize();
  rebuild();
})();
