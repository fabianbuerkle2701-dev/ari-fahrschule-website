/* =========================================================
   ARI, der Assistent der Freiburger Fahrschule ARI

   Zwei Betriebsarten:

   1. Ohne Schlüssel (Standard)
      Antworten kommen aus der Wissensbasis weiter unten.
      Alles läuft im Browser, es verlässt nichts das Gerät,
      es kostet nichts und es kann nichts erfunden werden.

   2. Mit Sprachmodell
      <script src="js/assistant.js" data-api="https://…workers.dev"></script>
      Dann formuliert ein echtes Modell die Antworten frei.
      Fällt der Dienst aus oder braucht er zu lange, springt
      automatisch wieder die Wissensbasis ein.

   In beiden Betriebsarten kann der Assistent auch eine Anfrage
   aufnehmen: Name, Telefon, E-Mail, Klasse, Anliegen, der Reihe nach
   erfragt, dann dieselbe Art E-Mail wie das Kontaktformular. Das laeuft
   komplett lokal und oeffnet am Ende mailto:, genau wie das Formular in
   main.js - es verlaesst nichts den Browser, bis der Besuch selbst im
   eigenen Mailprogramm auf Senden geht. Siehe "Anfrage im Gespraech"
   weiter unten.

   Einrichtung: siehe assistant-backend/README.md
   ========================================================= */
(function () {
  "use strict";

  var SELF = document.currentScript;
  var API_URL = (SELF && SELF.getAttribute("data-api")) || window.ARI_API_URL || null;

  var PHONE_HUMAN = "0176 43454447";
  var PHONE_LINK = "+4917643454447";
  var MAIL = "Info@fahrschule-ari.de";

  /* ---------------------------------------------------------
     Wissensbasis
     Jedes Thema: Stichwörter zum Erkennen, dazu die Antwort.
     "handoff: true" blendet Anrufen/E-Mail unter die Antwort ein,
     überall dort, wo eine verbindliche Auskunft fällig wäre.
     --------------------------------------------------------- */
  var PACK = {
    openLabel: "Fragen?",
    title: "ARI Assistent",
    subtitle: "antwortet sofort",
    badge: "KI",
    greeting:
      "Hallo! Ich bin der Assistent der Fahrschule ARI in Freiburg.\nFrag mich nach Klassen, Theoriezeiten, Standorten oder dem Ablauf, oder ich nehme gleich hier deine Anfrage auf. Ich antworte sofort.",
    disclaimer:
      "Ich bin ein digitaler Assistent, kein Fahrlehrer. Bei Preisen und allem Verbindlichen hole ich lieber das Team dazu.",
    inputLabel: "Deine Frage",
    placeholder: "Frag mich etwas …",
    send: "Senden",
    close: "Schließen",
    typing: "ARI schreibt …",
    suggestionsLabel: "Häufig gefragt",
    moreLabel: "Das interessiert andere auch",
    fallback:
      "Da bin ich mir nicht sicher, ob ich dich richtig verstanden habe, und dann rate ich lieber nicht.\n\nSchau, ob unten etwas passt. Oder schreib \"Anfrage\", dann nehme ich hier gleich deine Angaben auf.",
    handoffTitle: "Lieber direkt sprechen?",
    callLabel: "Anrufen",
    mailLabel: "E-Mail",
    privacy: "Dieses Gespräch bleibt in deinem Browser. Wir speichern nichts.",
    privacyApi: "Deine Nachrichten werden zur Beantwortung verarbeitet. Bitte keine sensiblen Daten senden.",

    topics: [
      {
        id: "preis",
        label: "Was kostet der Führerschein?",
        keywords: ["preis", "preise", "kosten", "kostet", "teuer", "guenstig", "euro", "gebuehr", "zahlen", "bezahlen", "pauschale", "tarif", "rate", "ratenzahlung", "finanzierung", "grundbetrag", "fahrstunde", "preisaushang"],
        answer:
          "Die festen Posten stehen offen auf der Seite unter Preise, so wie im Preisaushang:\n\n• Klasse B: Grundbetrag 499 €\n• Fahrstunde: 79 € je 45 Minuten\n• Sonderfahrten: 85 € je 45 Minuten\n• Vorstellung zur Theorieprüfung: 79 €, zur praktischen Prüfung: 199 €\n• Klasse BE: Grundbetrag 299 €, zusammen mit B nur 699 €\n• B96-Kurs: 599 €\n• Lern-App: 89 € einmalig, nicht im Grundbetrag enthalten\n\nWas ich dir nicht sagen kann, ist die Endsumme. Die hängt daran, wie viele Fahrstunden du brauchst, und das ist von Mensch zu Mensch verschieden. Dazu kommen die amtlichen Gebühren von Führerscheinstelle und Prüforganisation.\n\nRuf kurz an, dann schätzen wir das für deine Situation realistisch ein.",
        handoff: true
      },
      {
        id: "klassen",
        label: "Welche Klassen bildet ihr aus?",
        keywords: ["klasse", "klassen", "welche", "angebot", "ausbildung", "kategorie", "auto", "pkw", "anbieten", "bietet"],
        answer:
          "Wir bilden in vier Klassen aus:\n\n• B: der Autoführerschein bis 3.500 kg, AM und L sind enthalten\n• B197: du lernst auf Automatik und bekommst trotzdem den Führerschein ohne Automatik-Eintrag\n• B96: Anhängerschulung bis 4.250 kg Gesamtgewicht, ohne Prüfung\n• BE: die große Anhängerklasse mit eigener praktischer Prüfung\n\nWelche zu dir passt, hängt davon ab, was du fahren willst. Sag mir, was du vorhast."
      },
      {
        id: "b197",
        label: "Automatik oder Schaltung?",
        keywords: ["automatik", "b197", "197", "schaltung", "schalter", "handschaltung", "getriebe", "kupplung", "eintrag", "beschraenkung"],
        answer:
          "Mit B197 hast du beides: Du lernst und prüfst auf Automatik, machst zusätzlich mindestens zehn Fahrstunden auf dem Schalter und am Ende eine Testfahrt. Dein Führerschein gilt danach ohne Automatik-Beschränkung.\n\nFür viele ist das der ruhigere Weg, weil man sich am Anfang auf den Verkehr konzentriert statt auf die Kupplung.\n\nDu kannst natürlich auch klassisch auf Schaltung lernen. Was dir mehr liegt, merken wir in den ersten Stunden."
      },
      {
        id: "anhaenger",
        label: "B96 oder BE: was brauche ich?",
        keywords: ["b96", "96", "be", "anhaenger", "anhanger", "wohnwagen", "caravan", "pferdeanhaenger", "boot", "gespann", "zugfahrzeug", "ziehen", "haenger"],
        answer:
          "Das entscheidet das Gewicht deines Gespanns.\n\nB96 ist eine Schulung ohne Prüfung: Zugfahrzeug und Anhänger dürfen zusammen bis 4.250 kg wiegen. Das reicht für die meisten Wohnwagen.\n\nBE ist eine eigene Klasse mit praktischer Prüfung und geht deutlich darüber hinaus.\n\nAm besten bringst du die Fahrzeugscheine von Auto und Anhänger mit, dann rechnen wir es zusammen aus und du bezahlst nichts, was du nicht brauchst.",
        handoff: true
      },
      {
        id: "theorie",
        label: "Wann ist Theorieunterricht?",
        keywords: ["theorie", "theorieunterricht", "unterricht", "abend", "abends", "vorlesung", "theoriestunde", "doppelstunde", "montag", "dienstag", "donnerstag"],
        answer:
          "Theorie ist an drei Abenden pro Woche, jeweils von 18:00 bis 19:30 Uhr:\n\n• Zähringen (Zähringerstr. 373): montags\n• Stühlinger (Stühlingerstr. 12): dienstags und donnerstags\n\nFür Klasse B sind es 12 Doppelstunden Grundstoff à 90 Minuten und 2 Doppelstunden Zusatzstoff. Der Unterricht ist in geschlossene Themenblöcke gegliedert, du kannst also jederzeit einsteigen, ohne auf einen Kursstart zu warten, und die Abende mischen."
      },
      {
        id: "oeffnung",
        label: "Wann habt ihr Büro?",
        keywords: ["oeffnungszeiten", "offnungszeiten", "geoeffnet", "geoffnet", "buero", "buro", "sprechzeiten", "wann offen", "erreichbar", "vorbeikommen", "offen"],
        answer:
          "Unsere Bürozeiten:\n\n• Zähringen: Montag und Freitag, 12:00 bis 18:00 Uhr\n• Stühlinger: Dienstag und Donnerstag, 12:00 bis 18:00 Uhr\n\nDanach ist an denselben Standorten Theorie von 18:00 bis 19:30 Uhr, in Zähringen nur montags.\n\nAn Feiertagen und in den Ferien kann das abweichen. Ein kurzer Anruf vorher spart dir den Weg."
      },
      {
        id: "standort",
        label: "Wo finde ich euch?",
        keywords: ["adresse", "wo", "standort", "standorte", "anfahrt", "finden", "strasse", "zaehringen", "zahringen", "stuehlinger", "stuhlinger", "freiburg", "parken", "karte", "hinkommen", "filiale"],
        answer:
          "Wir sind an zwei Standorten in Freiburg:\n\n• Zähringen: Zähringerstraße 373, 79108 Freiburg\n• Stühlinger: Stühlingerstraße 12, 79106 Freiburg\n\nDein Vertrag gilt für beide. Du suchst dir aus, wo Theorie und Büro für dich günstiger liegen."
      },
      {
        id: "anmeldung",
        label: "Wie melde ich mich an?",
        keywords: ["anmelden", "anmeldung", "melde", "angemeldet", "einschreiben", "registrieren", "starten", "anfangen", "loslegen", "beginnen", "dabei", "aufnehmen", "platz", "warteliste"],
        answer:
          "Am einfachsten hier: Schreib \"Anfrage\", dann frage ich dich der Reihe nach ab und stelle daraus eine Nachricht an uns zusammen.\n\nGeht auch über das Kontaktformular auf der Startseite, per E-Mail an " + MAIL + " oder telefonisch: " + PHONE_HUMAN + ". Vorbeikommen geht natürlich auch. Den Antrag füllen wir gemeinsam aus. Mit dem Theorieunterricht kannst du sofort starten, auch während der Antrag noch läuft.",
        handoff: true
      },
      {
        id: "unterlagen",
        label: "Welche Unterlagen brauche ich?",
        keywords: ["unterlagen", "papiere", "dokumente", "mitbringen", "brauche", "benoetige", "sehtest", "augen", "passfoto", "foto", "bild", "erste hilfe", "ersthelfer", "kurs", "antrag", "ausweis", "pass"],
        answer:
          "Das ist schnell erzählt. Du brauchst:\n\n• Personalausweis oder Reisepass\n• ein biometrisches Passfoto\n• eine Sehtestbescheinigung, nicht älter als zwei Jahre\n• den Nachweis über den Erste-Hilfe-Kurs (9 Unterrichtseinheiten)\n\nBeim Begleiteten Fahren ab 17 kommt pro Begleitperson ein Formular dazu, mit Kopie von Ausweis und Führerschein.\n\nSehtest gibt es bei jedem Optiker, Erste Hilfe bei den üblichen Anbietern. Wenn dir etwas fehlt, sag Bescheid, wir sortieren das gemeinsam."
      },
      {
        id: "bf17",
        label: "Kann ich mit 17 anfangen?",
        keywords: ["17", "16", "bf17", "bf 17", "begleitet", "begleitetes", "begleitperson", "jung", "alter", "mindestalter", "eltern", "frueh", "schon"],
        answer:
          "Ja. Ab 16½ Jahren kannst du mit der Ausbildung beginnen und hältst den Führerschein pünktlich zum 18. Geburtstag in der Hand.\n\nBeim Begleiteten Fahren ab 17 machst du den kompletten Führerschein mit 17 und fährst danach mit einer Begleitperson, die in deiner Prüfungsbescheinigung eingetragen ist. Mit 18 fällt die Begleitung weg.\n\nDen Antrag kannst du schon mit 16½ stellen, anmelden darfst du dich vorher. Wer früh anfängt, ist pünktlich zum Geburtstag fertig. Das planen wir gern rückwärts.\n\nDie Begleitperson braucht keine Ausbildung, nur ein paar Voraussetzungen. Welche genau, erklären wir dir in Ruhe."
      },
      {
        id: "fahrlehrer",
        label: "Wer unterrichtet bei euch?",
        keywords: ["fahrlehrer", "lehrer", "team", "miftar", "rexhepi", "chef", "inhaber", "erfahrung", "ausbilder", "unterrichtet"],
        answer:
          "Bei uns unterrichtet Miftar Rexhepi, seit über zehn Jahren Fahrlehrer in Freiburg. Im Februar 2024 hat er die Fahrschule ARI neu eröffnet.\n\nDas heißt für dich: kein ständiger Wechsel des Fahrlehrers. Du fährst mit jemandem, der weiß, wo du stehst und was du noch brauchst."
      },
      {
        id: "fuhrpark",
        label: "Welche Autos fahrt ihr?",
        keywords: ["auto", "autos", "fahrzeug", "fahrzeuge", "fuhrpark", "golf", "vw", "wagen", "modell", "welches"],
        answer:
          "Einen VW Golf 8 und einen VW Golf Plus mit Automatik.\n\nBeide haben aktuelle Assistenzsysteme, werden regelmäßig gewartet und sind sauber. Das ist uns wichtig, weil du dich darin wohlfühlen sollst."
      },
      {
        id: "app",
        label: "Gibt es eine Lern-App?",
        keywords: ["app", "lernapp", "lern app", "online", "handy", "lernen", "zuhause", "fragebogen", "uebungsfragen", "digital"],
        answer:
          "Ja, die Führerscheinlern-App gibt es für einmalig 89 €.\n\nDamit lernst du, wann und wo du willst, im Bus, auf dem Sofa, in der Pause. Die Theorieabende ersetzt sie nicht, aber sie macht die Vorbereitung auf die Prüfung deutlich leichter."
      },
      {
        id: "ablauf",
        label: "Wie läuft das alles ab?",
        keywords: ["ablauf", "schritte", "reihenfolge", "wie geht", "was zuerst", "beginnen", "vorgehen", "plan", "weg"],
        answer:
          "In fünf Schritten:\n\n1. Anmeldung: am besten schriftlich über das Kontaktformular, hier im Chat oder persönlich, geht aber auch telefonisch\n2. Unterlagen besorgen: Lichtbild, Sehtest, Erste-Hilfe-Kurs\n3. Fahrerlaubnis beantragen, den Papierkram machen wir gemeinsam\n4. Theorieunterricht und theoretische Prüfung\n5. Übungs- und Sonderfahrten, dann die praktische Prüfung\n\nWir sagen dir bei jedem Schritt, was ansteht. Du musst dich um nichts alleine kümmern."
      },
      {
        id: "dauer",
        label: "Wie lange dauert das?",
        keywords: ["dauer", "dauert", "lange", "schnell", "wochen", "monate", "zeit", "fertig", "intensiv", "ferien", "sommer"],
        answer:
          "Das hängt vor allem an dir.\n\nDie Theorie hast du in wenigen Wochen durch, wenn du regelmäßig zu den Abenden kommst. Bei der Praxis ist die Spanne groß: Manche brauchen wenige Stunden über die Pflichtfahrten hinaus, andere mehr. Beides ist völlig normal.\n\nWenn du auf einen festen Termin hinarbeitest, etwa Geburtstag, Studienbeginn oder Umzug, dann sag früh Bescheid. Dann planen wir von hinten."
      },
      {
        id: "fahrstunden",
        label: "Wie viele Fahrstunden brauche ich?",
        keywords: ["fahrstunde", "fahrstunden", "praxis", "praktisch", "sonderfahrten", "ueberland", "uberland", "autobahn", "nachtfahrt", "dunkelheit", "pflichtstunden", "uebungsstunden"],
        answer:
          "Vorgeschrieben sind die Sonderfahrten: fünf Fahrten über Land, vier auf der Autobahn und drei bei Dunkelheit, jeweils 45 Minuten.\n\nWie viele Übungsstunden du davor brauchst, sagt dir niemand seriös vorher. Wir sagen dir aber ehrlich, wo du stehst, und melden dich erst zur Prüfung an, wenn du wirklich so weit bist. Eine Stunde mehr ist günstiger als eine Prüfung, die schiefgeht."
      },
      {
        id: "pruefung",
        label: "Wie läuft die Prüfung ab?",
        keywords: ["pruefung", "prufung", "test", "theorieprufung", "theoriepruefung", "praktische", "tuev", "dekra", "bestanden", "durchgefallen", "fehlerpunkte", "fragen"],
        answer:
          "Erst Theorie, dann Praxis.\n\nDie Theorieprüfung machst du am Rechner bei TÜV oder DEKRA: 30 Fragen für Klasse B, bestanden mit höchstens 10 Fehlerpunkten und nie mit zwei Fünf-Punkte-Fehlern.\n\nDie praktische Prüfung dauert bei Klasse B 55 Minuten. Dein Fahrlehrer sitzt mit im Auto, der Prüfer hinten.\n\nAnmelden dürfen wir dich frühestens drei Monate vor deinem Mindestalter. Und keine Sorge: Durchfallen ist kein Weltuntergang, das lässt sich wiederholen."
      },
      {
        id: "unsicher",
        label: "Ich bin unsicher am Steuer",
        keywords: ["angst", "unsicher", "nervoes", "nervos", "panik", "traue", "schaffe", "aufregung", "pruefungsangst", "prufungsangst", "stress", "ueberfordert", "langsam"],
        answer:
          "Das hören wir öfter, als du denkst. Und es ist überhaupt nichts, wofür man sich schämen müsste.\n\nWir gehen das Tempo, das für dich passt. Keine Zurufe, kein Blick auf die Uhr, keine Prüfung, bevor du dich sicher fühlst. Angefangen wird da, wo es dir noch angenehm ist, und von dort aus wird es Schritt für Schritt mehr.\n\nSag deinem Fahrlehrer einfach gleich in der ersten Stunde, wie es dir geht. Dann kann er sich darauf einstellen.",
        handoff: true
      },
      {
        id: "ausland",
        label: "Ausländischen Führerschein umschreiben",
        keywords: ["umschreiben", "umschreibung", "auslaendisch", "auslandisch", "ausland", "anerkennung", "uebersetzung", "ubersetzung", "eu", "drittstaat", "umtausch"],
        answer:
          "Ob und wie ein ausländischer Führerschein umgeschrieben wird, hängt vom Ausstellungsland ab, und die Regeln ändern sich immer wieder.\n\nDeshalb sage ich hier bewusst nichts, worauf du dich am Ende nicht verlassen kannst. Ruf an oder komm mit deinem Führerschein vorbei, dann schauen wir uns deinen Fall konkret an.",
        handoff: true
      },
      {
        id: "kontakt",
        label: "Wie erreiche ich euch?",
        keywords: ["kontakt", "telefon", "nummer", "anrufen", "erreichen", "mail", "email", "whatsapp", "schreiben", "instagram", "melden", "anfrage", "formular", "beratung", "beraten"],
        answer:
          "Am liebsten schriftlich: " + MAIL + ", über das Kontaktformular auf der Startseite oder gleich hier im Chat, ich nehme deine Angaben auf und stelle eine Nachricht an uns zusammen.\n\nTelefonisch geht auch: " + PHONE_HUMAN + ". Auf Instagram findest du uns als @fahrschule_ari, dort posten wir Bestandene, Termine und was sonst so ansteht.",
        handoff: true
      }
    ]
  };

  /* ---------------------------------------------------------
     Erkennen, worum es geht
     --------------------------------------------------------- */
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchTopic(input) {
    var q = normalize(input);
    if (q.length < 2) return null;

    var words = q.split(" ").filter(function (w) { return w.length > 1; });
    var best = null, bestScore = 0;

    PACK.topics.forEach(function (topic) {
      var score = 0;

      topic.keywords.forEach(function (kw) {
        var k = normalize(kw);
        if (!k) return;

        // Mehrwortbegriffe zählen am stärksten, weil sie kaum zufällig passen
        if (k.indexOf(" ") !== -1) {
          if (q.indexOf(k) !== -1) score += 5;
          return;
        }

        // Ganzes Wort schlägt Wortanfang. Sonst gewinnt "auto" in
        // "autobahn" das falsche Thema.
        for (var i = 0; i < words.length; i++) {
          if (words[i] === k) { score += 3.5; return; }
        }
        if (k.length >= 5) {
          for (var j = 0; j < words.length; j++) {
            var w = words[j];
            if (w.indexOf(k) === 0 || (w.length >= 5 && k.indexOf(w) === 0)) { score += 2.5; return; }
          }
        }
      });

      if (normalize(topic.label).indexOf(q) !== -1) score += 2;
      if (score > bestScore) { bestScore = score; best = topic; }
    });

    // Schwelle 3, nicht 2.5: Ein blosser Wortanfang zaehlt 2.5, ein ganzes
    // Wort 3.5. Bei 2.5 genuegte ein einziger Zufallstreffer im Wortanfang
    // fuer eine selbstbewusste Antwort. "Wochenende" traf "wochen" und
    // brachte die Antwort zur Ausbildungsdauer. Jetzt braucht es ein
    // ganzes Wort oder zwei Wortanfaenge; sonst sagt der Assistent
    // ehrlich, dass er unsicher ist, und bietet Anruf und E-Mail an.
    return bestScore >= 3 ? best : null;
  }

  /* ---------------------------------------------------------
     Offene Vergleichsfragen ("Was ist der Unterschied zwischen
     B und B197?") und erfundene Klassen ("Was ist B78?")

     matchTopic() waehlt immer nur EIN Thema, eine Vergleichsfrage
     braeuchte aber zwei. Hier werden zuerst die im Text erwaehnten
     Klassen erkannt (bewusst nur die vier, die es wirklich gibt, in
     fester Reihenfolge fuer eine gleichbleibende Ausgabe), und eine
     Zahl hinter "b", die keine dieser Klassen ist, wird als
     nicht angebotene Klasse gemeldet statt irgendeinem Thema
     zugeordnet zu werden. Das bleibt eine feste, keine erfundene
     Antwort: Jeder Text unten steht auch schon anderswo im Code. */
  var KLASSEN_REIHENFOLGE = ["B", "B197", "B96", "BE"];
  var KLASSEN_KURZ = {
    B: "der klassische Autoführerschein bis 3.500 kg, AM und L sind enthalten, ab 18 oder mit Begleitetem Fahren ab 17",
    B197: "wie B, aber du lernst und prüfst auf Automatik und machst zusätzlich mindestens zehn Fahrstunden auf dem Schalter, danach gilt der Führerschein ohne Automatik-Beschränkung",
    B96: "eine Schulung ohne Prüfung für Anhänger, Zugfahrzeug und Anhänger zusammen bis 4.250 kg",
    BE: "die große Anhängerklasse mit eigener praktischer Prüfung, für schwerere Gespanne als B96"
  };

  function klassenErwaehnt(text) {
    var q = normalize(text);
    var treffer = [];
    if (/\bb\s?197\b/.test(q)) treffer.push("B197");
    if (/\bb\s?96\b/.test(q)) treffer.push("B96");
    if (/\bbe\b/.test(q)) treffer.push("BE");
    // Das blosse "b" erst pruefen, nachdem b197/b96 aus dem Text raus
    // sind, sonst zaehlt "b" aus "b 197" versehentlich mit.
    var q2 = q.replace(/\bb\s?197\b/g, " ").replace(/\bb\s?96\b/g, " ");
    if (/\bb\b/.test(q2)) treffer.push("B");
    return KLASSEN_REIHENFOLGE.filter(function (k) { return treffer.indexOf(k) !== -1; });
  }

  function klassenUnbekannt(text) {
    var m = normalize(text).match(/\bb\s?(\d{1,3})\b/);
    if (!m || m[1] === "96" || m[1] === "197") return null;
    return "B" + m[1];
  }

  function klassenVergleich(text) {
    var t = klassenErwaehnt(text);
    return t.length === 2 ? t : null;
  }

  function vergleichsText(paar) {
    return "Kurz gegenübergestellt:\n\n" +
      "• " + paar[0] + ": " + KLASSEN_KURZ[paar[0]] + "\n" +
      "• " + paar[1] + ": " + KLASSEN_KURZ[paar[1]] + "\n\n" +
      "Sag mir, was du vorhast, dann sage ich dir genauer, was für dich passt.";
  }

  function klassenUnbekanntText(code) {
    return "Die Klasse " + code + " gibt es bei uns nicht. Wir bilden aus in B, B197, B96 und BE.";
  }

  // Erkennt eine echte Frage an Satzzeichen oder typischen Fragewoertern
  // am Anfang. Greift auch waehrend des Anfrage-Dialogs: Sonst landete
  // eine Zwischenfrage stumm als Wert im laufenden Feld.
  var FRAGE_BEGINN = ["was", "wie", "wann", "wo", "warum", "wieso", "weshalb",
    "welche", "welcher", "welches", "kann ich", "darf ich", "gibt es",
    "gibts", "muss ich"];
  function wirktWieFrage(v) {
    if (v.indexOf("?") !== -1) return true;
    var q = normalize(v);
    return FRAGE_BEGINN.some(function (w) { return q === w || q.indexOf(w + " ") === 0; });
  }

  // Eine Stelle, die entscheidet, womit eine freie Eingabe beantwortet
  // wird: erfundene Klasse, Vergleich zweier echter Klassen, ein
  // getroffenes Thema, oder ehrlich die Rueckfallantwort. Wird sowohl
  // fuer den normalen Chat als auch fuer Zwischenfragen im Anfrage-
  // Dialog benutzt, damit beide dieselbe Antwort geben.
  function loesungFuer(v) {
    var unbekannt = klassenUnbekannt(v);
    if (unbekannt) return { text: klassenUnbekanntText(unbekannt), topic: null };

    var paar = klassenVergleich(v);
    if (paar) return { text: vergleichsText(paar), topic: null };

    var topic = matchTopic(v);
    if (topic) return { text: topic.answer, topic: topic };

    return { text: PACK.fallback, topic: null };
  }

  /* ---------------------------------------------------------
     Oberfläche
     --------------------------------------------------------- */
  function build() {
    var asked = [];
    var history = [];

    var root = document.createElement("div");
    root.className = "ari-root";
    root.innerHTML =
      '<button class="ari-launcher" type="button" aria-expanded="false" aria-controls="ariPanel">' +
        '<span class="ari-launcher-icon" aria-hidden="true">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.8L3 21l1.9-5a8.4 8.4 0 0 1-.8-3.6 8.4 8.4 0 0 1 8.4-8.4 8.4 8.4 0 0 1 8.5 8.5z"/></svg>' +
          '<span class="ari-punkt"></span>' +
        '</span>' +
        '<span class="ari-launcher-text">' +
          '<strong>' + PACK.openLabel + '</strong>' +
          '<small>' + PACK.subtitle + '</small>' +
        '</span>' +
      '</button>' +
      '<div class="ari-panel" id="ariPanel" role="dialog" aria-modal="false" aria-labelledby="ariTitle" hidden>' +
        '<header class="ari-head">' +
          '<span class="ari-avatar" aria-hidden="true">A</span>' +
          '<span class="ari-headtext">' +
            '<strong id="ariTitle">' + PACK.title + ' <span class="ari-badge">' + PACK.badge + '</span></strong>' +
            '<span>' + PACK.subtitle + '</span>' +
          '</span>' +
          '<button class="ari-close" type="button" aria-label="' + PACK.close + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
          '</button>' +
        '</header>' +
        '<div class="ari-log" id="ariLog" role="log" aria-live="polite"></div>' +
        '<div class="ari-suggest" id="ariSuggest"></div>' +
        '<form class="ari-form" id="ariForm">' +
          '<label class="sr-only" for="ariInput">' + PACK.inputLabel + '</label>' +
          '<input class="ari-input" id="ariInput" type="text" autocomplete="off" placeholder="' + PACK.placeholder + '">' +
          '<button class="ari-send" type="submit" aria-label="' + PACK.send + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '</button>' +
        '</form>' +
        '<p class="ari-privacy">' + (API_URL ? PACK.privacyApi : PACK.privacy) + '</p>' +
      '</div>';

    document.body.appendChild(root);

    var launcher = root.querySelector(".ari-launcher");
    var panel = root.querySelector(".ari-panel");
    var closeBtn = root.querySelector(".ari-close");
    var log = root.querySelector("#ariLog");
    var suggest = root.querySelector("#ariSuggest");
    var form = root.querySelector("#ariForm");
    var input = root.querySelector("#ariInput");

    function scrollLog() { log.scrollTop = log.scrollHeight; }

    // Kurze Antwort kurz "tippen", lange etwas länger. Wirkt ruhiger
    // als eine feste Verzögerung und liest sich weniger maschinell.
    function thinkTime(text) {
      return Math.min(1900, 480 + String(text || "").length * 7);
    }

    function addMsg(who, text, extraNode) {
      var wrap = document.createElement("div");
      wrap.className = "ari-msg ari-msg-" + who;
      var bubble = document.createElement("div");
      bubble.className = "ari-bubble";
      String(text).split("\n").forEach(function (line) {
        if (line === "") { bubble.appendChild(document.createElement("br")); return; }
        var p = document.createElement("p");
        p.textContent = line;   // bewusst textContent: nichts wird als HTML ausgeführt
        bubble.appendChild(p);
      });
      if (extraNode) bubble.appendChild(extraNode);
      wrap.appendChild(bubble);
      log.appendChild(wrap);
      scrollLog();
      return wrap;
    }

    function showTyping() {
      var wrap = document.createElement("div");
      wrap.className = "ari-msg ari-msg-bot";
      wrap.innerHTML = '<div class="ari-bubble"><span class="ari-dots"><i></i><i></i><i></i></span></div>';
      wrap.setAttribute("aria-label", PACK.typing);
      log.appendChild(wrap);
      scrollLog();
      return wrap;
    }

    function handoffNode() {
      var box = document.createElement("div");
      box.className = "ari-handoff";

      var t = document.createElement("span");
      t.className = "ari-handoff-title";
      t.textContent = PACK.handoffTitle;
      box.appendChild(t);

      var row = document.createElement("div");
      row.className = "ari-handoff-row";

      var call = document.createElement("a");
      call.className = "ari-hbtn ari-hbtn-primary";
      call.href = "tel:" + PHONE_LINK;
      call.textContent = PACK.callLabel;

      var mail = document.createElement("a");
      mail.className = "ari-hbtn";
      mail.href = "mailto:" + MAIL;
      mail.textContent = PACK.mailLabel;

      row.appendChild(call);
      row.appendChild(mail);
      box.appendChild(row);
      return box;
    }

    function kontaktNode() {
      var box = document.createElement("div");
      box.className = "ari-handoff";

      var t = document.createElement("span");
      t.className = "ari-handoff-title";
      t.textContent = "Am liebsten gleich hier?";
      box.appendChild(t);

      var row = document.createElement("div");
      row.className = "ari-handoff-row";

      var start = document.createElement("button");
      start.type = "button";
      start.className = "ari-hbtn ari-hbtn-primary";
      start.textContent = "Anfrage stellen";
      start.addEventListener("click", function () { anfrageStarten(); });

      var call = document.createElement("a");
      call.className = "ari-hbtn";
      call.href = "tel:" + PHONE_LINK;
      call.textContent = PACK.callLabel;

      row.appendChild(start);
      row.appendChild(call);
      box.appendChild(row);
      return box;
    }

    /* ---------------------------------------------------------
       Anfrage im Gespraech
       Fragt dieselben Angaben ab wie das Kontaktformular in main.js
       und baut daraus dieselbe Art E-Mail. "anfrage" haelt den
       Zustand, solange der Dialog laeuft; ist er gesetzt, gehen
       Eingaben nicht mehr an matchTopic(), sondern an anfrageAntwort().
       --------------------------------------------------------- */
    var anfrage = null;
    var KLASSEN_ZUSATZ = { B: "Pkw", B197: "Automatik", B96: "Anhänger", BE: "Anhänger" };
    var ANFRAGE_FELDER = [
      {
        schluessel: "name", frage: "Wie heißt du?",
        pruefen: function (v) { return v.trim().length > 0; },
        fehler: "Magst du mir noch kurz deinen Namen sagen?"
      },
      {
        schluessel: "telefon", frage: "Unter welcher Telefonnummer erreichen wir dich?",
        pruefen: function (v) { return v.replace(/\D/g, "").length >= 6; },
        fehler: "Das sieht noch nicht nach einer vollständigen Telefonnummer aus."
      },
      {
        schluessel: "email", frage: "Und deine E-Mail-Adresse?",
        pruefen: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        fehler: "Das sieht noch nicht nach einer vollständigen E-Mail-Adresse aus."
      },
      {
        schluessel: "klasse",
        frage: "Für welche Klasse interessierst du dich, B, B197, B96 oder BE? Wenn du es noch nicht weißt, schreib einfach \"weiß nicht\".",
        pruefen: function () { return true; }
      },
      {
        schluessel: "anliegen", frage: "Magst du in ein, zwei Sätzen beschreiben, worum es geht?",
        pruefen: function (v) { return v.trim().length > 0; },
        fehler: "Schreib mir noch kurz, worum es geht, dann kann das Team direkt loslegen."
      }
    ];

    // Grobe Zuordnung auf eine der vier Klassen. Trifft nichts, bleibt
    // das Feld leer, genau wie "Weiß ich noch nicht" im Formular.
    function klasseErkennen(v) {
      var q = normalize(v);
      var w = q.split(" ");
      if (w.indexOf("b197") !== -1 || q.indexOf("automatik") !== -1) return "B197";
      if (w.indexOf("b96") !== -1) return "B96";
      if (w.indexOf("be") !== -1 && q.indexOf("anhaenger") !== -1) return "BE";
      if (w.indexOf("be") !== -1 && w.length <= 2) return "BE";
      if (w.indexOf("b") !== -1) return "B";
      return "";
    }

    function anfrageStarten() {
      anfrage = { schritt: 0, daten: {} };
      suggest.textContent = "";
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot",
          "Gern, dann sammle ich kurz die wichtigsten Angaben. Du kannst jederzeit \"abbrechen\" schreiben.\n\n" +
          ANFRAGE_FELDER[0].frage);
      }, thinkTime("kurz"));
    }

    function anfrageAbbrechen() {
      anfrage = null;
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot", "Kein Problem, ich breche ab. Frag mich einfach wieder, wenn du magst.");
        renderSuggestions();
      }, thinkTime("kurz"));
    }

    function anfrageAntwort(v) {
      if (/^(abbrechen|abbruch|stop|stopp)$/i.test(v.trim())) { anfrageAbbrechen(); return; }

      var feld = ANFRAGE_FELDER[anfrage.schritt];

      // Klingt die Eingabe nach einer echten Frage statt einer Antwort auf
      // genau dieses Feld, wird sie beantwortet, danach kommt dieselbe
      // Feldfrage noch einmal. Sonst landete "Was ist der Unterschied
      // zwischen B und B197?" stumm als Wert im Feld "Klasse", und der
      // Dialog rauschte weiter, ohne die Frage beantwortet zu haben.
      // Beim Anliegen nicht: dort ist eine Frage oft schon die richtige
      // Antwort und soll unveraendert ins Anliegen.
      if (feld.schluessel !== "anliegen" && wirktWieFrage(v)) {
        zwischenfrageBeantworten(v, feld);
        return;
      }

      var wert = feld.schluessel === "klasse" ? klasseErkennen(v) : v.trim();

      if (feld.schluessel !== "klasse" && !feld.pruefen(v)) {
        var tf = showTyping();
        window.setTimeout(function () { tf.remove(); addMsg("bot", feld.fehler); }, thinkTime(feld.fehler));
        return;
      }

      anfrage.daten[feld.schluessel] = wert;
      anfrage.schritt++;

      if (anfrage.schritt < ANFRAGE_FELDER.length) {
        var naechstes = ANFRAGE_FELDER[anfrage.schritt];
        var tn = showTyping();
        window.setTimeout(function () { tn.remove(); addMsg("bot", naechstes.frage); }, thinkTime(naechstes.frage));
        return;
      }

      anfrageBestaetigen();
    }

    function zwischenfrageBeantworten(v, feld) {
      var text = loesungFuer(v).text;
      var t1 = showTyping();
      window.setTimeout(function () {
        t1.remove();
        addMsg("bot", text);
        var t2 = showTyping();
        window.setTimeout(function () { t2.remove(); addMsg("bot", feld.frage); }, thinkTime(feld.frage));
      }, thinkTime(text));
    }

    function anfrageBestaetigen() {
      var d = anfrage.daten;
      var zusammenfassung =
        "Alles klar, " + d.name + ". Das habe ich:\n\n" +
        "Name: " + d.name + "\n" +
        "Telefon: " + d.telefon + "\n" +
        "E-Mail: " + d.email + "\n" +
        "Klasse: " + (d.klasse || "weiß noch nicht") + "\n" +
        "Anliegen: " + d.anliegen + "\n\n" +
        "Ich öffne jetzt dein E-Mail-Programm mit einer fertigen Nachricht an uns. Einverstanden?";

      var box = document.createElement("div");
      box.className = "ari-handoff";
      var titel = document.createElement("span");
      titel.className = "ari-handoff-title";
      titel.textContent = "Anfrage abschicken?";
      box.appendChild(titel);

      var row = document.createElement("div");
      row.className = "ari-handoff-row";

      var ja = document.createElement("button");
      ja.type = "button";
      ja.className = "ari-hbtn ari-hbtn-primary";
      ja.textContent = "Ja, senden";
      ja.addEventListener("click", function () { box.remove(); anfrageAbsenden(); });

      var nein = document.createElement("button");
      nein.type = "button";
      nein.className = "ari-hbtn";
      nein.textContent = "Doch lieber anrufen";
      nein.addEventListener("click", function () {
        box.remove();
        anfrage = null;
        var t = showTyping();
        window.setTimeout(function () {
          t.remove();
          addMsg("bot", "Klar, dann meld dich einfach unter " + PHONE_HUMAN + ".");
          renderSuggestions();
        }, thinkTime("kurz"));
      });

      row.appendChild(ja);
      row.appendChild(nein);
      box.appendChild(row);

      var t = showTyping();
      window.setTimeout(function () { t.remove(); addMsg("bot", zusammenfassung, box); }, thinkTime(zusammenfassung));
    }

    function anfrageAbsenden() {
      var d = anfrage.daten;
      anfrage = null;

      var kuerzel = d.klasse || "";
      var zusatz = KLASSEN_ZUSATZ[kuerzel] || "";
      var einstieg = kuerzel
        ? "ich interessiere mich für den Führerschein der Klasse " + kuerzel + (zusatz ? " (" + zusatz + ")" : "") + "."
        : "ich möchte den Führerschein machen und bin mir noch nicht sicher, welche Klasse zu mir passt.";

      var text =
        "Hallo Fahrschule ARI,\n\n" +
        einstieg + "\n\n" +
        "Mein Anliegen:\n" + d.anliegen + "\n\n" +
        "Meine Kontaktdaten:\n" +
        "Name: " + d.name + "\n" +
        "Telefon: " + d.telefon + "\n" +
        "E-Mail: " + d.email + "\n\n" +
        "Über einen kurzen Rückruf würde ich mich freuen.\n\n" +
        "Viele Grüße\n" + d.name + "\n";

      // Derselbe Grenzwert wie beim Kontaktformular in main.js: Viele
      // Mailprogramme schneiden mailto-Adressen ab etwa 2000 Zeichen ab,
      // ohne es zu sagen.
      var adresse = "mailto:" + MAIL +
        "?subject=" + encodeURIComponent(kuerzel ? "Anfrage über den Assistenten, Klasse " + kuerzel : "Anfrage über den Assistenten") +
        "&body=" + encodeURIComponent(text);

      if (adresse.length > 1900) {
        addMsg("bot",
          "Dein Anliegen ist für den E-Mail-Weg etwas zu lang geraten. Ruf uns bitte kurz an: " + PHONE_HUMAN + ".",
          handoffNode());
        renderSuggestions();
        return;
      }

      window.location.href = adresse;
      addMsg("bot", "Dein E-Mail-Programm öffnet sich mit der fertigen Nachricht. Falls nicht: " + MAIL + ".");
      renderSuggestions();
    }

    function renderSuggestions() {
      suggest.textContent = "";
      var remaining = PACK.topics.filter(function (t) { return asked.indexOf(t.id) === -1; });
      if (!remaining.length) { asked = []; remaining = PACK.topics.slice(); }

      var label = document.createElement("span");
      label.className = "ari-suggest-label";
      label.textContent = asked.length ? PACK.moreLabel : PACK.suggestionsLabel;
      suggest.appendChild(label);

      var row = document.createElement("div");
      row.className = "ari-chips";
      remaining.slice(0, 4).forEach(function (topic) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "ari-chip";
        b.textContent = topic.label;
        b.addEventListener("click", function () {
          addMsg("user", topic.label);
          history.push({ role: "user", content: topic.label });
          // Die Knoepfe werden gleich ersetzt, auch der gerade gedrueckte.
          // Ohne das faellt der Fokus auf den Seitenkoerper und die naechste
          // Tabulatortaste beginnt wieder ganz oben.
          input.focus();
          answerTopic(topic);
        });
        row.appendChild(b);
      });
      suggest.appendChild(row);
    }

    function answerTopic(topic) {
      if (asked.indexOf(topic.id) === -1) asked.push(topic.id);
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot", topic.answer, topic.id === "kontakt" ? kontaktNode() : (topic.handoff ? handoffNode() : null));
        history.push({ role: "assistant", content: topic.answer });
        renderSuggestions();
      }, thinkTime(topic.answer));
    }

    function answerLocal(value) {
      var loesung = loesungFuer(value);

      // Ein getroffenes Thema laeuft weiter ueber answerTopic(): Nur die
      // kennt "gefragt"/Verlauf und den Sonderknopf beim Kontakt-Thema.
      if (loesung.topic) { answerTopic(loesung.topic); return; }

      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        // Nur die ehrliche Rueckfallantwort bekommt die Anruf/E-Mail-
        // Knoepfe; bei einer erfundenen Klasse oder einem Vergleich ist
        // die Antwort bereits vollstaendig, ein Knopf waere unnoetig.
        addMsg("bot", loesung.text, loesung.text === PACK.fallback ? handoffNode() : null);
        renderSuggestions();
      }, thinkTime(loesung.text));
    }

    // Mit Sprachmodell verlassen Nachrichten den Browser. Dafuer wird vor
    // der ersten Uebertragung ausdruecklich gefragt. Ohne Zustimmung
    // antwortet weiter die eingebaute Wissensbasis.
    function einwilligungEinholen(value) {
      var box = document.createElement("div");
      box.className = "ari-handoff";

      var t = document.createElement("span");
      t.className = "ari-handoff-title";
      t.textContent = "Einverstanden?";
      box.appendChild(t);

      var row = document.createElement("div");
      row.className = "ari-handoff-row";

      var ja = document.createElement("button");
      ja.type = "button";
      ja.className = "ari-hbtn ari-hbtn-primary";
      ja.textContent = "Ja, Frage senden";
      ja.addEventListener("click", function () {
        if (window.ariDatenschutz) window.ariDatenschutz.setzen("assistent", true);
        box.remove();
        answerViaApi(value);
      });

      var nein = document.createElement("button");
      nein.type = "button";
      nein.className = "ari-hbtn";
      nein.textContent = "Lieber nicht";
      nein.addEventListener("click", function () {
        box.remove();
        answerLocal(value);
      });

      row.appendChild(ja);
      row.appendChild(nein);
      box.appendChild(row);

      addMsg("bot",
        "Für eine frei formulierte Antwort wird deine Frage an unseren Dienstleister übertragen und dort verarbeitet.\n\nOhne dein Einverständnis antworte ich weiter aus der eingebauten Liste. Das bleibt vollständig in deinem Browser.",
        box);
      renderSuggestions();
    }

    function answerViaApi(value) {
      var t = showTyping();
      var ctrl = new AbortController();
      var timer = window.setTimeout(function () { ctrl.abort(); }, 20000);

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
        signal: ctrl.signal
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (data) {
          window.clearTimeout(timer);
          t.remove();
          var reply = (data && (data.reply || data.text)) || "";
          if (!reply) throw new Error("leere Antwort");
          addMsg("bot", reply, /anruf|telefon|melde dich|vorbei|team/i.test(reply) ? handoffNode() : null);
          history.push({ role: "assistant", content: reply });
          renderSuggestions();
        })
        .catch(function () {
          // Dienst weg oder zu langsam: die Wissensbasis übernimmt,
          // der Besucher merkt davon nichts.
          window.clearTimeout(timer);
          t.remove();
          answerLocal(value);
        });
    }

    var started = false;
    function start() {
      if (started) return;
      started = true;
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot", PACK.greeting);
        var note = document.createElement("p");
        note.className = "ari-disclaimer";
        note.textContent = PACK.disclaimer;
        log.appendChild(note);
        renderSuggestions();
        scrollLog();
      }, 560);
    }

    // Unsichtbar heisst nicht unerreichbar: Ohne das blieb der Knopf im
    // Tab-Fluss, man landete auf etwas Unsichtbarem und Enter schloss das
    // Fenster wieder.
    function knopfVerbergen(verbergen) {
      if (verbergen) launcher.setAttribute("tabindex", "-1");
      else launcher.removeAttribute("tabindex");
      launcher.setAttribute("aria-hidden", verbergen ? "true" : "false");
    }

    function open() {
      panel.hidden = false;
      root.classList.add("ari-open");
      launcher.setAttribute("aria-expanded", "true");
      knopfVerbergen(true);
      start();
      window.setTimeout(function () { input.focus(); }, 80);
    }

    function close() {
      panel.hidden = true;
      root.classList.remove("ari-open");
      launcher.setAttribute("aria-expanded", "false");
      knopfVerbergen(false);
      launcher.focus();
    }

    launcher.addEventListener("click", function () { panel.hidden ? open() : close(); });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || panel.hidden) return;
      // Nur schliessen, wenn der Tastendruck aus dem Assistenten kommt.
      // Vorher schloss Escape von ueberall und zog den Fokus in die Ecke,
      // etwa mitten beim Ausfuellen des Kontaktformulars.
      if (!panel.contains(e.target) && e.target !== launcher &&
          e.target !== document.body) return;
      close();
    });

    // Jeder Knopf mit data-ari-open holt den Assistenten nach vorn
    document.querySelectorAll("[data-ari-open]").forEach(function (btn) {
      btn.addEventListener("click", function () { if (panel.hidden) open(); });
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); submit(); }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submit();
    });

    function submit() {
      var v = input.value.trim();
      if (!v) return;
      addMsg("user", v);
      history.push({ role: "user", content: v });
      input.value = "";
      // Laeuft der Anfrage-Dialog, ist jede Eingabe eine Antwort auf die
      // laufende Frage, kein Fall fuer die Wissensbasis oder das Modell.
      if (anfrage) { anfrageAntwort(v); return; }
      if (/^anfrage$/i.test(v)) { anfrageStarten(); return; }
      if (!API_URL) { answerLocal(v); return; }
      if (window.ariDatenschutz && !window.ariDatenschutz.erlaubt("assistent")) {
        einwilligungEinholen(v);
        return;
      }
      answerViaApi(v);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
