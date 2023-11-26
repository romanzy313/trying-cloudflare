// import type {
//   KVNamespace,
//   PagesFunction,
//   Response,
//   //   crypto,
// } from "@cloudflare/workers-types";
interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async ({
  data,
  request,
  params,
  env,
  waitUntil,
}) => {
  let value = parseInt((await env.KV.get("counter")) || "0");

  // this will be executed after function is returned, pretty cool
  waitUntil(env.KV.put("counter", (value + 1).toString()));

  const rand = crypto.randomUUID();
  //   const result = `${value}=${rand}`;
  const result = `counter=${value}`;
  console.log("request response is", result, "with random value of", rand);

  return new Response(result, {
    headers: {
      "Cache-Control": "s-maxage=10",
    },
  });
};
