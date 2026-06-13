import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getMaterialById,
  calculateStock,
  getMaterialReferences,
} from "#/feature/materials/queries";
import { MaterialDetail } from "#/feature/materials/components/MaterialDetail";
import { InventoryMode } from "#/feature/materials/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MaterialEditPage({ params }: PageProps) {
  return (
    <div className="px-4 py-6 pb-24">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <MaterialEditContent params={params} />
      </Suspense>
    </div>
  );
}

async function MaterialEditContent({ params }: PageProps) {
  const { id } = await params;
  const material = await getMaterialById(id);

  if (!material) {
    notFound();
  }

  const stock =
    material.inventoryMode === InventoryMode.STOCK_TRACKED
      ? await calculateStock(material.id)
      : null;

  const references = await getMaterialReferences(material.id);

  return <MaterialDetail material={material} stock={stock} references={references} />;
}
