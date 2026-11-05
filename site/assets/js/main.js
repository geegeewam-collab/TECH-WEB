(() => {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-primary-nav]");

  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    };
    menuButton.addEventListener("click", () => {
      const willOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
      document.body.classList.toggle("menu-open", willOpen);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  // Mark the current navigation destination without relying on client-side routing.
  const currentPath = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const target = new URL(link.href, window.location.origin).pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
    if (target === currentPath || (target !== "/" && currentPath.startsWith(target + "/"))) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Small reveal transitions; content remains visible when reduced motion is enabled.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Portfolio filters are progressive enhancement: every project is visible by default.
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-project-card]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        card.hidden = filter !== "all" && !categories.includes(filter);
      });
    });
  });

  // Footer year is maintained automatically.
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
