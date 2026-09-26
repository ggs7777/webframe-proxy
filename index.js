export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const target = incoming.searchParams.get("url");

    if (!target) {
      return new Response("Missing ?url=https://example.com", {
        status: 400
      });
    }

    let targetURL;

    try {
      targetURL = new URL(target);
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    if (!["http:", "https:"].includes(targetURL.protocol)) {
      return new Response("Only HTTP/HTTPS URLs are supported", {
        status: 400
      });
    }

    try {
      const response = await fetch(targetURL);

      const headers = new Headers(response.headers);
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });

    } catch (error) {
      return new Response("Proxy error: " + error.message, {
        status: 502
      });
    }
  }
};
