/* =========================================================
   Besucherzähler

   Die Zahl kommt vom eigenen Cloudflare Worker (siehe
   besucher-backend/). Ohne data-api bleibt die Zeile unsichtbar —
   es wird nie eine erfundene Zahl angezeigt.

   Gezählt wird einmal je Besuchssitzung, nicht je Seitenaufruf:
   Wer sich durch fünf Seiten klickt, ist ein Besucher, nicht fünf.
   ========================================================= */
(function () {
  "use strict";

  var SELF = document.currentScript;
  var API = (SELF && SELF.getAttribute("data-api")) || window.ARI_ZAEHLER_API || null;
  var SITZUNG = "ari-besuch-gezaehlt";

  function ziel() { return document.getElementById("besucherzaehler"); }

  function schreiben(stand, istNeu) {
    var el = ziel();
    if (!el || !stand) return;
    var zahl = el.querySelector(".bz-zahl");
    var text = el.querySelector(".bz-text");
    zahl.textContent = stand.toLocaleString("de-DE");
    text.textContent = istNeu ? "Du bist Besucher Nr." : "Besucher bisher";
    el.hidden = false;
    hochzaehlen(zahl, stand);
  }

  // Kleine Bewegung beim Erscheinen. Wer Bewegung abbestellt hat,
  // sieht sofort die Endzahl.
  function hochzaehlen(el, ziel) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var start = null, dauer = 900;
    var von = Math.max(0, ziel - Math.min(ziel, 120));
    function schritt(jetzt) {
      if (start === null) start = jetzt;
      var p = Math.min(1, (jetzt - start) / dauer);
      var weich = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(von + (ziel - von) * weich).toLocaleString("de-DE");
      if (p < 1) window.requestAnimationFrame(schritt);
    }
    window.requestAnimationFrame(schritt);
  }

  function holen() {
    if (!API || !ziel()) return;

    var gezaehlt = false;
    try { gezaehlt = sessionStorage.getItem(SITZUNG) === "1"; } catch (e) {}

    var steuerung = new AbortController();
    var frist = window.setTimeout(function () { steuerung.abort(); }, 6000);

    fetch(API, {
      method: gezaehlt ? "GET" : "POST",
      signal: steuerung.signal,
      headers: { "Content-Type": "application/json" }
    })
      .then(function (a) {
        if (!a.ok) throw new Error("HTTP " + a.status);
        return a.json();
      })
      .then(function (d) {
        window.clearTimeout(frist);
        if (!d || typeof d.stand !== "number") return;
        if (!gezaehlt) {
          try { sessionStorage.setItem(SITZUNG, "1"); } catch (e) {}
        }
        schreiben(d.stand, !gezaehlt);
      })
      .catch(function () {
        // Zähler nicht erreichbar: Zeile bleibt aus, die Seite merkt es nicht.
        window.clearTimeout(frist);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", holen);
  } else {
    holen();
  }
})();
