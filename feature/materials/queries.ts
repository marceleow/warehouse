"use cache";

import { cache } from "react";
import { db } from "#/drizzle";
import {
  materials,
  receiptLineItems,
  issueLineItems,
  adjustmentLineItems,
  stockTrackingPeriods,
  materialReceipts,
  materialIssues,
  stockAdjustments,
} from "#/drizzle/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";

export const getMaterials = cache(async () => {
  cacheTag("materials");
  return db.select().from(materials).orderBy(materials.name);
});

export const getMaterialById = cache(async (id: string) => {
  cacheTag("materials");
  const rows = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return rows[0] ?? null;
});

export const getCurrentStockTrackingPeriod = cache(async (materialId: string) => {
  cacheTag("materials");
  const rows = await db
    .select()
    .from(stockTrackingPeriods)
    .where(
      and(eq(stockTrackingPeriods.materialId, materialId), isNull(stockTrackingPeriods.endedAt)),
    )
    .limit(1);
  return rows[0] ?? null;
});

export const calculateStock = cache(async (materialId: string) => {
  cacheTag("materials");
  const period = await getCurrentStockTrackingPeriod(materialId);
  if (!period) return 0;

  const [receipts] = await db
    .select({ total: sql<number>`COALESCE(SUM(${receiptLineItems.quantity}), 0)` })
    .from(receiptLineItems)
    .innerJoin(materialReceipts, eq(receiptLineItems.receiptId, materialReceipts.id))
    .where(
      and(
        eq(receiptLineItems.materialId, materialId),
        sql`date(${materialReceipts.receiptDate}) >= date(${period.startedAt})`,
      ),
    );

  const [issues] = await db
    .select({ total: sql<number>`COALESCE(SUM(${issueLineItems.quantity}), 0)` })
    .from(issueLineItems)
    .innerJoin(materialIssues, eq(issueLineItems.issueId, materialIssues.id))
    .where(
      and(
        eq(issueLineItems.materialId, materialId),
        sql`date(${materialIssues.issueDate}) >= date(${period.startedAt})`,
      ),
    );

  const [adjustments] = await db
    .select({ total: sql<number>`COALESCE(SUM(${adjustmentLineItems.delta}), 0)` })
    .from(adjustmentLineItems)
    .innerJoin(stockAdjustments, eq(adjustmentLineItems.adjustmentId, stockAdjustments.id))
    .where(
      and(
        eq(adjustmentLineItems.materialId, materialId),
        sql`date(${stockAdjustments.adjustmentDate}) >= date(${period.startedAt})`,
      ),
    );

  return (receipts?.total ?? 0) - (issues?.total ?? 0) + (adjustments?.total ?? 0);
});

export const getMaterialReferences = cache(async (materialId: string) => {
  cacheTag("materials");
  const [receiptResult, issueResult, adjustmentResult] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(receiptLineItems)
      .where(eq(receiptLineItems.materialId, materialId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(issueLineItems)
      .where(eq(issueLineItems.materialId, materialId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(adjustmentLineItems)
      .where(eq(adjustmentLineItems.materialId, materialId)),
  ]);

  return {
    receiptCount: receiptResult[0]?.count ?? 0,
    issueCount: issueResult[0]?.count ?? 0,
    adjustmentCount: adjustmentResult[0]?.count ?? 0,
    total:
      (receiptResult[0]?.count ?? 0) +
      (issueResult[0]?.count ?? 0) +
      (adjustmentResult[0]?.count ?? 0),
  };
});
