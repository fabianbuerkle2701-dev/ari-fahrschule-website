/* =========================================================
   Bestätigung der Datenschutzerklärung

   Kein Cookie-Banner: Die Seite setzt keine Cookies, lädt nichts von
   Dritten und braucht daher für nichts eine Einwilligung. Was hier
   passiert, ist eine einmalige Kenntnisnahme der Datenschutzerklärung —
   ohne Ablehnen-Knopf, weil es nichts abzulehnen gibt, und ohne
   Sperrbildschirm, weil die Seite auch vorher nichts verarbeitet.

   Einwilligungspflichtig wird genau eine Sache: der Assistent, sobald
   er über assistant-backend/ mit einem Sprachmodell läuft. Dann
   verlassen Nachrichten den Browser, und er fragt vorher nach.
   ========================================================= */
(function () {
  "use strict";

  var SCHLUESSEL = "ari-datenschutz";
  var FASSUNG = 1;          // hochzählen, wenn sich die Verarbeitung ändert

  function lesen() {
    try {
      var d = JSON.parse(localStorage.getItem(SCHLUESSEL) || "null");
      return d && d.fassung === FASSUNG ? d : null;
    } catch (e) { return null; }
  }
  function schreiben(d) {
    try { d.fassung = FASSUNG; localStorage.setItem(SCHLUESSEL, JSON.stringify(d)); } catch (e) {}
  }

  var stand = lesen();
  var wurzel = null;

  window.ariDatenschutz = {
    erlaubt: function (zweck) { return !!(stand && stand[zweck]); },
    setzen: function (zweck, wert) {
      stand = stand || {};
      stand[zweck] = !!wert;
      schreiben(stand);
    },
    oeffnen: function () { zeigen(); }
  };

  function zeigen() {
    if (wurzel) { wurzel.classList.add("dh-sichtbar"); return; }

    wurzel = document.createElement("aside");
    wurzel.className = "dh";
    wurzel.setAttribute("role", "region");
    wurzel.setAttribute("aria-label", "Datenschutz");
    wurzel.innerHTML =
      '<div class="dh-innen">' +
        '<p class="dh-text">Diese Seite setzt keine Cookies, bindet keine Werbe- oder ' +
        'Analysedienste ein und gibt nichts an Dritte weiter. ' +
        'Näheres in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
        '<button class="btn btn-gold dh-ok" type="button">Akzeptieren</button>' +
      '</div>';
    document.body.appendChild(wurzel);

    wurzel.querySelector(".dh-ok").addEventListener("click", function () {
      window.ariDatenschutz.setzen("erklaerung", true);
      wurzel.classList.remove("dh-sichtbar");
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { wurzel.classList.add("dh-sichtbar"); });
    });
  }

  function start() {
    document.querySelectorAll("[data-datenschutz-oeffnen]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); zeigen(); });
    });
    if (!window.ariDatenschutz.erlaubt("erklaerung")) {
      window.setTimeout(zeigen, 800);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
