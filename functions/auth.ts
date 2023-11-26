// import type {
//   KVNamespace,
//   PagesFunction,
//   Response,
//   //   crypto,

import { ServiceWorkerGlobalScope } from "@cloudflare/workers-types";

// } from "@cloudflare/workers-types";
interface Env {
  USER_SERVICE: ServiceWorkerGlobalScope;
}

export const onRequest: PagesFunction<Env> = async ({
  data,
  request,
  params,
  env,
  waitUntil,
}) => {
  const res = await env.USER_SERVICE.fetch(
    new Request("http://example.com/login", {
      method: "POST",
      body: JSON.stringify({ login: "test", password: "test" }),
      headers: {
        "content-type": "application/json",
        "x-api-key": "anything really",
      },
    })
    // new Request({
    //   url: "/login",
    //   body: new ReadableStream("asdasd"),

    // //   text: "abcd"
    // //   body: JSON.stringify({ login: "test", password: "test" }),
    // })
  );

  //   console.log("response is", await res.json());

  return res as any;
  //   let value = parseInt((await env.KV.get("counter")) || "0");

  // this will be executed after function is returned, pretty cool
  //   waitUntil(env.KV.put("counter", (value + 1).toString()));

  //   const rand = crypto.randomUUID();
  //   //   const result = `${value}=${rand}`;
  //   const result = `counter=${value}`;
  //   console.log("request response is", result, "with random value of", rand);

  //   return new Response(result, {
  //     headers: {
  //       "Cache-Control": "s-maxage=10",
  //     },
  //   });
};
