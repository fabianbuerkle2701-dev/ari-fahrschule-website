#!/usr/bin/env python3
"""
Baut die Unterseiten aus Kopf- und Fußbereich der Startseite.

Kein Framework, kein npm: Die Seite bleibt statisches HTML. Dieses
Skript sorgt nur dafür, dass Navigation und Fußbereich auf allen
Seiten gleich sind, statt sie fünfmal von Hand zu pflegen.

Aufruf:  python3 _bau/baue.py
"""
import os
import re

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def lies(pfad):
    with open(os.path.join(WURZEL, pfad), encoding="utf-8") as f:
        return f.read()

KOPF = lies("_bau/kopf.html")
FUSS = lies("_bau/fuss.html")

def anpassen(block, aktiv):
    """Anker der Startseite auf index.html umbiegen, aktiven Punkt markieren."""
    b = block
    b = b.replace('href="#top"', 'href="index.html"')
    for anker in ["ablauf", "standorte", "faq", "kontakt", "fahrschule", "klassen"]:
        b = b.replace('href="#' + anker + '"', 'href="index.html#' + anker + '"')
    # Eigene Seiten bekommen echte Verweise
    b = b.replace('href="index.html#fahrschule"', 'href="fahrschule.html"')
    b = b.replace('href="index.html#klassen"', 'href="klassen.html"')
    if aktiv:
        b = b.replace('href="' + aktiv + '"', 'href="' + aktiv + '" aria-current="page"', 1)
    return b

def seite(datei, titel, beschreibung, inhalt, aktiv=None):
    html = f'''<!DOCTYPE html>
<html lang="de" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titel}</title>
<meta name="description" content="{beschreibung}">
<meta name="theme-color" content="#c9b41e">
<link rel="canonical" href="https://www.fahrschule-ari.de/{datei}">
<meta property="og:type" content="website">
<meta property="og:title" content="{titel}">
<meta property="og:description" content="{beschreibung}">
<meta property="og:url" content="https://www.fahrschule-ari.de/{datei}">
<meta property="og:image" content="https://www.fahrschule-ari.de/images/golf-8.png">
<meta property="og:locale" content="de_DE">
<link rel="icon" href="images/favicon.ico" sizes="32x32">
<link rel="icon" href="images/favicon-64.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="images/apple-touch-icon.png">
<link rel="preload" href="fonts/rubik-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/onest-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/style.css">
<script>
  // Kennzeichnet, dass Skripte laufen. Nur dann werden Abschnitte fuer das
  // Einblenden versteckt. Ohne JavaScript bleibt die Seite vollstaendig
  // lesbar, statt halb leer zu bleiben.
  document.documentElement.classList.add("js");
</script>
<script>
  try {{
    var t = localStorage.getItem("ari-theme");
    if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = t;
  }} catch (e) {{}}
</script>
</head>
<body>

<a class="skip-link" href="#main">Zum Inhalt springen</a>

{anpassen(KOPF, aktiv)}
<main id="main">
{inhalt}
</main>

{anpassen(FUSS, aktiv)}
<button class="to-top" id="toTop" type="button" aria-label="Nach oben">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
</button>

<script src="js/datenschutz-hinweis.js" defer></script>
<script src="js/zaehler.js" defer></script>
<script src="js/main.js" defer></script>
<script src="js/assistant.js" defer></script>
</body>
</html>
'''
    with open(os.path.join(WURZEL, datei), "w", encoding="utf-8") as f:
        f.write(html)
    print("geschrieben:", datei, len(html), "Zeichen")

if __name__ == "__main__":
    import inhalte
    for datei, args in inhalte.SEITEN.items():
        seite(datei, **args)
