/* =========================================================
   ARI Fahrschule — Verhalten der Seite
   Kein Framework, keine externen Aufrufe.
   ========================================================= */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var toTop = document.getElementById("toTop");

  /* ---------- Farbschema ---------- */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("ari-theme", next); } catch (e) {}
    });
  }

  /* ---------- Menü auf schmalen Bildschirmen ---------- */
  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Fortschritt, Kopfzeile, Nach-oben-Knopf ---------- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 12);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  var reveals = document.querySelectorAll(".reveal, .road-step");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Bewegung, die am Scrollfortschritt hängt ----------
     Der Golf fährt die Strecke im Ablauf-Abschnitt ab, das Rad im
     Zahlenband dreht sich mit. Beides sind reine Zierde: Ohne dieses
     Skript steht der Wagen am Anfang der Strecke und alles bleibt
     lesbar. Wer Bewegung abbestellt hat, bekommt gar keine.          */
  var stillPlease = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var drivers = [];

  if (!stillPlease) {
    var roadRun = document.getElementById("roadRun");
    if (roadRun) {
      drivers.push({ el: roadRun, prop: "--drive", from: -0.28, to: 1.34 });
      // Wie oft sich die Räder auf der Strecke drehen müssen, ergibt sich
      // aus Reifenumfang und Fahrweg — geraten sähe man sofort.
      var messeUmdrehungen = function () {
        var wagen = roadRun.querySelector(".wagen");
        if (!wagen) return;
        var breite = wagen.offsetWidth;
        var strecke = roadRun.clientWidth - breite;
        var reifen = breite * 0.17840;           // Reifenaussendurchmesser
        if (reifen > 0 && strecke > 0) {
          roadRun.style.setProperty("--turns", (strecke / (Math.PI * reifen)).toFixed(2));
        }
      };
      messeUmdrehungen();
      window.addEventListener("resize", messeUmdrehungen, { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(messeUmdrehungen);
      window.addEventListener("load", messeUmdrehungen);
    }
    var wheel = document.querySelector(".strip-wheel");
    if (wheel) {
      drivers.push({ el: wheel.closest(".strip") || wheel, target: wheel, prop: "--spin", from: 0, to: 1.4, clamp: false });
    }
  }

  function updateDrivers() {
    var vh = window.innerHeight;
    drivers.forEach(function (d) {
      var box = d.el.getBoundingClientRect();
      // 0 = Element betritt das Bild von unten, 1 = es verlässt es oben
      var span = vh + box.height;
      var p = (vh - box.top) / span;
      p = Math.max(0, Math.min(1, p));
      var value = d.from + (d.to - d.from) * p;
      if (d.clamp !== false) value = Math.max(0, Math.min(1, value));
      (d.target || d.el).style.setProperty(d.prop, value.toFixed(4));
    });
  }

  if (drivers.length) {
    window.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateDrivers);
    }, { passive: true });
    window.addEventListener("resize", updateDrivers, { passive: true });
    updateDrivers();
  }

  /* ---------- Zahlen im Band hochzählen ----------
     Läuft einmal, wenn das Band ins Bild kommt. Wer Bewegung
     abbestellt hat, sieht sofort die Endzahl.                */
  var counters = document.querySelectorAll("[data-count]");

  if (counters.length && "IntersectionObserver" in window && !stillPlease) {
    var counted = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counted.unobserve(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counted.observe(el); });
  }

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    var start = null;
    var dur = 900;
    function frame(now) {
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
    }
    el.textContent = "0" + suffix;
    window.requestAnimationFrame(frame);
  }

  /* ---------- Aktiver Menüpunkt ---------- */
  var sections = ["fahrschule", "klassen", "ablauf", "standorte", "faq", "kontakt"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        document.querySelectorAll(".main-nav a").forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- FAQ: immer nur eine Antwort offen ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Kontaktformular ----------
     Die Seite liegt statisch, es gibt also keinen Server, der Post
     verschicken könnte. Statt ein Formular vorzutäuschen, das ins Leere
     läuft, öffnen wir das E-Mail-Programm mit fertigem Text an die
     Adresse der Fahrschule. Wer später einen Formulardienst nutzt
     (z. B. Formspree), ersetzt nur diesen Block.                       */
  var MAIL = "Info@fahrschule-ari.de";
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#cf-name");
      var mail = form.querySelector("#cf-mail");
      var phone = form.querySelector("#cf-phone");
      var klasse = form.querySelector("#cf-class");
      var msg = form.querySelector("#cf-msg");
      var ds = form.querySelector("#cf-ds");

      if (!name.value.trim()) { name.focus(); sagen("Bitte trag noch deinen Namen ein."); return; }
      if (!mail.checkValidity()) { mail.focus(); sagen("Die E-Mail-Adresse sieht noch nicht vollständig aus."); return; }
      if (ds && !ds.checked) { ds.focus(); sagen("Bitte bestätige noch die Datenschutzerklärung."); return; }

      var text =
        "Name: " + name.value.trim() + "\n" +
        "Telefon: " + (phone.value.trim() || "—") + "\n" +
        "E-Mail: " + mail.value.trim() + "\n" +
        "Klasse: " + klasse.value + "\n\n" +
        (msg.value.trim() || "(keine Nachricht)") + "\n";

      window.location.href = "mailto:" + MAIL +
        "?subject=" + encodeURIComponent("Anfrage über die Webseite — " + klasse.value) +
        "&body=" + encodeURIComponent(text);

      sagen("Dein E-Mail-Programm öffnet sich. Falls nicht: " + MAIL);
    });
  }
  function sagen(text) { if (status) status.textContent = text; }

  /* ---------- Jahreszahl in der Fußzeile ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
