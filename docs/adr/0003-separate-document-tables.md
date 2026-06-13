# 0003: Separate document tables for Receipts, Issues, and Adjustments

Three separate header tables (`materialReceipts`, `materialIssues`, `stockAdjustments`) with three separate line item tables (`receiptLineItems`, `issueLineItems`, `adjustmentLineItems`), plus a shared `materials` table and a `stockTrackingPeriods` table. No polymorphic `transactions` table.

## Status

Accepted

## Context

The previous schema used a single `transactions` table with a `type` discriminator and a shared `transactionItems` table. Each document type (Receipt, Issue, Adjustment) has fundamentally different header fields. A polymorphic design would require many nullable columns and weaker constraints.

## Decision

Use six tables (three header + three line item) so each document type has its own columns with no nullable-where-inapplicable fields. Every foreign key is a simple single-target reference enforced by the database.

## Consequences

- Clean column constraints — no nullable header fields for inapplicable document types
- Full referential integrity on every foreign key
- More tables (8 total including materials, receiptAttachments, and stockTrackingPeriods) but each is simple and well-defined
- Document-specific queries are straightforward — no type filtering needed
- Cross-document queries (e.g. Material transaction history) require UNIONs across the three line item tables
