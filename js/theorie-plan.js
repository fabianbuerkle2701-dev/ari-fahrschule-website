/* =========================================================
   ARI Fahrschule, welches Thema an welchem Abend dran ist
   Nur auf theorie-themen.html geladen.
   ========================================================= */
(function () {
  "use strict";

  var wurzel = document.getElementById("themaPlan");
  if (!wurzel) return;

  /* Die 14 Themen in der amtlichen Reihenfolge (FahrschAusbO, Anlage 1
     und Anlage 2.2). Index 0 ist Thema 1. */
  var THEMEN = [
    "Persönliche Voraussetzungen",
    "Risikofaktor Mensch",
    "Rechtliche Rahmenbedingungen",
    "Straßenverkehrssystem und seine Nutzung",
    "Vorfahrt und Verkehrsregelungen",
    "Verkehrszeichen und Verkehrseinrichtungen sowie Bahnübergänge",
    "Andere Teilnehmer im Straßenverkehr",
    "Geschwindigkeit, Abstand und umweltschonende Fahrweise",
    "Verkehrsverhalten bei Fahrmanövern, Verkehrsbeobachtung",
    "Ruhender Verkehr",
    "Verhalten in besonderen Situationen, Folgen von Verstößen gegen Verkehrsvorschriften",
    "Lebenslanges Lernen",
    "Technische Bedingungen, Personen- und Güterbeförderung, umweltbewusster Umgang mit Kraftfahrzeugen",
    "Fahren mit Solokraftfahrzeugen und Zügen"
  ];

  /* Ankerpunkt: Montag, 17. August 2026, Thema 10, in Zähringen. Von hier
     aus laeuft die Reihenfolge fortlaufend weiter, Montag - Dienstag -
     Donnerstag, danach wieder von vorn bei Thema 1. Aendert sich der
     tatsaechliche Rhythmus einmal, reicht es, diese drei Werte
     anzupassen, der Rest rechnet sich von selbst weiter. */
  var ANKER = new Date(2026, 7, 17); // Monat ist nullbasiert: 7 = August
  var ANKER_THEMA = 10;              // 1-basiert
  var ABENDE = [
    { tag: 1, ort: "Zähringen" },   // Montag
    { tag: 2, ort: "Stühlinger" },  // Dienstag
    { tag: 4, ort: "Stühlinger" }   // Donnerstag
  ];

  function mitternacht(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function abendAn(tag) {
    for (var i = 0; i < ABENDE.length; i++) {
      if (ABENDE[i].tag === tag.getDay()) return ABENDE[i];
    }
    return null;
  }

  /* Zaehlt, wie viele Unterrichtsabende zwischen dem Ankertag und dem
     Zieltag liegen, positiv fuer Tage danach, negativ fuer Tage davor.
     Ein einfacher Tag-fuer-Tag-Schritt statt einer Formel: Bei drei
     Abenden pro Woche sind das selbst nach Jahren nur ein paar hundert
     Schritte, dafuer ist die Rechnung auf Anhieb nachvollziehbar. */
  function indexFuer(ziel) {
    var richtung = ziel.getTime() >= ANKER.getTime() ? 1 : -1;
    var n = 0;
    var tag = mitternacht(ANKER);
    var zielTag = mitternacht(ziel);
    while (tag.getTime() !== zielTag.getTime()) {
      tag.setDate(tag.getDate() + richtung);
      if (abendAn(tag)) n += richtung;
    }
    return n;
  }

  function themaFuer(ziel) {
    var n = indexFuer(ziel);
    var i = (((ANKER_THEMA - 1 + n) % THEMEN.length) + THEMEN.length) % THEMEN.length;
    return { nummer: i + 1, titel: THEMEN[i] };
  }

  /* Die naechsten paar Unterrichtsabende ab einem Starttag, inklusive
     diesem Tag, falls er selbst einer ist. */
  function naechsteAbende(ab, anzahl) {
    var liste = [];
    var tag = mitternacht(ab);
    var sicherung = 0;
    while (liste.length < anzahl && sicherung < 60) {
      var abend = abendAn(tag);
      if (abend) {
        liste.push({ datum: new Date(tag), ort: abend.ort, thema: themaFuer(tag) });
      }
      tag.setDate(tag.getDate() + 1);
      sicherung++;
    }
    return liste;
  }

  function karteBauen(eintrag) {
    var karte = document.createElement("article");
    karte.className = "thema-karte";

    var kopf = document.createElement("div");
    kopf.className = "thema-kopf";

    var tag = document.createElement("span");
    tag.className = "thema-tag";
    tag.textContent = "Thema " + eintrag.thema.nummer;
    kopf.appendChild(tag);

    var datum = document.createElement("h3");
    datum.textContent = eintrag.datum.toLocaleDateString("de-DE", {
      weekday: "long", day: "numeric", month: "long"
    });
    kopf.appendChild(datum);

    karte.appendChild(kopf);

    var titel = document.createElement("p");
    titel.className = "thema-titel";
    titel.textContent = eintrag.thema.titel;
    karte.appendChild(titel);

    var ort = document.createElement("p");
    ort.className = "thema-ort";
    ort.textContent = eintrag.ort + ", 18:00 bis 19:30 Uhr";
    karte.appendChild(ort);

    return karte;
  }

  var heute = mitternacht(new Date());
  var abende = naechsteAbende(heute, 3);
  if (!abende.length) return; // Sicherung fuer falsch gesetzte ABENDE-Liste

  var liste = document.createElement("div");
  liste.className = "thema-karten";
  abende.forEach(function (eintrag) {
    liste.appendChild(karteBauen(eintrag));
  });

  wurzel.textContent = "";
  wurzel.appendChild(liste);
})();
