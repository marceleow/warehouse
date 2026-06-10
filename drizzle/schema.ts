import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const locations = sqliteTable("locations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
});

export const materials = sqliteTable("materials", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  type: text().$type<"tracked" | "log_only">().notNull(),
  unitOfMeasure: text().notNull(),
  description: text(),
});

export const materialBalance = sqliteTable("material_balance", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  materialId: text()
    .references(() => materials.id)
    .notNull(),
  quantity: real().notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text().$type<"in" | "out">().notNull(),
  requestedBy: text().notNull(),
  note: text(),
  locationId: text()
    .references(() => locations.id)
    .notNull(),
  timestamp: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const transactionItems = sqliteTable("transaction_items", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  transactionId: text()
    .references(() => transactions.id)
    .notNull(),
  materialId: text()
    .references(() => materials.id)
    .notNull(),
  quantity: real().notNull(),
});

export const table = {
  locations,
  materials,
  materialBalance,
  transactions,
  transactionItems,
};
