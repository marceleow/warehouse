import type { Config } from "drizzle-kit";
import { env } from "./env";

export default {
  dialect: "sqlite",
  schema: "./drizzle/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
