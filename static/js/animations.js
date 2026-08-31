(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function typewriter(el) {
    var text = el.getAttribute("data-text") || el.textContent;
    if (reduceMotion) {
      el.textContent = text;
      el.classList.add("done");
      return;
    }
    el.textContent = "";
    var i = 0;
    (function step() {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(step, 45);
      } else {
        el.classList.add("done");
      }
    })();
  }

  function initTypewriter() {
    document.querySelectorAll("[data-typewriter]").forEach(typewriter);
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTypewriter();
    initScrollReveal();
  });
})();
