# -*- coding: utf-8 -*-
"""Inhalte der Unterseiten. Zahlen stammen vom Preisaushang in der Fahrschule."""

def kopfteil(h1, lead):
    return f'''  <section class="seitenkopf">
    <div class="shell">
      <h1>{h1}</h1>
      <p class="lead">{lead}</p>
    </div>
  </section>
'''

# ---------------------------------------------------------------- Preise
def posten(bezeichnung, wert, zusatz=""):
    z = f'<small>{zusatz}</small>' if zusatz else ""
    w = wert if wert else '<span class="p-leer">–</span>'
    return f'''        <div class="p-zeile">
          <span class="p-was">{bezeichnung}{z}</span>
          <span class="p-wert">{w}</span>
        </div>
'''

PREISE = kopfteil(
    "Was der Führerschein kostet.",
    "Die Zahlen unten stehen so auch als Preisaushang nach § 32 Fahrlehrergesetz "
    "in unseren Büros. Keine Pakete, keine versteckten Posten – du zahlst den "
    "Grundbetrag und die Fahrstunden, die du tatsächlich brauchst."
) + '''
  <section class="preise">
    <div class="shell">
      <div class="p-karten">

        <article class="p-karte p-karte-haupt reveal">
          <header class="p-kopf">
            <span class="p-klasse">B</span>
            <span class="p-titel">Pkw bis 3.500 kg</span>
          </header>
''' + posten("Grundbetrag", "499,00 €", "allgemeine Aufwendungen einschließlich des theoretischen Unterrichts") \
    + posten("Fahrstunde", "79,00 €", "je 45 Minuten") \
    + posten("Sonderfahrten", "85,00 €", "Überland, Autobahn und Dunkelheit, je 45 Minuten") \
    + posten("Vorstellung zur theoretischen Prüfung", "79,00 €") \
    + posten("Vorstellung zur praktischen Prüfung", "199,00 €", "komplett") + '''
        </article>

        <article class="p-karte reveal reveal-delay-1">
          <header class="p-kopf">
            <span class="p-klasse">BE</span>
            <span class="p-titel">Anhänger mit Prüfung</span>
          </header>
''' + posten("Grundbetrag", "299,00 €") \
    + posten("Fahrstunde", "79,00 €", "je 45 Minuten") \
    + posten("Sonderfahrten", "87,00 €", "Überland, Autobahn und Dunkelheit, je 45 Minuten") \
    + posten("Unterweisung am Fahrzeug", "79,00 €", "je 45 Minuten") \
    + posten("Vorstellung zur praktischen Prüfung", "204,00 €", "komplett") \
    + posten("bei Teilprüfung", "125,00 €", "nur praktisches Fahren und Grundfahraufgaben") \
    + posten("bei Teilprüfung", "79,00 €", "nur Verbinden und Trennen von Fahrzeugen") + '''
        </article>
      </div>

      <div class="p-extra">
        <div class="p-extra-block reveal">
          <span class="p-extra-label">Beide Klassen zusammen</span>
          <strong>B + BE – Grundbetrag 699,00 €</strong>
          <p>Wer beides zusammen macht, zahlt den Grundbetrag nur einmal
             und spart gegenüber 499 € plus 299 € rund hundert Euro.</p>
        </div>

        <div class="p-extra-block reveal reveal-delay-1">
          <span class="p-extra-label">Klasse B96</span>
          <strong>Ausbildungskurs 599,00 €</strong>
          <p>Die Schulung nach Anlage 7a FeV für Gespanne bis 4.250 kg.
             Keine Prüfung, dafür ein fester Kurspreis.</p>
        </div>
      </div>

      <div class="p-hinweis reveal">
        <h2>Was noch dazukommt</h2>
        <p>
          Nicht im Preis der Fahrschule enthalten sind die amtlichen Gebühren:
          die Gebühr der Führerscheinstelle für den Antrag, die Gebühren der
          Prüforganisation für Theorie- und Praxisprüfung, dazu Sehtest,
          Erste-Hilfe-Kurs und das biometrische Passfoto. Diese Beträge
          zahlst du direkt an die jeweilige Stelle, nicht an uns.
        </p>
        <p>
          Wie viele Fahrstunden du brauchst, sagt dir niemand seriös vorher.
          Vorgeschrieben sind die zwölf Sonderfahrten; alles davor hängt von
          dir ab. Wir sagen dir ehrlich, wo du stehst, und melden dich erst
          zur Prüfung an, wenn du so weit bist.
        </p>
        <p class="p-stand">
          Stand des Preisaushangs: siehe Aushang in den Büros Zähringen und
          Stühlinger. Bei Fragen zu einzelnen Posten ruf einfach an.
        </p>
      </div>

      <div class="note-band reveal">
        <div>
          <h3>Rechnen wir es gemeinsam durch?</h3>
          <p>Am Telefon schätzen wir dir in fünf Minuten realistisch ein, womit
             du in deiner Situation rechnen musst.</p>
        </div>
        <a class="btn btn-gold" href="tel:+4917643454447">0176 43454447</a>
      </div>
    </div>
  </section>
'''

# ---------------------------------------------------------------- Klassen
KLASSEN = kopfteil(
    "Vier Klassen, ein Ziel.",
    "Ob erster Führerschein, Wohnwagen oder Pferdeanhänger – wir bilden in den "
    "Klassen aus, die du im Alltag wirklich brauchst."
) + '''
  <section>
    <div class="shell klassen-lang">

      <article class="kl reveal" id="b">
        <div class="kl-marke"><span>B</span></div>
        <div class="kl-text">
          <h2>Der Autoführerschein</h2>
          <p class="lead">Fahrzeuge bis 3.500 kg zulässige Gesamtmasse, mit bis zu
             acht Sitzplätzen außer dem Fahrersitz. Die Klassen AM und L sind
             enthalten.</p>
          <p>Ab 18 Jahren, mit Begleitetem Fahren schon ab 17. Anfangen kannst du
             ab 16½ – wer früh beginnt, hält den Führerschein pünktlich zum
             Geburtstag in der Hand.</p>
          <p>Zur Ausbildung gehören 12 Doppelstunden Grundstoff und 2 Doppelstunden
             Zusatzstoff im Theorieunterricht, dazu die Fahrstunden und die zwölf
             Sonderfahrten: fünf über Land, vier auf der Autobahn, drei bei
             Dunkelheit.</p>
          <p class="kl-preis"><a href="preise.html">Grundbetrag 499 €, Fahrstunde 79 €</a></p>
        </div>
      </article>

      <article class="kl reveal" id="b197">
        <div class="kl-marke"><span>B197</span></div>
        <div class="kl-text">
          <h2>Automatik lernen, ohne Automatik im Führerschein</h2>
          <p class="lead">Du lernst und prüfst auf Automatik und bekommst trotzdem
             einen Führerschein ohne Beschränkung – du darfst also auch Schaltwagen
             fahren.</p>
          <p>Dafür brauchst du mindestens zehn Fahrstunden zu 45 Minuten auf einem
             Schaltwagen und eine anschließende Testfahrt bei deinem Fahrlehrer.
             Erst danach wird die Prüfung angesetzt.</p>
          <p>Für viele ist das der ruhigere Weg: Am Anfang konzentrierst du dich auf
             den Verkehr statt auf die Kupplung, und das Schalten kommt dazu, wenn
             der Rest schon sitzt.</p>
          <p class="kl-preis"><a href="preise.html">Preise wie Klasse B</a></p>
        </div>
      </article>

      <article class="kl reveal" id="b96">
        <div class="kl-marke"><span>B96</span></div>
        <div class="kl-text">
          <h2>Anhänger bis 4.250 kg</h2>
          <p class="lead">Die Schulung für alle, die mit Wohnwagen, Pferde- oder
             Bootsanhänger unterwegs sind – Zugfahrzeug und Anhänger zusammen bis
             4.250 kg.</p>
          <p>Es ist keine Prüfung, sondern eine Fahrerschulung nach Anlage 7a FeV:
             Theorie, Übungen auf dem Platz und Fahren im Verkehr. Am Ende steht
             kein Prüfer, sondern eine Bescheinigung.</p>
          <p>Voraussetzung ist die Klasse B. Ob B96 reicht oder ob es BE sein muss,
             hängt am Gewicht deines Gespanns – bring die Fahrzeugscheine mit, dann
             rechnen wir es zusammen aus.</p>
          <p class="kl-preis"><a href="preise.html">Kurs 599 €</a></p>
        </div>
      </article>

      <article class="kl reveal" id="be">
        <div class="kl-marke"><span>BE</span></div>
        <div class="kl-text">
          <h2>Der große Anhängerführerschein</h2>
          <p class="lead">Für schwere Anhänger jenseits der Grenzen von B96. Eine
             eigene Führerscheinklasse mit praktischer Prüfung, aufbauend auf
             Klasse B.</p>
          <p>Theorieunterricht entfällt, es zählt die Praxis: Fahrstunden mit dem
             Gespann, die Unterweisung am Fahrzeug sowie Sonderfahrten über Land,
             auf der Autobahn und bei Dunkelheit.</p>
          <p>Wer B und BE zusammen macht, zahlt den Grundbetrag nur einmal.</p>
          <p class="kl-preis"><a href="preise.html">Grundbetrag 299 €, zusammen mit B 699 €</a></p>
        </div>
      </article>
    </div>
  </section>

  <section class="why">
    <div class="shell">
      <div class="note-band reveal" style="margin-top:0">
        <div>
          <h3>Unsicher, was zu dir passt?</h3>
          <p>Sag uns, was du fahren willst – wir sagen dir, welche Klasse du dafür
             brauchst und welche nicht.</p>
        </div>
        <a class="btn btn-gold" href="tel:+4917643454447">0176 43454447</a>
      </div>
    </div>
  </section>
'''

# ---------------------------------------------------------------- Fahrschule
FAHRSCHULE = kopfteil(
    "Ein Fahrlehrer, der dich kennt.",
    "Keine Massenabfertigung, kein ständiger Wechsel: Du fährst mit jemandem, "
    "der weiß, wo du stehst und was du noch brauchst."
) + '''
  <section>
    <div class="shell about-grid">
      <div class="about-copy reveal">
        <p class="lead">
          „Mein Name ist Miftar Rexhepi. Ich bin seit über zehn Jahren Fahrlehrer
          und habe die Fahrschule ARI im Februar 2024 neu eröffnet – mit einer
          klaren Vorstellung davon, wie Fahrausbildung aussehen sollte.“
        </p>
        <p>
          Jeder Schüler bekommt eine Ausbildung, die zu ihm passt: zu seinem Tempo,
          seinen Vorkenntnissen und seinem Terminkalender. Durch diese intensive
          Betreuung brauchen unsere Schüler in der Regel selten Fahrstunden über
          die gesetzlichen Anforderungen hinaus.
        </p>
        <p>
          Es geht uns nicht nur um den Führerschein, sondern darum, dass du danach
          sicher und selbstbewusst unterwegs bist – auch in zehn Jahren noch.
        </p>
        <ul class="values">
          <li>Zuverlässigkeit</li>
          <li>Professionalität</li>
          <li>Persönliche Betreuung</li>
        </ul>
      </div>

      <figure class="about-figure reveal reveal-delay-1">
        <img src="images/miftar.jpg" alt="Miftar Rexhepi, Inhaber und Fahrlehrer der Fahrschule ARI, vor einem der Fahrschulwagen." width="649" height="980" loading="lazy">
        <figcaption>Miftar Rexhepi – seit über zehn Jahren Fahrlehrer.</figcaption>
      </figure>
    </div>
  </section>

  <section class="theorie-band">
    <div class="theorie-photo">
      <img src="images/theorie-quer.jpg" alt="Theorieunterricht der Fahrschule ARI: Gruppe von Fahrschülern im Unterrichtsraum." width="1600" height="1292" loading="lazy">
    </div>
    <div class="shell theorie-inner">
      <div class="theorie-card reveal">
        <h2>Einsteigen, wann es dir passt.</h2>
        <p>
          Der Unterricht ist in geschlossene Themenblöcke gegliedert. Du wartest
          also nicht auf einen Kursstart, sondern kommst zum nächsten Abend, der
          dir passt – in Zähringen oder im Stühlinger. Bilder und Videos laufen
          dabei über den großen Bildschirm.
        </p>
        <dl class="facts">
          <div><dt>12</dt><dd>Doppelstunden Grundstoff, je 90 Minuten</dd></div>
          <div><dt>2</dt><dd>Doppelstunden Zusatzstoff für Klasse B</dd></div>
          <div><dt>0 €</dt><dd>für die Lern-App – die bekommst du von uns</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <section class="why">
    <div class="shell">
      <div class="section-head reveal">
        <h2>Womit du fährst.</h2>
        <p>Gepflegte Fahrzeuge mit aktuellen Assistenzsystemen, regelmäßig gewartet
           und sauber – weil du dich darin wohlfühlen sollst.</p>
      </div>

      <div class="why-grid">
        <div class="why-item reveal">
          <div class="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6.5 17l1.2-5.2a2 2 0 0 1 2-1.6h4.6a2 2 0 0 1 2 1.6L17.5 17"/><circle cx="7.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/></svg></div>
          <h3>VW Golf 8</h3>
          <p>Unser Hauptfahrzeug für die Klasse B, mit Schaltgetriebe.</p>
        </div>
        <div class="why-item reveal reveal-delay-1">
          <div class="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8.5 12h7"/></svg></div>
          <h3>VW Golf Plus, Automatik</h3>
          <p>Für alle, die auf Automatik lernen – mit B197 trotzdem ohne
             Beschränkung im Führerschein.</p>
        </div>
        <div class="why-item reveal reveal-delay-2">
          <div class="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18.5h2"/></svg></div>
          <h3>Lern-App inklusive</h3>
          <p>Alle Schüler bekommen kostenlos die Führerscheinlern-App und lernen
             damit, wann und wo sie wollen.</p>
        </div>
      </div>
    </div>
  </section>
'''

SEITEN = {
    "preise.html": dict(
        titel="Preise – ARI Fahrschule Freiburg",
        beschreibung="Preisaushang der ARI Fahrschule Freiburg nach § 32 Fahrlehrergesetz: Grundbetrag, Fahrstunden und Prüfungsgebühren für die Klassen B, B96 und BE.",
        inhalt=PREISE, aktiv="preise.html"),
    "klassen.html": dict(
        titel="Führerscheinklassen B, B197, B96 und BE – ARI Fahrschule Freiburg",
        beschreibung="Die Führerscheinklassen der ARI Fahrschule Freiburg im Detail: B, B197 mit Automatik, B96 und BE für Anhänger.",
        inhalt=KLASSEN, aktiv="klassen.html"),
    "fahrschule.html": dict(
        titel="Unsere Fahrschule – ARI Fahrschule Freiburg",
        beschreibung="Miftar Rexhepi, seit über zehn Jahren Fahrlehrer, über die ARI Fahrschule in Freiburg, den Theorieunterricht und den Fuhrpark.",
        inhalt=FAHRSCHULE, aktiv=None),
}
