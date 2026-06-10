import { env } from "#/env";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: {
    url: env.DATABASE_URL,
  },
});
