(() => {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themeToggle = document.querySelector(".theme-toggle");

  const applyTheme = (theme, persist) => {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#fafafa" : "#09090b");
    themeToggle?.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    if (persist) {
      try { localStorage.setItem("theme", theme); } catch (e) { /* storage unavailable */ }
    }
  };

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
  themeToggle?.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
  });

  /* ---------- Mobile navigation ---------- */
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");

  const setNav = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle?.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !header.contains(e.target)) setNav(false);
  });
  window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });

  /* ---------- Header border on scroll ---------- */
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Active nav link (scroll spy) ---------- */
  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = navLinks.map((a) => document.querySelector(a.hash)).filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.hash === `#${entry.target.id}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));

    // Clear the highlight when back in the hero.
    const hero = document.querySelector(".hero");
    if (hero) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) navLinks.forEach((l) => { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
      }, { rootMargin: "-45% 0px -50% 0px" }).observe(hero);
    }
  }

  /* ---------- Scroll reveal ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (!reduceMotion && "IntersectionObserver" in window) {
    // Stagger siblings that share a parent (e.g. grid items).
    revealEls.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
      const index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 80}ms`);
    });

    root.classList.add("js-reveal");
    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealer.observe(el));
  }

  /* ---------- Copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add("is-copied");
        btn.setAttribute("aria-label", "Email address copied");
        setTimeout(() => {
          btn.classList.remove("is-copied");
          btn.setAttribute("aria-label", "Copy email address");
        }, 2000);
      } catch (e) {
        window.location.href = `mailto:${text}`;
      }
    });
  });

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Contact form (EmailJS) ---------- */
  const EMAILJS = {
    publicKey: "zkg8zOCHX6c4Cqst_",
    serviceId: "default_service",
    templateId: "template_vxmo4u9",
  };

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form) {
    const submit = form.querySelector('button[type="submit"]');
    const label = submit.querySelector(".btn-label");
    const defaultLabel = label.textContent;

    const setStatus = (state, message) => {
      status.dataset.state = state;
      status.textContent = message;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!window.emailjs) {
        setStatus("error", "The message service couldn't load. Please email me directly at teyeetukudo@gmail.com.");
        return;
      }

      submit.disabled = true;
      label.textContent = "Sending…";
      setStatus("", "");

      try {
        await window.emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, form, { publicKey: EMAILJS.publicKey });
        form.reset();
        setStatus("success", "Thanks! Your message is on its way. I'll get back to you soon.");
      } catch (err) {
        console.error("EmailJS error:", err);
        setStatus("error", "Something went wrong sending your message. Please try again, or email me directly.");
      } finally {
        submit.disabled = false;
        label.textContent = defaultLabel;
      }
    });
  }
})();
