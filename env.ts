import { object, string, parse } from "valibot";

export const env = parse(
  object({
    DATABASE_URL: string(),
  }),
  process.env,
);
