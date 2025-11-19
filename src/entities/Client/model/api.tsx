import { SERVER_ADRESS } from "../const/apiKey";
import {Client} from "../model/types";

export async function fetchClientsFromServer():Promise<Client[]>{
    const response = await fetch(SERVER_ADRESS);
     if(!response.ok) {throw new Error("Failed to load clients");}

    return response.json();
}
export async function createClientInServer(payload:Partial<Client>):Promise<Client>{
    const response = await fetch(SERVER_ADRESS, {
        method:"POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });
     if(!response.ok) {throw new Error("Failed to create client");}

    return response.json();
}
