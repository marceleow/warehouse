# Warehouse — Implementation Spec

> This document captures all architectural and data-modeling decisions resolved during the design session on 2026-06-14. It is meant to be handed to an AI coding agent as the single source of truth for rebuilding the application from its current state.

## 1. What changed from the prior codebase

The project was originally a SvelteKit app. It has been migrated to **Next.js** (App Router, RSC). The domain model in `CONTEXT.md` was also rewritten — the old schema (`transactions`, `locations`, `materialBalance`) is now **out of date** and must be replaced entirely.

The current codebase has:

- A working Next.js shell (App Router, `reactCompiler: true`, `cacheComponents: true`)
- Drizzle ORM + libSQL (SQLite) for the database
- shadcn/ui (base-vega style) for components
- Valibot for server-side validation
- Sonner for toast notifications
- A `feature/` directory pattern for feature modules (queries, actions, types, components)
- A `Dock` component for bottom navigation (currently only Home + Master Data)

## 2. Decisions made

### 2.1 Schema rewrite — three separate document tables

The old `transactions` table is replaced by three distinct document tables, each with its own columns and its own line item table. No nullable-where-inapplicable fields, no polymorphic keys.

**Six tables total:**

| Table                  | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `materials`            | Material master records                          |
| `materialReceipts`     | Receipt header                                   |
| `receiptLineItems`     | Receipt line items                               |
| `materialIssues`       | Issue header                                     |
| `issueLineItems`       | Issue line items                                 |
| `stockAdjustments`     | Adjustment header                                |
| `adjustmentLineItems`  | Adjustment line items                            |
| `stockTrackingPeriods` | Records when a material's tracking period starts |

### 2.2 House Units are config constants

House Units live in a TypeScript constant file, **not** in the database. Material Issues store the House Unit name as a plain string. No referential integrity for House Units. No CRUD in the UI. Changing a House Unit name does not retroactively update historical issues.

### 2.3 Stock is calculated on the fly, no materialized balance

See ADR-0001 (`docs/adr/0001-calculate-stock-from-transaction-history.md`).

- Current stock = Total Received − Total Issued + Total Adjustments for the current `STOCK_TRACKED` period
- No `materialBalance` table
- Historical stock is computed by filtering transactions by date within the relevant tracking period

### 2.4 Inventory Mode switching requires period tracking

When a Material switches from `LOG_ONLY` → `STOCK_TRACKED`, a `stockTrackingPeriods` row is created with `startedAt = now`. Stock calculations only consider transactions whose date falls within the **current** (or a given) `STOCK_TRACKED` period. Switching `STOCK_TRACKED` → `LOG_ONLY` ends the current period (set `endedAt`). Multiple switches produce multiple periods.

---

## 3. Database schema

```ts
// drizzle/schema.ts — complete replacement

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
  receiptDate: text("receipt_date").notNull(), // business date, defaults to today
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
  issueDate: text("issue_date").notNull(), // business date, defaults to today
  houseUnit: text("house_unit").notNull(), // free text, from config constant
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
  adjustmentDate: text("adjustment_date").notNull(), // business date, defaults to today
  reason: text("reason").notNull(), // required
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
```

### Design notes on schema

- **`materials.inventoryMode`** uses the canonical values `STOCK_TRACKED` and `LOG_ONLY` (per CONTEXT.md). The old `"tracked"` / `"log_only"` values are gone.
- **Dates** are stored as ISO 8601 strings via `text()` — consistent with the existing codebase pattern.
- **Line items** have unique `(documentId, materialId)` — each Material appears at most once per document. This is enforced at the application layer (merge duplicates in the form submission).
- **`adjustmentLineItems.delta`** replaces `quantity` — positive for additions, negative for reductions. Named `delta` per CONTEXT.md.
- **`receiptAttachments`** — stores metadata only. Actual files are saved to the local filesystem (see §5).
- **`stockTrackingPeriods`** — one row per STOCK_TRACKED activation. When a material is first set to STOCK_TRACKED, a period row is created with `startedAt = now, endedAt = null`. When switched back to LOG_ONLY, `endedAt` is set. When re-activated, a new period row is created. Stock calculation only sums transactions within the current (or specified) period.

### Uniqueness constraint

Each Material may appear at most once per document. This is **not** a database-level constraint (line items share no single materialId + documentId column across three tables) — it is enforced in the application layer by merging duplicate line items on form submission.

---

## 4. House Units — config constant

```ts
// lib/houseUnits.ts

export const HOUSE_UNITS = ["R01-10", "R01-12", "R02-05", "R02-08", "R03-01", "R03-04"] as const;

export type HouseUnit = (typeof HOUSE_UNITS)[number];
```

- No database table. No CRUD in the UI.
- Material Issues store `houseUnit` as a plain `text` field.
- To add/remove/rename House Units, edit this file and redeploy.

---

## 5. Receipt attachments — file storage

- Attachments are stored on the local filesystem under a configurable directory (default: `./uploads/receipts/`).
- The `receiptAttachments` table stores metadata (file name, MIME type, relative path).
- Accepted MIME types: `application/pdf`, `image/jpeg`, `image/png`.
- Attachments are optional at creation time and can be added later from the Receipt Detail screen.
- Attachments do not affect stock calculations, transaction validity, or workflow status (per CONTEXT.md).
- For the MVP, use local filesystem storage. A future iteration may add cloud storage.

---

## 6. Stock calculation logic

### 6.1 Current stock

For a `STOCK_TRACKED` material, find the **current** `stockTrackingPeriods` row (where `endedAt IS NULL`). Stock is:

```
SUM(receiptLineItems.quantity WHERE receiptDate >= period.startedAt)
− SUM(issueLineItems.quantity WHERE issueDate >= period.startedAt)
+ SUM(adjustmentLineItems.delta WHERE adjustmentDate >= period.startedAt)
```

If the material has never been tracked (no period row exists), stock is 0.

### 6.2 LOG_ONLY materials

No stock is calculated. No stock adjustment line items can reference a LOG_ONLY material (enforced in application validation).

### 6.3 Mode switching

- **LOG_ONLY → STOCK_TRACKED**: Create a new `stockTrackingPeriods` row with `startedAt = now`, `endedAt = null`. Previous transactions recorded while LOG_ONLY do not contribute to stock. User should create a Stock Adjustment to set an opening balance if needed.
- **STOCK_TRACKED → LOG_ONLY**: Set `endedAt = now` on the current period. Warn the user that remaining calculated stock will be ignored until tracking is re-enabled.
- **Switching can happen multiple times.** Each LOG_ONLY → STOCK_TRACKED transition starts a new period with stock at 0.

### 6.4 Historical stock

To calculate stock as of a given date, find the `stockTrackingPeriods` row where `startedAt <= date AND (endedAt IS NULL OR endedAt > date)`, then apply the formula above with `date` as the upper bound.

---

## 7. Validation rules

### Material Issue creation

- For each line item referencing a `STOCK_TRACKED` material, the issued quantity must not exceed the material's current available stock. The system blocks negative stock and displays a validation error.
- LOG_ONLY materials can be issued without stock checks.
- Each material appears at most once per issue (merge duplicates).

### Material Receipt creation

- Each material appears at most once per receipt (merge duplicates).
- No stock availability checks (receipts always add).

### Stock Adjustment creation

- Only `STOCK_TRACKED` materials are selectable.
- Delta can be positive or negative.
- A negative delta that would result in negative stock is blocked with a validation error.
- Each material appears at most once per adjustment (merge duplicates).

### Material deletion

- A Material can only be deleted if it has never been referenced by any line item (across all three document types). Otherwise, it must be edited or its Inventory Mode changed.

### Inventory Mode change

- When changing from `STOCK_TRACKED` to `LOG_ONLY`, the system warns the user before confirming.
- When changing from `LOG_ONLY` to `STOCK_TRACKED`, a new tracking period is created. The user should be prompted to create a Stock Adjustment for the opening balance.

---

## 8. Application routes and views

### Bottom Navigation (4 tabs)

Per CONTEXT.md, the app has a bottom dock with 4 tabs:

| Tab      | Route       | Description                                                                       |
| -------- | ----------- | --------------------------------------------------------------------------------- |
| Issues   | `/issues`   | Create new Material Issue + recent issues list                                    |
| Stock    | `/stock`    | Material list with stock levels (quick lookup)                                    |
| Receipts | `/receipts` | Create new Material Receipt + recent receipts list                                |
| More     | `/more`     | Adjustments, material management, house unit history, receipt history with search |

### Route structure (Next.js App Router)

```
app/
├── layout.tsx                    ← root layout with Dock
├── page.tsx                      ← redirect to /issues (primary tab)
├── issues/
│   ├── page.tsx                  ← recent issues list + create button
│   ├── new/
│   │   └── page.tsx              ← create Material Issue form
│   └── [id]/
│       └── page.tsx              ← Issue Detail
├── stock/
│   ├── page.tsx                  ← Material list (searchable, with stock levels)
│   └── [id]/
│       └── page.tsx              ← Material Detail (info + transaction history)
├── receipts/
│   ├── page.tsx                  ← recent receipts list + create button
│   ├── new/
│   │   └── page.tsx              ← create Material Receipt form
│   └── [id]/
│       └── page.tsx              ← Receipt Detail (with attachments)
├── more/
│   ├── page.tsx                  ← More tab landing (links to sub-sections)
│   ├── adjustments/
│   │   ├── page.tsx              ← Stock Adjustments list
│   │   ├── new/
│   │   │   └── page.tsx          ← create Stock Adjustment form
│   │   └── [id]/
│   │       └── page.tsx          ← Adjustment Detail
│   ├── materials/
│   │   ├── page.tsx              ← Material management list
│   │   ├── new/
│   │   │   └── page.tsx          ← create Material
│   │   └── [id]/
│   │       └── page.tsx          ← Material edit (also Inventory Mode change)
│   ├── house-units/
│   │   └── [name]/
│   │       └── page.tsx          ← House Unit Material History
│   └── receipt-history/
│       └── page.tsx              ← Receipt history with search
```

---

## 9. Feature module structure

Follow the existing pattern in `feature/locations/`. Each feature module contains:

```
feature/<domain>/
├── types.ts          ← Valibot schemas + inferred types
├── queries.ts        ← Server-side data fetching functions (use "use cache" + react cache)
├── action.ts         ← Server actions (mutations)
└── components/
    ├── <Entity>List.tsx
    ├── <Entity>Form.tsx
    ├── <Entity>Detail.tsx
    └── ...drawers, sheets, etc.
```

Feature modules to create:

1. `feature/materials/` — Material CRUD, Inventory Mode switching, stock calculation
2. `feature/issues/` — Material Issue CRUD
3. `feature/receipts/` — Material Receipt CRUD + attachments
4. `feature/adjustments/` — Stock Adjustment CRUD
5. `feature/stock/` — Stock level queries and display

The existing `feature/locations/` module should be **removed** — Locations are not part of the CONTEXT.md domain model.

---

## 10. Seed data

The seed file (`drizzle/seed.ts`) must be rewritten to match the new schema:

- **Materials**: 37 materials as currently defined (preserve the same names, units, descriptions, and types — but change `"tracked"` → `"STOCK_TRACKED"` and `"log_only"` → `"LOG_ONLY"`)
- **House Units**: Not seeded (they're a config constant)
- **Sample Material Receipts, Issues, and Stock Adjustments**: Create a few of each with realistic data matching the current seed's transaction patterns (materials received from head office, materials issued to house units, adjustments)
- **Stock Tracking Periods**: One row per `STOCK_TRACKED` material, with `startedAt` before the earliest sample transaction, `endedAt = null`
- Remove all references to `locations`, `transactions`, `transactionItems`, and `materialBalance`

---

## 11. File upload for Receipt attachments

- Use the Next.js Route Handler pattern (`app/api/attachments/route.ts`) for upload/delete.
- Store files in `./uploads/receipts/<receiptId>/\<filename>`.
- The `POST` handler accepts `multipart/form-data`, validates MIME type (PDF, JPG, PNG), saves to disk, and creates a `receiptAttachments` row.
- The `DELETE` handler removes the file from disk and the database row.
- Serve attachments via Next.js `rewrites` in `next.config.ts` pointing `/uploads/(.*)` → `./uploads/$1`, or via a dedicated API route.

---

## 12. Tech stack summary

| Layer         | Technology                                                            |
| ------------- | --------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, RSC, reactCompiler, cacheComponents)          |
| Database      | libSQL (SQLite) via Drizzle ORM                                       |
| Validation    | Valibot (server-side schema validation)                               |
| UI Components | shadcn/ui (base-vega style) + Tailwind CSS v4                         |
| Icons         | Lucide React                                                          |
| Toast         | Sonner                                                                |
| Bottom Nav    | Existing `Dock` component (expand to 4 tabs per §8)                   |
| File Upload   | Next.js Route Handlers + local filesystem                             |
| Auth          | Single application password (no user accounts, roles, or permissions) |

---

## 13. Implementation order (recommended)

Build in this sequence so that each step has working dependencies:

1. **Schema + seed** — Replace `drizzle/schema.ts` and `drizzle/seed.ts`. Run `db:reset`. Verify tables exist and seed data loads.
2. **House Units config** — Create `lib/houseUnits.ts`.
3. **Materials feature** — CRUD for Material master records, Inventory Mode switching with tracking period management. Stock calculation queries.
4. **Stock view** — Material list with stock levels (the `/stock` tab). Material detail with transaction history.
5. **Issues feature** — Create Material Issue, validation including stock availability check, list + detail views.
6. **Receipts feature** — Create Material Receipt, list + detail views. Attachments can be a follow-up.
7. **Receipt attachments** — File upload API route, attachment UI on Receipt Detail.
8. **Adjustments feature** — Create Stock Adjustment, list + detail views.
9. **More tab** — House Unit history, receipt history with search, material management.
10. **Dock update** — Expand the `Dock` component from 2 tabs to 4 tabs per §8.

---

## 14. Things explicitly NOT in scope for MVP

- Authentication / application password (can be added later)
- Pagination (dataset is small)
- Search/filter beyond simple name search on Material list
- Batch operations (import/export)
- Reporting or analytics views
- Offline-first / PWA optimizations beyond basic setup
