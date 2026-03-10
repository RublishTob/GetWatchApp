import { recalcHasWarranty } from "@/shared/hooks/recalcHasWarranty";
import { updateClientsBulk } from "@/entities/Client/model/slice";
import { Client } from "@/entities/Client/model/types";
import { AppDispatch } from "@/app/store/Store";

export function recalcWarrantyForClients(
  clients: Client[],
  dispatch: AppDispatch
) {
  if (!clients.length) return;

  const updates: { id: number; hasWarranty: boolean }[] = [];

  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];

    const newWarranty = recalcHasWarranty(client);

    if (newWarranty !== client.hasWarranty) {
      updates.push({
        id: client.id,
        hasWarranty: newWarranty,
      });
    }
  }

  if (updates.length > 0) {
    dispatch(updateClientsBulk(updates));
  }
}