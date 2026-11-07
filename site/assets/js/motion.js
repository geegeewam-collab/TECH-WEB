/* GEEGEE TECH — motion layer: living chrome sculptures, word-by-word headlines, glass highlights. */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const path = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";

  /* 1. Sculpture stage: a different composition on every page */
  const sets = [["ribbon-a", "ribbon-c", "ring-1"], ["ribbon-d", "ribbon-e", "knot-1"], ["ribbon-b", "knot-2", "ring-2"], ["ribbon-c", "ring-3", "knot-3"], ["ribbon-e", "ribbon-a", "knot-1"], ["ribbon-d", "ribbon-b", "ring-3"]];
  let h = 0; for (const c of path) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const set = path === "/" ? sets[0] : sets[1 + (h % (sets.length - 1))];
  const small = innerWidth < 760, k = small ? 1.7 : 1;
  const cfg = [
    { w: path === "/" ? 66 : 54, x: small ? 18 : (path === "/" ? 54 : 70), y: small ? 40 : (path === "/" ? 34 : 26), ax: 8, ay: 10, r: 12, b: 0 },
    { w: 34, x: small ? -30 : -5, y: 60, ax: 7, ay: 9, r: -20, b: 3 },
    { w: 16, x: small ? 60 : 46, y: 4, ax: 10, ay: 6, r: 36, b: 7 }
  ];
  const stage = document.createElement("div");
  stage.className = "sculpture-stage"; stage.dataset.page = path === "/" ? "home" : "inner"; stage.setAttribute("aria-hidden", "true");
  const els = set.map((name, i) => {
    const c = cfg[i], img = new Image();
    img.src = `/assets/shapes/${name}.webp`; img.alt = ""; img.decoding = "async";
    img.style.cssText = `left:${c.x}vw;top:${c.y}vh;width:${Math.min(c.w * k, 120)}vw;--k:${i};` + (c.b ? `filter:blur(${c.b}px) brightness(.75);` : "");
    stage.appendChild(img); return img;
  });
  document.body.prepend(stage);

  let sy = scrollY, tmx = 0, tmy = 0, mx = 0, my = 0;
  const frame = (t) => {
    sy += (scrollY - sy) * 0.08; mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    const ph = sy / (innerHeight * 1.4), vw = innerWidth / 100, vh = innerHeight / 100;
    els.forEach((el, i) => {
      const c = cfg[i], a = ph * (1 + i * 0.35) + i * 2.1, s = reduce ? 0 : t;
      const dx = Math.sin(a) * c.ax * vw + mx * (i + 1) * 12 + Math.sin(s / 4200 + i) * 12;
      const dy = Math.cos(a * 0.8) * c.ay * vh + my * (i + 1) * 9 + Math.cos(s / 5200 + i) * 14;
      const rot = sy * 0.012 * c.r + Math.sin(s / 6500 + i) * 3;
      el.style.transform = `translate3d(${dx}px,${dy}px,0) rotate(${rot}deg) scale(${1 + Math.sin(a) * 0.04})`;
    });
    stage.style.setProperty("--dim", Math.max(0.58, 1 - sy / innerHeight * 0.35).toFixed(3));
    root.classList.toggle("is-scrolled", scrollY > 24);
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  if (!reduce) {
    addEventListener("pointermove", (e) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; }, { passive: true });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAnimationFrame(frame); });
  } else addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true });

  /* 2. Headlines rise word by word */
  if (!reduce) document.querySelectorAll(".hero .display, .page-title").forEach((el) => {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    let n = 0;
    const walk = (node) => [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((p) => {
          if (!p.trim()) { frag.append(p); return; }
          const w = document.createElement("span"), s = document.createElement("span");
          w.className = "w"; w.setAttribute("aria-hidden", "true"); s.style.setProperty("--i", n++); s.textContent = p; w.append(s); frag.append(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
    walk(el);
  });

  /* 3. Stagger reveals inside a group */
  document.querySelectorAll(".reveal").forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--i", sibs.indexOf(el));
  });

  /* 4. Light that follows the finger/cursor on glass */
  const glass = ".service-card, .work-card, .cta-panel, .contact-form, .value-card, .step-card, .studio-note";
  document.addEventListener("pointermove", (e) => {
    const c = e.target.closest && e.target.closest(glass); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });
})();
