"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "#/components/ui/input";
import { Card, CardContent } from "#/components/ui/card";
import { InventoryMode } from "../types";

interface MaterialWithStock {
  id: string;
  name: string;
  materialCode: string | null;
  unitOfMeasure: string;
  inventoryMode: InventoryMode;
  description: string | null;
  stock: number | null;
}

interface MaterialListProps {
  materials: MaterialWithStock[];
}

export function MaterialList({ materials }: MaterialListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return materials;
    const q = search.toLowerCase();
    return materials.filter(
      (m) => m.name.toLowerCase().includes(q) || (m.materialCode?.toLowerCase() ?? "").includes(q),
    );
  }, [materials, search]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search materials..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-2">
        {filtered.map((m) => (
          <Link key={m.id} href={`/more/materials/${m.id}`}>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="flex items-center justify-between py-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.name}</p>
                  {m.materialCode && (
                    <p className="text-xs text-muted-foreground">{m.materialCode}</p>
                  )}
                </div>
                <div className="text-right shrink-0 ml-4">
                  {m.inventoryMode === InventoryMode.STOCK_TRACKED ? (
                    <p className="text-sm font-medium">
                      {m.stock} {m.unitOfMeasure}
                    </p>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      Log Only
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No materials found.</p>
        )}
      </div>
    </div>
  );
}
