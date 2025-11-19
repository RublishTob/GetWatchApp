import {configureStore} from "@reduxjs/toolkit";
import clientReducer from "@/entities/Client/model/slice";
import { filterClientsReducer } from '@/features/model/filterClients/slices/filterClientsSlice';
import { searchClientsReducer } from '@/features/model/searchClient/slices/searchClientsSlice';
import { sortClientsReducer } from '@features/model/sortClients/slice/sortClientSlice'

export const Store = configureStore({
    reducer: {
        clients: clientReducer,
        filterClients: filterClientsReducer,
        searchClients: searchClientsReducer,
        sortClients: sortClientsReducer,
    },
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
