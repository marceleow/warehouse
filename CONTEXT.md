# Warehouse

A construction material warehouse management system for house building. Used by a small team (~3 people) who share responsibility. Protected by a single application password — no user accounts, roles, or permissions. Records incoming and outgoing material transactions and maintains inventory where applicable. The system is operational rather than analytical.

## Language

**Material**:
A commodity-type construction material tracked by quantity, not by individual identity. Master record fields: Name (required), Unit of Measure (required), Inventory Mode (required), Material Code (optional), Description (optional). Examples: pipes, pipe fittings, electrical accessories, paint, ceramic tiles, cement, sand, steel bars. Supports full CRUD. A Material can only be deleted if it has never been referenced by any transaction; otherwise, it must be edited or its Inventory Mode changed instead.
_Avoid_: Item, product, SKU, part

**Inventory Mode**:
A property of a Material master record that determines whether the system maintains a stock balance. One of `STOCK_TRACKED` or `LOG_ONLY`. Can be changed at any time. Stock formula for STOCK_TRACKED: Total Received Qty − Total Issued Qty + Total Adjustments. Historical stock can be calculated as of any point in time. LOG_ONLY materials never have stock adjustments. STOCK_TRACKED materials cannot be issued in quantities exceeding available stock — the system blocks negative stock and displays a validation error. LOG_ONLY materials have no stock balance and no availability checks.

Switching LOG_ONLY → STOCK_TRACKED starts a new stock-tracking period with an initial stock of 0. Previous transactions recorded while LOG_ONLY do not contribute to stock calculations. Users can create a Stock Adjustment to establish an opening balance. This transition can happen multiple times; each time resets stock to 0.

Switching STOCK*TRACKED → LOG_ONLY stops stock calculations immediately. The system warns the user before confirming, as any remaining calculated stock will be ignored until stock tracking is re-enabled.
\_Avoid*: Tracking type, count flag

**Stock-tracked Material**:
A Material whose Inventory Mode is `STOCK_TRACKED`. The system calculates current stock from incoming and outgoing transactions. Examples: PVC pipes, ceramic tiles, electrical accessories, roofing materials.
_Avoid_: Countable material, quantifiable material

**Log-only Material**:
A Material whose Inventory Mode is `LOG_ONLY`. Transactions are recorded for historical purposes, but no stock balance is maintained. Typically consumables or project-specific materials where inventory control is not required.
_Avoid_: Untracked material, non-countable material

**Unit of Measure**:
The unit in which a Material's quantity is expressed (e.g., pieces, kg, meters, liters, sacks).
_Avoid_: UOM, measure

**Material Receipt**:
A document representing materials received from the head office. Consists of a header (receipt date, optional notes) and one or more Line Items. Supports multiple attachments (PDF, JPG/JPEG, PNG) — e.g., an on-site photo followed by a later office scan. Receipt date is a business date that defaults to the current date but can be modified for backdated entries. Attachments are optional at creation time and can be added later. Attachments are supporting documentation only and do not affect stock calculations, transaction validity, or workflow status. Can be edited or deleted after creation. Stores createdAt and updatedAt timestamps. Identified internally by UUID; users identify receipts by receipt date and any attached delivery note.
_Avoid_: Incoming transaction, goods receipt, inbound, delivery

**Material Issue**:
A document representing materials released from the warehouse to workers for a specific House Unit and construction activity. Consists of a header (issue date, House Unit, collector, work description notes) and one or more Line Items. Issue date is a business date that defaults to the current date but can be modified for backdated entries. Can be edited or deleted after creation. Stores createdAt and updatedAt timestamps. Identified internally by UUID; users identify issues by issue date and House Unit.
_Avoid_: Outgoing transaction, withdrawal, outbound

**Stock Adjustment**:
A document representing a correction to calculated stock for STOCK*TRACKED materials. Contains a delta (positive or negative) per material, not an absolute value. Requires a note explaining the reason. May cover multiple materials in one document (e.g., results of a physical count). Does not apply to LOG_ONLY materials. Adjustment date is a business date that defaults to the current date but can be modified for backdated entries. Can be edited or deleted after creation. Stores createdAt and updatedAt timestamps. Identified internally by UUID; users identify adjustments by adjustment date.
\_Avoid*: Stock correction, inventory adjustment, stock count

**Line Item**:
A single line within a Material Receipt, Material Issue, or Stock Adjustment specifying a Material and a quantity (absolute for receipts/issues, delta for adjustments). Quantities support decimal values (e.g., 2.5 tonnes, 3.5 liters). Each Material may appear at most once per document — duplicate entries should be merged by combining quantities.
_Avoid_: Transaction detail, line entry

**House Unit**:
A predefined entry representing a specific unit in a housing project. Has a single field: Name (e.g., R01-10, R01-12, R02-05). Users select from the predefined list when creating Material Issues. No additional attributes such as block, phase, or address. Defined as a config constant in the codebase — no create, edit, or delete functionality in the application.
_Avoid_: Unit, apartment, lot, property

**Collector**:
The person who physically collects materials from the warehouse. Recorded on Material Issues as free text (a name).
_Avoid_: Recipient, requester

## Priority

Operations ranked by frequency:

1. Creating a Material Issue — most common daily activity
2. Checking Stock Levels — frequent need before issuing
3. Creating a Material Receipt — less frequent than issues
4. Viewing Transaction History — occasional review
5. Creating Stock Adjustments — infrequent
6. Managing Materials — uncommon master data changes

The application should prioritize speed and simplicity. Users record transactions quickly rather than analyze reports.

## Views

**Bottom Navigation (4 tabs):**

- **Issues** — Create new Material Issue + recent issues list (highest priority)
- **Stock** — Material list with stock levels (quick lookup)
- **Receipts** — Create new Material Receipt + recent receipts list
- **More** — Adjustments, material management, house unit history, receipt history with search

**Material List**:
Shows all materials in a single searchable list. STOCK_TRACKED materials display current stock quantity and unit of measure. LOG_ONLY materials display a "Log Only" indicator instead of a stock quantity. Searchable by name. Tapping a material opens Material Detail.

**Material Detail**:
Material information, Inventory Mode, current stock (for STOCK_TRACKED only), and complete transaction history (receipts, issues, adjustments). LOG_ONLY materials show transaction history but no stock balance.

**Material Receipt List**:
Browse and search receipts by date. View attached delivery notes and images.

**Material Issue List**:
Browse and search issues by date and House Unit.

**Create Material Issue flow**:
Single scrollable form. Header fields: Issue Date (defaults to today, editable), House Unit (select from list), Collector (free text), Work Description (free text). Line items: select Material, enter Quantity, add more as needed. Submit triggers validation including stock availability check for STOCK_TRACKED materials. On success, navigates to the newly created Issue Detail screen. No multi-step wizard, review screen, copy-from-previous, or templates.

**Create Material Receipt flow**:
Single scrollable form. Header fields: Receipt Date (defaults to today, editable), Notes (optional). Line items: select Material, enter Quantity, add more as needed. Attachments (PDF, JPG/JPEG, PNG) are optional during creation — users may upload one or more photos immediately or skip entirely. Additional attachments can be added later from the Receipt Detail screen. Absence of attachments never prevents creation.

**Create Stock Adjustment flow**:
Single scrollable form. Header fields: Adjustment Date (defaults to today, editable), Reason (required). Line items: select Material, enter delta Quantity (positive or negative). Only STOCK_TRACKED materials are selectable. Submit triggers validation. On success, navigates to the Adjustment Detail screen.

**House Unit Material History**:
Shows all materials issued to a specific House Unit.
