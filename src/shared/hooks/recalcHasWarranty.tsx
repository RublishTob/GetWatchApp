import { Client } from "@/entities/Client/model/types";

export function recalcHasWarranty(client: Client): boolean {
    if (!client.dateOut || !client.warrantyMonths) return false;

    const dateOutDate = new Date(client.dateOut);
    const months = Number(client.warrantyMonths);

    const end = new Date(dateOutDate);
    end.setMonth(end.getMonth() + months);

    return new Date() <= end;
}

