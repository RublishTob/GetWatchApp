import { addClient, updateClient, getClients, deleteClient } from "../data/db";
import { Client } from "@entities/Client";

export const apiDb = {
  async fetchClientsFromDb(): Promise<Client[]> {
    return await getClients();
  },

  async createClientInDb(payload: Partial<Client>) {
    const id = await addClient(payload as any);
    return { ...payload, id } as Client;
  },

  async updateClientInDb(client: Client) {
    await updateClient(client);
    return client;
  },

  async deleteClientInDb(id: number) {
    await deleteClient(id);
    return id;
  }
};