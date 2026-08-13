# Besucherzähler

Die Webseite liegt statisch auf einem Server, der nur Dateien ausliefert. Sie
kann deshalb nicht selbst mitzählen — dafür braucht es eine Stelle, die sich
den Stand merkt. Dieser Ordner enthält sie: einen kleinen Cloudflare Worker
mit einem Schlüssel-Wert-Speicher.

## Warum kein fertiger Zähldienst

Es gibt kostenlose Zähler zum Einbinden. Die sind selten geschenkt: Sie sehen
jeden Besuch, setzen eigene Kennungen und verkaufen die Auswertung weiter.
Die Seite lädt sonst nichts von Dritten, und in der Datenschutzerklärung
steht genau das. Ein fremder Zähler würde diesen Satz zu einer Lüge machen
und wäre nach § 25 TDDDG zustimmungspflichtig — es käme also ein
Einwilligungsbanner dazu.

Mit dem eigenen Worker bleibt alles in eurer Hand. Gespeichert wird eine
einzige Zahl, keine IP-Adresse, kein Zeitstempel, kein Merkmal des Besuchers.

## Einrichtung, etwa 15 Minuten

**1. Speicher anlegen**
Cloudflare-Dashboard → **Storage & Databases → KV → Create Instance**.
Namen vergeben, zum Beispiel `ari-besucher`.

**2. Worker anlegen**
**Workers & Pages → Create → Worker**, Namen vergeben, etwa `ari-zaehler`.
Dann **Edit Code**, den Inhalt von `worker.js` einfügen, **Deploy**.

**3. Speicher verbinden**
Im Worker: **Settings → Bindings → Add → KV Namespace**

| Feld            | Wert            |
|-----------------|-----------------|
| Variablenname   | `ZAEHLER`       |
| KV Namespace    | `ari-besucher`  |

Der Variablenname muss exakt `ZAEHLER` heißen, sonst findet der Worker den
Speicher nicht.

**4. Erlaubte Adressen prüfen**
Oben in `worker.js` steht `ERLAUBTE_HERKUNFT`. Dort müssen die Adressen
stehen, unter denen die Webseite läuft — sonst kann jeder den Zähler von
außen hochtreiben.

**5. Webseite verbinden**
Cloudflare zeigt nach dem Deploy eine Adresse an, etwa
`https://ari-zaehler.DEIN-NAME.workers.dev`. Diese in **allen** HTML-Dateien
eintragen, dort wo der Zähler eingebunden ist:

```html
<script src="js/zaehler.js" data-api="https://ari-zaehler.DEIN-NAME.workers.dev" defer></script>
```

Ohne `data-api` bleibt die Zeile im Fußbereich unsichtbar. Es wird also nie
eine erfundene Zahl angezeigt.

**6. Startwert setzen (falls gewünscht)**
Im KV-Speicher lässt sich der Schlüssel `besuche` von Hand anlegen und auf
einen Startwert setzen, etwa `1000`.

## Was das kostet

Nichts, solange ihr unter den kostenlosen Kontingenten bleibt: 100.000
Worker-Aufrufe und 1.000 KV-Schreibvorgänge pro Tag. Gezählt wird einmal je
Besuchssitzung, nicht je Seitenaufruf — 1.000 Schreibvorgänge entsprechen
also 1.000 Besuchern am Tag. Falls die Fahrschule das je erreicht, ist ein
größerer Tarif das kleinste Problem.

## Was der Zähler nicht kann

Er zählt Sitzungen, keine Personen. Wer den Browser wechselt oder nach
Tagen wiederkommt, wird erneut gezählt. Für eine ehrliche Hausnummer reicht
das; wer belastbare Statistiken braucht, kommt um eine richtige Auswertung
nicht herum — und die ist dann einwilligungspflichtig.
