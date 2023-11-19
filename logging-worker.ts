/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// here is example
// https://developers.cloudflare.com/workers/observability/tail-workers/

// and how to use on google
// https://cloud.google.com/logging/docs/reference/v2/rest/v2/entries/write

// google auth https://cloud.google.com/docs/authentication/rest
export default {
  async tail(events) {
    fetch("https://example.com/endpoint", {
      method: "POST",
      body: JSON.stringify(events),
    });
  },
};
