"use server";

import { db } from "#/drizzle";
import {
  materials,
  stockTrackingPeriods,
  receiptLineItems,
  issueLineItems,
  adjustmentLineItems,
} from "#/drizzle/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import * as v from "valibot";
import { updateTag } from "next/cache";
import { materialInsertSchema, materialUpdateSchema, inventoryModeSwitchSchema } from "./types";

export async function createMaterial(input: unknown) {
  const parsed = v.safeParse(materialInsertSchema, input);
  if (!parsed.success) {
    return { success: false, errors: v.flatten(parsed.issues).nested };
  }

  const now = new Date().toISOString();
  const [material] = await db
    .insert(materials)
    .values({
      ...parsed.output,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (material.inventoryMode === "STOCK_TRACKED") {
    await db.insert(stockTrackingPeriods).values({
      materialId: material.id,
      startedAt: now,
      endedAt: null,
    });
  }

  updateTag("materials");
  return { success: true, data: material };
}

export async function updateMaterial(input: unknown) {
  const parsed = v.safeParse(materialUpdateSchema, input);
  if (!parsed.success) {
    return { success: false, errors: v.flatten(parsed.issues).nested };
  }

  const { id, inventoryMode, ...rest } = parsed.output;
  const now = new Date().toISOString();

  const [existing] = await db.select().from(materials).where(eq(materials.id, id)).limit(1);

  if (!existing) {
    return { success: false, error: "Material not found" };
  }

  if (existing.inventoryMode !== inventoryMode) {
    if (inventoryMode === "STOCK_TRACKED") {
      await db.insert(stockTrackingPeriods).values({
        materialId: id,
        startedAt: now,
        endedAt: null,
      });
    } else {
      await db
        .update(stockTrackingPeriods)
        .set({ endedAt: now })
        .where(and(eq(stockTrackingPeriods.materialId, id), isNull(stockTrackingPeriods.endedAt)));
    }
  }

  const [material] = await db
    .update(materials)
    .set({
      ...rest,
      inventoryMode,
      updatedAt: now,
    })
    .where(eq(materials.id, id))
    .returning();

  updateTag("materials");
  return { success: true, data: material };
}

export async function switchInventoryMode(input: unknown) {
  const parsed = v.safeParse(inventoryModeSwitchSchema, input);
  if (!parsed.success) {
    return { success: false, errors: v.flatten(parsed.issues).nested };
  }

  const { id, inventoryMode } = parsed.output;
  const now = new Date().toISOString();

  const [material] = await db.select().from(materials).where(eq(materials.id, id)).limit(1);

  if (!material) {
    return { success: false, error: "Material not found" };
  }

  if (material.inventoryMode === inventoryMode) {
    return { success: true, data: material };
  }

  if (inventoryMode === "STOCK_TRACKED") {
    await db.insert(stockTrackingPeriods).values({
      materialId: id,
      startedAt: now,
      endedAt: null,
    });
  } else {
    await db
      .update(stockTrackingPeriods)
      .set({ endedAt: now })
      .where(and(eq(stockTrackingPeriods.materialId, id), isNull(stockTrackingPeriods.endedAt)));
  }

  const [updated] = await db
    .update(materials)
    .set({ inventoryMode, updatedAt: now })
    .where(eq(materials.id, id))
    .returning();

  updateTag("materials");
  return { success: true, data: updated };
}

export async function deleteMaterial(id: string) {
  const [receiptResult, issueResult, adjustmentResult] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(receiptLineItems)
      .where(eq(receiptLineItems.materialId, id)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(issueLineItems)
      .where(eq(issueLineItems.materialId, id)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(adjustmentLineItems)
      .where(eq(adjustmentLineItems.materialId, id)),
  ]);

  const total =
    (receiptResult[0]?.count ?? 0) +
    (issueResult[0]?.count ?? 0) +
    (adjustmentResult[0]?.count ?? 0);

  if (total > 0) {
    return {
      success: false,
      error: "Cannot delete material that is referenced by transactions",
    };
  }

  await db.delete(materials).where(eq(materials.id, id));
  updateTag("materials");
  return { success: true };
}
