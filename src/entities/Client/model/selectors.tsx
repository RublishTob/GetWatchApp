import { RootState } from "@/app/store/Store";
import { clientAdapter } from "./slice";

const selectors = clientAdapter.getSelectors((state: RootState) => (state as any).clients);

export const selectAllClients = selectors.selectAll;
export const selectClientById = selectors.selectById;
export const selectClientIds = selectors.selectIds;
export const selectClientsLoading = (state: RootState) => (state as any).clients.loading;
