import {createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit";
import * as api from "./api";
import { Client } from "./types";
import { initDB } from "@/data/db";
import { getClients } from "@/data/db";
import {apiDb} from "@/data/api"

const adapter = createEntityAdapter<Client>({
  sortComparer: (a, b) => {
    const dateA = new Date(a.dateIn).getTime();
    const dateB = new Date(b.dateIn).getTime();
    return dateB - dateA;
  },
});

export const fetchClientsInfo = createAsyncThunk(
  "clients/fetch",
  async () => {
    await initDB();
    return await apiDb.fetchClientsFromDb();
  }
);

export const createOneClient = createAsyncThunk(
  "client/create",
  async (payload: Partial<Client>) => {
    return await apiDb.createClientInDb(payload);
  }
);

export const updateOneClient = createAsyncThunk(
  "client/update",
  async (payload: Client) => {
    return await apiDb.updateClientInDb(payload);
  }
);

export const deleteOneClient = createAsyncThunk(
  "client/delete",
  async (id: number) => {
    return await apiDb.deleteClientInDb(id);
  }
);

const initialState = adapter.getInitialState({
  loading: false as boolean,
  error: null as string | null,
  selectedId: null as number|null,
});


const clientsSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    addClientLocal: adapter.addOne,
    updateClientLocal: adapter.upsertOne,
    updateClientFull: adapter.setOne, 
    removeClientLocal: adapter.removeOne,
    selectClientId(state, action: { payload: number | null }) { (state as any).selectedId = action.payload; },
  },
  extraReducers: (builder) => {
  builder
    .addCase(fetchClientsInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchClientsInfo.fulfilled, (state, action) => {
      adapter.setAll(state, action.payload);
      state.loading = false;
    })
    .addCase(createOneClient.fulfilled, (state, action) => {
      adapter.addOne(state, action.payload);
    })
    .addCase(updateOneClient.fulfilled, (state, action) => {
      adapter.upsertOne(state, action.payload);
    })
    .addCase(deleteOneClient.fulfilled, (state, action) => {
      adapter.removeOne(state, action.payload);
    });
}
});

export default clientsSlice.reducer;
export const { addClientLocal, updateClientLocal, removeClientLocal, selectClientId } = clientsSlice.actions;
export const clientAdapter = adapter;
export type ClientState = ReturnType<typeof clientsSlice.getInitialState>;
