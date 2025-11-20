import {createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit";
import * as api from "./api";
import { Client } from "./types";

const adapter = createEntityAdapter<Client>({
  sortComparer: (a, b) => a.clientName.localeCompare(b.clientName),
});


export const fetchClientsInfo = createAsyncThunk("clients/fetch", async ()=> {
    return await api.fetchClientsFromServer();
});
export const createOneClient = createAsyncThunk("client/fetch", async(payload:Partial<Client>)=>{
    return await api.createClientInServer(payload);
});

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
    .addCase(fetchClientsInfo.pending, (state) => { (state as any).loading = true; (state as any).error = null; })
    .addCase(fetchClientsInfo.fulfilled, (state, action) => { adapter.setAll(state, action.payload); (state as any).loading = false; })
    .addCase(fetchClientsInfo.rejected, (state, action) => { (state as any).loading = false; (state as any).error = action.error.message || "Error"; })
    
    .addCase(createOneClient.fulfilled, (state, action) => { adapter.addOne(state, action.payload); });
  },
});

export default clientsSlice.reducer;
export const { addClientLocal, updateClientLocal, removeClientLocal, selectClientId } = clientsSlice.actions;
export const clientAdapter = adapter;
export type ClientState = ReturnType<typeof clientsSlice.getInitialState>;
