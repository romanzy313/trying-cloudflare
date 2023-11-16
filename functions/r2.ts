import { getDb } from "../src/database";
interface Env {
  DB: D1Database;
}

// simple test for now

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const db = getDb(env.DB);
  const query = db
    .selectFrom("Customer")
    .innerJoin("Business", "Business.id", "Customer.companyId")
    .select([
      //   "Business.id",
      "Customer.id",
      "Business.name",
      "Customer.contactName",
    ])
    .compile();
  console.log("query", query.sql);

  const results = await db.executeQuery(query);

  console.log("result", results);

  // .leftJoin("Business", "Business.id", "Customer.id")
  // .execute();
  //   const stmtRead = env.DB.prepare("SELECT * from Customers");
  //   const result = await stmtRead.all();

  return new Response(JSON.stringify(results.rows), {
    headers: {
      "content-type": "application/json",
    },
  });

  //   if (request.method.toUpperCase() == "POST") {

  //     stmt.bind()
  //   }

  //   const obj = await env.DB.get("some-key");
  //   if (obj === null) {
  //     return new Response("Not found", { status: 404 });
  //   }
  //   return new Response(obj.body);
};
