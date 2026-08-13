# Der Assistent als echter KI-Agent

Der Assistent auf der Webseite läuft standardmäßig **ohne** Sprachmodell: Er beantwortet
die häufigsten Fragen aus einer eingebauten Wissensbasis (`js/assistant.js`). Das kostet
nichts, funktioniert sofort, kann nichts erfinden — und es verlassen keine Daten den Browser.

Wenn der Assistent frei formulierte Antworten geben soll, braucht es ein Sprachmodell
und damit einen API-Schlüssel. Dieser Ordner enthält alles dafür.

## Warum der Schlüssel nicht auf die Webseite darf

Alles, was im HTML oder JavaScript steht, kann jeder Besucher im Browser lesen — auch ein
API-Schlüssel. Er wäre binnen Stunden von automatisierten Scannern gefunden und auf fremde
Rechnung verbraucht.

Deshalb der Umweg über einen kleinen Server, der den Schlüssel hält:

```
Browser  →  Cloudflare Worker  →  Anthropic API
            (Schlüssel liegt hier)
```

Der Browser sieht nur die Adresse des Workers, nie den Schlüssel.

## Einrichtung, etwa 20 Minuten

**1. Konten anlegen**
Kostenloses Konto bei [Cloudflare](https://dash.cloudflare.com/sign-up). Das kostenlose
Kontingent liegt bei 100.000 Anfragen pro Tag — für eine Fahrschule um Größenordnungen
mehr als nötig.

**2. API-Schlüssel besorgen**
Unter [console.anthropic.com](https://console.anthropic.com) Konto anlegen, Guthaben
aufladen, unter *API Keys* einen Schlüssel erzeugen. Er wird nur einmal angezeigt.

**3. Worker anlegen**
Cloudflare-Dashboard → **Workers & Pages → Create → Worker**. Namen vergeben, etwa
`ari-assistent`. Dann **Edit Code**, den gesamten Inhalt von `worker.js` einfügen,
**Deploy** klicken.

**4. Schlüssel hinterlegen**
Im Worker: **Settings → Variables and Secrets → Add**

| Feld | Wert                        |
|------|-----------------------------|
| Typ  | Secret                      |
| Name | `ANTHROPIC_API_KEY`         |
| Wert | der Schlüssel aus Schritt 2 |

Als *Secret* hinterlegt ist der Wert danach auch im Dashboard nicht mehr lesbar.

**5. Erlaubte Domains prüfen**
Oben in `worker.js` steht `ALLOWED_ORIGINS`. Dort müssen die Adressen stehen, unter denen
die Webseite läuft. Nur von diesen Adressen nimmt der Worker Anfragen an — das verhindert,
dass Fremde ihn auf eure Kosten nutzen. Zum Testen auf dem eigenen Rechner gehört
`http://localhost:8080` in die Liste.

**6. Webseite umstellen**
Cloudflare zeigt nach dem Deploy eine Adresse an, etwa
`https://ari-assistent.DEIN-NAME.workers.dev`. Diese in `index.html` eintragen:

```html
<script src="js/assistant.js" data-api="https://ari-assistent.DEIN-NAME.workers.dev" defer></script>
```

Sobald `data-api` gesetzt ist, fragt der Assistent das Sprachmodell. Ohne das Attribut
bleibt er bei der Wissensbasis.

**Wichtig:** Fällt der Worker aus oder antwortet er nicht innerhalb von 20 Sekunden,
schaltet die Webseite automatisch zurück auf die eingebaute Wissensbasis. Der Assistent
fällt also nie komplett aus.

## Was das kostet

Mit Haiku 4.5 und typischen Anfragen liegen die Kosten im Bereich weniger Cent pro hundert
Gespräche, realistisch also wenige Euro im Monat. In der Anthropic-Konsole lässt sich ein
monatliches Limit setzen — dringend zu empfehlen, damit es keine Überraschungen gibt.

## Vor dem Livegang bedenken

- **Datenschutz:** Sobald der Worker aktiv ist, werden Chat-Nachrichten an Dienstleister
  übertragen. Die Datenschutzerklärung muss das benennen, und mit Anthropic sowie
  Cloudflare ist jeweils ein Auftragsverarbeitungsvertrag zu schließen.
- **Transparenz:** Der Assistent weist sich als solcher aus. Das muss so bleiben.
- **Missbrauchsschutz:** Der Worker begrenzt Nachrichtenlänge und Verlauf. Bei auffälliger
  Nutzung lässt sich in Cloudflare zusätzlich eine Rate-Limit-Regel setzen.
- **Systemprompt pflegen:** Öffnungszeiten, Klassen und Kontaktdaten stehen oben in
  `worker.js`. Ändert sich etwas, muss es dort **und** in `js/assistant.js` nachgezogen
  werden — sonst erzählt der Assistent Veraltetes.
