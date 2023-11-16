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
}) => {
  let value = parseInt(await env.KV.get("counter"));

  if (Number.isNaN(value)) value = 0;
  else value++;

  await env.KV.put("counter", value.toString());

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
