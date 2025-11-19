import { RootState } from "@/app/store/Store";

export const selectSearchQuery = (state: RootState) =>
  state.searchClients.query;