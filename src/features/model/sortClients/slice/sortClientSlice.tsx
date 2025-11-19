import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SortableFields =
  | "price"
  | "dateIn"
  | "dateOut"
  | "clientName"
  | "lastname"
  | "nameOfWatch";

export type SortOrder = "asc" | "desc";

interface SortState {
  field: SortableFields | null;
  order: SortOrder;
}

const initialState: SortState = {
  field: null,
  order: "asc",
};

export const sortClientsSlice = createSlice({
  name: "sortClients",
  initialState,
  reducers: {
    setSort(state, a: PayloadAction<{ field: SortableFields; order: SortOrder }>) {
      state.field = a.payload.field;
      state.order = a.payload.order;
    },
    resetSort(state) {
      state.field = null;
      state.order = "asc";
    },
  },
});

export const { setSort, resetSort } = sortClientsSlice.actions;
export const sortClientsReducer = sortClientsSlice.reducer;