import { createSelector } from "@reduxjs/toolkit";
import { selectAllClients } from "@/entities/Client/model/selectors";
import { selectSearchQuery } from "@features/model/searchClient/selectors/searchClientsSelector";
import { selectFilterSettings } from "./filterClientsSelector";
import { selectSortSettings } from "@features/model/sortClients/selector/sortClientSelector"
import { Client } from "@/entities";

export const selectFilteredClients = createSelector(
  [selectAllClients, selectSearchQuery, selectFilterSettings, selectSortSettings],
  (clients, q, filters, sort) => {
    const query = q.trim().toLowerCase();

    let result = clients;

    // -------- SEARCH --------
    if (query) {
      result = result.filter((c: Client) => {
        const text = `${c.clientName} ${c.lastname} ${c.nameOfWatch} ${c.numberOfPhone}`.toLowerCase();
        return text.includes(query);
      });
    }

    // -------- FILTERS --------
    result = result.filter((c: Client) => {
      if (filters.onDeliveryOnly) {
        const today = new Date().setHours(0, 0, 0, 0);
        const dateOut = new Date(c.dateOut).setHours(0, 0, 0, 0);

        if (!(c.accepted && dateOut < today)) return false;
      }
      if (filters.conflictOnly && !c.isConflictClient) return false;
      if (filters.acceptedOnly && !c.accepted) return false;
      if (filters.warrantyOnly && !c.hasWarranty) return false;

      if (filters.priceFrom !== null && c.price < filters.priceFrom) return false;
      if (filters.priceTo !== null && c.price > filters.priceTo) return false;

      if (filters.dateFrom !== null && c.dateIn < filters.dateFrom) return false;
      if (filters.dateTo !== null && c.dateOut > filters.dateTo) return false;

      return true;
    });

    // -------- SORT --------
    if (sort.field) {
  result = [...result].sort((a, b) => {
    const A = a[sort.field!];
    const B = b[sort.field!];

    if (A === B) return 0;

    // Строки
    if (typeof A === "string" && typeof B === "string") {
      return sort.order === "asc"
        ? A.localeCompare(B)
        : B.localeCompare(A);
    }

    // Числа
    if (typeof A === "number" && typeof B === "number") {
      return sort.order === "asc" ? A - B : B - A;
    }

    return 0;
  });
}

    return result;
  }
);