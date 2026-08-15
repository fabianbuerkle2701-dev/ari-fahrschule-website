/**
 * Besucherzähler der Fahrschule ARI
 *
 * Ein Cloudflare Worker mit einem KV-Speicher. Er zählt hoch und gibt den
 * Stand zurück, mehr nicht. Es wird KEINE IP-Adresse, kein Zeitstempel und
 * kein Merkmal des Besuchers gespeichert. In dem Speicher steht genau eine
 * Zahl.
 *
 * Bewusst kein fremder Zähldienst: Die Seite lädt sonst nichts von Dritten,
 * und ein kostenloser Zähler bezahlt sich üblicherweise mit den Daten der
 * Besucher. Das ist der Preis nicht wert.
 *
 * Einrichtung siehe README.md im selben Ordner.
 */

const ERLAUBTE_HERKUNFT = [
  "https://www.fahrschule-ari.de",
  "https://fahrschule-ari.de",
  "https://fabianbuerkle2701-dev.github.io"
];

const SCHLUESSEL = "besuche";

function kopfzeilen(herkunft) {
  const erlaubt = ERLAUBTE_HERKUNFT.includes(herkunft) ? herkunft : ERLAUBTE_HERKUNFT[0];
  return {
    "Access-Control-Allow-Origin": erlaubt,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store"
  };
}

function antwort(obj, status, herkunft) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...kopfzeilen(herkunft) }
  });
}

export default {
  async fetch(request, env) {
    const herkunft = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: kopfzeilen(herkunft) });
    }

    if (!env.ZAEHLER) {
      return antwort({ fehler: "KV-Speicher nicht verbunden" }, 500, herkunft);
    }

    try {
      const stand = parseInt(await env.ZAEHLER.get(SCHLUESSEL), 10) || 0;

      // GET liest nur, POST zählt hoch. Die Webseite schickt POST einmal je
      // Sitzung, damit das Blättern zwischen den Seiten nicht mitzählt.
      if (request.method === "POST") {
        const neu = stand + 1;
        await env.ZAEHLER.put(SCHLUESSEL, String(neu));
        return antwort({ stand: neu, neu: true }, 200, herkunft);
      }

      return antwort({ stand, neu: false }, 200, herkunft);
    } catch (fehler) {
      console.error("Zähler-Fehler", fehler);
      return antwort({ fehler: "Zähler gerade nicht erreichbar" }, 502, herkunft);
    }
  }
};
