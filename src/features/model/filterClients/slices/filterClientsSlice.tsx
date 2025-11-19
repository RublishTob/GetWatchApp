import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  conflictOnly: boolean;
  acceptedOnly: boolean;
  warrantyOnly: boolean;
  onDeliveryOnly: boolean,

  priceFrom: number | null;
  priceTo: number | null;

  dateFrom: number | null;
  dateTo: number | null;
}

const initialState: FilterState = {
  conflictOnly: false,
  acceptedOnly: false,
  warrantyOnly: false,
  onDeliveryOnly: false,

  priceFrom: null,
  priceTo: null,

  dateFrom: null,
  dateTo: null,
};

export const filterClientsSlice = createSlice({
  name: "filterClients",
  initialState,
  reducers: {
    toggleConflict(state) {
      state.conflictOnly = !state.conflictOnly;
    },
    toggleAccepted(state) {
      state.acceptedOnly = !state.acceptedOnly;
    },
    toggleOnDelivery(state) {
      state.onDeliveryOnly = !state.onDeliveryOnly;
    },
    toggleWarranty(state) {
      state.warrantyOnly = !state.warrantyOnly;
    },

    setPriceFrom(state, a: PayloadAction<number | null>) {
      state.priceFrom = a.payload;
    },
    setPriceTo(state, a: PayloadAction<number | null>) {
      state.priceTo = a.payload;
    },

    setDateFrom(state, a: PayloadAction<number | null>) {
      state.dateFrom = a.payload;
    },
    setDateTo(state, a: PayloadAction<number | null>) {
      state.dateTo = a.payload;
    },

    resetFilters() {
      return initialState;
    },
  },
});

export const {
  toggleConflict,
  toggleAccepted,
  toggleWarranty,
  toggleOnDelivery,
  setPriceFrom,
  setPriceTo,
  setDateFrom,
  setDateTo,
  resetFilters,
} = filterClientsSlice.actions;

export const filterClientsReducer = filterClientsSlice.reducer;