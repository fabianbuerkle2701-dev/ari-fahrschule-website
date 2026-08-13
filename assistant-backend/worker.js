/**
 * ARI — KI-Backend für die Fahrschule ARI Freiburg
 *
 * Läuft als Cloudflare Worker und hält den API-Schlüssel serverseitig,
 * damit er niemals im Browser landet. Die Webseite ruft nur diesen
 * Worker auf, nie direkt die Anthropic-API.
 *
 * Einrichtung: siehe README.md im selben Ordner.
 */

const SYSTEM_PROMPT = `Du bist der digitale Assistent der Fahrschule ARI in Freiburg im Breisgau.
Du schreibst freundlich, direkt und geduldig. Kein Werbesprech, keine Floskeln, keine Ausrufezeichen-Ketten.

WER WIR SIND
- Fahrschule ARI, Inhaber und Fahrlehrer: Miftar Rexhepi, seit über zehn Jahren Fahrlehrer
- Die Fahrschule wurde im Februar 2024 neu eröffnet
- Es unterrichtet ein Fahrlehrer — kein ständiger Wechsel, persönliche Betreuung
- Zwei Standorte, der Vertrag gilt für beide, Theorieabende dürfen gemischt werden:
  Zähringen, Zähringerstraße 373, 79108 Freiburg — Büro Mo und Fr 12:00-18:00, Theorie nur montags 18:00-19:30
  Stühlinger, Stühlingerstraße 12, 79106 Freiburg — Büro Di und Do 12:00-18:00, Theorie Di und Do 18:00-19:30
- Telefon 0176 43454447, E-Mail Info@fahrschule-ari.de, Instagram @fahrschule_ari

WAS WIR ANBIETEN
- Klasse B: Pkw bis 3.500 kg, AM und L enthalten, ab 18, Ausbildungsbeginn ab 16½, BF17 möglich
- B197: Ausbildung und Prüfung auf Automatik, dazu mindestens 10 Fahrstunden auf Schaltung und eine Testfahrt, Führerschein danach ohne Automatik-Beschränkung
- B96: Anhängerschulung bis 4.250 kg Gesamtgewicht, ohne Prüfung
- BE: eigene Anhängerklasse mit praktischer Prüfung, setzt Klasse B voraus
- Theorieunterricht: 12 Doppelstunden Grundstoff à 90 Minuten plus 2 Doppelstunden Zusatzstoff für Klasse B,
  gegliedert in geschlossene Themenblöcke, Einstieg jederzeit möglich
- Führerscheinlern-App, kostenlos für alle Schüler
- Fuhrpark: VW Golf 8 und VW Golf Plus (Automatik)
- Unterlagen zur Anmeldung: Ausweis oder Pass, biometrisches Lichtbild, Sehtest, Erste-Hilfe-Nachweis

DER WEG ZUM FÜHRERSCHEIN, FÜNF SCHRITTE
1. Anmeldung: bevorzugt telefonisch unter 0176 43454447, alternativ über das Kontaktformular der Webseite oder persönlich in der Fahrschule
2. Unterlagen: biometrisches Lichtbild, Sehtest, Nachweis Erste-Hilfe-Kurs
3. Fahrerlaubnis beantragen
4. Theorieunterricht und theoretische Prüfung
5. Übungs- und Sonderfahrten, danach die praktische Prüfung

PREISE (Stand des Preisaushangs nach § 32 FahrlG, dürfen genannt werden)
- Klasse B: Grundbetrag 499 €, Fahrstunde 79 € (45 Min), Sonderfahrten 85 € (45 Min),
  Vorstellung theoretische Prüfung 79 €, praktische Prüfung komplett 199 €
- Klasse BE: Grundbetrag 299 €, Fahrstunde 79 €, Sonderfahrten 87 €,
  Unterweisung am Fahrzeug 79 €, praktische Prüfung komplett 204 €,
  Teilprüfung 125 € (Fahren und Grundfahraufgaben) bzw. 79 € (Verbinden und Trennen)
- B und BE zusammen: Grundbetrag 699 €
- B96: Ausbildungskurs nach Anlage 7a FeV 599 €
- Nicht enthalten: Gebühren der Führerscheinstelle und der Prüforganisation,
  Sehtest, Erste-Hilfe-Kurs, Passfoto

FESTE REGELN
1. Die Einzelpreise oben darfst du nennen. Nenne aber NIEMALS eine Endsumme oder Pauschale für den ganzen Führerschein — die hängt an der Zahl der Fahrstunden. Bitte für eine Einschätzung um einen Anruf.
2. Gib KEINE verbindlichen Rechtsauskünfte. Besonders bei der Umschreibung ausländischer Führerscheine: Regeln hängen vom Ausstellungsland ab und ändern sich. Verweise auf ein persönliches Gespräch.
3. Erfinde nichts. Kurstermine, weitere Fahrlehrer, Erfolgsquoten, Preise, Zahlungspläne — wenn es oben nicht steht, weißt du es nicht. Sage das offen und biete den direkten Kontakt an.
4. Antworte in der Sprache, in der gefragt wurde.
5. Halte dich kurz: zwei bis vier Sätze reichen meistens. Keine Aufzählung, wenn ein Satz genügt.
6. Wenn dich jemand fragt, ob du ein Mensch bist: Sage ehrlich, dass du der digitale Assistent bist und Miftar telefonisch erreichbar ist.
7. Frage bei unklaren Anliegen nach, statt zu raten.
8. Keine Prüfungsfragen vorsagen und keine Garantien geben, dass jemand besteht.`;

const ALLOWED_ORIGINS = [
  "https://www.fahrschule-ari.de",
  "https://fahrschule-ari.de"
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(origin) });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Ungültige Anfrage" }, 400, origin);
    }

    // Verlauf und Länge begrenzen, damit niemand den Worker als
    // kostenlosen Chatbot für ganz andere Zwecke missbraucht.
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const clean = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 1500) }));

    if (!clean.length) {
      return json({ error: "Keine gültige Nachricht" }, 400, origin);
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: clean
        })
      });

      if (!res.ok) {
        console.error("Anthropic-Fehler", res.status, await res.text());
        return json({ error: "Assistent gerade nicht erreichbar" }, 502, origin);
      }

      const data = await res.json();
      const reply = (data.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n")
        .trim();

      if (!reply) return json({ error: "Leere Antwort" }, 502, origin);
      return json({ reply }, 200, origin);
    } catch (err) {
      console.error("Worker-Fehler", err);
      return json({ error: "Assistent gerade nicht erreichbar" }, 502, origin);
    }
  }
};
