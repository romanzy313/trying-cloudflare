import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "kysely-codegen";
// (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT
// interface CustomersTable {
//   CustomerId: number;
//   CompanyName: string;
//   ContactName: string;
// }

// interface Database {
//   Customers: CustomersTable;
// }

export function d1(env: any) {
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });

  return db;
}
