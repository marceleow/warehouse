import { useCallback, useState } from "react";

export function useActionDrawer<T>() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const show = useCallback((value: T) => {
    setData(value);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const clear = useCallback(() => {
    setData(null);
  }, []);

  const update = useCallback((patch: Partial<T>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const onOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  return {
    open,
    data,
    show,
    close,
    clear,
    update,
    onOpenChange,
  } as const;
}
