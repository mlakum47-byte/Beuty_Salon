/* ==========================================================================
   LUXÉ BRIDAL STUDIO — CONSOLIDATED MASTER SCRIPT
   Navbar + Hero Section + Featured Services + About Us
   ========================================================================== */

"use strict";

// Register GSAP Plugins exactly once at header
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
   1. NAVBAR MODULE — initNavbar()
   ========================================================================== */
function initNavbar() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- THEME MANAGEMENT ---
  const themeToggles = document.querySelectorAll("#themeToggle, #themeToggleMobile");
  const storedTheme = localStorage.getItem("luxe-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let currentTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

  function applyTheme(theme, save = true) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (save) localStorage.setItem("luxe-theme", theme);

    themeToggles.forEach((btn) => {
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    });
  }
  applyTheme(currentTheme, false);

  themeToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  });

  // --- SCROLL OBSERVER & MOUSE REACTIVE GLOW ---
  let lastScrollY = window.scrollY;
  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
    lastScrollY = scrollY;
  }
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  nav.addEventListener("mousemove", (e) => {
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    nav.style.setProperty("--mx", `${x}px`);
    nav.style.setProperty("--my", `${y}px`);
  });

  // --- ACTIVE NAV LINK INDICATOR ---
  const navIndicator = document.getElementById("navIndicator");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  let activeLink = document.querySelector(".nav-link.is-active");

  function moveIndicatorTo(target) {
    if (!navIndicator || !target || reduceMotion) return;
    const linkRect = target.getBoundingClientRect();
    const navRect = nav.querySelector(".nav-menu").getBoundingClientRect();
    const left = linkRect.left - navRect.left;
    const width = linkRect.width;

    gsap.to(navIndicator, {
      left: left,
      width: width,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
      onStart: () => navIndicator.classList.add("is-visible"),
    });
  }

  if (activeLink) moveIndicatorTo(activeLink);

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => moveIndicatorTo(link));
    link.addEventListener("mouseleave", () => moveIndicatorTo(activeLink));
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#") e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
      activeLink = link;
      moveIndicatorTo(activeLink);
    });
  });

  window.addEventListener("resize", () => {
    if (activeLink) moveIndicatorTo(activeLink);
  });

  // --- MEGA MENU TIMELINE & INTERACTION ---
  const servicesTrigger = document.getElementById("servicesTrigger");
  const megaMenu = document.getElementById("megaMenu");

  if (servicesTrigger && megaMenu) {
    let megaOpen = false;

    const megaMenuTimeline = gsap.timeline({ paused: true });
    megaMenuTimeline
      .to(megaMenu, {
        duration: 0.45,
        opacity: 1,
        y: 0,
        visibility: "visible",
        ease: "power3.out",
      })
      .from(
        megaMenu.querySelectorAll(".mega-menu__intro > *, .mega-col"),
        {
          duration: 0.35,
          y: 12,
          opacity: 0,
          stagger: 0.04,
          ease: "power2.out",
        },
        "-=0.25"
      );

    function openMega() {
      if (megaOpen) return;
      megaOpen = true;
      megaMenu.classList.add("is-open");
      servicesTrigger.setAttribute("aria-expanded", "true");
      megaMenuTimeline.play();
    }

    function closeMega() {
      if (!megaOpen) return;
      megaOpen = false;
      servicesTrigger.setAttribute("aria-expanded", "false");
      megaMenuTimeline.reverse().then(() => {
        megaMenu.classList.remove("is-open");
      });
    }

    servicesTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      megaOpen ? closeMega() : openMega();
    });

    document.addEventListener("click", (e) => {
      if (megaOpen && !megaMenu.contains(e.target) && !servicesTrigger.contains(e.target)) {
        closeMega();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && megaOpen) closeMega();
    });
  }

  // --- MOBILE MENU TIMELINE & CANVAS PARTICLES ---
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileCloseBtn = document.getElementById("mobileCloseBtn");
  const mobileLinks = document.querySelectorAll("[data-mobile-link]");

  if (hamburgerBtn && mobileMenu) {
    let mobileOpen = false;

    const mobileMenuTimeline = gsap.timeline({ paused: true });
    mobileMenuTimeline
      .to(mobileMenu, {
        duration: 0.5,
        opacity: 1,
        visibility: "visible",
        ease: "power3.out",
      })
      .to(
        mobileMenu.querySelectorAll(".mobile-menu__list a"),
        {
          duration: 0.4,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.3"
      );

    function openMobile() {
      if (mobileOpen) return;
      mobileOpen = true;
      mobileMenu.removeAttribute("inert");
      mobileMenu.classList.add("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      mobileMenuTimeline.play();
      startNavParticles();
    }

    function closeMobile() {
      if (!mobileOpen) return;
      mobileOpen = false;
      hamburgerBtn.setAttribute("aria-expanded", "false");
      mobileMenuTimeline.reverse().then(() => {
        mobileMenu.classList.remove("is-open");
        mobileMenu.setAttribute("inert", "");
        document.body.style.overflow = "";
        stopNavParticles();
      });
    }

    hamburgerBtn.addEventListener("click", openMobile);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", closeMobile);

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobile);
    });

    // Mobile canvas ambient dots
    const navCanvas = document.getElementById("navParticleCanvas");
    let navParticles = [];
    let navParticleRafId = null;

    function resizeNavCanvas() {
      if (!navCanvas) return;
      navCanvas.width = window.innerWidth;
      navCanvas.height = window.innerHeight;
    }

    function startNavParticles() {
      if (!navCanvas || reduceMotion) return;
      resizeNavCanvas();
      const ctx = navCanvas.getContext("2d");
      navParticles = Array.from({ length: 45 }, () => ({
        x: Math.random() * navCanvas.width,
        y: Math.random() * navCanvas.height,
        r: Math.random() * 2 + 0.8,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
      }));

      function drawNavParticles() {
        ctx.clearRect(0, 0, navCanvas.width, navCanvas.height);
        ctx.fillStyle = currentTheme === "dark" ? "#ecd9a6" : "#a97a34";

        navParticles.forEach((p) => {
          p.x += p.dx;
          p.y += p.dy;
          if (p.x < 0 || p.x > navCanvas.width) p.dx *= -1;
          if (p.y < 0 || p.y > navCanvas.height) p.dy *= -1;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        navParticleRafId = requestAnimationFrame(drawNavParticles);
      }
      drawNavParticles();
    }

    function stopNavParticles() {
      if (navParticleRafId) {
        cancelAnimationFrame(navParticleRafId);
        navParticleRafId = null;
      }
    }
  }

  // --- SEARCH OVERLAY ---
  const searchBtn = document.getElementById("searchBtn");
  const searchBtnMobile = document.getElementById("searchBtnMobile");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const searchInput = document.getElementById("searchInput");

  if (searchOverlay) {
    function openSearch() {
      searchOverlay.removeAttribute("inert");
      searchOverlay.classList.add("is-open");
      if (searchInput) setTimeout(() => searchInput.focus(), 100);
    }
    function closeSearch() {
      searchOverlay.classList.remove("is-open");
      searchOverlay.setAttribute("inert", "");
    }

    if (searchBtn) searchBtn.addEventListener("click", openSearch);
    if (searchBtnMobile) searchBtnMobile.addEventListener("click", openSearch);
    if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);

    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay || e.target.classList.contains("search-overlay__glass")) {
        closeSearch();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchOverlay.classList.contains("is-open")) {
        closeSearch();
      }
    });
  }

  // --- BUTTON MAGNETIC & RIPPLE EFFECTS ---
  function makeNavMagnetic(el, strength = 0.25) {
    if (!el || reduceMotion) return;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(el, { x: x, y: y, duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  }
  makeNavMagnetic(document.getElementById("ctaBtn"));

  document.querySelectorAll(".cta-btn, .icon-btn, .theme-toggle").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement("span");
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      circle.classList.add("ripple");

      const existingRipple = this.querySelector(".ripple");
      if (existingRipple) existingRipple.remove();
      this.appendChild(circle);
    });
  });
}

/* ==========================================================================
   2. HERO SECTION MODULE — initHero()
   ========================================================================== */
function initHero() {
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- THREE.JS GOLDEN PARTICLE FIELD ---
  const heroCanvas = document.getElementById("heroParticleCanvas");
  let heroScene, heroCamera, heroRenderer, heroPoints, heroParticleGeo;
  let heroRafId = null;
  let heroMouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  if (heroCanvas && typeof THREE !== "undefined" && !reduceMotion) {
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    heroCamera.position.z = 300;

    heroRenderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 600;
      const y = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 300;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      scales[i] = Math.random() * 3 + 1;
    }

    heroParticleGeo = new THREE.BufferGeometry();
    heroParticleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    heroParticleGeo.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Custom gradient circle canvas texture
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const tCtx = textureCanvas.getContext("2d");
    const grad = tCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(236, 217, 166, 0.95)");
    grad.addColorStop(0.4, "rgba(207, 159, 82, 0.6)");
    grad.addColorStop(1, "rgba(207, 159, 82, 0)");
    tCtx.fillStyle = grad;
    tCtx.beginPath();
    tCtx.arc(32, 32, 32, 0, Math.PI * 2);
    tCtx.fill();

    const particleTexture = new THREE.CanvasTexture(textureCanvas);
    const particleMaterial = new THREE.PointsMaterial({
      size: 6,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    heroPoints = new THREE.Points(heroParticleGeo, particleMaterial);
    heroScene.add(heroPoints);

    function animateHeroParticles() {
      heroRafId = requestAnimationFrame(animateHeroParticles);

      heroMouse.x += (heroMouse.targetX - heroMouse.x) * 0.05;
      heroMouse.y += (heroMouse.targetY - heroMouse.y) * 0.05;

      const pos = heroParticleGeo.attributes.position.array;
      const time = Date.now() * 0.0008;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];

        pos[i3] = ox + Math.sin(time + i) * 12 + heroMouse.x * 20;
        pos[i3 + 1] = oy + Math.cos(time * 0.8 + i) * 12 + heroMouse.y * 20;
      }
      heroParticleGeo.attributes.position.needsUpdate = true;

      heroPoints.rotation.y = time * 0.05;
      heroRenderer.render(heroScene, heroCamera);
    }
    animateHeroParticles();

    // IntersectionObserver to pause Three.js when Hero is scrolled out of view
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!heroRafId) animateHeroParticles();
          } else {
            if (heroRafId) {
              cancelAnimationFrame(heroRafId);
              heroRafId = null;
            }
          }
        });
      },
      { threshold: 0.05 }
    );
    heroObserver.observe(heroSection);

    window.addEventListener("resize", () => {
      if (!heroCamera || !heroRenderer) return;
      heroCamera.aspect = window.innerWidth / window.innerHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // --- MOUSE MOVE GLOW & PARALLAX OBSERVER ---
  const mouseGlow = document.getElementById("mouseGlow");
  const heroVisual = document.getElementById("heroVisual");
  const portraitFrame = document.getElementById("portraitFrame");
  const floaties = document.querySelectorAll(".floaty");
  const glassCards = document.querySelectorAll(".glass-card");
  const heroDecos = document.querySelectorAll(".hero-bg .deco");

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    heroMouse.targetX = normX;
    heroMouse.targetY = normY;

    if (mouseGlow) {
      mouseGlow.style.setProperty("--mx", `${x}px`);
      mouseGlow.style.setProperty("--my", `${y}px`);
    }

    if (reduceMotion) return;

    if (portraitFrame) {
      gsap.to(portraitFrame, {
        rotateY: normX * 8,
        rotateX: -normY * 8,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    floaties.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || "1");
      gsap.to(el, {
        x: normX * 24 * speed,
        y: normY * 24 * speed,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    glassCards.forEach((el, idx) => {
      const factor = (idx + 1) * 6;
      gsap.to(el, {
        x: normX * factor,
        y: normY * factor,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    heroDecos.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "0.04");
      gsap.to(el, {
        x: normX * depth * 300,
        y: normY * depth * 300,
        duration: 1,
        ease: "power2.out",
      });
    });
  });

  heroSection.addEventListener("mouseleave", () => {
    heroMouse.targetX = 0;
    heroMouse.targetY = 0;

    if (portraitFrame) gsap.to(portraitFrame, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power2.out" });
    floaties.forEach((el) => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "power2.out" }));
    glassCards.forEach((el) => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "power2.out" }));
  });

  // --- INTRO TIMELINE ANIMATION (GSAP + SplitType) ---
  function runHeroIntro() {
    const heroHeading = document.getElementById("heroHeading");
    if (!heroHeading) return;

    let split = null;
    if (typeof SplitType !== "undefined") {
      split = new SplitType(heroHeading, { types: "lines, words", lineClass: "line" });
    }

    const heroIntroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Background & Ornaments
    heroIntroTimeline
      .from(".hero-bg__mesh, .hero-bg__blob", {
        opacity: 0,
        duration: 1.4,
      })
      .from(
        heroDecos,
        {
          scale: 0.7,
          opacity: 0,
          duration: 1.2,
          stagger: 0.08,
        },
        "-=1.0"
      );

    // Copy Elements
    heroIntroTimeline
      .to(
        "[data-anim='label']",
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        "-=0.8"
      );

    if (split && split.lines) {
      heroIntroTimeline.to(
        split.lines.map((l) => l.querySelector("div") || l),
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.5"
      );
    } else {
      heroIntroTimeline.fromTo(
        heroHeading,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.5"
      );
    }

    heroIntroTimeline
      .to(
        "[data-anim='desc']",
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        "-=0.6"
      )
      .to(
        ".hero-actions .btn",
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
        },
        "-=0.5"
      );

    // Stat Counter Animations
    heroIntroTimeline.to(
      ".hero-stat",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        onStart: () => animateHeroCounters(),
      },
      "-=0.4"
    );

    // Visual Composition & Floating Elements
    if (portraitFrame) {
      heroIntroTimeline.to(
        portraitFrame,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=1.0"
      );
    }

    heroIntroTimeline
      .to(
        floaties,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "back.out(1.6)",
        },
        "-=0.7"
      )
      .to(
        glassCards,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
        },
        "-=0.5"
      )
      .to(
        "#scrollCue",
        {
          opacity: 1,
          duration: 0.6,
        },
        "-=0.3"
      );

    // Start continuous floating loops after intro
    startHeroFloatingLoops();
  }

  function animateHeroCounters() {
    const counts = document.querySelectorAll(".js-count");
    counts.forEach((el) => {
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString() + suffix;
        },
      });
    });
  }

  function startHeroFloatingLoops() {
    if (reduceMotion) return;
    floaties.forEach((el, index) => {
      const delay = (index % 4) * 0.4;
      gsap.to(el, {
        y: "+=12",
        rotate: index % 2 === 0 ? 6 : -6,
        duration: 3 + (index % 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.easeInOut",
        delay: delay,
      });
    });
  }

  // Run Hero intro timeline
  runHeroIntro();

  // Hero Magnetic CTAs
  function makeHeroMagnetic(el) {
    if (!el || reduceMotion) return;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(el, { x: x, y: y, duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  }
  makeHeroMagnetic(document.getElementById("ctaPrimary"));
  makeHeroMagnetic(document.getElementById("ctaSecondary"));
}

/* ==========================================================================
   3. FEATURED SERVICES MODULE — initFeaturedServices()
   ========================================================================== */
function initFeaturedServices() {
  const servicesSection = document.getElementById("services");
  if (!servicesSection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     A. THREE.JS — LUXURY DUST / GOLDEN SPARKLE PARTICLE FIELD
  ------------------------------------------------------------------------ */
  let servicesRenderer, servicesScene, servicesCamera;
  let servicesRafId = null;

  function initServicesParticles() {
    const canvas = document.getElementById("servicesCanvas");
    if (!canvas || reduceMotion || typeof THREE === "undefined") return;

    let width = servicesSection.clientWidth;
    let height = servicesSection.clientHeight;

    servicesRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    servicesRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    servicesRenderer.setSize(width, height);

    servicesScene = new THREE.Scene();
    servicesCamera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    servicesCamera.position.z = 480;

    const layers = [];

    function makeLayer(count, size, color, spread, opacity) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      servicesScene.add(points);
      return points;
    }

    layers.push(makeLayer(90, 6, 0xc6a15b, 1200, 0.35));   // golden sparkles (near)
    layers.push(makeLayer(60, 10, 0xe4c98a, 1400, 0.18));  // soft light orbs (far)
    layers.push(makeLayer(70, 3, 0xf6efe6, 1000, 0.4));    // fine dust

    let mouseX = 0, mouseY = 0;
    servicesSection.addEventListener("mousemove", (e) => {
      const rect = servicesSection.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();
    function animateServicesParticles() {
      servicesRafId = requestAnimationFrame(animateServicesParticles);
      const t = clock.getElapsedTime();

      layers.forEach((layer, i) => {
        layer.rotation.y = t * 0.02 * (i + 1);
        layer.position.x += (mouseX * 30 - layer.position.x) * 0.02;
        layer.position.y += (-mouseY * 20 - layer.position.y) * 0.02;
      });

      servicesCamera.position.x += (mouseX * 25 - servicesCamera.position.x) * 0.03;
      servicesCamera.position.y += (-mouseY * 15 - servicesCamera.position.y) * 0.03;
      servicesCamera.lookAt(servicesScene.position);

      servicesRenderer.render(servicesScene, servicesCamera);
    }
    animateServicesParticles();

    // IntersectionObserver to pause rendering when section is off-screen
    const servicesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!servicesRafId) animateServicesParticles();
        } else {
          if (servicesRafId) {
            cancelAnimationFrame(servicesRafId);
            servicesRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    servicesObserver.observe(servicesSection);

    window.addEventListener("resize", () => {
      if (!servicesCamera || !servicesRenderer) return;
      width = servicesSection.clientWidth;
      height = servicesSection.clientHeight;
      servicesCamera.aspect = width / height;
      servicesCamera.updateProjectionMatrix();
      servicesRenderer.setSize(width, height);
    });
  }

  /* ------------------------------------------------------------------------
     B. SCROLL-TRIGGERED REVEAL TIMELINE
  ------------------------------------------------------------------------ */
  function initServicesScrollReveal() {
    const servicesRevealTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        start: "top 75%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    servicesRevealTl
      .from(".services .mesh-blob, .services .light-ray, .services .deco", {
        opacity: 0,
        duration: 1.2,
      })
      .from("#services [data-reveal='label']", { y: 20, opacity: 0, duration: 0.6 }, "-=0.8")
      .from("#services [data-reveal='heading']", { y: 40, opacity: 0, duration: 0.9 }, "-=0.4")
      .from("#services [data-reveal='desc']", { y: 24, opacity: 0, duration: 0.7 }, "-=0.55")
      .from("#services [data-reveal='filters']", { y: 18, opacity: 0, duration: 0.6 }, "-=0.4")
      .to(".service-card", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.09,
      }, "-=0.25")
      .from(".services .badge--float", {
        opacity: 0,
        scale: 0.6,
        duration: 0.6,
        stagger: 0.08,
        onComplete() {
          gsap.to(".services .badge--float", { opacity: 1, duration: 0.4 });
        },
      }, "-=0.5")
      .from("#services [data-reveal='cta']", { y: 30, opacity: 0, duration: 0.8 }, "-=0.2")
      .to("#services [data-reveal='cta']", { opacity: 1, y: 0, duration: 0.01 }, "<");

    ScrollTrigger.create({
      trigger: ".services__cta",
      start: "top 90%",
      once: true,
      onEnter: () => gsap.to(".services__cta", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
    });
  }

  /* ------------------------------------------------------------------------
     C. CARD 3D TILT + GLASS REFLECTION
  ------------------------------------------------------------------------ */
  function initServicesTilt() {
    if (reduceMotion) return;
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card) => {
      let bounds;
      const strength = card.classList.contains("service-card--featured") ? 6 : 9;

      const onEnter = () => { bounds = card.getBoundingClientRect(); };

      const onMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const x = (e.clientX - bounds.left) / bounds.width - 0.5;
        const y = (e.clientY - bounds.top) / bounds.height - 0.5;

        gsap.to(card, {
          rotateY: x * strength,
          rotateX: -y * strength,
          y: -6,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power2.out",
        });

        card.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--my", `${(y + 0.5) * 100}%`);
        card.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(230,200,150,0.08), var(--glass-bg) 60%)`;
      };

      const onLeave = () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.7, ease: "power3.out" });
        card.style.background = "var(--glass-bg)";
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    });
  }

  /* ------------------------------------------------------------------------
     D. CLICK RIPPLE + EXPAND
  ------------------------------------------------------------------------ */
  function initServicesClickInteraction() {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card) => {
      const trigger = (e) => {
        const bounds = card.getBoundingClientRect();
        const clientX = e.clientX ?? bounds.left + bounds.width / 2;
        const clientY = e.clientY ?? bounds.top + bounds.height / 2;
        const x = clientX - bounds.left;
        const y = clientY - bounds.top;
        const size = Math.max(bounds.width, bounds.height) * 1.4;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        card.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());

        gsap.fromTo(card,
          { scale: 1 },
          { scale: 1.02, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      };

      card.addEventListener("click", trigger);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger(e);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     E. CATEGORY FILTERS — GSAP REARRANGE
  ------------------------------------------------------------------------ */
  function initServicesFilters() {
    const servicesFilterBtns = document.querySelectorAll(".filters .filter-btn");
    const servicesFilterIndicator = document.querySelector(".filter-indicator");
    const servicesCards = Array.from(document.querySelectorAll(".service-card"));

    function moveIndicator(btn) {
      if (!btn || !servicesFilterIndicator) return;
      const btnBounds = btn.getBoundingClientRect();
      const parentBounds = btn.parentElement.getBoundingClientRect();
      gsap.to(servicesFilterIndicator, {
        x: btnBounds.left - parentBounds.left - 6,
        width: btnBounds.width,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    const activeBtn = document.querySelector(".filters .filter-btn.is-active");
    if (activeBtn) {
      requestAnimationFrame(() => moveIndicator(activeBtn));
      window.addEventListener("resize", () => moveIndicator(document.querySelector(".filters .filter-btn.is-active")));
    }

    servicesFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        servicesFilterBtns.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        moveIndicator(btn);

        const filter = btn.dataset.filter;
        const state = servicesCards.map((c) => ({ el: c, rect: c.getBoundingClientRect() }));

        servicesCards.forEach((card) => {
          const cats = card.dataset.category.split(" ");
          const show = filter === "all" || cats.includes(filter);
          card.style.display = show ? "" : "none";
        });

        requestAnimationFrame(() => {
          state.forEach(({ el, rect }) => {
            if (el.style.display === "none") return;
            const newRect = el.getBoundingClientRect();
            const dx = rect.left - newRect.left;
            const dy = rect.top - newRect.top;
            if (dx || dy) {
              gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
            }
          });
          gsap.fromTo(
            servicesCards.filter((c) => c.style.display !== "none"),
            { opacity: 0.4, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" }
          );
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     F. MAGNETIC CTA BUTTON
  ------------------------------------------------------------------------ */
  function initServicesMagneticButton() {
    const btn = document.getElementById("servicesViewAllBtn");
    if (!btn || reduceMotion) return;

    btn.addEventListener("pointermove", (e) => {
      const bounds = btn.getBoundingClientRect();
      const x = (e.clientX - bounds.left - bounds.width / 2) * 0.35;
      const y = (e.clientY - bounds.top - bounds.height / 2) * 0.6;
      gsap.to(btn, { x, y, duration: 0.4, ease: "power3.out" });
    });
    btn.addEventListener("pointerleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  }

  /* ------------------------------------------------------------------------
     G. AMBIENT MOUSE PARALLAX
  ------------------------------------------------------------------------ */
  function initServicesParallax() {
    if (reduceMotion) return;
    const badges = document.querySelectorAll(".services .badge--float");
    const blobs = document.querySelectorAll(".services .mesh-blob");

    servicesSection.addEventListener("pointermove", (e) => {
      const bounds = servicesSection.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width - 0.5;
      const py = (e.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(badges, { x: px * 14, y: py * 14, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      gsap.to(blobs, { x: px * -30, y: py * -20, duration: 1.4, ease: "power2.out", overwrite: "auto" });
    });
  }

  /* ------------------------------------------------------------------------
     H. LUXURY CUSTOM CURSOR
  ------------------------------------------------------------------------ */
  function initServicesCursor() {
    const servicesCursor = document.getElementById("servicesCursor");
    if (!servicesCursor || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let raf;
    let cx = 0, cy = 0, tx = 0, ty = 0;

    servicesSection.addEventListener("pointerenter", () => servicesCursor.classList.add("is-active"));
    servicesSection.addEventListener("pointerleave", () => servicesCursor.classList.remove("is-active"));
    servicesSection.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) tick();
    });

    function tick() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      servicesCursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    servicesSection.querySelectorAll(".service-card, .magnetic-btn, .filter-btn").forEach((el) => {
      el.addEventListener("pointerenter", () => servicesCursor.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => servicesCursor.classList.remove("is-hover"));
    });
  }

  // Initialize all Featured Services modules
  initServicesParticles();
  initServicesScrollReveal();
  initServicesTilt();
  initServicesClickInteraction();
  initServicesFilters();
  initServicesMagneticButton();
  initServicesParallax();
  initServicesCursor();
}

/* ==========================================================================
   4. ABOUT US MODULE — initAbout()
   ========================================================================== */
function initAbout() {
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     A. THREE.JS — GOLDEN SPARKLE & DUST PARTICLE FIELD
  ------------------------------------------------------------------------ */
  let aboutRenderer, aboutScene, aboutCamera;
  let aboutRafId = null;

  function initAboutParticles() {
    const canvas = document.getElementById("aboutCanvas");
    if (!canvas || reduceMotion || typeof THREE === "undefined") return;

    let width = aboutSection.clientWidth;
    let height = aboutSection.clientHeight;

    aboutRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    aboutRenderer.setSize(width, height);

    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    aboutCamera.position.z = 480;

    const layers = [];
    function makeLayer(count, size, color, spread, opacity) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      aboutScene.add(points);
      return points;
    }

    layers.push(makeLayer(80, 6, 0xc6a15b, 1200, 0.32));   // golden sparkles
    layers.push(makeLayer(55, 10, 0xe4c98a, 1400, 0.16));  // soft light orbs
    layers.push(makeLayer(65, 3, 0xf6efe6, 1000, 0.38));   // fine dust

    let mouseX = 0, mouseY = 0;
    aboutSection.addEventListener("mousemove", (e) => {
      const rect = aboutSection.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();
    function animateAboutParticles() {
      aboutRafId = requestAnimationFrame(animateAboutParticles);
      const t = clock.getElapsedTime();

      layers.forEach((layer, i) => {
        layer.rotation.y = t * 0.018 * (i + 1);
        layer.position.x += (mouseX * 28 - layer.position.x) * 0.02;
        layer.position.y += (-mouseY * 18 - layer.position.y) * 0.02;
      });

      aboutCamera.position.x += (mouseX * 22 - aboutCamera.position.x) * 0.03;
      aboutCamera.position.y += (-mouseY * 14 - aboutCamera.position.y) * 0.03;
      aboutCamera.lookAt(aboutScene.position);

      aboutRenderer.render(aboutScene, aboutCamera);
    }
    animateAboutParticles();

    // IntersectionObserver to pause rendering when section is off-screen
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!aboutRafId) animateAboutParticles();
        } else {
          if (aboutRafId) {
            cancelAnimationFrame(aboutRafId);
            aboutRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    aboutObserver.observe(aboutSection);

    window.addEventListener("resize", () => {
      if (!aboutCamera || !aboutRenderer) return;
      width = aboutSection.clientWidth;
      height = aboutSection.clientHeight;
      aboutCamera.aspect = width / height;
      aboutCamera.updateProjectionMatrix();
      aboutRenderer.setSize(width, height);
    });
  }

  /* ------------------------------------------------------------------------
     B. CINEMATIC SCROLL-TRIGGERED REVEAL TIMELINE
  ------------------------------------------------------------------------ */
  function initAboutScrollReveal() {
    const aboutRevealTl = gsap.timeline({
      scrollTrigger: { trigger: aboutSection, start: "top 70%", once: true },
      defaults: { ease: "power3.out" },
    });

    aboutRevealTl
      .from(".about .mesh-blob, .about .light-ray, .about .deco", { opacity: 0, duration: 1.2 })
      .from("#about [data-reveal='label']", { y: 20, opacity: 0, duration: 0.6 }, "-=0.8")
      .from("#about [data-reveal='heading']", { y: 40, opacity: 0, duration: 0.9 }, "-=0.4")
      .from("#about [data-reveal='desc']", { y: 24, opacity: 0, duration: 0.7 }, "-=0.55")
      // editorial images slide into place from distinct directions
      .to(".atelier__frame--interior", { opacity: 1, x: 0, duration: 0.9 }, "-=0.3")
      .fromTo(".atelier__frame--interior", { x: -40 }, { x: 0, duration: 0.9 }, "<")
      .to(".atelier__frame--bride", { opacity: 1, duration: 0.8 }, "-=0.6")
      .fromTo(".atelier__frame--bride", { y: 50 }, { y: 0, duration: 0.8 }, "<")
      .to(".atelier__frame--artist", { opacity: 1, duration: 0.8 }, "-=0.6")
      .fromTo(".atelier__frame--artist", { x: 40 }, { x: 0, duration: 0.8 }, "<")
      .to(".atelier__frame--hair", { opacity: 1, duration: 0.8 }, "-=0.55")
      .fromTo(".atelier__frame--hair", { y: 40 }, { y: 0, duration: 0.8 }, "<")
      .to(".atelier__frame--products", { opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(".atelier__frame--products", { scale: 0.8 }, { scale: 1, duration: 0.7 }, "<")
      // signature ribbon draws itself
      .to("#aboutRibbonPath", { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, "-=0.4")
      // floating badges
      .to(".about .badge--float", { opacity: 1, duration: 0.5, stagger: 0.12 }, "-=1.2")
      // story blocks
      .to(".story-block", { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, "-=1.1")
      // mission / vision / values cards stagger
      .to(".value-card", { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.6")
      // achievements reveal
      .to(".achievements", { opacity: 1, duration: 0.6 }, "-=0.3")
      .from(".achievement", { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 }, "<")
      // statistics block
      .to(".about .stats", { opacity: 1, duration: 0.6 }, "-=0.2")
      // timeline
      .to(".timeline-wrap", { opacity: 1, duration: 0.6 }, "-=0.2")
      .to(".milestone", { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, "-=0.3")
      .to(".timeline__progress", { width: "100%", duration: 1.2, ease: "power2.inOut" }, "-=0.6");
  }

  /* ------------------------------------------------------------------------
     C. ANIMATED STATISTIC COUNTERS FOR ABOUT US
  ------------------------------------------------------------------------ */
  function initAboutCounters() {
    const counters = document.querySelectorAll(".about .stat__num");
    if (!counters.length) return;

    ScrollTrigger.create({
      trigger: ".about .stats",
      start: "top 85%",
      once: true,
      onEnter: () => {
        counters.forEach((el) => {
          const target = parseInt(el.dataset.countTo, 10);
          const suffix = el.dataset.suffix || "";
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate() {
              el.textContent = Math.floor(obj.val).toLocaleString() + suffix;
            },
          });
        });
      },
    });
  }

  /* ------------------------------------------------------------------------
     D. IMAGE PARALLAX (ATELIER)
  ------------------------------------------------------------------------ */
  function initAtelierParallax() {
    if (reduceMotion) return;
    const atelier = document.querySelector(".atelier");
    const frames = document.querySelectorAll(".atelier__frame");
    if (!atelier) return;

    atelier.addEventListener("pointermove", (e) => {
      const bounds = atelier.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width - 0.5;
      const py = (e.clientY - bounds.top) / bounds.height - 0.5;

      frames.forEach((frame, i) => {
        const depth = (i + 1) * 6;
        gsap.to(frame, {
          x: px * depth,
          y: py * depth,
          rotateX: -py * 4,
          rotateY: px * 4,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    atelier.addEventListener("pointerleave", () => {
      gsap.to(frames, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1, ease: "power3.out" });
    });
  }

  /* ------------------------------------------------------------------------
     E. AMBIENT MOUSE PARALLAX
  ------------------------------------------------------------------------ */
  function initAboutParallax() {
    if (reduceMotion) return;
    const badges = document.querySelectorAll(".about .badge--float");
    const blobs = document.querySelectorAll(".about .mesh-blob");

    aboutSection.addEventListener("pointermove", (e) => {
      const bounds = aboutSection.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width - 0.5;
      const py = (e.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(badges, { x: px * 12, y: py * 12, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      gsap.to(blobs, { x: px * -28, y: py * -18, duration: 1.4, ease: "power2.out", overwrite: "auto" });
    });
  }

  /* ------------------------------------------------------------------------
     F. LUXURY CUSTOM CURSOR FOR ABOUT US
  ------------------------------------------------------------------------ */
  function initAboutCursor() {
    const aboutCursor = document.getElementById("aboutCursor");
    if (!aboutCursor || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let raf, cx = 0, cy = 0, tx = 0, ty = 0;

    aboutSection.addEventListener("pointerenter", () => aboutCursor.classList.add("is-active"));
    aboutSection.addEventListener("pointerleave", () => aboutCursor.classList.remove("is-active"));
    aboutSection.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) tick();
    });

    function tick() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      aboutCursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(tick);
      else raf = null;
    }

    aboutSection.querySelectorAll(".atelier__frame, .value-card, .achievement, .milestone").forEach((el) => {
      el.addEventListener("pointerenter", () => aboutCursor.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => aboutCursor.classList.remove("is-hover"));
    });
  }

  // Initialize all About Us modules
  initAboutParticles();
  initAboutScrollReveal();
  initAboutCounters();
  initAtelierParallax();
  initAboutParallax();
  initAboutCursor();
}

/* ==========================================================================
   5. WHY CHOOSE US MODULE — initWhyChoose()
   ========================================================================== */
function initWhyChoose() {
  const whySection = document.getElementById("why-choose-us");
  if (!whySection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     A. THREE.JS — AMBIENT GOLDEN DUST PARTICLE FIELD
  ------------------------------------------------------------------------ */
  let whyRenderer, whyScene, whyCamera;
  let whyRafId = null;

  function initWhyParticles() {
    const canvas = document.getElementById("whyCanvas");
    if (!canvas || reduceMotion || typeof THREE === "undefined") return;

    let width = whySection.clientWidth;
    let height = whySection.clientHeight;

    whyRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    whyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    whyRenderer.setSize(width, height);

    whyScene = new THREE.Scene();
    whyCamera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
    whyCamera.position.z = 60;

    const PARTICLE_COUNT = 160;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      speeds[i] = 0.02 + Math.random() * 0.05;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc6a467,
      size: 0.55,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    whyScene.add(points);

    let mouseX = 0, mouseY = 0;
    whySection.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animateWhyParticles() {
      whyRafId = requestAnimationFrame(animateWhyParticles);

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posAttr.array[i * 3 + 1] += speeds[i];
        if (posAttr.array[i * 3 + 1] > 45) posAttr.array[i * 3 + 1] = -45;
      }
      posAttr.needsUpdate = true;

      whyCamera.position.x += (mouseX * 6 - whyCamera.position.x) * 0.02;
      whyCamera.position.y += (-mouseY * 4 - whyCamera.position.y) * 0.02;
      whyCamera.lookAt(whyScene.position);

      whyRenderer.render(whyScene, whyCamera);
    }
    animateWhyParticles();

    // IntersectionObserver to pause rendering when section is off-screen
    const whyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!whyRafId) animateWhyParticles();
        } else {
          if (whyRafId) {
            cancelAnimationFrame(whyRafId);
            whyRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    whyObserver.observe(whySection);

    window.addEventListener("resize", () => {
      if (!whyCamera || !whyRenderer) return;
      width = whySection.clientWidth;
      height = whySection.clientHeight;
      whyCamera.aspect = width / height;
      whyCamera.updateProjectionMatrix();
      whyRenderer.setSize(width, height);
    });
  }

  /* ------------------------------------------------------------------------
     B. GSAP — SCROLL-ORCHESTRATED REVEAL TIMELINE
  ------------------------------------------------------------------------ */
  function initWhyScrollTimeline() {
    if (typeof gsap === "undefined") return;

    if (reduceMotion) {
      gsap.set("#why-choose-us [data-reveal]", { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const whyTl = gsap.timeline({
      scrollTrigger: {
        trigger: whySection,
        start: "top 78%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    whyTl
      .from("#why-choose-us .mesh-glow--one, #why-choose-us .mesh-glow--two, #why-choose-us .mesh-glow--three", {
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
      }, 0)
      .from('#why-choose-us [data-reveal="eyebrow"]', {
        opacity: 0,
        y: 16,
        duration: 0.7,
      }, 0.1)
      .from("#why-choose-us .heading-line", {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.12,
      }, 0.25)
      .from('#why-choose-us [data-reveal="desc"]', {
        opacity: 0,
        y: 18,
        duration: 0.8,
      }, 0.55)
      .from('#why-choose-us [data-reveal="portrait"]', {
        opacity: 0,
        x: -50,
        duration: 1.1,
      }, 0.7)
      .from('#why-choose-us [data-reveal="card"]', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.8,
        stagger: 0.09,
      }, 0.9)
      .from('#why-choose-us [data-reveal="stats"]', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        onStart: initWhyCounters,
      }, 1.3)
      .from('#why-choose-us [data-reveal="cta"]', {
        opacity: 0,
        y: 24,
        duration: 0.8,
      }, 1.5);

    // Continuous floating motion for cards
    gsap.to("#why-choose-us .feature-card", {
      y: "-=6",
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.35, from: "random" },
      delay: 1.6,
    });

    // Ambient orb drift
    gsap.to("#why-choose-us .mesh-glow--one", { x: 30, y: 20, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to("#why-choose-us .mesh-glow--two", { x: -25, y: -15, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to("#why-choose-us .mesh-glow--three", { x: 15, y: -20, duration: 12, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  /* ------------------------------------------------------------------------
     C. ANIMATED STAT COUNTERS
  ------------------------------------------------------------------------ */
  let whyCountersStarted = false;
  function initWhyCounters() {
    if (whyCountersStarted) return;
    whyCountersStarted = true;

    whySection.querySelectorAll(".stat").forEach((stat) => {
      const target = parseInt(stat.dataset.count, 10) || 0;
      const suffix = stat.dataset.suffix || "";
      const numberEl = stat.querySelector("[data-number]");
      if (!numberEl) return;

      if (reduceMotion) {
        numberEl.textContent = target + suffix;
        return;
      }

      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          numberEl.textContent = Math.round(counter.val).toLocaleString() + suffix;
        },
      });
    });
  }

  /* ------------------------------------------------------------------------
     D. MOUSE-REACTIVE PARALLAX
  ------------------------------------------------------------------------ */
  function initWhyMouseParallax() {
    if (reduceMotion || typeof gsap === "undefined") return;

    const portrait = whySection.querySelector(".showcase-portrait");
    const cards = whySection.querySelectorAll(".feature-card");

    whySection.addEventListener("mousemove", (e) => {
      const rect = whySection.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (portrait) {
        gsap.to(portrait, {
          rotateY: relX * 6,
          rotateX: -relY * 6,
          transformPerspective: 900,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      cards.forEach((card, i) => {
        const depth = 6 + (i % 3) * 2;
        gsap.to(card, {
          x: relX * depth,
          y: relY * depth,
          duration: 0.7,
          ease: "power2.out",
        });
      });

      gsap.to("#why-choose-us .mesh-glow--three", {
        x: relX * 40,
        y: relY * 40,
        duration: 1,
        ease: "power2.out",
      });
    }, { passive: true });

    whySection.addEventListener("mouseleave", () => {
      if (portrait) gsap.to(portrait, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
      cards.forEach((card) => gsap.to(card, { x: 0, y: 0, duration: 0.8, ease: "power3.out" }));
    });
  }

  /* ------------------------------------------------------------------------
     E. MAGNETIC CTA BUTTON + RIPPLE
  ------------------------------------------------------------------------ */
  function initWhyCTA() {
    const button = document.getElementById("whyCtaButton");
    if (!button) return;

    if (!reduceMotion && typeof gsap !== "undefined") {
      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(button, { x: x * 0.25, y: y * 0.4, duration: 0.4, ease: "power2.out" });
      });
      button.addEventListener("mouseleave", () => {
        gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      });
    }

    button.addEventListener("click", (e) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  }

  // Initialize all Why Choose Us modules
  initWhyParticles();
  initWhyScrollTimeline();
  initWhyMouseParallax();
  initWhyCTA();
}

/* ==========================================================================
   6. BRIDAL EXPERIENCE MODULE — initBridalExperience()
   ========================================================================== */
function initBridalExperience() {
  const bridalSection = document.getElementById("bridal-experience");
  if (!bridalSection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     A. SPLIT EDITORIAL HEADING INTO WORD SPANS
  ------------------------------------------------------------------------ */
  function splitBridalHeading() {
    const heading = bridalSection.querySelector("[data-split-heading]");
    if (!heading) return;
    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map((w) => `<span class="word">${w}</span>`)
      .join(" ");
  }

  /* ------------------------------------------------------------------------
     B. THREE.JS — GOLDEN DUST + ROSE PETALS + SOFT SPARKLES CANVAS FIELD
  ------------------------------------------------------------------------ */
  let bridalRenderer, bridalScene, bridalCamera;
  let bridalRafId = null;

  function initBridalParticles() {
    const canvas = document.getElementById("bridalCanvas");
    if (!canvas || reduceMotion || typeof THREE === "undefined") return;

    let width = bridalSection.clientWidth;
    let height = bridalSection.clientHeight;

    bridalRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    bridalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    bridalRenderer.setSize(width, height);

    bridalScene = new THREE.Scene();
    bridalCamera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
    bridalCamera.position.z = 60;

    // Layer A: Golden dust
    const DUST_COUNT = 140;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustSpeeds = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 150;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 95;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 70 - 20;
      dustSpeeds[i] = 0.015 + Math.random() * 0.035;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc6a467,
      size: 0.5,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    bridalScene.add(dust);

    // Layer B: Soft sparkles
    const SPARK_COUNT = 60;
    const sparkPositions = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 120;
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xecd6a2,
      size: 0.9,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    bridalScene.add(sparks);

    // Layer C: Rose petals
    function makePetalTexture() {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d");
      ctx.translate(32, 32);
      ctx.rotate(Math.PI / 4);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      grad.addColorStop(0, "rgba(181,73,91,0.95)");
      grad.addColorStop(1, "rgba(181,73,91,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    const petalTexture = makePetalTexture();
    const PETAL_COUNT = 22;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(PETAL_COUNT * 3);
    const petalSpeeds = new Float32Array(PETAL_COUNT);
    const petalSway = new Float32Array(PETAL_COUNT);

    for (let i = 0; i < PETAL_COUNT; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 130;
      petalPositions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 + 10;
      petalSpeeds[i] = 0.03 + Math.random() * 0.05;
      petalSway[i] = Math.random() * Math.PI * 2;
    }
    petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPositions, 3));
    const petalMat = new THREE.PointsMaterial({
      map: petalTexture,
      size: 3.2,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const petals = new THREE.Points(petalGeo, petalMat);
    bridalScene.add(petals);

    let mouseX = 0, mouseY = 0;
    bridalSection.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    let t = 0;
    function animateBridalParticles() {
      bridalRafId = requestAnimationFrame(animateBridalParticles);
      t += 0.01;

      const dPos = dustGeo.attributes.position;
      for (let i = 0; i < DUST_COUNT; i++) {
        dPos.array[i * 3 + 1] += dustSpeeds[i];
        if (dPos.array[i * 3 + 1] > 48) dPos.array[i * 3 + 1] = -48;
      }
      dPos.needsUpdate = true;

      sparkMat.opacity = 0.45 + Math.sin(t * 2) * 0.25;

      const pPos = petalGeo.attributes.position;
      for (let i = 0; i < PETAL_COUNT; i++) {
        pPos.array[i * 3 + 1] -= petalSpeeds[i];
        pPos.array[i * 3] += Math.sin(t + petalSway[i]) * 0.03;
        if (pPos.array[i * 3 + 1] < -46) pPos.array[i * 3 + 1] = 46;
      }
      pPos.needsUpdate = true;
      petals.rotation.z += 0.0008;

      bridalCamera.position.x += (mouseX * 6 - bridalCamera.position.x) * 0.02;
      bridalCamera.position.y += (-mouseY * 4 - bridalCamera.position.y) * 0.02;
      bridalCamera.lookAt(bridalScene.position);

      bridalRenderer.render(bridalScene, bridalCamera);
    }
    animateBridalParticles();

    // IntersectionObserver to pause rendering when section is off-screen
    const bridalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!bridalRafId) animateBridalParticles();
        } else {
          if (bridalRafId) {
            cancelAnimationFrame(bridalRafId);
            bridalRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    bridalObserver.observe(bridalSection);

    window.addEventListener("resize", () => {
      if (!bridalCamera || !bridalRenderer) return;
      width = bridalSection.clientWidth;
      height = bridalSection.clientHeight;
      bridalCamera.aspect = width / height;
      bridalCamera.updateProjectionMatrix();
      bridalRenderer.setSize(width, height);
    });
  }

  /* ------------------------------------------------------------------------
     C. FALLING CSS ROSE PETALS LAYER
  ------------------------------------------------------------------------ */
  function initBridalCSSPetals() {
    if (reduceMotion || typeof gsap === "undefined") return;
    const count = window.innerWidth < 700 ? 5 : 10;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "rose-petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.transform = `rotate(${Math.random() * 360}deg)`;
      bridalSection.appendChild(petal);

      gsap.to(petal, {
        y: bridalSection.offsetHeight + 200,
        x: `+=${(Math.random() - 0.5) * 160}`,
        rotation: `+=${Math.random() * 360}`,
        duration: 14 + Math.random() * 10,
        repeat: -1,
        delay: -Math.random() * 20,
        ease: "none",
      });
    }
  }

  /* ------------------------------------------------------------------------
     D. GSAP — CINEMATIC SCROLL-TRIGGERED TIMELINE
  ------------------------------------------------------------------------ */
  function initBridalScrollTimeline() {
    if (typeof gsap === "undefined") return;

    if (reduceMotion) {
      gsap.set("#bridal-experience [data-reveal], #bridal-experience .word", { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const openTl = gsap.timeline({
      scrollTrigger: { trigger: bridalSection, start: "top 80%", once: true },
      defaults: { ease: "power3.out" },
    });

    openTl
      .from("#bridal-experience .mesh-glow--one, #bridal-experience .mesh-glow--two, #bridal-experience .mesh-glow--three", {
        opacity: 0, duration: 1.4, stagger: 0.15,
      }, 0)
      .from('#bridal-experience [data-reveal="eyebrow"]', { opacity: 0, y: 16, duration: 0.7 }, 0.1)
      .from("#bridalHeading .word", {
        opacity: 0,
        y: 30,
        rotateX: -40,
        duration: 0.8,
        stagger: 0.045,
        transformOrigin: "50% 100%",
      }, 0.25)
      .from('#bridal-experience [data-reveal="desc"]', { opacity: 0, y: 18, duration: 0.8 }, 0.75)
      .from("#bridal-experience .stage-hero", { opacity: 0, scale: 0.94, y: 30, duration: 1 }, 0.95);

    const floats = gsap.utils.toArray("#bridal-experience .stage-float");
    floats.sort((a, b) => (+a.dataset.depth || 0) - (+b.dataset.depth || 0));
    openTl.from(floats, {
      opacity: 0,
      y: 40,
      scale: 0.85,
      duration: 0.7,
      stagger: 0.12,
    }, 1.15);

    openTl.from("#bridal-experience .stage-story", { opacity: 0, y: 20, duration: 0.8 }, 1.7);

    // Timeline steps reveal
    gsap.from('#bridal-experience [data-reveal="journey-heading"]', {
      scrollTrigger: { trigger: "#bridal-experience .journey-intro", start: "top 85%" },
      opacity: 0, y: 20, duration: 0.7, stagger: 0.1,
    });

    gsap.utils.toArray('#bridal-experience [data-reveal="journey-step"]').forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: "top 88%" },
        opacity: 0,
        y: 36,
        duration: 0.7,
        delay: i * 0.05,
        ease: "power3.out",
      });
    });

    // Feature cards stagger in
    gsap.from('#bridal-experience [data-reveal="features-heading"]', {
      scrollTrigger: { trigger: "#bridal-experience .features", start: "top 85%" },
      opacity: 0, y: 20, duration: 0.7,
    });
    gsap.from('#bridal-experience [data-reveal="feature-card"]', {
      scrollTrigger: { trigger: "#bridal-experience .features .feature-grid", start: "top 88%" },
      opacity: 0,
      y: 40,
      scale: 0.94,
      duration: 0.7,
      stagger: 0.08,
    });

    // Package cards scale upward
    gsap.from('#bridal-experience [data-reveal="packages-heading"]', {
      scrollTrigger: { trigger: "#bridal-experience .packages", start: "top 85%" },
      opacity: 0, y: 20, duration: 0.7,
    });
    gsap.from('#bridal-experience [data-reveal="package-card"]', {
      scrollTrigger: { trigger: "#bridal-experience .package-grid", start: "top 85%" },
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.4)",
    });

    // CTA appears
    gsap.from('#bridal-experience [data-reveal="cta-heading"]', {
      scrollTrigger: { trigger: "#bridal-experience .bridal-cta", start: "top 88%" },
      opacity: 0, y: 22, duration: 0.7,
    });
    gsap.from('#bridal-experience [data-reveal="cta-buttons"]', {
      scrollTrigger: { trigger: "#bridal-experience .bridal-cta", start: "top 85%" },
      opacity: 0, y: 20, duration: 0.7, delay: 0.1,
    });

    // Continuous floating motion
    gsap.to("#bridal-experience .stage-float", {
      y: "-=10",
      duration: 3.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.4, from: "random" },
      delay: 2,
    });
    gsap.to("#bridal-experience .feature-card", {
      y: "-=5",
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.3, from: "random" },
      delay: 2.4,
    });
    gsap.to("#bridal-experience .mesh-glow--one", { x: 30, y: 20, duration: 15, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to("#bridal-experience .mesh-glow--two", { x: -25, y: -15, duration: 17, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to("#bridal-experience .mesh-glow--three", { x: 15, y: -20, duration: 13, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to("#bridal-experience .deco-ring", { rotation: 360, duration: 40, ease: "none", repeat: -1 });
  }

  /* ------------------------------------------------------------------------
     E. MOUSE-REACTIVE PARALLAX
  ------------------------------------------------------------------------ */
  function initBridalMouseParallax() {
    if (reduceMotion || typeof gsap === "undefined") return;

    const floats = bridalSection.querySelectorAll(".stage-float");
    const hero = bridalSection.querySelector(".stage-hero");
    const cards = bridalSection.querySelectorAll(".feature-card, .package-card");
    const decos = bridalSection.querySelectorAll(".deco-diamond, .deco-ring");

    bridalSection.addEventListener("mousemove", (e) => {
      const rect = bridalSection.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (hero) {
        gsap.to(hero, { x: relX * 10, y: relY * 8, duration: 0.8, ease: "power2.out" });
      }

      floats.forEach((float) => {
        const depth = (+float.dataset.depth || 12);
        gsap.to(float, { x: relX * depth, y: relY * depth, duration: 0.7, ease: "power2.out" });
      });

      cards.forEach((card, i) => {
        const depth = 4 + (i % 3) * 2;
        gsap.to(card, { x: relX * depth, y: relY * depth, duration: 0.7, ease: "power2.out" });
      });

      decos.forEach((deco, i) => {
        gsap.to(deco, { x: relX * (14 + i * 4), y: relY * (14 + i * 4), duration: 0.9, ease: "power2.out" });
      });

      gsap.to("#bridal-experience .mesh-glow--three", { x: relX * 40, y: relY * 40, duration: 1, ease: "power2.out" });
    }, { passive: true });

    bridalSection.addEventListener("mouseleave", () => {
      if (hero) gsap.to(hero, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
      floats.forEach((float) => gsap.to(float, { x: 0, y: 0, duration: 0.9, ease: "power3.out" }));
      cards.forEach((card) => gsap.to(card, { x: 0, y: 0, duration: 0.9, ease: "power3.out" }));
    });
  }

  /* ------------------------------------------------------------------------
     F. MAGNETIC CTAs & SCROLL NAVIGATION
  ------------------------------------------------------------------------ */
  function initBridalCTAs() {
    const buttons = bridalSection.querySelectorAll(".cta-btn, .package-card__cta");

    buttons.forEach((button) => {
      if (!reduceMotion && typeof gsap !== "undefined" && button.classList.contains("cta-btn")) {
        button.addEventListener("mousemove", (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(button, { x: x * 0.25, y: y * 0.4, duration: 0.4, ease: "power2.out" });
        });
        button.addEventListener("mouseleave", () => {
          gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        });
      }

      button.addEventListener("click", (e) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        const size = Math.max(rect.width, rect.height) * 1.6;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        button.style.position = button.style.position || "relative";
        button.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
      });
    });

    const exploreBtn = document.getElementById("bridalCtaExplore");
    const packagesEl = bridalSection.querySelector(".packages");
    if (exploreBtn && packagesEl) {
      exploreBtn.addEventListener("click", () => {
        packagesEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    }
  }

  // Initialize all Bridal Experience modules
  splitBridalHeading();
  initBridalParticles();
  initBridalCSSPetals();
  initBridalScrollTimeline();
  initBridalMouseParallax();
  initBridalCTAs();
}

/* ==========================================================================
   7. SERVICE CATEGORIES MODULE — initServiceCategories()
   ========================================================================== */
function initServiceCategories() {
  const catSection = document.getElementById("service-categories");
  if (!catSection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     A. TEXT SPLIT FOR HEADING
  ------------------------------------------------------------------------ */
  function splitCatHeading() {
    catSection.querySelectorAll(".services__heading .line").forEach((line) => {
      const words = line.textContent.trim().split(" ");
      line.innerHTML = words
        .map((w) => `<span class="word"><span class="word-inner">${w}</span></span>`)
        .join(" ");
      line.querySelectorAll(".word").forEach((w) => {
        w.style.display = "inline-block";
        w.style.overflow = "hidden";
      });
      line.querySelectorAll(".word-inner").forEach((wi) => {
        wi.style.display = "inline-block";
        wi.style.transform = "translateY(110%)";
      });
    });
  }
  splitCatHeading();

  /* ------------------------------------------------------------------------
     B. CINEMATIC SCROLL TIMELINE
  ------------------------------------------------------------------------ */
  function initCatScrollTimeline() {
    if (typeof gsap === "undefined") return;

    if (reduceMotion) {
      gsap.set(catSection.querySelectorAll(".word-inner, [data-anim]"), { opacity: 1, y: "0%", scale: 1 });
      return;
    }

    const catTl = gsap.timeline({
      scrollTrigger: {
        trigger: catSection,
        start: "top 75%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    catTl
      .from(catSection.querySelector(".mesh-gradient"), { opacity: 0, duration: 1.2 })
      .from(catSection.querySelector(".eyebrow"), { opacity: 0, y: 18, duration: 0.7 }, "-=0.6")
      .to(catSection.querySelectorAll(".services__heading .word-inner"), {
        y: "0%",
        duration: 0.9,
        stagger: 0.045,
      }, "-=0.35")
      .from(catSection.querySelector(".services__desc"), { opacity: 0, y: 24, duration: 0.8 }, "-=0.55")
      .from(catSection.querySelectorAll(".filter-pill"), {
        opacity: 0, y: 16, duration: 0.5, stagger: 0.06,
      }, "-=0.45")
      .from(catSection.querySelectorAll(".feature-card"), {
        opacity: 0, y: 50, scale: 0.96, duration: 0.9, stagger: 0.14,
      }, "-=0.25")
      .from(catSection.querySelectorAll(".s-card"), {
        opacity: 0, y: 36, duration: 0.7, stagger: 0.05,
      }, "-=0.5")
      .from(catSection.querySelector(".services-cta"), {
        opacity: 0, y: 30, duration: 0.8,
      }, "-=0.2");

    // Gentle float once revealed
    gsap.to(catSection.querySelectorAll(".s-card"), {
      y: (i) => (i % 2 === 0 ? -8 : 8),
      duration: (i) => 3.4 + (i % 3) * 0.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.15, from: "random" },
    });
  }

  /* ------------------------------------------------------------------------
     C. CURSOR-FOLLOW SPOTLIGHT GLOW
  ------------------------------------------------------------------------ */
  function initCatCursorGlow() {
    const cursorGlow = document.getElementById("categoriesCursorGlow");
    if (!cursorGlow || reduceMotion || typeof gsap === "undefined") return;

    let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
    catSection.addEventListener("mouseenter", () => gsap.to(cursorGlow, { opacity: 1, duration: 0.4 }));
    catSection.addEventListener("mouseleave", () => gsap.to(cursorGlow, { opacity: 0, duration: 0.4 }));
    catSection.addEventListener("mousemove", (e) => {
      const rect = catSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    }, { passive: true });

    gsap.ticker.add(() => {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      cursorGlow.style.transform = `translate(${glowX - 210}px, ${glowY - 210}px)`;
    });
  }

  /* ------------------------------------------------------------------------
     D. 3D TILT + LIGHT-FOLLOWS-CURSOR ON CARDS
  ------------------------------------------------------------------------ */
  function initCatCardTilt() {
    if (reduceMotion || typeof gsap === "undefined") return;
    const maxTilt = 7;

    catSection.querySelectorAll(".feature-card, .s-card__inner").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: px * maxTilt * 2,
          rotateX: -py * maxTilt * 2,
          y: -10,
          scale: 1.02,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.6)" });
      });
    });
  }

  /* ------------------------------------------------------------------------
     E. LUXURY RIPPLE ON CLICK
  ------------------------------------------------------------------------ */
  function initCatRipple() {
    catSection.querySelectorAll(".feature-card, .s-card__inner").forEach((card) => {
      card.addEventListener("click", (e) => {
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height) * 1.4;
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        card.appendChild(ripple);

        if (typeof gsap !== "undefined" && !reduceMotion) {
          gsap.fromTo(card, { scale: 1 }, { scale: 0.985, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" });
        }

        ripple.addEventListener("animationend", () => ripple.remove());
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") card.click();
      });
    });
  }

  /* ------------------------------------------------------------------------
     F. CATEGORY FILTERING
  ------------------------------------------------------------------------ */
  function initCatFiltering() {
    const filterButtons = catSection.querySelectorAll(".filter-pill");
    const allCards = catSection.querySelectorAll(".feature-card, .s-card");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");

        const filter = btn.dataset.filter;

        allCards.forEach((card) => {
          const matches = filter === "all" || card.dataset.category === filter;
          if (matches) {
            card.classList.remove("is-hidden");
            if (typeof gsap !== "undefined" && !reduceMotion) {
              gsap.fromTo(card, { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
            }
          } else {
            if (typeof gsap !== "undefined" && !reduceMotion) {
              gsap.to(card, {
                opacity: 0, y: 10, scale: 0.96, duration: 0.3, ease: "power1.in",
                onComplete: () => card.classList.add("is-hidden"),
              });
            } else {
              card.classList.add("is-hidden");
            }
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     G. MAGNETIC CTA BUTTON
  ------------------------------------------------------------------------ */
  function initCatMagneticBtn() {
    const magneticBtn = document.getElementById("categoriesViewAllBtn");
    if (magneticBtn && !reduceMotion && typeof gsap !== "undefined") {
      magneticBtn.addEventListener("mousemove", (e) => {
        const rect = magneticBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(magneticBtn, { x: x * 0.35, y: y * 0.5, duration: 0.4, ease: "power2.out" });
      });
      magneticBtn.addEventListener("mouseleave", () => {
        gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      });
    }
  }

  /* ------------------------------------------------------------------------
     H. THREE.JS — LUXURY GOLDEN DUST PARTICLE FIELD
  ------------------------------------------------------------------------ */
  let catRenderer, catScene, catCamera;
  let catRafId = null;

  function initCatParticles() {
    const canvas = document.getElementById("categoriesParticleCanvas");
    if (!canvas || typeof THREE === "undefined" || reduceMotion) return;

    let width = catSection.clientWidth;
    let height = catSection.clientHeight;

    catRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    catRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    catRenderer.setSize(width, height);

    catScene = new THREE.Scene();
    catCamera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    catCamera.position.z = 60;

    const layers = [];
    const layerConfig = [
      { count: 90, spread: 140, size: 0.55, color: 0xcba135, speed: 0.15 },
      { count: 60, spread: 100, size: 0.9,  color: 0xd9a798, speed: 0.25 },
      { count: 40, spread: 70,  size: 1.4,  color: 0xf6f1e8, speed: 0.35 },
    ];

    layerConfig.forEach((cfg) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(cfg.count * 3);
      const basePositions = new Float32Array(cfg.count * 3);

      for (let i = 0; i < cfg.count; i++) {
        const x = (Math.random() - 0.5) * cfg.spread;
        const y = (Math.random() - 0.5) * cfg.spread * 0.8;
        const z = (Math.random() - 0.5) * 40;
        positions.set([x, y, z], i * 3);
        basePositions.set([x, y, z], i * 3);
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: cfg.color,
        size: cfg.size,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      catScene.add(points);
      layers.push({ points, base: basePositions, speed: cfg.speed, geometry });
    });

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    catSection.addEventListener("mousemove", (e) => {
      const rect = catSection.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }, { passive: true });

    const clock = new THREE.Clock();

    function animateCatParticles() {
      catRafId = requestAnimationFrame(animateCatParticles);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      layers.forEach((layer, li) => {
        const posAttr = layer.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const bx = layer.base[i * 3];
          const by = layer.base[i * 3 + 1];
          const bz = layer.base[i * 3 + 2];

          const driftX = Math.sin(t * layer.speed + i) * 1.2;
          const driftY = Math.cos(t * layer.speed * 0.8 + i) * 1.2;

          const dx = bx - mouse.x * 40;
          const dy = by - mouse.y * 30;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repel = Math.max(0, 18 - dist) * 0.6;
          const repelX = dist > 0 ? (dx / dist) * repel : 0;
          const repelY = dist > 0 ? (dy / dist) * repel : 0;

          posAttr.array[i * 3]     = bx + driftX + repelX;
          posAttr.array[i * 3 + 1] = by + driftY + repelY;
          posAttr.array[i * 3 + 2] = bz;
        }
        posAttr.needsUpdate = true;
        layer.points.rotation.z = t * 0.01 * (li + 1);
      });

      catRenderer.render(catScene, catCamera);
    }
    animateCatParticles();

    // IntersectionObserver to pause rendering when section is off-screen
    const catObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!catRafId) animateCatParticles();
        } else {
          if (catRafId) {
            cancelAnimationFrame(catRafId);
            catRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    catObserver.observe(catSection);

    window.addEventListener("resize", () => {
      if (!catCamera || !catRenderer) return;
      width = catSection.clientWidth;
      height = catSection.clientHeight;
      catCamera.aspect = width / height;
      catCamera.updateProjectionMatrix();
      catRenderer.setSize(width, height);
    });
  }

  // Initialize all Service Categories sub-modules
  initCatScrollTimeline();
  initCatCursorGlow();
  initCatCardTilt();
  initCatRipple();
  initCatFiltering();
  initCatMagneticBtn();
  initCatParticles();
}

/* ==========================================================================
   8. MEET OUR ARTISTS MODULE — initMeetArtists()
   ========================================================================== */
function initMeetArtists() {
  const section = document.getElementById("artists");
  if (!section) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     A. HEADER TEXT REVEAL (independent, staggered)
  ------------------------------------------------------------------------ */
  if (typeof gsap !== "undefined") {
    gsap.set(".artists__header [data-reveal]", { opacity: 0, y: 28 });
    gsap.to(".artists__header [data-reveal]", {
      scrollTrigger: {
        trigger: ".artists__header",
        start: "top 80%",
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.14,
    });
  }

  /* ------------------------------------------------------------------------
     B. THREE.JS AMBIENT PARTICLE SCENE
     Floating gold glitter / cosmetic dust with mouse + scroll depth
  ------------------------------------------------------------------------ */
  let artistsRenderer, artistsScene, artistsCamera;
  let artistsRafId = null;

  function initArtistsThree() {
    const canvas = document.getElementById("artistsCanvas");
    if (!canvas || typeof THREE === "undefined") return;

    artistsRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    artistsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    artistsScene = new THREE.Scene();
    artistsCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    artistsCamera.position.z = 12;

    const PARTICLE_COUNT = window.innerWidth < 700 ? 90 : 220;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      speeds[i] = 0.1 + Math.random() * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // soft round golden sprite drawn on a canvas (no external texture files)
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64; spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(230,200,150,0.9)");
    grad.addColorStop(0.5, "rgba(198,161,91,0.35)");
    grad.addColorStop(1, "rgba(198,161,91,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.22,
      map: sprite,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    });

    const points = new THREE.Points(geometry, material);
    artistsScene.add(points);

    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let scrollDepth = 0;

    section.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => { scrollDepth = self.progress; },
      });
    }

    function resizeArtistsThree() {
      if (!artistsCamera || !artistsRenderer) return;
      const w = section.clientWidth || window.innerWidth;
      const h = window.innerHeight;
      artistsRenderer.setSize(w, h, false);
      artistsCamera.aspect = w / h;
      artistsCamera.updateProjectionMatrix();
    }
    resizeArtistsThree();
    window.addEventListener("resize", resizeArtistsThree);

    const clock = new THREE.Clock();

    function animateArtistsParticles() {
      artistsRafId = requestAnimationFrame(animateArtistsParticles);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posAttr.array[i * 3 + 1] += speeds[i] * dt * 0.4;
        if (posAttr.array[i * 3 + 1] > 8) posAttr.array[i * 3 + 1] = -8;
      }
      posAttr.needsUpdate = true;

      targetRotX += ((-mouseY * 0.25) - targetRotX) * 0.04;
      targetRotY += ((mouseX * 0.35) - targetRotY) * 0.04;
      points.rotation.x = targetRotX;
      points.rotation.y = targetRotY + elapsed * 0.02;

      artistsCamera.position.z = 12 - scrollDepth * 3;

      artistsRenderer.render(artistsScene, artistsCamera);
    }

    if (!prefersReducedMotion) {
      animateArtistsParticles();
    } else {
      artistsRenderer.render(artistsScene, artistsCamera);
    }

    // IntersectionObserver to pause rendering when off-screen
    const artistsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!artistsRafId && !prefersReducedMotion) animateArtistsParticles();
        } else {
          if (artistsRafId) {
            cancelAnimationFrame(artistsRafId);
            artistsRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    artistsObserver.observe(section);
  }
  initArtistsThree();

  /* ------------------------------------------------------------------------
     C. SPOTLIGHT CURSOR — follows mouse across the whole section
  ------------------------------------------------------------------------ */
  const spotlight = document.getElementById("artistsSpotlight");
  if (spotlight && !prefersReducedMotion && window.matchMedia("(hover:hover)").matches && typeof gsap !== "undefined") {
    section.addEventListener("mousemove", (e) => {
      gsap.to(spotlight, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
    });
  }

  /* ------------------------------------------------------------------------
     D. PINNED HORIZONTAL SCROLLTRIGGER STORY
  ------------------------------------------------------------------------ */
  const track = document.getElementById("artistsTrack");
  const pinWrap = document.getElementById("artistsPinWrap");
  const artistsList = typeof gsap !== "undefined" ? gsap.utils.toArray("#artists .artist") : Array.from(section.querySelectorAll(".artist"));
  const railItems = typeof gsap !== "undefined" ? gsap.utils.toArray("#artists .rail__item") : Array.from(section.querySelectorAll(".rail__item"));
  const railFill = document.getElementById("artistsRailFill");

  let horizontalST = null;

  function animateCount(el) {
    if (typeof gsap === "undefined" || prefersReducedMotion) {
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.hasAttribute("data-decimal");
      el.textContent = isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString();
      return;
    }
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.hasAttribute("data-decimal");
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString();
      },
    });
  }

  let activeIndex = -1;
  function setActiveArtist(idx) {
    if (idx === activeIndex) return;
    activeIndex = idx;

    railItems.forEach((item, i) => item.classList.toggle("is-active", i === idx));

    artistsList.forEach((artistEl, i) => {
      const bio = artistEl.querySelector("[data-clip]");
      const stats = artistEl.querySelectorAll("[data-stats] strong");
      const portrait = artistEl.querySelector(".artist__portrait");
      const shine = artistEl.querySelector(".artist__shine");

      if (i === idx) {
        if (typeof gsap !== "undefined" && !prefersReducedMotion) {
          gsap.to(bio, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power3.out" });
          gsap.fromTo(portrait, { scale: 1.08 }, { scale: 1, duration: 1.1, ease: "power3.out" });
          if (shine) {
            gsap.fromTo(shine, { xPercent: -120 }, { xPercent: 220, duration: 1.1, ease: "power2.out" });
          }
        } else {
          if (bio) bio.style.clipPath = "none";
        }
        stats.forEach((el) => animateCount(el));
      } else {
        if (typeof gsap !== "undefined" && !prefersReducedMotion) {
          gsap.to(bio, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power2.in" });
        }
      }
    });
  }

  function buildHorizontalScroll() {
    if (horizontalST) { horizontalST.kill(); horizontalST = null; }
    if (window.innerWidth <= 900 || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.set(track, { x: 0 });

    const totalScroll = () => track.scrollWidth - pinWrap.querySelector(".artists__viewport").clientWidth;

    horizontalST = gsap.to(track, {
      x: () => -totalScroll(),
      ease: "none",
      scrollTrigger: {
        id: "artistsHorizontal",
        trigger: pinWrap,
        start: "top top",
        end: () => `+=${totalScroll() * 1.15}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            artistsList.length - 1,
            Math.floor(self.progress * artistsList.length)
          );
          setActiveArtist(idx);
          if (railFill) railFill.style.width = `${((idx + 1) / artistsList.length) * 100}%`;
        },
      },
    });
  }

  buildHorizontalScroll();
  setActiveArtist(0);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildHorizontalScroll();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }, 250);
  });

  /* ------------------------------------------------------------------------
     E. PROFILE 3D TILT + IMAGE PARALLAX + LUXURY CURSOR LIGHT
  ------------------------------------------------------------------------ */
  if (window.matchMedia("(hover:hover)").matches && !prefersReducedMotion && typeof gsap !== "undefined") {
    section.querySelectorAll("[data-tilt]").forEach((card) => {
      const portrait = card.querySelector("[data-parallax]");
      const shine = card.querySelector(".artist__shine");

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: px * 14,
          rotateX: -py * 14,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 900,
        });
        if (portrait) {
          gsap.to(portrait, { x: -px * 22, y: -py * 22, duration: 0.6, ease: "power2.out" });
        }
        if (shine) {
          gsap.to(shine, { xPercent: px * 160, yPercent: py * 60, duration: 0.4 });
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
        if (portrait) gsap.to(portrait, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
      });
    });
  }

  /* ------------------------------------------------------------------------
     F. MAGNETIC LUXURY CTA BUTTONS
  ------------------------------------------------------------------------ */
  if (window.matchMedia("(hover:hover)").matches && !prefersReducedMotion && typeof gsap !== "undefined") {
    section.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ------------------------------------------------------------------------
     G. BOOK BUTTON RIPPLE
  ------------------------------------------------------------------------ */
  section.querySelectorAll(".btn-book, .btn-glass").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      ripple.style.position = "absolute";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      ripple.style.width = ripple.style.height = "8px";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(230,200,150,0.55)";
      ripple.style.transform = "translate(-50%,-50%) scale(0)";
      ripple.style.pointerEvents = "none";
      btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);

      if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.to(ripple, {
          scale: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        });
      } else {
        ripple.remove();
      }
    });
  });

  /* ------------------------------------------------------------------------
     H. KEYBOARD NAVIGATION FOR RAIL (a11y)
  ------------------------------------------------------------------------ */
  railItems.forEach((item, i) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (typeof ScrollTrigger !== "undefined") {
          const st = ScrollTrigger.getById("artistsHorizontal");
          if (st) {
            const progress = i / artistsList.length + 0.02;
            const y = st.start + (st.end - st.start) * progress;
            window.scrollTo({ top: y, behavior: "smooth" });
          } else if (artistsList[i]) {
            artistsList[i].scrollIntoView({ behavior: "smooth", inline: "center" });
          }
        }
      }
    });
  });
}

/* ==========================================================================
   9. BEFORE & AFTER TRANSFORMATIONS MODULE — initBeforeAfter()
   ========================================================================== */
function initBeforeAfter() {
  const section = document.getElementById("transformations");
  if (!section) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  const transformations = typeof gsap !== "undefined" ? gsap.utils.toArray("#transformations .transformation") : Array.from(section.querySelectorAll(".transformation"));
  const dots = typeof gsap !== "undefined" ? gsap.utils.toArray("#transformations .dots__item") : Array.from(section.querySelectorAll(".dots__item"));
  const pinWrap = document.getElementById("transformationsPinWrap");
  const stage = document.getElementById("transformationsStage");

  /* stagger-delay each masked detail line so the reveal cascades */
  transformations.forEach((t) => {
    t.querySelectorAll("[data-mask]").forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  /* ------------------------------------------------------------------------
     A. HEADER TEXT REVEAL
  ------------------------------------------------------------------------ */
  if (typeof gsap !== "undefined") {
    gsap.set("#transformations .reveal__header [data-reveal]", { opacity: 0, y: 28 });
    gsap.to("#transformations .reveal__header [data-reveal]", {
      scrollTrigger: { trigger: "#transformations .reveal__header", start: "top 80%", once: true },
      opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.14,
    });
  }

  /* ------------------------------------------------------------------------
     B. THREE.JS — reactive golden dust + rose petals
     Density / glow responds live to how far the active slider
     has been dragged toward "after" — a transformation you can
     literally see shimmer into being as you reveal it.
  ------------------------------------------------------------------------ */
  let transReactivity = { value: 0.1 };
  let transRenderer, transScene, transCamera;
  let transRafId = null;

  function initTransThree() {
    const canvas = document.getElementById("transformationsCanvas");
    if (!canvas || typeof THREE === "undefined") return;

    transRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    transRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    transScene = new THREE.Scene();
    transCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    transCamera.position.z = 12;

    function makeSprite(drawFn) {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 64;
      drawFn(c.getContext("2d"));
      return new THREE.CanvasTexture(c);
    }

    const goldSprite = makeSprite((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(230,200,150,0.9)");
      g.addColorStop(0.5, "rgba(198,161,91,0.35)");
      g.addColorStop(1, "rgba(198,161,91,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    });

    const petalSprite = makeSprite((ctx) => {
      ctx.translate(32, 32);
      ctx.rotate(Math.PI / 4);
      const g = ctx.createLinearGradient(-20, 0, 20, 0);
      g.addColorStop(0, "rgba(185,138,143,0)");
      g.addColorStop(0.5, "rgba(185,138,143,0.8)");
      g.addColorStop(1, "rgba(185,138,143,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    const DUST_COUNT = window.innerWidth < 700 ? 80 : 180;
    const PETAL_COUNT = window.innerWidth < 700 ? 18 : 38;

    function buildPoints(count, sprite, size, spreadY) {
      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);
      const drift = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
        speeds[i] = 0.08 + Math.random() * 0.3;
        drift[i] = Math.random() * Math.PI * 2;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size, map: sprite, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, opacity: 0.8,
      });
      return { points: new THREE.Points(geo, mat), speeds, drift, mat };
    }

    const dust = buildPoints(DUST_COUNT, goldSprite, 0.2, 16);
    const petals = buildPoints(PETAL_COUNT, petalSprite, 0.55, 18);

    transScene.add(dust.points);
    transScene.add(petals.points);

    let mouseX = 0, mouseY = 0, rotX = 0, rotY = 0, scrollDepth = 0;

    section.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: section, start: "top bottom", end: "bottom top",
        onUpdate: (self) => { scrollDepth = self.progress; },
      });
    }

    function resizeTransThree() {
      if (!transCamera || !transRenderer) return;
      const w = section.clientWidth || window.innerWidth;
      const h = window.innerHeight;
      transRenderer.setSize(w, h, false);
      transCamera.aspect = w / h;
      transCamera.updateProjectionMatrix();
    }
    resizeTransThree();
    window.addEventListener("resize", resizeTransThree);

    const clock = new THREE.Clock();

    function animateTransParticles() {
      transRafId = requestAnimationFrame(animateTransParticles);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const reveal = transReactivity.value;

      [dust, petals].forEach((group) => {
        const posAttr = group.points.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          posAttr.array[i * 3 + 1] -= group.speeds[i] * dt * (0.35 + reveal * 0.4);
          posAttr.array[i * 3] += Math.sin(elapsed + group.drift[i]) * 0.002;
          if (posAttr.array[i * 3 + 1] < -9) posAttr.array[i * 3 + 1] = 9;
        }
        posAttr.needsUpdate = true;
      });

      dust.mat.opacity = 0.55 + reveal * 0.4;
      dust.mat.size = 0.16 + reveal * 0.12;
      petals.mat.opacity = 0.35 + reveal * 0.35;

      rotX += ((-mouseY * 0.22) - rotX) * 0.04;
      rotY += ((mouseX * 0.3) - rotY) * 0.04;
      dust.points.rotation.set(rotX, rotY + elapsed * 0.015, 0);
      petals.points.rotation.set(rotX * 0.6, rotY * 0.6 - elapsed * 0.01, 0);

      transCamera.position.z = 12 - scrollDepth * 3;

      transRenderer.render(transScene, transCamera);
    }

    if (!prefersReducedMotion) {
      animateTransParticles();
    } else {
      transRenderer.render(transScene, transCamera);
    }

    // IntersectionObserver to pause rendering when off-screen
    const transObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!transRafId && !prefersReducedMotion) animateTransParticles();
        } else {
          if (transRafId) {
            cancelAnimationFrame(transRafId);
            transRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    transObserver.observe(section);
  }
  initTransThree();

  /* ------------------------------------------------------------------------
     C. CURSOR GLOW
  ------------------------------------------------------------------------ */
  const cursorGlow = document.getElementById("transformationsCursorGlow");
  if (cursorGlow && canHover && !prefersReducedMotion && typeof gsap !== "undefined") {
    section.addEventListener("mousemove", (e) => {
      gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
    });
  }

  /* ------------------------------------------------------------------------
     D. COMPARE SLIDER — mouse / touch / keyboard
  ------------------------------------------------------------------------ */
  const dragState = new WeakMap();

  function setReveal(compareEl, pct) {
    pct = Math.max(2, Math.min(98, pct));
    compareEl.style.setProperty("--reveal", `${pct}%`);
    const handle = compareEl.querySelector("[data-handle]");
    if (handle) handle.setAttribute("aria-valuenow", Math.round(pct));
    let st = dragState.get(compareEl);
    if (!st) { st = { dragging: false, value: pct }; dragState.set(compareEl, st); }
    st.value = pct;

    if (compareEl.closest(".transformation.is-active")) {
      transReactivity.value = pct / 100;
    }
  }

  section.querySelectorAll("[data-compare]").forEach((compareEl) => {
    dragState.set(compareEl, { dragging: false, value: 8 });
    const handle = compareEl.querySelector("[data-handle]");

    function pointerToPct(clientX) {
      const rect = compareEl.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function start(clientX) {
      const st = dragState.get(compareEl);
      st.dragging = true;
      compareEl.classList.add("is-dragging");
      setReveal(compareEl, pointerToPct(clientX));
    }
    function move(clientX) {
      const st = dragState.get(compareEl);
      if (!st.dragging) return;
      setReveal(compareEl, pointerToPct(clientX));
    }
    function end() {
      const st = dragState.get(compareEl);
      st.dragging = false;
      compareEl.classList.remove("is-dragging");
    }

    compareEl.addEventListener("pointerdown", (e) => { compareEl.setPointerCapture(e.pointerId); start(e.clientX); });
    compareEl.addEventListener("pointermove", (e) => move(e.clientX));
    compareEl.addEventListener("pointerup", end);
    compareEl.addEventListener("pointerleave", (e) => { if (e.buttons !== 1) end(); });

    if (handle) {
      handle.addEventListener("keydown", (e) => {
        const st = dragState.get(compareEl);
        if (e.key === "ArrowLeft") { setReveal(compareEl, st.value - 4); e.preventDefault(); }
        if (e.key === "ArrowRight") { setReveal(compareEl, st.value + 4); e.preventDefault(); }
      });
    }
  });

  function isDragging(compareEl) {
    const st = dragState.get(compareEl);
    return st ? st.dragging : false;
  }

  /* ------------------------------------------------------------------------
     E. DETAILS MASK REVEAL trigger
  ------------------------------------------------------------------------ */
  function revealDetails(transformationEl) {
    const details = transformationEl.querySelector("[data-details]");
    if (details) details.classList.add("is-revealed");
  }
  function hideDetails(transformationEl) {
    const details = transformationEl.querySelector("[data-details]");
    if (details) details.classList.remove("is-revealed");
  }

  /* ------------------------------------------------------------------------
     F. ACTIVE-TRANSFORMATION SWITCHING
  ------------------------------------------------------------------------ */
  let activeIndex = 0;

  function goToIndex(newIndex, { resetReveal = true } = {}) {
    newIndex = Math.max(0, Math.min(transformations.length - 1, newIndex));
    if (newIndex === activeIndex && transformations[newIndex].classList.contains("is-active")) return;

    const prevEl = transformations[activeIndex];
    const nextEl = transformations[newIndex];

    if (prevEl && prevEl !== nextEl) {
      prevEl.classList.remove("is-active");
      prevEl.classList.add("is-leaving");
      hideDetails(prevEl);
      setTimeout(() => prevEl.classList.remove("is-leaving"), 950);
    }

    nextEl.classList.add("is-active");
    if (resetReveal) {
      const compareEl = nextEl.querySelector("[data-compare]");
      if (compareEl) setReveal(compareEl, 8);
    }

    dots.forEach((d, i) => d.classList.toggle("is-active", i === newIndex));
    activeIndex = newIndex;
  }

  /* ------------------------------------------------------------------------
     G. DESKTOP / LAPTOP / TABLET-LANDSCAPE: pinned scroll story
  ------------------------------------------------------------------------ */
  let storyST = null;

  function buildScrollStory() {
    if (storyST) { storyST.kill(); storyST = null; }
    if (window.innerWidth <= 900 || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const segments = transformations.length;

    storyST = ScrollTrigger.create({
      id: "transformStory",
      trigger: pinWrap,
      start: "top top",
      end: () => `+=${window.innerHeight * segments * 1.35}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const raw = self.progress * segments;
        const idx = Math.min(segments - 1, Math.floor(raw));
        const local = Math.min(1, raw - idx);

        goToIndex(idx, { resetReveal: false });

        const activeEl = transformations[idx];
        const compareEl = activeEl.querySelector("[data-compare]");

        if (compareEl && !isDragging(compareEl)) {
          const sweep = Math.min(1, local / 0.55);
          setReveal(compareEl, 6 + sweep * 56);
        }

        if (local > 0.15) revealDetails(activeEl);
        else if (local < 0.05) hideDetails(activeEl);
      },
    });
  }

  buildScrollStory();
  goToIndex(0, { resetReveal: true });
  if (transformations[0]) revealDetails(transformations[0]);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildScrollStory();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }, 250);
  });

  /* ------------------------------------------------------------------------
     H. MOBILE: swipeable transformation carousel
  ------------------------------------------------------------------------ */
  if (stage) {
    let touchStartX = null;
    stage.addEventListener("touchstart", (e) => {
      if (window.innerWidth > 900) return;
      if (e.target.closest("[data-compare]")) return;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener("touchend", (e) => {
      if (window.innerWidth > 900 || touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) goToIndex(activeIndex + 1);
      else goToIndex(activeIndex - 1);
      if (transformations[activeIndex]) revealDetails(transformations[activeIndex]);
      const compareEl = transformations[activeIndex] ? transformations[activeIndex].querySelector("[data-compare]") : null;
      if (compareEl) setReveal(compareEl, 45);
    }, { passive: true });
  }

  dots.forEach((dot, i) => {
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("role", "button");
    dot.addEventListener("click", () => {
      if (window.innerWidth > 900) return;
      goToIndex(i);
      if (transformations[i]) revealDetails(transformations[i]);
    });
  });

  /* ------------------------------------------------------------------------
     I. LUXURY STATISTICS — animated counters
  ------------------------------------------------------------------------ */
  section.querySelectorAll(".stats__item strong").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (typeof gsap !== "undefined" && !prefersReducedMotion) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 1.6, ease: "power2.out",
              onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString() + suffix; },
            });
          } else {
            el.textContent = Math.round(target).toLocaleString() + suffix;
          }
        },
      });
    }
  });

  /* ------------------------------------------------------------------------
     J. MAGNETIC CTA BUTTONS
  ------------------------------------------------------------------------ */
  if (canHover && !prefersReducedMotion && typeof gsap !== "undefined") {
    section.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ------------------------------------------------------------------------
     K. RIPPLE ON BUTTONS
  ------------------------------------------------------------------------ */
  section.querySelectorAll(".btn-book, .btn-glass").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      Object.assign(ripple.style, {
        position: "absolute",
        left: `${e.clientX - rect.left}px`,
        top: `${e.clientY - rect.top}px`,
        width: "8px", height: "8px", borderRadius: "50%",
        background: "rgba(230,200,150,0.55)",
        transform: "translate(-50%,-50%) scale(0)",
        pointerEvents: "none",
      });
      btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);

      if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.to(ripple, { scale: 26, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() });
      } else {
        ripple.remove();
      }
    });
  });
}

/* ==========================================================================
   10. PREMIUM PACKAGES MODULE — initPremiumPackages() (pkg- NAMESPACED)
   ========================================================================== */
function initPremiumPackages() {
  const pkgSection = document.getElementById('pkg-section');
  if (!pkgSection) return;

  const pkgPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pkgIsMobile = window.matchMedia('(max-width: 640px)').matches;

  /* ------------------------------------------------------------------
     A. HEADER TEXT SPLIT & INTRO TIMELINE
  ------------------------------------------------------------------ */
  function pkgSplitLines() {
    pkgSection.querySelectorAll('.pkg-heading .pkg-line').forEach((line) => {
      const words = line.textContent.trim().split(' ');
      line.innerHTML = words
        .map((w) => `<span class="pkg-word" style="display:inline-block;overflow:hidden;"><span class="pkg-word-inner" style="display:inline-block;transform:translateY(110%);">${w}</span></span>`)
        .join(' ');
    });
  }
  pkgSplitLines();

  if (typeof gsap !== 'undefined') {
    const pkgHeaderTimeline = gsap.timeline({
      scrollTrigger: { trigger: pkgSection.querySelector('.pkg-header'), start: 'top 80%', once: true },
      defaults: { ease: 'power3.out' }
    });

    pkgHeaderTimeline
      .from(pkgSection.querySelector('.pkg-eyebrow'), { opacity: 0, y: 18, duration: 0.7 })
      .to(pkgSection.querySelectorAll('.pkg-heading .pkg-word-inner'), { y: '0%', duration: 0.9, stagger: 0.045 }, '-=0.4')
      .from(pkgSection.querySelector('.pkg-desc'), { opacity: 0, y: 24, duration: 0.8 }, '-=0.55');
  }

  /* ------------------------------------------------------------------
     B. CURSOR-FOLLOW AMBIENT GLOW
  ------------------------------------------------------------------ */
  const pkgCursorGlow = document.getElementById('pkg-cursor-glow');
  if (pkgCursorGlow && !pkgPrefersReducedMotion && typeof gsap !== 'undefined') {
    let gx = 0, gy = 0, tx = 0, ty = 0;
    pkgSection.addEventListener('mouseenter', () => gsap.to(pkgCursorGlow, { opacity: 1, duration: 0.4 }));
    pkgSection.addEventListener('mouseleave', () => gsap.to(pkgCursorGlow, { opacity: 0, duration: 0.4 }));
    pkgSection.addEventListener('mousemove', (e) => {
      const rect = pkgSection.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
    });
    gsap.ticker.add(() => {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      pkgCursorGlow.style.transform = `translate(${gx - 230}px, ${gy - 230}px)`;
    });
  }

  /* ------------------------------------------------------------------
     C. PER-CARD SPOTLIGHT + 3D TILT & RIPPLE
  ------------------------------------------------------------------ */
  const pkgGlasses = pkgSection.querySelectorAll('.pkg-card-glass');
  pkgGlasses.forEach((glass) => {
    if (pkgPrefersReducedMotion) return;

    glass.addEventListener('mousemove', (e) => {
      const rect = glass.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      glass.style.setProperty('--pkg-mx', `${mx}%`);
      glass.style.setProperty('--pkg-my', `${my}%`);

      if (typeof gsap !== 'undefined') {
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(glass, {
          rotateY: px * 8,
          rotateX: -py * 8,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    glass.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(glass, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)' });
      }
    });

    glass.addEventListener('click', (e) => {
      const rect = glass.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.3;
      Object.assign(ripple.style, {
        position: 'absolute',
        width: `${size}px`, height: `${size}px`,
        left: `${e.clientX - rect.left - size / 2}px`,
        top: `${e.clientY - rect.top - size / 2}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(203,161,53,0.5), transparent 70%)',
        transform: 'scale(0)',
        pointerEvents: 'none',
        zIndex: 6
      });
      glass.appendChild(ripple);
      if (typeof gsap !== 'undefined') {
        gsap.to(ripple, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
      } else {
        ripple.remove();
      }
    });
  });

  /* ------------------------------------------------------------------
     D. PINNED PACKAGE STORY — STAGE & SCROLLTRIGGER
  ------------------------------------------------------------------ */
  const pkgPinStage = document.getElementById('pkg-pin-stage');
  const pkgCards = typeof gsap !== 'undefined' ? gsap.utils.toArray('#pkg-section .pkg-card') : Array.from(pkgSection.querySelectorAll('.pkg-card'));
  const pkgDots = typeof gsap !== 'undefined' ? gsap.utils.toArray('#pkg-section .pkg-stage-progress-dot') : Array.from(pkgSection.querySelectorAll('.pkg-stage-progress-dot'));

  function pkgSetActive(index) {
    pkgCards.forEach((c, i) => c.classList.toggle('is-active', i === index));
    pkgDots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  if (pkgPinStage && pkgCards.length === 4 && !pkgIsMobile && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    gsap.set(pkgCards[0], { xPercent: 0,  yPercent: 0, rotateY: 0,  z: 0,    scale: 1,    opacity: 1, filter: 'blur(0px)' });
    gsap.set(pkgCards[1], { xPercent: 0,  yPercent: 0, rotateY: 100, z: 0,   scale: 0.9,  opacity: 0, filter: 'blur(0px)' });
    gsap.set(pkgCards[2], { xPercent: 0,  yPercent: 0, rotateY: 0,  z: -900, scale: 0.4,  opacity: 0, filter: 'blur(14px)' });
    gsap.set(pkgCards[3], { xPercent: 0,  yPercent: 0, rotateY: 0,  z: 0,    scale: 0.05, opacity: 0, filter: 'blur(0px)' });
    pkgSetActive(0);

    const pkgMasterTimeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    pkgMasterTimeline.addLabel('seg1')
      .to(pkgCards[0], { xPercent: -140, rotateZ: -6, opacity: 0, duration: 1 }, 'seg1')
      .to(pkgCards[1], { rotateY: 0, scale: 1, opacity: 1, duration: 1 }, 'seg1');

    pkgMasterTimeline.addLabel('seg2')
      .to(pkgCards[1], { yPercent: -30, rotateX: 12, scale: 0.85, opacity: 0, duration: 1 }, 'seg2')
      .to(pkgCards[2], { z: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1 }, 'seg2');

    pkgMasterTimeline.addLabel('seg3')
      .to(pkgCards[2], { z: -500, scale: 0.6, opacity: 0, filter: 'blur(10px)', duration: 1 }, 'seg3')
      .to(pkgCards[3], { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' }, 'seg3');

    pkgMasterTimeline.addLabel('seg4').to({}, { duration: 1 });

    ScrollTrigger.create({
      id: 'pkgPinStory',
      trigger: pkgPinStage,
      start: 'top top',
      end: '+=3200',
      pin: true,
      scrub: 1,
      animation: pkgMasterTimeline,
      onUpdate: (self) => {
        const idx = Math.min(3, Math.floor(self.progress * 4));
        pkgSetActive(idx);
      }
    });

  } else {
    if (typeof gsap !== 'undefined') {
      pkgCards.forEach((c) => gsap.set(c, { clearProps: 'all' }));
    }
    pkgSetActive(0);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.batch(pkgCards, {
        start: 'top 85%',
        onEnter: (batch) => {
          if (typeof gsap !== 'undefined') gsap.to(batch, { opacity: 1, stagger: 0.1 });
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     E. COMPARISON CARDS MORPH
  ------------------------------------------------------------------ */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const pkgComparisonTimeline = gsap.timeline({
      scrollTrigger: { trigger: pkgSection.querySelector('.pkg-comparison'), start: 'top 82%', once: true }
    });
    pkgComparisonTimeline.to(pkgSection.querySelectorAll('.pkg-compare-card'), {
      scale: 1, opacity: 1, rotateX: 0,
      duration: 0.9,
      stagger: 0.14,
      ease: 'back.out(1.5)'
    });
  }

  /* ------------------------------------------------------------------
     F. CTA REVEAL
  ------------------------------------------------------------------ */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.from(pkgSection.querySelector('.pkg-cta'), {
      scrollTrigger: { trigger: pkgSection.querySelector('.pkg-cta'), start: 'top 85%', once: true },
      opacity: 0, y: 40, scale: 0.96, duration: 0.9, ease: 'power3.out'
    });
  }

  /* ------------------------------------------------------------------
     G. MAGNETIC BUTTONS
  ------------------------------------------------------------------ */
  if (!pkgPrefersReducedMotion && typeof gsap !== 'undefined') {
    pkgSection.querySelectorAll('.pkg-magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.35, y: y * 0.5, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ------------------------------------------------------------------
     H. THREE.JS SCENE — pkgScene, pkgCamera, pkgRenderer
  ------------------------------------------------------------------ */
  let pkgScene, pkgCamera, pkgRenderer, pkgClock, pkgRafId = null;

  function initPkgThree() {
    const canvas = document.getElementById('pkg-canvas');
    if (!canvas || typeof THREE === 'undefined' || pkgPrefersReducedMotion) return;

    pkgRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    pkgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    pkgScene = new THREE.Scene();
    pkgCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    pkgCamera.position.z = 90;

    pkgScene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const point = new THREE.PointLight(0xe6c877, 1.2, 400);
    point.position.set(40, 40, 80);
    pkgScene.add(point);

    function pkgResizeThree() {
      if (!pkgCamera || !pkgRenderer) return;
      const w = pkgSection.clientWidth || window.innerWidth;
      const h = pkgSection.clientHeight || window.innerHeight;
      pkgRenderer.setSize(w, h, false);
      pkgCamera.aspect = w / h;
      pkgCamera.updateProjectionMatrix();
    }
    pkgResizeThree();
    window.addEventListener('resize', pkgResizeThree);

    // Golden dust particles
    const dustCount = 140;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustBase = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 200;
      dustPos.set([x, y, z], i * 3);
      dustBase.set([x, y, z], i * 3);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xcba135, size: 0.7, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const pkgDust = new THREE.Points(dustGeo, dustMat);
    pkgScene.add(pkgDust);

    // Luxury diamonds
    const pkgDiamonds = [];
    const diamondGeo = new THREE.OctahedronGeometry(2.4, 0);
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0xf6f1e8 : 0xe6c877,
        shininess: 120,
        transparent: true,
        opacity: 0.75,
        specular: 0xffffff
      });
      const mesh = new THREE.Mesh(diamondGeo, mat);
      mesh.position.set((Math.random() - 0.5) * 140, (Math.random() - 0.5) * 90, (Math.random() - 0.5) * 160);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData.speed = 0.2 + Math.random() * 0.3;
      pkgScene.add(mesh);
      pkgDiamonds.push(mesh);
    }

    // Floating luxury ribbons
    const pkgRibbons = [];
    const ribbonGeo = new THREE.PlaneGeometry(40, 3, 16, 1);
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xd9a798 : 0xcba135,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(ribbonGeo, mat);
      mesh.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 70, (Math.random() - 0.5) * 120 - 40);
      mesh.rotation.z = Math.random() * Math.PI;
      mesh.rotation.x = Math.random() * 0.6;
      mesh.userData.speed = 0.05 + Math.random() * 0.08;
      pkgScene.add(mesh);
      pkgRibbons.push(mesh);
    }

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    pkgSection.addEventListener('mousemove', (e) => {
      const rect = pkgSection.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    });

    pkgClock = new THREE.Clock();

    function pkgAnimate() {
      pkgRafId = requestAnimationFrame(pkgAnimate);
      const t = pkgClock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      pkgCamera.position.x += (mouse.x * 12 - pkgCamera.position.x) * 0.03;
      pkgCamera.position.y += (mouse.y * 8 - pkgCamera.position.y) * 0.03;
      pkgCamera.lookAt(0, 0, 0);

      const posAttr = dustGeo.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        const bx = dustBase[i * 3], by = dustBase[i * 3 + 1];
        posAttr.array[i * 3]     = bx + Math.sin(t * 0.2 + i) * 2;
        posAttr.array[i * 3 + 1] = by + Math.cos(t * 0.16 + i) * 2;
      }
      posAttr.needsUpdate = true;
      pkgDust.rotation.y = t * 0.02;

      pkgDiamonds.forEach((d) => {
        d.rotation.x += 0.003 * d.userData.speed * 20 * 0.02;
        d.rotation.y += 0.004 * d.userData.speed * 20 * 0.02;
        d.position.y += Math.sin(t * d.userData.speed + d.position.x) * 0.01;
      });

      pkgRibbons.forEach((r) => {
        r.rotation.z += r.userData.speed * 0.01;
        r.position.y += Math.sin(t * 0.3 + r.position.x) * 0.005;
      });

      pkgRenderer.render(pkgScene, pkgCamera);
    }

    pkgAnimate();

    // IntersectionObserver to pause rendering when off-screen
    const pkgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!pkgRafId && !pkgPrefersReducedMotion) pkgAnimate();
        } else {
          if (pkgRafId) {
            cancelAnimationFrame(pkgRafId);
            pkgRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    pkgObserver.observe(pkgSection);
  }

  initPkgThree();
}

/* =========================================================================
   11. TESTIMONIALS MODULE — initTestimonials() (test- NAMESPACED)
   ========================================================================= */
function initTestimonials() {
  const testSection = document.getElementById("test-section");
  if (!testSection) return;

  const testPrefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const testPex = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

  const testData = [
    {
      name: "Ananya & Rohan Sharma",
      date: "14 Feb 2026",
      location: "Udaipur, Rajasthan",
      service: "Full Bridal Package",
      rating: 5,
      review: "LUXÉ turned our wedding week into a film. Every fitting, every trial, every sunrise touch-up felt considered. I have never felt more like myself, only more radiant.",
      img: testPex(11480642),
      gallery: [testPex(18398510, 400), testPex(11813969, 400)],
      journey: "3-day bridal experience across mehendi, sangeet & the final ceremony.",
      services: ["Bridal Draping", "HD Airbrush Makeup", "Hair Styling", "Pre-Wedding Skin Ritual"],
      tip: "Start your skin ritual 6 weeks out — radiance is built in layers, not applied in an hour.",
      quote: "LUXÉ didn't just prepare me for a wedding. They prepared me to feel like the most luminous version of myself."
    },
    {
      name: "Priya Malhotra",
      date: "02 Nov 2025",
      location: "Jaipur, Rajasthan",
      service: "Bridal Makeup & Hair",
      rating: 5,
      review: "The artistry was unreal — soft, dewy, editorial, exactly the reference I brought in. My mother cried when she saw me. That's the LUXÉ difference.",
      img: testPex(16910979),
      gallery: [testPex(21063577, 400), testPex(11439330, 400)],
      journey: "Single-day destination bridal glam with 5am start and touch-up kit.",
      services: ["Editorial Bridal Makeup", "Hair Styling", "Lash Application"],
      tip: "Book your trial in the same lighting as your venue — golden hour reads differently indoors.",
      quote: "Soft, dewy, unforgettable — they matched my reference photo better than I imagined possible."
    },
    {
      name: "Kavya Nair",
      date: "22 Dec 2025",
      location: "Kochi, Kerala",
      service: "Bridal Couture Draping",
      rating: 5,
      review: "The draping team treated my grandmother's saree like a museum piece and made it modern again. Structured, elegant, and it held for fourteen hours straight.",
      img: testPex(11439330),
      gallery: [testPex(16910979, 400), testPex(21063577, 400)],
      journey: "Heirloom saree redesign consultation followed by wedding-day draping.",
      services: ["Heirloom Draping", "Jewelry Styling", "Bridal Consultation"],
      tip: "Bring heirloom fabric in for a structural assessment at least a month before the big day.",
      quote: "They made my grandmother's saree feel brand new, without losing a single thread of its history."
    },
    {
      name: "Meera Kapoor",
      date: "18 Jan 2026",
      location: "Mumbai, Maharashtra",
      service: "Pre-Wedding Editorial",
      rating: 4.9,
      review: "This was less a makeover, more a fashion shoot. The team directed light, pose, and mood — every frame from our pre-wedding shoot looked like a campaign.",
      img: testPex(21063577),
      gallery: [testPex(11439330, 400), testPex(13022170, 400)],
      journey: "Full-day editorial pre-wedding styling across three outfit changes.",
      services: ["Editorial Styling", "Color-Correct Makeup", "Hair Sculpting"],
      tip: "Plan outfit changes from richest to lightest tone — it keeps every frame visually distinct.",
      quote: "Every frame from that shoot looks like it belongs in a bridal campaign, not a phone gallery."
    },
    {
      name: "Ishita & Arjun Verma",
      date: "09 Mar 2026",
      location: "Goa",
      service: "Couple Styling Experience",
      rating: 5,
      review: "We booked the couple's package on a whim and it became the highlight of our wedding prep. Relaxed, funny, precise — they read the room and the skin tone equally well.",
      img: testPex(18398510),
      gallery: [testPex(11480642, 400), testPex(11813969, 400)],
      journey: "Joint styling session ahead of the beach ceremony and reception.",
      services: ["Groom Grooming", "Bridal Glam", "Couple Consultation"],
      tip: "Coordinate palettes, not outfits — matching undertones photograph better than matching colors.",
      quote: "They read the room, and our skin tones, perfectly. It felt less like a service, more like a celebration."
    },
    {
      name: "Simran Kaur",
      date: "27 Oct 2025",
      location: "Chandigarh, Punjab",
      service: "Bridal Photography Package",
      rating: 5,
      review: "From the first candid to the last portrait, the LUXÉ photography team anticipated every emotional beat. My album feels like a novel, not a checklist of poses.",
      img: testPex(11813969),
      gallery: [testPex(18398510, 400), testPex(11480642, 400)],
      journey: "Full ceremony coverage paired with a styled golden-hour portrait session.",
      services: ["Candid Coverage", "Golden Hour Portraits", "Album Curation"],
      tip: "Reserve 20 quiet minutes at golden hour — it's where the most timeless portraits happen.",
      quote: "My album reads like a novel. They understood the story before I could put it into words."
    },
    {
      name: "Ritu Desai",
      date: "12 Sep 2025",
      location: "Ahmedabad, Gujarat",
      service: "Signature Beauty Session",
      rating: 4.9,
      review: "I came in for a refresh before my reception and left glowing for a week. The facial and contour work is surgical in its precision, yet the result looks effortless.",
      img: testPex(13022170),
      gallery: [testPex(30004322, 400), testPex(34381970, 400)],
      journey: "Two-session skin prep culminating in reception-night glam.",
      services: ["Signature Facial", "Precision Contour", "Skin Priming"],
      tip: "Hydration facials work best 48 hours before makeup — enough time to settle, not fade.",
      quote: "Precision that looks effortless — I was still glowing a week after my reception."
    },
    {
      name: "Ananya Rao",
      date: "05 Jan 2026",
      location: "Bengaluru, Karnataka",
      service: "Engagement Glow Facial",
      rating: 5,
      review: "Booked this as a treat before my engagement shoot and it changed how I felt on camera. The team's calm, unhurried approach is a luxury in itself.",
      img: testPex(30004322),
      gallery: [testPex(13022170, 400), testPex(29852895, 400)],
      journey: "Pre-shoot consultation and glow facial two days before the event.",
      services: ["Glow Facial", "Brow Shaping", "Skin Consultation"],
      tip: "A gentle facial 48 hours out gives skin time to calm before any camera-ready makeup.",
      quote: "I felt calm, unhurried, and completely camera-ready — that confidence is its own kind of luxury."
    },
    {
      name: "Diya Chatterjee",
      date: "30 Nov 2025",
      location: "Kolkata, West Bengal",
      service: "Reception Glam Makeover",
      rating: 4.8,
      review: "My reception look needed to be bolder than my wedding day, and the team nailed the transition — same bride, entirely new energy for the night.",
      img: testPex(34381970),
      gallery: [testPex(30004322, 400), testPex(29852895, 400)],
      journey: "Same-day transformation between ceremony and evening reception.",
      services: ["Reception Glam", "Quick-Change Styling", "Statement Lip Art"],
      tip: "Keep a two-tone lip kit on hand for a fast, dramatic day-to-night transition.",
      quote: "Same bride, entirely new energy — the quick-change transformation was flawless from every angle."
    },
    {
      name: "Naina Oberoi",
      date: "16 Aug 2025",
      location: "Jodhpur, Rajasthan",
      service: "Bridal Trial & Consultation",
      rating: 5,
      review: "The trial session alone was worth booking LUXÉ. They listened, adjusted, and photographed every look so I could decide with total confidence.",
      img: testPex(29852895),
      gallery: [testPex(34381970, 400), testPex(30004322, 400)],
      journey: "Two-round trial process refined against real venue lighting references.",
      services: ["Bridal Trial", "Look Consultation", "Reference Photography"],
      tip: "Ask your studio to photograph every trial look — decisions are easier outside the mirror.",
      quote: "They let me decide with total confidence, photographing every look before the day even arrived."
    }
  ];

  const N = testData.length;
  const ANGLE_STEP = 360 / N;

  const testStage        = document.getElementById("test-carousel-stage");
  const testRing         = document.getElementById("test-carousel-ring");
  const testTemplate     = document.getElementById("test-card-template");
  const testRailFill     = document.getElementById("test-rail-fill");
  const testActiveIndex  = document.getElementById("test-active-index");
  const testPrevBtn      = document.getElementById("test-prev-card");
  const testNextBtn      = document.getElementById("test-next-card");

  const testFeaturePortrait = document.getElementById("test-feature-portrait");
  const testFeatureGallery  = document.getElementById("test-feature-gallery");
  const testFeatureQuote    = document.getElementById("test-feature-quote");
  const testFeatureName     = document.getElementById("test-feature-name");
  const testFeatureJourney  = document.getElementById("test-feature-journey");
  const testFeatureServices = document.getElementById("test-feature-services");
  const testFeatureTip      = document.getElementById("test-feature-tip");
  const testFeatureBookLink = document.getElementById("test-feature-book-link");

  let testRadius = 640;

  function testComputeRadius() {
    if (!testStage) return;
    const cardW = Math.min(320, testStage.clientWidth * 0.74);
    testRadius = Math.round((cardW / 2) / Math.tan(Math.PI / N)) + 40;
  }

  const testCardEls = [];

  function testBuildCards() {
    if (!testRing || !testTemplate) return;
    testRing.innerHTML = "";
    testCardEls.length = 0;

    testData.forEach((t, i) => {
      const node = testTemplate.content.firstElementChild.cloneNode(true);
      node.style.transform = `translate(-50%,-50%) rotateY(${i * ANGLE_STEP}deg) translateZ(${testRadius}px)`;
      node.dataset.index = i;
      node.setAttribute("aria-label", `Testimonial ${i + 1} of ${N}: ${t.name}`);

      const img = node.querySelector(".test-card-img");
      if (img) {
        img.src = t.img;
        img.alt = `${t.name}, LUXÉ Bridal Studio client`;
      }

      const nameEl = node.querySelector(".test-card-name");
      if (nameEl) nameEl.textContent = t.name;

      const eventEl = node.querySelector(".test-card-event");
      if (eventEl) eventEl.textContent = `${t.date} · ${t.location}`;

      const serviceEl = node.querySelector(".test-card-service");
      if (serviceEl) serviceEl.textContent = t.service;

      const reviewEl = node.querySelector(".test-card-review");
      if (reviewEl) reviewEl.textContent = `“${t.review}”`;

      const ratingEl = node.querySelector(".test-card-rating");
      if (ratingEl) {
        const full = Math.round(t.rating);
        ratingEl.innerHTML = Array.from({ length: 5 }, (_, s) =>
          `<span>${s < full ? "★" : "☆"}</span>`).join("") +
          `<span style="color:var(--test-ivory-faint);font-size:11px;margin-left:6px;">${t.rating.toFixed(1)}</span>`;
      }

      const bookBtn = node.querySelector(".test-card-book");
      if (bookBtn) {
        bookBtn.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      }

      node.addEventListener("focus", () => testGoToIndex(i));
      node.addEventListener("click", () => testGoToIndex(i));

      testRing.appendChild(node);
      testCardEls.push(node);
      testAttachTilt(node);
    });
  }

  function testAttachTilt(card) {
    const tilt = card.querySelector(".test-card-tilt");
    const glass = card.querySelector(".test-card-glass");
    if (testPrefersReducedMotion || !glass) return;

    let raf = null;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rotY = (px - 0.5) * 18;
        const rotX = (0.5 - py) * 14;
        if (typeof gsap !== "undefined" && tilt) {
          gsap.to(tilt, { rotateX: rotX, rotateY: rotY, duration: 0.5, ease: "power2.out" });
        }
        glass.style.setProperty("--test-mx", `${px * 100}%`);
        glass.style.setProperty("--test-my", `${py * 100}%`);
      });
    });

    card.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined" && tilt) {
        gsap.to(tilt, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1,0.6)" });
      }
    });
  }

  let testScrollRotation = 0;
  let testManualRotation = 0;
  let testActiveIndexVal = 0;

  function testCurrentTotalRotation() {
    return testScrollRotation + testManualRotation;
  }

  function testApplyRing() {
    const total = testCurrentTotalRotation();
    if (typeof gsap !== "undefined" && testRing) {
      gsap.set(testRing, { rotateY: total });
    }

    const idx = (((-Math.round(total / ANGLE_STEP)) % N) + N) % N;
    if (idx !== testActiveIndexVal) {
      testActiveIndexVal = idx;
      testOnActiveChange(idx);
    }

    testCardEls.forEach((c, i) => {
      c.classList.toggle("test-card--active", i === testActiveIndexVal);
      c.classList.toggle("test-card--dim", i !== testActiveIndexVal);
    });

    const progress = (((-total % 360) + 360) % 360) / 360;
    if (testRailFill) testRailFill.style.width = `${Math.max(4, progress * 100)}%`;
    if (testActiveIndex) testActiveIndex.textContent = String(testActiveIndexVal + 1).padStart(2, "0");
  }

  function testGoToIndex(i) {
    testManualRotation += (testActiveIndexVal - i) * ANGLE_STEP;
    testApplyRing();
    testUpdateFeature(i, true);
  }

  function testUpdateFeature(i, animated) {
    const t = testData[i];
    if (!t) return;

    const paint = () => {
      if (testFeaturePortrait) {
        testFeaturePortrait.src = t.img;
        testFeaturePortrait.alt = `${t.name} featured bridal portrait`;
      }
      if (testFeatureGallery) {
        testFeatureGallery.innerHTML = t.gallery.map(src =>
          `<img src="${src}" alt="${t.name} wedding gallery image" loading="lazy" />`).join("");
      }
      if (testFeatureQuote) testFeatureQuote.textContent = `“${t.quote}”`;
      if (testFeatureName) testFeatureName.textContent = `${t.name} — ${t.location}`;
      if (testFeatureJourney) testFeatureJourney.textContent = t.journey;
      if (testFeatureServices) testFeatureServices.innerHTML = t.services.map(s => `<li>${s}</li>`).join("");
      if (testFeatureTip) testFeatureTip.textContent = t.tip;
    };

    if (testPrefersReducedMotion || !animated || typeof gsap === "undefined") {
      paint();
      return;
    }

    const mask = testSection.querySelector(".test-feature-portrait-mask");
    if (mask) {
      const testRevealTimeline = gsap.timeline();
      testRevealTimeline.to(mask, { clipPath: "inset(0 0 100% 0 round 24px)", duration: 0.35, ease: "power2.in" })
        .add(paint)
        .to(mask, { clipPath: "inset(0 0 0% 0 round 24px)", duration: 0.5, ease: "power3.out" });
    } else {
      paint();
    }

    if (testFeatureQuote) {
      gsap.fromTo(testFeatureQuote, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" });
    }
  }

  function testOnActiveChange(i) {
    testUpdateFeature(i, true);
    if (typeof gsap !== "undefined") {
      gsap.to(".test-orb--a", { opacity: 0.35 + (i % 3) * 0.08, duration: 1, overwrite: "auto" });
    }
  }

  /* ScrollTrigger Pinning on Desktop */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const testMm = gsap.matchMedia();

    testMm.add("(min-width: 901px)", () => {
      if (testPrefersReducedMotion) return;

      const testScrollTrigger = ScrollTrigger.create({
        id: "testPinStory",
        trigger: "#test-section",
        start: "top top",
        end: "+=320%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          testScrollRotation = -self.progress * 360;
          testApplyRing();
        }
      });

      return () => { testScrollTrigger && testScrollTrigger.kill(); };
    });

    testMm.add("(max-width: 900px)", () => {
      if (testPrefersReducedMotion || !testStage) return;

      let startX = 0, startRotation = 0, dragging = false;

      const onDown = (e) => {
        dragging = true;
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        startRotation = testManualRotation;
      };
      const onMove = (e) => {
        if (!dragging) return;
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        const delta = (x - startX) * 0.35;
        testManualRotation = startRotation + delta;
        testApplyRing();
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        testManualRotation = Math.round(testManualRotation / ANGLE_STEP) * ANGLE_STEP;
        gsap.to({}, { duration: 0.4, onUpdate: testApplyRing });
        testApplyRing();
      };

      testStage.addEventListener("touchstart", onDown, { passive: true });
      testStage.addEventListener("touchmove", onMove, { passive: true });
      testStage.addEventListener("touchend", onUp);
      testStage.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);

      return () => {
        testStage.removeEventListener("touchstart", onDown);
        testStage.removeEventListener("touchmove", onMove);
        testStage.removeEventListener("touchend", onUp);
        testStage.removeEventListener("mousedown", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    });
  }

  if (testPrevBtn) testPrevBtn.addEventListener("click", () => testGoToIndex((testActiveIndexVal - 1 + N) % N));
  if (testNextBtn) testNextBtn.addEventListener("click", () => testGoToIndex((testActiveIndexVal + 1) % N));

  if (testStage) {
    testStage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); testGoToIndex((testActiveIndexVal + 1) % N); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); testGoToIndex((testActiveIndexVal - 1) % N); }
    });
  }

  /* Header animation */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const testHeaderTimeline = gsap.timeline({
      scrollTrigger: { trigger: ".test-header", start: "top 80%" }
    });

    testHeaderTimeline.from(".test-eyebrow-text", { opacity: 0, letterSpacing: "0.7em", duration: 0.9, ease: "power3.out" })
      .from(".test-eyebrow-line", { scaleX: 0, transformOrigin: "left", duration: 0.7, ease: "power3.out" }, "<0.1")
      .from(".test-heading .test-line", { yPercent: 110, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, "-=0.4")
      .from(".test-desc", { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
      .from(".test-hint", { opacity: 0, y: 8, duration: 0.6 }, "-=0.3");
  }

  /* Stat counters */
  if (typeof ScrollTrigger !== "undefined") {
    testSection.querySelectorAll(".test-stats-number").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimal || "0", 10);
      const suffix = el.dataset.suffix || "";
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          if (typeof gsap !== "undefined" && !testPrefersReducedMotion) {
            gsap.to(obj, {
              val: target, duration: 1.8, ease: "power2.out",
              onUpdate: () => {
                el.textContent = decimals ? obj.val.toFixed(decimals) + suffix : Math.round(obj.val) + suffix;
              }
            });
          } else {
            el.textContent = decimals ? target.toFixed(decimals) + suffix : Math.round(target) + suffix;
          }
        }
      });
    });
  }

  /* Magnetic buttons & ripples */
  testSection.querySelectorAll("[data-magnetic]").forEach((btn) => {
    if (!testPrefersReducedMotion && typeof gsap !== "undefined") {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.35;
        const y = (e.clientY - r.top - r.height / 2) * 0.6;
        gsap.to(btn, { x, y, duration: 0.5, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
      });
    }

    btn.addEventListener("click", (e) => {
      const ripple = btn.querySelector(".test-btn-ripple");
      if (ripple) {
        const r = btn.getBoundingClientRect();
        ripple.style.left = `${e.clientX - r.left}px`;
        ripple.style.top = `${e.clientY - r.top}px`;
        ripple.classList.remove("is-active");
        void ripple.offsetWidth;
        ripple.classList.add("is-active");
      }
    });
  });

  /* Three.js floating golden particles */
  let testScene, testCamera, testRenderer, testClock, testRafId = null;

  function initTestThree() {
    const canvas = document.getElementById("test-canvas");
    if (!window.THREE || !canvas || testPrefersReducedMotion) return;

    testRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    testRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    testScene = new THREE.Scene();
    testCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    testCamera.position.z = 12;

    const COUNT = 650;
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xd9b877, size: 0.045, transparent: true, opacity: 0.75,
      depthWrite: false, blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geo, mat);
    testScene.add(points);

    const petalGeo = new THREE.CircleGeometry(0.12, 16);
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xf1dca8, transparent: true, opacity: 0.35 });
    const petals = [];
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(petalGeo, petalMat.clone());
      m.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8);
      m.rotation.z = Math.random() * Math.PI;
      testScene.add(m);
      petals.push(m);
    }

    let mouseX = 0, mouseY = 0;
    testSection.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    function resizeTestThree() {
      if (!testCamera || !testRenderer) return;
      const w = testSection.clientWidth || window.innerWidth;
      const h = testSection.clientHeight || window.innerHeight;
      testRenderer.setSize(w, h, false);
      testCamera.aspect = w / h;
      testCamera.updateProjectionMatrix();
    }
    resizeTestThree();
    window.addEventListener("resize", resizeTestThree);

    testClock = new THREE.Clock();

    function testAnimate() {
      testRafId = requestAnimationFrame(testAnimate);
      const t = testClock.getElapsedTime();

      points.rotation.y = t * 0.15 + mouseX * 0.3;
      points.rotation.x = mouseY * 0.15;
      testCamera.position.x += (mouseX * 1.2 - testCamera.position.x) * 0.02;
      testCamera.position.y += (-mouseY * 0.8 - testCamera.position.y) * 0.02;
      testCamera.lookAt(0, 0, 0);

      petals.forEach((p, i) => {
        p.position.y += Math.sin(t + i) * 0.002;
        p.rotation.z += 0.0015;
      });

      testRenderer.render(testScene, testCamera);
    }

    testAnimate();

    const testObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!testRafId && !testPrefersReducedMotion) testAnimate();
        } else {
          if (testRafId) {
            cancelAnimationFrame(testRafId);
            testRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    testObserver.observe(testSection);
  }

  testComputeRadius();
  testBuildCards();
  testApplyRing();
  testUpdateFeature(0, false);
  initTestThree();
}

/* ==========================================================================
   MASTER INITIALIZER — initWebsite()
   ========================================================================== */
function initWebsite() {
  initNavbar();
  initHero();
  initFeaturedServices();
  initAbout();
  initWhyChoose();
  initBridalExperience();
  initServiceCategories();
  initMeetArtists();
  initBeforeAfter();
  initPremiumPackages();
  initTestimonials();
  initBooking();
  initContact();

  // Single ScrollTrigger refresh after all modules are initialized
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
}

// Single DOMContentLoaded Listener
document.addEventListener("DOMContentLoaded", () => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initWebsite);
  } else {
    initWebsite();
  }
});







/* =========================================================================
   12. BOOKING / APPOINTMENT MODULE — initBooking() (booking- NAMESPACED)
   ========================================================================= */
function initBooking() {
  const bookingSection = document.getElementById("booking-section");
  if (!bookingSection) return;

  const bookingPrefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- DOM refs ---- */
  const bookingForm       = document.getElementById("booking-form");
  const bookingSubmit     = document.getElementById("booking-submit");
  const bookingSuccess    = document.getElementById("booking-success");
  const bookingReset      = document.getElementById("booking-reset");
  const bookingFormCard   = document.getElementById("booking-form-card");

  const bookingFields = {
    name:    { input: document.getElementById("booking-name"),    error: document.getElementById("booking-name-error") },
    phone:   { input: document.getElementById("booking-phone"),   error: document.getElementById("booking-phone-error") },
    email:   { input: document.getElementById("booking-email"),   error: document.getElementById("booking-email-error") },
    service: { input: document.getElementById("booking-service"), error: document.getElementById("booking-service-error") },
    date:    { input: document.getElementById("booking-date"),    error: document.getElementById("booking-date-error") },
    time:    { input: document.getElementById("booking-time"),    error: document.getElementById("booking-time-error") },
  };

  /* ---- Set min date to today ---- */
  const bookingDateInput = bookingFields.date.input;
  if (bookingDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm   = String(today.getMonth() + 1).padStart(2, "0");
    const dd   = String(today.getDate()).padStart(2, "0");
    bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ---- Validation helpers ---- */
  function bookingShowError(fieldKey, msg) {
    const { input, error } = bookingFields[fieldKey];
    if (!input || !error) return;
    input.classList.add("is-invalid");
    error.textContent = msg;
    error.classList.add("is-visible");
    if (typeof gsap !== "undefined" && !bookingPrefersReduced) {
      gsap.fromTo(input, { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.5)" });
    }
  }

  function bookingClearError(fieldKey) {
    const { input, error } = bookingFields[fieldKey];
    if (!input || !error) return;
    input.classList.remove("is-invalid");
    error.textContent = "";
    error.classList.remove("is-visible");
  }

  function bookingValidate() {
    let valid = true;

    // Name
    const nameVal = (bookingFields.name.input?.value || "").trim();
    if (!nameVal) { bookingShowError("name", "Please enter your full name."); valid = false; }
    else { bookingClearError("name"); }

    // Phone
    const phoneVal = (bookingFields.phone.input?.value || "").replace(/\s/g, "");
    if (!phoneVal) { bookingShowError("phone", "Please enter your phone number."); valid = false; }
    else if (!/^[+]?[\d]{7,15}$/.test(phoneVal)) { bookingShowError("phone", "Please enter a valid phone number."); valid = false; }
    else { bookingClearError("phone"); }

    // Email
    const emailVal = (bookingFields.email.input?.value || "").trim();
    if (!emailVal) { bookingShowError("email", "Please enter your email address."); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { bookingShowError("email", "Please enter a valid email address."); valid = false; }
    else { bookingClearError("email"); }

    // Service
    const svcVal = bookingFields.service.input?.value || "";
    if (!svcVal) { bookingShowError("service", "Please select a service."); valid = false; }
    else { bookingClearError("service"); }

    // Date
    const dateVal = bookingFields.date.input?.value || "";
    if (!dateVal) { bookingShowError("date", "Please choose a preferred date."); valid = false; }
    else { bookingClearError("date"); }

    // Time
    const timeVal = bookingFields.time.input?.value || "";
    if (!timeVal) { bookingShowError("time", "Please select a preferred time."); valid = false; }
    else { bookingClearError("time"); }

    return valid;
  }

  /* ---- Inline live validation (on blur) ---- */
  Object.keys(bookingFields).forEach((key) => {
    const inp = bookingFields[key].input;
    if (!inp) return;
    inp.addEventListener("blur", () => {
      if (inp.value) bookingClearError(key);
    });
    inp.addEventListener("input", () => {
      if (inp.classList.contains("is-invalid") && inp.value) bookingClearError(key);
    });
  });

  /* ---- Ripple effect on button click ---- */
  if (bookingSubmit) {
    bookingSubmit.addEventListener("click", (e) => {
      const ripple = bookingSubmit.querySelector(".booking-button-ripple");
      if (ripple) {
        const r = bookingSubmit.getBoundingClientRect();
        ripple.style.left = `${e.clientX - r.left}px`;
        ripple.style.top  = `${e.clientY - r.top}px`;
        ripple.classList.remove("is-active");
        void ripple.offsetWidth;
        ripple.classList.add("is-active");
      }
    });
  }

  /* ---- Form submission ---- */
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!bookingValidate()) return;

      // Simulate async submit
      if (bookingSubmit) {
        bookingSubmit.disabled = true;
        bookingSubmit.classList.add("is-loading");
        const label = bookingSubmit.querySelector(".booking-button-label");
        if (label) label.textContent = "Sending";
      }

      setTimeout(() => {
        bookingShowSuccess();
      }, 1400);
    });
  }

  function bookingShowSuccess() {
    if (!bookingForm || !bookingSuccess || !bookingFormCard) return;

    if (typeof gsap !== "undefined" && !bookingPrefersReduced) {
      gsap.to(bookingForm, {
        opacity: 0, y: -14, duration: 0.45, ease: "power2.in",
        onComplete: () => {
          bookingForm.style.display = "none";
          bookingSuccess.setAttribute("aria-hidden", "false");
          bookingSuccess.removeAttribute("hidden");
          gsap.fromTo(bookingSuccess,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
          );
        }
      });
    } else {
      bookingForm.style.display = "none";
      bookingSuccess.setAttribute("aria-hidden", "false");
    }
  }

  /* ---- Reset flow ---- */
  if (bookingReset) {
    bookingReset.addEventListener("click", () => {
      if (!bookingForm || !bookingSuccess) return;
      bookingSuccess.setAttribute("aria-hidden", "true");
      bookingForm.reset();
      bookingForm.style.display = "";
      if (bookingSubmit) {
        bookingSubmit.disabled = false;
        bookingSubmit.classList.remove("is-loading");
        const label = bookingSubmit.querySelector(".booking-button-label");
        if (label) label.textContent = "Reserve My Appointment";
      }
      Object.keys(bookingFields).forEach((k) => bookingClearError(k));

      if (typeof gsap !== "undefined" && !bookingPrefersReduced) {
        gsap.fromTo(bookingForm, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      }
    });
  }

  /* ---- GSAP scroll reveal (header + layout) ---- */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {

    const bookingRevealTimeline = gsap.timeline({
      scrollTrigger: {
        id: "bookingHeaderReveal",
        trigger: ".booking-header",
        start: "top 82%",
        once: true
      }
    });

    bookingRevealTimeline
      .from(".booking-eyebrow-text", { opacity: 0, letterSpacing: "0.65em", duration: 0.9, ease: "power3.out" })
      .from(".booking-eyebrow-line", { scaleX: 0, transformOrigin: "center", duration: 0.7, ease: "power3.out", stagger: 0.1 }, "<0.1")
      .from(".booking-title-line", { yPercent: 115, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, "-=0.4")
      .from(".booking-subtitle", { opacity: 0, y: 14, duration: 0.8, ease: "power3.out" }, "-=0.4");

    const bookingTimeline = gsap.timeline({
      scrollTrigger: {
        id: "bookingLayoutReveal",
        trigger: ".booking-layout",
        start: "top 80%",
        once: true
      }
    });

    bookingTimeline
      .from(".booking-info-card", {
        opacity: 0, x: -30, duration: 0.9, ease: "power3.out"
      })
      .from(".booking-form-card", {
        opacity: 0, x: 30, duration: 0.9, ease: "power3.out"
      }, "<0.1");

    /* Stagger info items */
    gsap.from(".booking-info-item", {
      scrollTrigger: { id: "bookingInfoItems", trigger: ".booking-info-list", start: "top 85%", once: true },
      opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.3
    });

    /* Stagger promise list */
    gsap.from(".booking-info-promise-list li", {
      scrollTrigger: { id: "bookingPromiseList", trigger: ".booking-info-promise-list", start: "top 88%", once: true },
      opacity: 0, y: 10, duration: 0.5, stagger: 0.08, ease: "power3.out"
    });

    /* Form fields cascade reveal */
    gsap.from(".booking-field-group", {
      scrollTrigger: { id: "bookingFieldsReveal", trigger: ".booking-form", start: "top 82%", once: true },
      opacity: 0, y: 16, duration: 0.55, stagger: 0.07, ease: "power3.out", delay: 0.2
    });
  }

  /* ---- Three.js ambient particle atmosphere ---- */
  let bookingScene, bookingCamera, bookingRenderer, bookingClock, bookingRafId = null;

  function bookingInitThree() {
    const bookingCanvas = document.getElementById("booking-canvas");
    if (!window.THREE || !bookingCanvas || bookingPrefersReduced) return;

    bookingRenderer = new THREE.WebGLRenderer({ canvas: bookingCanvas, alpha: true, antialias: true });
    bookingRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    bookingScene  = new THREE.Scene();
    bookingCamera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    bookingCamera.position.z = 14;

    const COUNT = 500;
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      sizes[i]             = Math.random() * 0.04 + 0.015;
    }

    const bookingGeo = new THREE.BufferGeometry();
    bookingGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    bookingGeo.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    const bookingMat = new THREE.PointsMaterial({
      color: 0xcfa865,
      size: 0.038,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const bookingPoints = new THREE.Points(bookingGeo, bookingMat);
    bookingScene.add(bookingPoints);

    /* Small twinkling diamonds */
    const bookingDiamondGeo = new THREE.OctahedronGeometry(0.08, 0);
    const bookingDiamondMat = new THREE.MeshBasicMaterial({ color: 0xf1dba8, transparent: true, opacity: 0.25, wireframe: false });
    const bookingDiamonds   = [];
    for (let i = 0; i < 10; i++) {
      const d = new THREE.Mesh(bookingDiamondGeo, bookingDiamondMat.clone());
      d.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10);
      d.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      bookingScene.add(d);
      bookingDiamonds.push(d);
    }

    let bookingMouseX = 0, bookingMouseY = 0;
    bookingSection.addEventListener("mousemove", (ev) => {
      bookingMouseX = (ev.clientX / window.innerWidth  - 0.5);
      bookingMouseY = (ev.clientY / window.innerHeight - 0.5);
    });

    function bookingResizeThree() {
      if (!bookingRenderer || !bookingCamera) return;
      const w = bookingSection.clientWidth  || window.innerWidth;
      const h = bookingSection.clientHeight || window.innerHeight;
      bookingRenderer.setSize(w, h, false);
      bookingCamera.aspect = w / h;
      bookingCamera.updateProjectionMatrix();
    }
    bookingResizeThree();
    window.addEventListener("resize", bookingResizeThree);

    bookingClock = new THREE.Clock();

    function bookingAnimate() {
      bookingRafId = requestAnimationFrame(bookingAnimate);
      const t = bookingClock.getElapsedTime();

      bookingPoints.rotation.y = t * 0.08 + bookingMouseX * 0.25;
      bookingPoints.rotation.x = bookingMouseY * 0.12;
      bookingCamera.position.x += (bookingMouseX * 1.0 - bookingCamera.position.x) * 0.018;
      bookingCamera.position.y += (-bookingMouseY * 0.7 - bookingCamera.position.y) * 0.018;
      bookingCamera.lookAt(0, 0, 0);

      bookingDiamonds.forEach((d, i) => {
        d.rotation.y += 0.004 + i * 0.001;
        d.position.y += Math.sin(t * 0.7 + i) * 0.0015;
        d.material.opacity = 0.18 + Math.sin(t * 1.2 + i * 0.8) * 0.1;
      });

      bookingRenderer.render(bookingScene, bookingCamera);
    }

    bookingAnimate();

    const bookingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!bookingRafId && !bookingPrefersReduced) bookingAnimate();
        } else {
          if (bookingRafId) {
            cancelAnimationFrame(bookingRafId);
            bookingRafId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    bookingObserver.observe(bookingSection);
  }

  bookingInitThree();
}
/* =========================================================================
   13. CONTACT MODULE — initContact() (contact- NAMESPACED)
   ========================================================================= */
function initContact() {
  const contactSection = document.getElementById("contact-section");
  if (!contactSection) return;

  const contactPrefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Copyright year ---- */
  const contactYearEl = document.getElementById("contact-year");
  if (contactYearEl) contactYearEl.textContent = new Date().getFullYear();

  /* ---- GSAP scroll reveal ---- */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {

    /* Header reveal */
    const contactRevealTimeline = gsap.timeline({
      scrollTrigger: {
        id: "contactHeaderReveal",
        trigger: ".contact-header",
        start: "top 82%",
        once: true
      }
    });
    contactRevealTimeline
      .from(".contact-eyebrow-text",  { opacity: 0, letterSpacing: "0.65em", duration: 0.9, ease: "power3.out" })
      .from(".contact-eyebrow-line",  { scaleX: 0, transformOrigin: "center", duration: 0.7, ease: "power3.out", stagger: 0.1 }, "<0.1")
      .from(".contact-title-line",    { yPercent: 115, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, "-=0.4")
      .from(".contact-subtitle",      { opacity: 0, y: 14, duration: 0.8, ease: "power3.out" }, "-=0.4");

    /* Contact card reveal */
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        id: "contactGridReveal",
        trigger: ".contact-grid",
        start: "top 80%",
        once: true
      }
    });
    contactTimeline
      .from("#contact-card",       { opacity: 0, x: -28, duration: 0.9, ease: "power3.out" })
      .from("#contact-map",        { opacity: 0, x: 28,  duration: 0.9, ease: "power3.out" }, "<0.1")
      .from("#contact-quick-card", { opacity: 0, y: 20,  duration: 0.7, ease: "power3.out" }, "-=0.5");

    /* Info items stagger */
    gsap.from(".contact-info-item", {
      scrollTrigger: { id: "contactInfoItems", trigger: ".contact-info-list", start: "top 86%", once: true },
      opacity: 0, x: -18, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.25
    });

    /* Social links stagger */
    gsap.from(".contact-social-link", {
      scrollTrigger: { id: "contactSocialReveal", trigger: ".contact-social-list", start: "top 88%", once: true },
      opacity: 0, x: -14, duration: 0.5, stagger: 0.09, ease: "power3.out", delay: 0.1
    });

    /* Quick grid items */
    gsap.from(".contact-quick-item", {
      scrollTrigger: { id: "contactQuickReveal", trigger: ".contact-quick-grid", start: "top 88%", once: true },
      opacity: 0, y: 12, duration: 0.5, stagger: 0.1, ease: "power3.out"
    });

    /* Bottom strip */
    gsap.from("#contact-bottom", {
      scrollTrigger: { id: "contactBottomReveal", trigger: "#contact-bottom", start: "top 92%", once: true },
      opacity: 0, y: 10, duration: 0.7, ease: "power3.out"
    });

    /* Decorative rings parallax */
    if (!contactPrefersReduced) {
      const contactScrollTrigger = ScrollTrigger.create({
        id: "contactDecorParallax",
        trigger: contactSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          gsap.set(".contact-decor--ring-a", { y: self.progress * -60 });
          gsap.set(".contact-decor--ring-b", { y: self.progress * 40 });
          gsap.set(".contact-decor--dot-grid", { y: self.progress * -30 });
        }
      });
    }
  }

  /* ---- Hover shimmer on contact card ---- */
  const contactCard = document.getElementById("contact-card");
  if (contactCard && !contactPrefersReduced) {
    contactCard.addEventListener("mousemove", (e) => {
      const r = contactCard.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width)  * 100;
      const py = ((e.clientY - r.top)  / r.height) * 100;
      contactCard.style.setProperty("--contact-shine-x", `${px}%`);
      contactCard.style.setProperty("--contact-shine-y", `${py}%`);
    });
  }

  /* ---- Map iframe lazy interaction fix ---- */
  const contactMapFrame = document.getElementById("contact-map-frame");
  if (contactMapFrame) {
    const contactMapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !contactMapFrame.dataset.loaded) {
          contactMapFrame.dataset.loaded = "1";
        }
      });
    }, { threshold: 0.1 });
    contactMapObserver.observe(contactMapFrame);
  }

  /* ---- Three.js floating gold specks ---- */
  let contactScene, contactCamera, contactRenderer, contactClock, contactRafId = null;

  function contactInitThree() {
    const contactCanvas = document.getElementById("contact-canvas");
    if (!window.THREE || !contactCanvas || contactPrefersReduced) return;

    contactRenderer = new THREE.WebGLRenderer({ canvas: contactCanvas, alpha: true, antialias: true });
    contactRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    contactScene  = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    contactCamera.position.z = 14;

    /* Floating particle field */
    const COUNT = 420;
    const pos   = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const contactGeo = new THREE.BufferGeometry();
    contactGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const contactMat = new THREE.PointsMaterial({
      color: 0xcfa865, size: 0.034, transparent: true,
      opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending
    });
    const contactPoints = new THREE.Points(contactGeo, contactMat);
    contactScene.add(contactPoints);

    /* Gold rings */
    const contactRingGeo = new THREE.TorusGeometry(2.4, 0.008, 6, 80);
    const contactRingMat = new THREE.MeshBasicMaterial({ color: 0xd9b877, transparent: true, opacity: 0.18 });
    const contactRingMeshes = [];
    for (let i = 0; i < 3; i++) {
      const rm = new THREE.Mesh(contactRingGeo, contactRingMat.clone());
      rm.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      rm.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
      contactScene.add(rm);
      contactRingMeshes.push(rm);
    }

    let contactMx = 0, contactMy = 0;
    contactSection.addEventListener("mousemove", (ev) => {
      contactMx = ev.clientX / window.innerWidth  - 0.5;
      contactMy = ev.clientY / window.innerHeight - 0.5;
    });

    function contactResizeThree() {
      if (!contactRenderer || !contactCamera) return;
      const w = contactSection.clientWidth  || window.innerWidth;
      const h = contactSection.clientHeight || window.innerHeight;
      contactRenderer.setSize(w, h, false);
      contactCamera.aspect = w / h;
      contactCamera.updateProjectionMatrix();
    }
    contactResizeThree();
    window.addEventListener("resize", contactResizeThree);

    contactClock = new THREE.Clock();

    function contactAnimate() {
      contactRafId = requestAnimationFrame(contactAnimate);
      const t = contactClock.getElapsedTime();

      contactPoints.rotation.y = t * 0.06 + contactMx * 0.2;
      contactPoints.rotation.x = contactMy * 0.1;
      contactCamera.position.x += (contactMx * 0.9 - contactCamera.position.x) * 0.016;
      contactCamera.position.y += (-contactMy * 0.6 - contactCamera.position.y) * 0.016;
      contactCamera.lookAt(0, 0, 0);

      contactRingMeshes.forEach((rm, i) => {
        rm.rotation.y += 0.003 + i * 0.0012;
        rm.rotation.z += 0.002;
        rm.material.opacity = 0.13 + Math.sin(t * 0.8 + i) * 0.06;
      });

      contactRenderer.render(contactScene, contactCamera);
    }

    contactAnimate();

    const contactVisObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!contactRafId && !contactPrefersReduced) contactAnimate();
        } else {
          if (contactRafId) { cancelAnimationFrame(contactRafId); contactRafId = null; }
        }
      });
    }, { threshold: 0.05 });
    contactVisObs.observe(contactSection);
  }

  contactInitThree();
}
