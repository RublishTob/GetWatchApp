import { useState, useCallback } from "react";

export function useDeleteConfirm(onConfirm?: () => void) {
  const [open, setOpen] = useState(false);

  const ask = () => {
    if (onConfirm) setOpen(true);
  };

  const cancel = () => setOpen(false);

  const confirm = useCallback(() => {
    setOpen(false);
    if (onConfirm) {
      onConfirm();
    }
  }, [onConfirm]);

  return { open, ask, cancel, confirm };
}