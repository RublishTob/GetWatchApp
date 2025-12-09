import { addClient, updateClient, getClients, deleteClient, updateClientPartialInDb } from "../data/db";
import { Client } from "@entities/Client";
import { restoreDatabaseFromBase64 } from "@/data/db";

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
  async updateClientPartialInDb(
    payload: Partial<Client> & { id: number }
  ): Promise<Partial<Client> & { id: number }> {
    const updated = await updateClientPartialInDb(payload);
    return updated;
  },

  async deleteClientInDb(id: number) {
    await deleteClient(id);
    return id;
  },
  /** 🔥 ВОССТАНОВЛЕНИЕ ИЗ РЕЗЕРВНОЙ КОПИИ */
  async restoreFromBackup(base64: string): Promise<boolean> {
    return await restoreDatabaseFromBase64(base64);
  }
};