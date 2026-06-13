"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "#/components/ui/button";
import { toast } from "sonner";
import { deleteMaterial } from "../action";
import { InventoryMode } from "../types";
import { MaterialForm } from "./MaterialForm";
import { InventoryModeSwitch } from "./InventoryModeSwitch";

interface MaterialDetailProps {
  material: {
    id: string;
    name: string;
    materialCode: string | null;
    unitOfMeasure: string;
    inventoryMode: InventoryMode;
    description: string | null;
  };
  stock: number | null;
  references: {
    receiptCount: number;
    issueCount: number;
    adjustmentCount: number;
    total: number;
  };
}

export function MaterialDetail({ material, stock, references }: MaterialDetailProps) {
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteMaterial(material.id);
    setDeleting(false);

    if (!result.success) {
      toast.error(("error" in result && result.error) || "Failed to delete material");
      setConfirmingDelete(false);
      return;
    }

    toast.success("Material deleted");
    router.push("/more/materials");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Edit Material</h1>
        <p className="text-sm text-muted-foreground">{material.name}</p>
      </div>

      <MaterialForm material={material} />

      <div className="space-y-4 pt-4 border-t border-border">
        <InventoryModeSwitch materialId={material.id} currentMode={material.inventoryMode} />

        {material.inventoryMode === InventoryMode.STOCK_TRACKED && stock !== null && (
          <div className="rounded-lg bg-card border border-border p-3">
            <p className="text-sm font-medium">Current Stock</p>
            <p className="text-lg font-bold">
              {stock} {material.unitOfMeasure}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        {!confirmingDelete ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setConfirmingDelete(true)}
          >
            Delete Material
          </Button>
        ) : (
          <div className="space-y-3">
            {references.total > 0 ? (
              <p className="text-sm text-destructive">
                Cannot delete: this material is referenced by {references.total} transaction
                {references.total === 1 ? "" : "s"}.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Are you sure? This action cannot be undone.
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleting || references.total > 0}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
