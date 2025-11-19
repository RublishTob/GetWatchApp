import { RootState } from "@/app/store/Store";

export const selectFilterSettings = (state: RootState) =>
  state.filterClients;