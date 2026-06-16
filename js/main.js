document.addEventListener("DOMContentLoaded", function () {
  // ============================================================
  // 1. SCROLL-SPY — active nav link highlighting
  // ============================================================
  const navLinks = Array.from(
    document.querySelectorAll('.nav-link[href^="#"]:not(.no-spy)'),
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let currentActive = null;

  function setActive(id) {
    if (currentActive === id) return;
    currentActive = id;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === id) link.classList.add("active");
      else link.classList.remove("active");
    });
    if (history.replaceState) history.replaceState(null, "", id);
    else location.hash = id;
  }

  function detectActive() {
    const navbar = document.querySelector(".navbar");
    const offset = navbar?.offsetHeight ? navbar.offsetHeight + 8 : 80;
    let best = { id: null, distance: Infinity };

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const distance = Math.abs(rect.top - offset);
        if (distance < best.distance) best = { id: "#" + sec.id, distance };
      }
    });

    if (best.id) setActive(best.id);
  }

  if (sections.length) {
    const observer = new IntersectionObserver(() => detectActive(), {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    });
    sections.forEach((s) => observer.observe(s));

    let tId = null;
    function debounceDetect() {
      clearTimeout(tId);
      tId = setTimeout(detectActive, 100);
    }
    window.addEventListener("scroll", debounceDetect, { passive: true });
    window.addEventListener("resize", debounceDetect);
    detectActive();
  }

  // ============================================================
  // 2. MOBILE NAVBAR — close menu after clicking a link
  // ============================================================
  const navbarCollapse = document.getElementById("navbarNav");
  if (navbarCollapse) {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      });
    });
  }

  // ============================================================
  // 4. NAVBAR TRANSPARENCY — glass effect on scroll
  // ============================================================
  const navbar = document.querySelector(".navbar");
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) navbar.classList.add("navbar-scrolled");
      else navbar.classList.remove("navbar-scrolled");
    },
    { passive: true },
  );

  // ============================================================
  // 5. VIDEO CAROUSEL — play only active slide's video
  // ============================================================
  const carouselEl = document.getElementById("highlightsCarousel");
  if (carouselEl) {
    function syncVideos() {
      carouselEl.querySelectorAll(".carousel-item video").forEach((v) => {
        v.pause();
        v.currentTime = 0;
      });
      const activeVideo = carouselEl.querySelector(
        ".carousel-item.active video",
      );
      if (activeVideo) activeVideo.play().catch(() => {});
    }

    carouselEl.addEventListener("slid.bs.carousel", syncVideos);
    syncVideos();
  }
});
