import { RootState } from "@/app/store/Store";

export const selectSortSettings = (state: RootState) =>
  state.sortClients;