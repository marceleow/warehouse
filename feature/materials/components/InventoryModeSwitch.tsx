"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "#/components/ui/button";
import { toast } from "sonner";
import { switchInventoryMode } from "../action";
import { InventoryMode } from "../types";

interface InventoryModeSwitchProps {
  materialId: string;
  currentMode: InventoryMode;
}

export function InventoryModeSwitch({ materialId, currentMode }: InventoryModeSwitchProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  const targetMode =
    currentMode === InventoryMode.STOCK_TRACKED
      ? InventoryMode.LOG_ONLY
      : InventoryMode.STOCK_TRACKED;

  async function handleSwitch() {
    setPending(true);
    const result = await switchInventoryMode({
      id: materialId,
      inventoryMode: targetMode,
    });
    setPending(false);
    setConfirming(false);

    if (!result.success) {
      toast.error(("error" in result && result.error) || "Failed to switch mode");
      return;
    }

    toast.success(
      `Switched to ${targetMode === InventoryMode.STOCK_TRACKED ? "Stock Tracked" : "Log Only"}`,
    );
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Inventory Mode</p>
          <p className="text-xs text-muted-foreground">
            {currentMode === InventoryMode.STOCK_TRACKED ? "Stock Tracked" : "Log Only"}
          </p>
        </div>
        {!confirming && (
          <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
            Switch to {targetMode === InventoryMode.STOCK_TRACKED ? "Stock Tracked" : "Log Only"}
          </Button>
        )}
      </div>

      {confirming && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-3">
          {currentMode === InventoryMode.STOCK_TRACKED && (
            <p className="text-sm text-destructive">
              Warning: Any remaining calculated stock will be ignored until stock tracking is
              re-enabled.
            </p>
          )}
          {currentMode === InventoryMode.LOG_ONLY && (
            <p className="text-sm text-muted-foreground">
              Switching to Stock Tracked will start a new tracking period with initial stock of 0.
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={handleSwitch} disabled={pending}>
              {pending ? "Switching..." : "Confirm"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
