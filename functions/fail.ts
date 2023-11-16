export function onRequest() {
  throw new Error("oups, we intentially failed");

  return new Response("Miracles dont exist");
}
