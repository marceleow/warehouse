"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { toast } from "sonner";
import { unitOfMeasure } from "#/lib/constants";
import { createMaterial, updateMaterial } from "../action";
import { InventoryMode } from "../types";

const UOM_OPTIONS = Object.values(unitOfMeasure);

interface MaterialFormProps {
  material?: {
    id: string;
    name: string;
    materialCode: string | null;
    unitOfMeasure: string;
    inventoryMode: InventoryMode;
    description: string | null;
  };
}

export function MaterialForm({ material }: MaterialFormProps) {
  const router = useRouter();
  const isEditing = !!material;

  const [formData, setFormData] = useState({
    name: material?.name ?? "",
    materialCode: material?.materialCode ?? "",
    unitOfMeasure: material?.unitOfMeasure ?? "",
    inventoryMode: material?.inventoryMode ?? InventoryMode.LOG_ONLY,
    description: material?.description ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors(null);

    const action = isEditing ? updateMaterial : createMaterial;
    const payload = isEditing ? { ...formData, id: material!.id } : formData;

    const result = await action(payload);
    setPending(false);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors as Record<string, string[]>);
      } else if ("error" in result && result.error) {
        toast.error(result.error as string);
      }
      return;
    }

    toast.success(isEditing ? "Material updated" : "Material created");
    router.push("/more/materials");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
          aria-invalid={!!errors?.name}
        />
        {errors?.name && <p className="text-xs text-destructive">{errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="materialCode">Material Code</Label>
        <Input
          id="materialCode"
          value={formData.materialCode}
          onChange={(e) => setFormData((d) => ({ ...d, materialCode: e.target.value }))}
          placeholder="Optional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
        <select
          id="unitOfMeasure"
          value={formData.unitOfMeasure}
          onChange={(e) => setFormData((d) => ({ ...d, unitOfMeasure: e.target.value }))}
          className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Select unit...</option>
          {UOM_OPTIONS.map((uom) => (
            <option key={uom} value={uom}>
              {uom}
            </option>
          ))}
        </select>
        {errors?.unitOfMeasure && (
          <p className="text-xs text-destructive">{errors.unitOfMeasure[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inventoryMode">Inventory Mode</Label>
        <select
          id="inventoryMode"
          value={formData.inventoryMode}
          onChange={(e) =>
            setFormData((d) => ({
              ...d,
              inventoryMode: e.target.value as InventoryMode,
            }))
          }
          className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value={InventoryMode.STOCK_TRACKED}>Stock Tracked</option>
          <option value={InventoryMode.LOG_ONLY}>Log Only</option>
        </select>
        {errors?.inventoryMode && (
          <p className="text-xs text-destructive">{errors.inventoryMode[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
          placeholder="Optional"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : isEditing ? "Update Material" : "Create Material"}
      </Button>
    </form>
  );
}
