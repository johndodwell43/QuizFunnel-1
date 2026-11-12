// Tiny dependency-free confetti burst. Respects reduced-motion. Cleans itself up.
let active = null;

// Stops a running burst at once (used when the screen that started it goes away).
export function clearConfetti() {
  if (active) {
    active.remove();
    active = null;
  }
}

export function burstConfetti({ count = 140, duration = 1800 } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  clearConfetti();
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '9999'
  });
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  active = canvas;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const colors = ['#2563eb', '#60a5fa', '#16a34a', '#86efac', '#f59e0b', '#ffffff'];
  const parts = Array.from({ length: count }, () => {
    const fromLeft = Math.random() < 0.5;
    const angle = (fromLeft ? -60 : -120) + (Math.random() - 0.5) * 50;
    const speed = 9 + Math.random() * 7;
    const rad = (angle * Math.PI) / 180;
    return {
      x: fromLeft ? W * 0.08 : W * 0.92,
      y: H * 0.62,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0]
    };
  });
  const start = performance.now();
  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    const fade = t > duration - 500 ? Math.max(0, (duration - t) / 500) : 1;
    for (const p of parts) {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (canvas !== active) return;
    if (t < duration) requestAnimationFrame(frame);
    else clearConfetti();
  }
  requestAnimationFrame(frame);
}
