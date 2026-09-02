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

  function initAutoPrint() {
    if (new URLSearchParams(window.location.search).get("print") === "1") {
      window.print();
    }
  }

  function initScrollSpy() {
    var links = document.querySelectorAll("[data-nav-link]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var sections = [];
    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section) sections.push(section);
    });
    if (!sections.length) return;

    var setActive = function (id) {
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initSpotlight() {
    var portfolio = document.querySelector(".portfolio");
    if (!portfolio || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    var spot = document.createElement("div");
    spot.className = "portfolio-spotlight";
    document.body.appendChild(spot);

    var pending = false;
    window.addEventListener("mousemove", function (e) {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        spot.style.background =
          "radial-gradient(600px at " + e.clientX + "px " + e.clientY + "px, " +
          "color-mix(in srgb, var(--accent) 12%, transparent), transparent 80%)";
        spot.classList.add("is-active");
        pending = false;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTypewriter();
    initScrollReveal();
    initAutoPrint();
    initScrollSpy();
    initSpotlight();
  });
})();
