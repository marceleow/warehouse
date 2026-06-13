import * as v from "valibot";

export const InventoryMode = {
  STOCK_TRACKED: "STOCK_TRACKED",
  LOG_ONLY: "LOG_ONLY",
} as const;

export type InventoryMode = (typeof InventoryMode)[keyof typeof InventoryMode];

export const materialInsertSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  materialCode: v.optional(v.string()),
  unitOfMeasure: v.pipe(v.string(), v.minLength(1, "Unit of Measure is required")),
  inventoryMode: v.picklist([InventoryMode.STOCK_TRACKED, InventoryMode.LOG_ONLY]),
  description: v.optional(v.string()),
});

export const materialUpdateSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: materialInsertSchema.entries.name,
  materialCode: materialInsertSchema.entries.materialCode,
  unitOfMeasure: materialInsertSchema.entries.unitOfMeasure,
  inventoryMode: materialInsertSchema.entries.inventoryMode,
  description: materialInsertSchema.entries.description,
});

export const inventoryModeSwitchSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  inventoryMode: materialInsertSchema.entries.inventoryMode,
});

export type MaterialInput = v.InferOutput<typeof materialInsertSchema>;
export type MaterialUpdate = v.InferOutput<typeof materialUpdateSchema>;
export type InventoryModeSwitch = v.InferOutput<typeof inventoryModeSwitchSchema>;
