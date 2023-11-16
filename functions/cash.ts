export function onRequest() {
  // no bueno
  const random = crypto.randomUUID();
  return new Response("Hello, world with id " + random, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "Cache-Control": "max-age=14400, s-maxage=84000",
      "Cloudflare-CDN-Cache-Control": "max-age=24400",
      "CDN-Cache-Control": "18000",
    },
  });
}
