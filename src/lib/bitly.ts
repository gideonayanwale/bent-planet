import { getServerEnv } from "./env";

/**
 * Shorten a long URL using the Bitly API v4.
 * Returns the shortened bit.ly URL if successful, or falls back to the original URL.
 */
export async function shortenUrl(longUrl: string): Promise<string> {
  try {
    const env = getServerEnv();
    const token = env.BITLY_ACCESS_TOKEN;

    if (!token) {
      // Bitly API key not configured, return original URL
      return longUrl;
    }

    const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: longUrl,
        domain: "bit.ly",
      }),
    });

    if (!response.ok) {
      console.warn(`Bitly shortening failed (${response.status}):`, await response.text());
      return longUrl;
    }

    const data = await response.json();
    return data.link || longUrl;
  } catch (error) {
    console.error("Error shortening URL with Bitly:", error);
    return longUrl;
  }
}
