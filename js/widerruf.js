/* =========================================================
   ARI Fahrschule, Widerrufsfunktion ("Vertrag widerrufen")
   Nur auf widerruf.html geladen.

   Zwei Schritte, wie es § 312l BGB fuer die Widerrufsfunktion vorsieht:
   erst die Angaben, dann eine Zusammenfassung mit eigener Bestaetigung.
   Verschickt wird wie beim Kontaktformular nichts von hier aus: Der
   zweite Klick oeffnet das E-Mail-Programm mit der fertigen Erklaerung
   an die Fahrschule. Bis dahin verlaesst nichts den Browser.
   ========================================================= */
(function () {
  "use strict";

  var MAIL = "Info@fahrschule-ari.de";
  var form = document.getElementById("widerrufForm");
  if (!form) return;

  var schritt1 = document.getElementById("wfSchritt1");
  var schritt2 = document.getElementById("wfSchritt2");
  var status = document.getElementById("wfStatus");
  var senden = document.getElementById("wfSenden");
  var zurueck = document.getElementById("wfZurueck");

  var name = form.querySelector("#wf-name");
  var mail = form.querySelector("#wf-mail");
  var anschrift = form.querySelector("#wf-anschrift");
  var vertrag = form.querySelector("#wf-vertrag");
  var datum = form.querySelector("#wf-datum");

  function sagen(text) { if (status) status.textContent = text; }

  /* "2026-10-23" aus dem Datumsfeld wird zu "23.10.2026", so wie man es
     in einer deutschen Erklaerung erwartet. */
  function deutschesDatum(iso) {
    var t = iso.split("-");
    return t.length === 3 ? t[2] + "." + t[1] + "." + t[0] : iso;
  }
  function heute() {
    return new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function erklaerungsText() {
    var zeilen =
      "Hallo Fahrschule ARI,\n\n" +
      "hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die " +
      "Erbringung der folgenden Dienstleistung:\n" +
      vertrag.value.trim() + "\n\n" +
      "Vertrag geschlossen am: " + deutschesDatum(datum.value) + "\n\n" +
      "Name: " + name.value.trim() + "\n";
    if (anschrift.value.trim()) zeilen += "Anschrift: " + anschrift.value.trim() + "\n";
    zeilen +=
      "E-Mail: " + mail.value.trim() + "\n\n" +
      "Datum: " + heute() + "\n\n" +
      "Bitte bestätigen Sie mir den Eingang dieses Widerrufs per E-Mail.\n\n" +
      "Viele Grüße\n" +
      name.value.trim() + "\n";
    return zeilen;
  }

  /* Schritt 1: pruefen und Zusammenfassung zeigen. In Feldreihenfolge,
     damit der Fokus nicht ueber das Formular springt. */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!name.value.trim()) { name.focus(); sagen("Bitte trag noch deinen Namen ein."); return; }
    if (!mail.checkValidity()) { mail.focus(); sagen("Die E-Mail-Adresse sieht noch nicht vollständig aus."); return; }
    if (!vertrag.value.trim()) { vertrag.focus(); sagen("Bitte nenn noch kurz, welchen Vertrag du widerrufst, zum Beispiel „Ausbildungsvertrag Klasse B“."); return; }
    if (!datum.value || !datum.checkValidity()) { datum.focus(); sagen("Bitte gib noch an, wann der Vertrag geschlossen wurde."); return; }

    document.getElementById("wfZVertrag").textContent = vertrag.value.trim();
    document.getElementById("wfZDatum").textContent = deutschesDatum(datum.value);
    document.getElementById("wfZName").textContent = name.value.trim();
    document.getElementById("wfZMail").textContent = mail.value.trim();
    var aZeile = document.getElementById("wfZAnschriftZeile");
    document.getElementById("wfZAnschrift").textContent = anschrift.value.trim();
    aZeile.hidden = !anschrift.value.trim();

    schritt1.hidden = true;
    schritt2.hidden = false;
    sagen("");
    senden.focus();
  });

  zurueck.addEventListener("click", function () {
    schritt2.hidden = true;
    schritt1.hidden = false;
    sagen("");
    name.focus();
  });

  /* Schritt 2: die eigentliche Erklaerung, per E-Mail-Programm. */
  senden.addEventListener("click", function () {
    var text = erklaerungsText();
    var adresse = "mailto:" + MAIL +
      "?subject=" + encodeURIComponent("Widerruf: " + vertrag.value.trim()) +
      "&body=" + encodeURIComponent(text);

    // Viele Mailprogramme schneiden mailto-Adressen ab etwa 2000 Zeichen
    // still ab. Lieber vorher um kuerzere Angaben bitten.
    if (adresse.length > 1900) {
      schritt2.hidden = true;
      schritt1.hidden = false;
      vertrag.focus();
      sagen("Die Angaben sind für den E-Mail-Weg etwas zu lang. Kürze bitte die Vertragsbezeichnung oder die Anschrift.");
      return;
    }

    window.location.href = adresse;
    sagen("Dein E-Mail-Programm öffnet sich mit der Widerrufserklärung. Falls nicht: " + MAIL);
  });
})();
