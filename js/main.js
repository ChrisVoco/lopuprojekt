document.addEventListener("DOMContentLoaded", function () {
  const navLinks = Array.from(
    document.querySelectorAll('.nav-link[href^="#"]:not(.no-spy)'),
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  let currentActive = null;

  function setActive(id) {
    if (currentActive === id) return;
    currentActive = id;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === id) link.classList.add("active");
      else link.classList.remove("active");
    });
    if (history.replaceState) {
      history.replaceState(null, "", id);
    } else {
      location.hash = id;
    }
  }

  function detectActive() {
    const navbar = document.querySelector(".navbar");
    const offset = navbar && navbar.offsetHeight ? navbar.offsetHeight + 8 : 80;
    let best = { id: null, distance: Infinity };

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      // consider only visible sections
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const distance = Math.abs(rect.top - offset);
        if (distance < best.distance) {
          best = { id: "#" + sec.id, distance };
        }
      }
    });

    if (best.id) setActive(best.id);
  }

  // IntersectionObserver triggers on changes; use it to run detectActive as well
  const observer = new IntersectionObserver(() => detectActive(), {
    root: null,
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0,
  });
  sections.forEach((s) => observer.observe(s));

  // also handle scroll/resize with debounce
  let tId = null;
  function debounceDetect() {
    clearTimeout(tId);
    tId = setTimeout(detectActive, 100);
  }
  window.addEventListener("scroll", debounceDetect, { passive: true });
  window.addEventListener("resize", debounceDetect);

  // initial detection (handles landing on a hash)
  detectActive();
});


const swiper = new Swiper(".highlights-slider", {
  slidesPerView: 1.3,
  centeredSlides: true,
  spaceBetween: 20,
});

function handleVideos() {
  document.querySelectorAll(".swiper-slide video").forEach(v => {
    v.pause();
  });

  const active = document.querySelector(".swiper-slide-active video");
  if (active) active.play();
}

swiper.on("slideChange", handleVideos);
handleVideos();