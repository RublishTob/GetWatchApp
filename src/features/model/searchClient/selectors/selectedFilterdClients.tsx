import { createSelector } from "@reduxjs/toolkit";
import { selectAllClients } from "@/entities/Client/model/selectors";
import { selectSearchQuery } from "./searchClientsSelector";
import { selectFilterSettings } from "./filterClientsSelector";
import { Client } from "@/entities";

export const selectFilteredClients = createSelector(
  [selectAllClients, selectSearchQuery, selectFilterSettings],
  (clients, query, filters) => {
    // Нормализуем запрос — trim + lowercase
    const q = query?.trim().toLowerCase() || "";

    // Если нет фильтров и нет запроса — возвращаем оригинал (быстро)
    const noFilters = !q && !filters.conflictOnly && !filters.acceptedOnly && !filters.warrantyOnly;
    if (noFilters) return clients;

    // Фильтрация: AND-логика (элемент должен проходить все активные условия)
    return clients.filter((c:Client) => {
      // 1) Поиск: проверяем несколько полей одновременно
      if (q) {
        const hay = `${c.clientName} ${c.lastname} ${c.nameOfWatch} ${c.numberOfPhone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // 2) Фильтры по булевым полям
      if (filters.conflictOnly && !c.isConflictClient) return false;
      if (filters.acceptedOnly && !c.accepted) return false;
      if (filters.warrantyOnly && !c.hasWarranty) return false;

      return true;
    });
  }
);