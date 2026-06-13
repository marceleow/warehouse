import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── Materials ─────────────────────────────────────────────────────────────

export const materials = sqliteTable("materials", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  materialCode: text("material_code"), // optional
  unitOfMeasure: text("unit_of_measure").notNull(),
  inventoryMode: text("inventory_mode")
    .$type<"STOCK_TRACKED" | "LOG_ONLY">()
    .notNull()
    .default("LOG_ONLY"),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── Material Receipts ─────────────────────────────────────────────────────

export const materialReceipts = sqliteTable("material_receipts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  receiptDate: text("receipt_date").notNull(), // business date
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const receiptLineItems = sqliteTable("receipt_line_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  receiptId: text("receipt_id")
    .references(() => materialReceipts.id)
    .notNull(),
  materialId: text("material_id")
    .references(() => materials.id)
    .notNull(),
  quantity: real("quantity").notNull(),
});

// ─── Material Issues ────────────────────────────────────────────────────────

export const materialIssues = sqliteTable("material_issues", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  issueDate: text("issue_date").notNull(), // business date
  houseUnit: text("house_unit").notNull(), // free text from config
  collector: text("collector").notNull(), // free text
  workDescription: text("work_description"), // optional
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const issueLineItems = sqliteTable("issue_line_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  issueId: text("issue_id")
    .references(() => materialIssues.id)
    .notNull(),
  materialId: text("material_id")
    .references(() => materials.id)
    .notNull(),
  quantity: real("quantity").notNull(),
});

// ─── Stock Adjustments ──────────────────────────────────────────────────────

export const stockAdjustments = sqliteTable("stock_adjustments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adjustmentDate: text("adjustment_date").notNull(), // business date
  reason: text("reason").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const adjustmentLineItems = sqliteTable("adjustment_line_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adjustmentId: text("adjustment_id")
    .references(() => stockAdjustments.id)
    .notNull(),
  materialId: text("material_id")
    .references(() => materials.id)
    .notNull(),
  delta: real("delta").notNull(), // positive or negative
});

// ─── Attachment metadata (for Material Receipt attachments) ─────────────────

export const receiptAttachments = sqliteTable("receipt_attachments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  receiptId: text("receipt_id")
    .references(() => materialReceipts.id)
    .notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(), // "application/pdf", "image/jpeg", "image/png"
  filePath: text("file_path").notNull(), // relative path on disk
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── Stock Tracking Periods ──────────────────────────────────────────────────

export const stockTrackingPeriods = sqliteTable("stock_tracking_periods", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  materialId: text("material_id")
    .references(() => materials.id)
    .notNull(),
  startedAt: text("started_at").notNull(), // ISO timestamp when STOCK_TRACKED began
  endedAt: text("ended_at"), // null if currently active
});

export const table = {
  materials,
  materialReceipts,
  receiptLineItems,
  materialIssues,
  issueLineItems,
  stockAdjustments,
  adjustmentLineItems,
  receiptAttachments,
  stockTrackingPeriods,
};
