# Webseite der Fahrschule ARI, Freiburg

Statische Seite: HTML, CSS und etwas JavaScript. Kein Build, kein WordPress,
keine Datenbank. Zum Ansehen genügt ein beliebiger Webserver, zum Ändern ein
Texteditor.

```
index.html            Startseite, alle Abschnitte
impressum.html        Impressum
datenschutz.html      Datenschutzerklärung
css/style.css         gesamte Gestaltung, Farben ganz oben als Variablen
css/fonts.css         Schriften (liegen lokal unter fonts/)
js/main.js            Menü, Farbschema, Einblendungen, Kontaktformular
js/assistant.js       der Assistent samt Wissensbasis
assistant-backend/    optionales KI-Backend, siehe README dort
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

## Der Assistent

Unten rechts sitzt ein Assistent, der die häufigsten Fragen beantwortet. Er
läuft in zwei Betriebsarten:

**Standard, ohne Kosten.** Die Antworten stehen als Wissensbasis in
`js/assistant.js` (20 Themen). Alles passiert im Browser des Besuchers, es
werden keine Daten übertragen und nichts gespeichert. Der Assistent kann
dadurch auch nichts erfinden.

**Mit Sprachmodell.** Wer freie Antworten will, richtet den Cloudflare Worker
aus `assistant-backend/` ein — Anleitung liegt dort. Fällt der Dienst aus,
schaltet die Seite automatisch auf die Wissensbasis zurück.

Ändern sich Öffnungszeiten oder Angebote, müssen sie an **drei** Stellen
nachgezogen werden: in `index.html`, in der Wissensbasis in `js/assistant.js`
und — falls eingerichtet — im Systemprompt in `assistant-backend/worker.js`.

## Woher die Inhalte stammen

Übernommen von fahrschule-ari.de: Impressumsangaben, der Text über Miftar
Rexhepi, die fünf Schritte zum Führerschein, Umfang des Theorieunterrichts
(12 + 2 Doppelstunden), die Lern-App, der Fuhrpark und die Kontaktdaten.
Öffnungszeiten und Standorte stammen aus der aktuellen Instagram-Grafik und
weichen bewusst von der alten Seite ab — dort fehlte Zähringen noch.

### Welches Bild wo sitzt

| Datei | Einsatz | Herkunft |
|---|---|---|
| `logo.png` / `logo-dark.png` | Kopf- und Fußbereich | `llogo.png`, bereits freigestellt |
| `theorie-hoch.jpg` | Bühne, randlos rechts | WhatsApp-Foto, Hochformat |
| `golf-8.png` | Bühne, steht auf der Fahrbahn | `Golf-removebg-preview-3.png` |
| `felge.svg` | drehende Räder, Zahlenband | selbst gezeichnet, deshalb exakt rund |
| `asphalt-kante.png` | Übergang in das Zahlenband | `carObj-arrow-down.png` |
| `miftar.jpg` | Abschnitt „Unsere Fahrschule" | Foto von Miftar am Fahrschulwagen |
| `theorie-quer.jpg` | randloses Breitbild „Theorieunterricht" | `Mifa.jpg` |
| `golf-8-klein.png` | fährt im Ablauf die Straße entlang | kleinere Ableitung |

Nicht verwendet, mit Absicht:

- **`tt-carusel-img01-01/02/03.png`** — Stockfotos, die mit dem alten
  WordPress-Theme kamen. Die Lizenz hing am Theme und deckt eine neue,
  eigenständige Seite nicht ab. Wenn du eine Lizenz dafür hast, sag
  Bescheid, dann baue ich sie ein.
- **`Der-Weg-zu-Fuehrerschein.png` / `Der-Weg_1.png`** — die Wegegrafik ist
  als Bild eingebrannt: fester Text, weißer Hintergrund, auf dem Handy
  unlesbar. Der Abschnitt „Ablauf" bildet sie stattdessen als HTML nach,
  mit denselben Rauten und demselben fahrenden Golf.
- **`car-wheel.png`** — ein beliebiges Rad aus dem Theme. Ersetzt durch die
  echte Felge des Fahrschulwagens.
- **`lCon.jpg`, `logo235.jpg`, `cropped-*`, `llogo3-*`** — kleinere oder
  beschnittene Fassungen desselben Logos.
- **`Fahrschule-ARI-Logo.pdf`** — liegt in `images/original/`. Falls das
  echtes Vektormaterial ist, ließe sich daraus ein gestochen scharfes
  SVG-Logo erzeugen; dafür braucht es ein Werkzeug wie Illustrator oder
  Inkscape.

### Bewegung auf der Seite

Alles davon respektiert „Bewegung reduzieren" in den Systemeinstellungen —
dann steht jedes Element in seinem Endzustand still.

- **Bühne:** Der Golf steht, die Fahrbahn läuft unter ihm durch und die
  Felgen drehen sich. Andersherum wäre es falsch: Ein nach links zeigendes
  Auto, das nach rechts wandert, sieht aus wie Rückwärtsfahren.
- **Ablauf:** Der Golf rollt beim Scrollen die Straße entlang. Wie oft sich
  seine Räder dabei drehen, rechnet `js/main.js` aus Fahrweg und
  Reifenumfang aus — geraten sähe man sofort.
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
      Steuernummer — eine USt-IdNr. beginnt mit „DE“. Bitte richtigstellen.
- [ ] **Hoster** in der Datenschutzerklärung eintragen und einen
      Auftragsverarbeitungsvertrag abschließen
- [ ] **Einwilligung für das Theoriefoto:** Auf dem Bild sind Fahrschüler zu
      erkennen. Das Foto stand schon auf der alten Seite; trotzdem sollte die
      Einwilligung der Abgebildeten vorliegen. Sonst durch ein Foto ohne
      erkennbare Gesichter ersetzen.
- [ ] **Anmeldung läuft nur telefonisch.** Es gibt bewusst kein Formular:
      Alle „Anmelden"-Schaltflächen lösen einen Anruf an 0176 43454447 aus.
      Wenn sich das ändert, sind es die `tel:`-Verweise in `index.html`
      sowie die Antworten „anmeldung" und „ablauf" in `js/assistant.js`.
- [ ] Domain umstellen und den Verzeichnisschutz entfernen

## Was noch fehlt

Gute Fotos. Aktuell gibt es genau ein echtes Motiv (Theorieraum) und den
freigestellten Golf. Sinnvoll wären: der Golf im Freien, ein Porträt von
Miftar, Aufnahmen beider Standorte von außen und ein Blick ins Büro. Sobald
die Dateien in `images/` liegen, lassen sie sich direkt einsetzen.
