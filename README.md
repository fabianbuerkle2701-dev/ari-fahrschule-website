# Webseite der Fahrschule ARI, Freiburg

Statische Seite: HTML, CSS und etwas JavaScript. Kein Build, kein WordPress,
keine Datenbank. Zum Ansehen genügt ein beliebiger Webserver, zum Ändern ein
Texteditor.

```
index.html            Startseite
fahrschule.html       Über die Fahrschule, Theorie, Fuhrpark
klassen.html          B, B197, B96 und BE im Detail
preise.html           Preisaushang nach § 32 FahrlG
impressum.html        Impressum
datenschutz.html      Datenschutzerklärung
_bau/                 Kopf, Fuß und Inhalte der Unterseiten
css/style.css         gesamte Gestaltung, Farben ganz oben als Variablen
css/fonts.css         Schriften (liegen lokal unter fonts/)
js/main.js            Menü, Farbschema, Einblendungen, Kontaktformular
js/assistant.js       der Assistent samt Wissensbasis
js/zaehler.js         Besucherzähler im Fußbereich
assistant-backend/    optionales KI-Backend, siehe README dort
besucher-backend/     Zähl-Dienst für den Besucherzähler, siehe README dort
images/               ausgelieferte Bilder
images/original/      unveränderte Dateien aus der alten Seite
_altbestand/          Sicherung der alten Seiteninhalte als Text
```

## Im Netz ansehen

Vorschau: <https://fabianbuerkle2701-dev.github.io/ari-fahrschule-website/>

Das ist eine Vorschau auf GitHub Pages, nicht die Livedomain. Jeder `git push`
auf `main` veröffentlicht die Änderung nach etwa einer Minute automatisch.

```bash
git add -A && git commit -m "Was geändert wurde" && git push
```

## Lokal ansehen

```bash
cd "/Users/fabian/Documents/Claude Code/ari-fahrschule-website" && python3 -m http.server 8815
```

Dann `http://localhost:8815` im Browser öffnen.

## Unterseiten ändern

Kopf- und Fußbereich liegen einmalig in `_bau/kopf.html` und `_bau/fuss.html`,
die Texte der drei Unterseiten in `_bau/inhalte.py`. Nach einer Änderung:

```bash
python3 _bau/baue.py
```

Damit werden `fahrschule.html`, `klassen.html` und `preise.html` neu erzeugt.
Die Startseite und die Rechtsseiten werden **nicht** überschrieben – ändert
sich die Navigation, muss sie dort von Hand nachgezogen werden.

## Drei Regeln, die den Aufbau tragen

**Keine Kicker.** Über keiner Überschrift steht ein kleines Gold-Label. Elf
gleich gebaute Labels über elf Abschnitten erzeugen den Gleichtakt, an dem man
Seiten nach Vorlage erkennt. Die Überschriften tragen ihre Bedeutung selbst.

**Kästen nur, wo sie etwas heben.** Karten sind der bequeme Behälter. Gruppiert
wird über Nähe und Haarlinien; ein Rahmen bekommt nur, was wirklich
heraussteht: Anruf, Preisverweis, Standorte, Preiskarten.

**Drei Radien, mehr nicht.** `--radius` für Flächen, `--radius-sm` für
Kleinteile, `--radius-pill` für Schaltflächen. Bilder und randlose Bänder
laufen ohne Rundung an die Kante.

## Die drei Goldtöne

Das Gold aus dem Logo ist `#c9b41e`. Auf weißem Grund erreicht es nur einen
Kontrast von 2,1:1 – als Schrift wäre das zu blass. Deshalb gibt es drei
abgestufte Werte, alle oben in `css/style.css`:

| Variable        | Wert      | Kontrast auf Weiß | Wofür |
|-----------------|-----------|-------------------|-------|
| `--gold`        | `#c9b41e` | 2,1:1             | Flächen, Linien, Schaltflächen, dunkler Grund |
| `--gold-titel`  | `#a89413` | 3,0:1             | große Schrift: „Führerschein", Klassenbuchstaben, Preiszahlen |
| `--gold-deep`   | `#7e6d0a` | 5,2:1             | kleine Schrift: Dachzeilen, Verweise, Bildunterschriften |

Im dunklen Schema drehen sich die Verhältnisse um, dort ist `--gold-titel`
identisch mit dem Logo-Gold.

Wer den Titel exakt im Logo-Gold möchte, ändert `--gold-titel` auf
`#c9b41e` – dann stimmt die Farbe pixelgenau, die Überschrift ist auf
weißem Grund aber deutlich blasser.

## Preise

Alle Beträge stammen vom Preisaushang nach § 32 Fahrlehrergesetz. Sie stehen
an drei Stellen und müssen bei einer Änderung überall nachgezogen werden:
`_bau/inhalte.py` (Preisseite), `index.html` (Verweis auf der Startseite) und
`js/assistant.js` sowie `assistant-backend/worker.js` (Assistent).

## Besucherzähler

Im Fußbereich steht „Du bist Besucher Nr. …". Die Zahl kommt von einem
eigenen Cloudflare Worker (`besucher-backend/`), **nicht** von einem fremden
Zähldienst – solche Dienste bezahlen sich mit den Daten der Besucher, und die
Seite lädt sonst nichts von Dritten.

Solange kein Dienst eingetragen ist, bleibt die Zeile **unsichtbar**. Es wird
nie eine erfundene Zahl angezeigt. Zum Aktivieren die Worker-Adresse in allen
HTML-Dateien eintragen:

```html
<script src="js/zaehler.js" data-api="https://ari-zaehler.DEIN-NAME.workers.dev" defer></script>
```

Gezählt wird einmal je Besuchssitzung, nicht je Seitenaufruf. Gespeichert
wird ausschließlich die Zahl selbst – keine IP, kein Zeitpunkt, kein Merkmal.

## Datenschutz-Bestätigung

Beim ersten Besuch erscheint unten eine schmale Leiste mit einem
Akzeptieren-Knopf. **Kein Cookie-Banner** – die Seite setzt keine Cookies
und lädt nichts von Dritten, es gibt also nichts, wofür eine Einwilligung
nötig wäre. Die Leiste ist eine Kenntnisnahme der Datenschutzerklärung und
verschwindet dauerhaft, sobald sie einmal bestätigt wurde.

`js/datenschutz-hinweis.js`. Ein Verweis mit dem Attribut
`data-datenschutz-oeffnen` blendet die Leiste wieder ein, falls sie irgendwo
erneut erreichbar sein soll. Ändert sich die Verarbeitung, wird `FASSUNG` in
der Datei hochgezählt – dann wird erneut gefragt.

Der Assistent ist damit verbunden: Läuft er später mit Sprachmodell, fragt er
vor der ersten Übertragung ausdrücklich nach und antwortet ohne Zustimmung
weiter aus der lokalen Wissensbasis.

## Der Assistent

Unten rechts sitzt ein Assistent, der die häufigsten Fragen beantwortet. Er
läuft in zwei Betriebsarten:

**Standard, ohne Kosten.** Die Antworten stehen als Wissensbasis in
`js/assistant.js` (20 Themen). Alles passiert im Browser des Besuchers, es
werden keine Daten übertragen und nichts gespeichert. Der Assistent kann
dadurch auch nichts erfinden.

**Mit Sprachmodell.** Wer freie Antworten will, richtet den Cloudflare Worker
aus `assistant-backend/` ein – Anleitung liegt dort. Fällt der Dienst aus,
schaltet die Seite automatisch auf die Wissensbasis zurück.

Ändern sich Öffnungszeiten oder Angebote, müssen sie an **drei** Stellen
nachgezogen werden: in `index.html`, in der Wissensbasis in `js/assistant.js`
und – falls eingerichtet – im Systemprompt in `assistant-backend/worker.js`.

## Woher die Inhalte stammen

Übernommen von fahrschule-ari.de: Impressumsangaben, der Text über Miftar
Rexhepi, die fünf Schritte zum Führerschein, Umfang des Theorieunterrichts
(12 + 2 Doppelstunden), die Lern-App, der Fuhrpark und die Kontaktdaten.
Öffnungszeiten und Standorte stammen aus der aktuellen Instagram-Grafik und
weichen bewusst von der alten Seite ab – dort fehlte Zähringen noch.

### Welches Bild wo sitzt

| Datei | Einsatz | Herkunft |
|---|---|---|
| `logo.png` / `logo-dark.png` | Kopf- und Fußbereich | `llogo.png`, bereits freigestellt |
| `theorie-hoch.jpg` | Bühne, randlos rechts | WhatsApp-Foto, Hochformat |
| `golf-8.png` | Bühne, steht auf der Fahrbahn | `Golf-removebg-preview-3.png` |
| `felge.svg` | drehende Räder, Zahlenband | selbst gezeichnet, deshalb exakt rund |
| `asphalt-kante.png` | Übergang in das Zahlenband | `carObj-arrow-down.png` |
| `miftar.jpg` | Abschnitt „Unsere Fahrschule" | Porträt-Zuschnitt aus einem Bestanden-Foto |
| `bestanden/01–09.jpg` | Bildband „Bestanden" auf der Startseite | neun Fotos vom Schreibtisch, mittig auf 4:5 beschnitten |
| `theorie-quer.jpg` | randloses Breitbild „Theorieunterricht" | `Mifa.jpg` |
| `golf-8-klein.png` | fährt im Ablauf die Straße entlang | kleinere Ableitung |

Nicht verwendet, mit Absicht:

- **`tt-carusel-img01-01/02/03.png`** – Stockfotos, die mit dem alten
  WordPress-Theme kamen. Die Lizenz hing am Theme und deckt eine neue,
  eigenständige Seite nicht ab. Wenn du eine Lizenz dafür hast, sag
  Bescheid, dann baue ich sie ein.
- **`Der-Weg-zu-Fuehrerschein.png` / `Der-Weg_1.png`** – die Wegegrafik ist
  als Bild eingebrannt: fester Text, weißer Hintergrund, auf dem Handy
  unlesbar. Der Abschnitt „Ablauf" bildet sie stattdessen als HTML nach,
  mit denselben Rauten und demselben fahrenden Golf.
- **`car-wheel.png`** – ein beliebiges Rad aus dem Theme. Ersetzt durch die
  echte Felge des Fahrschulwagens.
- **`lCon.jpg`, `logo235.jpg`, `cropped-*`, `llogo3-*`** – kleinere oder
  beschnittene Fassungen desselben Logos.
- **`Fahrschule-ARI-Logo.pdf`** – liegt in `images/original/`. Falls das
  echtes Vektormaterial ist, ließe sich daraus ein gestochen scharfes
  SVG-Logo erzeugen; dafür braucht es ein Werkzeug wie Illustrator oder
  Inkscape.

### Bewegung auf der Seite

Alles davon respektiert „Bewegung reduzieren" in den Systemeinstellungen –
dann steht jedes Element in seinem Endzustand still.

- **Bühne:** Der Golf steht, die Fahrbahn läuft unter ihm durch und die
  Felgen drehen sich. Andersherum wäre es falsch: Ein nach links zeigendes
  Auto, das nach rechts wandert, sieht aus wie Rückwärtsfahren.
- **Ablauf:** Der Golf rollt beim Scrollen die Straße entlang. Wie oft sich
  seine Räder dabei drehen, rechnet `js/main.js` aus Fahrweg und
  Reifenumfang aus – geraten sähe man sofort.
- **Zahlenband:** Die Zahlen zählen einmal hoch, die Felge im Hintergrund
  dreht sich mit dem Scrollen.
- **Abschnitte** blenden beim ersten Erscheinen ein, die Rauten im Ablauf
  schalten dabei auf Gold.

Der Wagen wird **nirgends gespiegelt**: Auf der Tür stehen „ARI FAHRSCHULE"
und die Web-Adresse, gespiegelt stünde beides seitenverkehrt da.

## Vor dem Livegang

- [ ] **Fahrschulerlaubnis-Nummer** im Impressum eintragen (fehlt noch)
- [ ] **Steuernummer prüfen:** Die alte Seite führte `06197/48921` als
      Umsatzsteuer-Identifikationsnummer. Das Format ist aber das einer
      Steuernummer – eine USt-IdNr. beginnt mit „DE“. Bitte richtigstellen.
- [ ] **Hoster** in der Datenschutzerklärung eintragen und einen
      Auftragsverarbeitungsvertrag abschließen
- [ ] **Einwilligungen für alle Personenfotos.** Betroffen sind das
      Theoriefoto (erkennbare Fahrschüler) und die neun Bestanden-Bilder.
      Unter dem Bildband steht der Satz „Alle Abgebildeten haben der
      Veröffentlichung zugestimmt." – **dieser Satz muss stimmen.** Wenn für
      einzelne Bilder keine Einwilligung vorliegt, nimm sie aus
      `images/bestanden/` heraus und lösche die zugehörige `<figure>` in
      `index.html`. Bei Minderjährigen unterschreiben die Eltern.
- [ ] Die Bestanden-Bilder werden bewusst nur 560 px breit ausgeliefert.
      Auf den Prüfbescheinigungen stehen Namen und Unterschriften – bei
      dieser Größe sind sie unlesbar. Nicht durch größere Fassungen ersetzen.
- [ ] **Zwei Wege zur Anmeldung, Telefon zuerst.** Die Schaltflächen in
      Kopfzeile und Bühne wählen direkt 0176 43454447; im Kontaktbereich
      steht der Anruf oben, das Formular darunter als zweiter Weg.
      Das Formular verschickt nichts selbst, sondern öffnet das
      E-Mail-Programm des Besuchers mit fertiger Nachricht an
      Info@fahrschule-ari.de (Block am Ende von `js/main.js`). Wer echten
      Serverversand will, braucht einen Dienst wie Formspree – dann wird
      nur dieser Block ersetzt.
- [ ] Domain umstellen und den Verzeichnisschutz entfernen

## Was noch fehlt

Gute Fotos. Aktuell gibt es genau ein echtes Motiv (Theorieraum) und den
freigestellten Golf. Sinnvoll wären: der Golf im Freien, ein Porträt von
Miftar, Aufnahmen beider Standorte von außen und ein Blick ins Büro. Sobald
die Dateien in `images/` liegen, lassen sie sich direkt einsetzen.
