import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterClientState {
  conflictOnly: boolean;
  acceptedOnly: boolean;
  warrantyOnly: boolean;
}

const initialState: FilterClientState = {
  conflictOnly: false,
  acceptedOnly: false,
  warrantyOnly: false,
};

export const filterClientsSlice = createSlice({
  name: "filterClients",
  initialState,
  reducers: {
    setConflictOnly(state, action: PayloadAction<boolean>) {
      state.conflictOnly = action.payload;
    },
    setAcceptedOnly(state, action: PayloadAction<boolean>) {
      state.acceptedOnly = action.payload;
    },
    setWarrantyOnly(state, action: PayloadAction<boolean>) {
      state.warrantyOnly = action.payload;
    },
  },
});

export const {
  setConflictOnly,
  setAcceptedOnly,
  setWarrantyOnly,
} = filterClientsSlice.actions;

export const filterClientsReducer = filterClientsSlice.reducer;