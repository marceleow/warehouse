import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { getMaterials, calculateStock } from "#/feature/materials/queries";
import { MaterialList } from "#/feature/materials/components/MaterialList";
import { InventoryMode } from "#/feature/materials/types";

export default async function MaterialsPage() {
  const materials = await getMaterials();

  const materialsWithStock = await Promise.all(
    materials.map(async (m) => ({
      ...m,
      stock: m.inventoryMode === InventoryMode.STOCK_TRACKED ? await calculateStock(m.id) : null,
    })),
  );

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Materials</h1>
        <Link href="/more/materials/new">
          <Button size="sm">
            <PlusIcon className="size-4 mr-1" />
            New
          </Button>
        </Link>
      </div>
      <MaterialList materials={materialsWithStock} />
    </div>
  );
}
