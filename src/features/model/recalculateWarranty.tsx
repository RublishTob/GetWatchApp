import { recalcHasWarranty } from "@/shared/hooks/recalcHasWarranty";
import { updateClientsBulk} from "@/entities/Client/model/slice";
import { Client } from "@/entities/Client/model/types";
import { AppDispatch } from "@/app/store/Store";

export async function recalcWarrantyForClients(
  clients: Client[],
  dispatch: AppDispatch
) {
  const updates = [];
  let i = 0;

  for (const c of clients) {
    const newWarranty = recalcHasWarranty(c);
    if (newWarranty !== c.hasWarranty) {
      updates.push({ id: c.id, hasWarranty: newWarranty });
    }
    i++;
    if (i % 2000 === 0) {
      await new Promise(resolve => setTimeout(resolve));
    }
  }

  if (updates.length > 0) {
    dispatch(updateClientsBulk(updates));
  }
}