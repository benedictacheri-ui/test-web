(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animate a number from 0 to its data-target value
  function countUp(el, duration) {
    var target = Number(el.dataset.target);
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = 0;
    requestAnimationFrame(step);
  }

  // Fill a bar to its data-value percentage
  function fillBar(el) {
    el.style.width = el.dataset.value + "%";
  }

  var observer = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.classList.contains("bar-fill")) fillBar(el);
          else countUp(el, 1100);
          observer.unobserve(el);
        });
      }, { threshold: 0.4 })
    : null;

  // Drop the score elements into place when the card scrolls into view
  var scoreCard = document.querySelector(".score-visual");
  if (scoreCard) {
    if ("IntersectionObserver" in window) {
      var dropObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scoreCard.classList.add("in-view");
            dropObserver.disconnect();
          }
        });
      }, { threshold: 0.35 });
      dropObserver.observe(scoreCard);
    } else {
      scoreCard.classList.add("in-view");
    }
  }

  document.querySelectorAll(".bar-fill, .count, .score-number").forEach(function (el) {
    if (observer) observer.observe(el);
    else if (el.classList.contains("bar-fill")) fillBar(el);
  });
})();
