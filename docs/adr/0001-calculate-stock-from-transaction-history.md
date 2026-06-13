# 0001: Calculate stock from transaction history

## Status

Accepted

## Context

STOCK_TRACKED materials need a current stock value: Total Received − Total Issued + Total Adjustments. The system must also support historical stock queries (stock as of any point in time).

Two main approaches exist:

- **Materialized balance table**: Store current stock in a `materialBalance` table, updated on every transaction write. Fast reads, but introduces a second source of truth and consistency risk.
- **Calculate on the fly**: Derive stock from transaction history every time. Single source of truth, but reads require aggregation.

The application serves a small team (~3 users) with a relatively small dataset (thousands of transactions, not millions).

## Decision

Calculate stock on the fly from transaction history. No materialized balance table.

## Consequences

- Single source of truth — stock is always derived from transactions
- No risk of balance tables becoming inconsistent with transaction history
- Simpler implementation and easier reasoning about correctness
- Historical stock calculations come for free — filter transactions by date
- Transaction edits and deletions are straightforward — no balance table to resync
- Materials switching between LOG_ONLY and STOCK_TRACKED multiple times is handled naturally — only transactions in STOCK_TRACKED periods contribute to stock
- Read performance may degrade if the dataset grows significantly; this is acceptable at current scale
- If performance becomes a concern in the future, a materialized balance layer can be introduced as a read optimization without changing the underlying business model
