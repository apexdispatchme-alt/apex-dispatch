/* Apex Dispatch — interactions. No external dependencies. */
(function () {
  "use strict";

  var RECIPIENT = "apex.dispatch.me@gmail.com";
  var GMAIL_COMPOSE = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(RECIPIENT);

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Quote form → Gmail compose ---------- */
  var form = document.getElementById("quoteForm");
  var errBox = document.getElementById("formError");

  function buildComposeUrl(data) {
    var subject = "Quote Request — " + data.name + " (MC#" + data.mc + ")";
    var lines = [
      "New quote request from the Apex Dispatch website",
      "",
      "Name: " + data.name,
      "MC Number: " + data.mc,
      "Truck / Trailer & Fleet: " + data.equipment,
      "",
      "Message:",
      data.message || "(none provided)"
    ];
    return (
      GMAIL_COMPOSE +
      "&su=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"))
    );
  }

  // Exposed for verification/testing in console: window.__apexBuildQuoteUrl({...})
  window.__apexBuildQuoteUrl = buildComposeUrl;

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("qName").value.trim();
      var mc = document.getElementById("qMC").value.trim();
      var equipment = document.getElementById("qEquip").value.trim();
      var message = document.getElementById("qMsg").value.trim();

      if (!name || !mc || !equipment) {
        if (errBox) errBox.hidden = false;
        return;
      }
      if (errBox) errBox.hidden = true;

      var url = buildComposeUrl({ name: name, mc: mc, equipment: equipment, message: message });
      window.open(url, "_blank", "noopener");
    });
  }
})();
