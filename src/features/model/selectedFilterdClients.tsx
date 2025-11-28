import { createSelector } from "@reduxjs/toolkit";
import { selectAllClients } from "@/entities/Client/model/selectors";
import { selectSearchQuery } from "@features/model/searchClient/selectors/searchClientsSelector";
import { selectFilterSettings } from "./filterClients/selectors/filterClientsSelector";
import { selectSortSettings } from "@features/model/sortClients/selector/sortClientSelector";
import { buildClientFilters } from "@/shared/libs/clientsFilters";
import { normalizeDate } from "@/shared/libs/dateUtils";

export const selectFilteredClients = createSelector(
  [selectAllClients, selectSearchQuery, selectFilterSettings, selectSortSettings],
  (clients, q, filters, sort) => {
    const query = q.trim().toLowerCase();
    const today = normalizeDate(new Date());

    let result = clients;

    // ---- SEARCH ----
    if (query) {
      result = result.filter((c) =>
        `${c.clientName} ${c.lastname} ${c.nameOfWatch} ${c.numberOfPhone}`
          .toLowerCase()
          .includes(query)
      );
    }

    // ---- FILTERS ----
    const conditions = buildClientFilters(filters, today);
    result = result.filter((c) => conditions.every((check) => check(c)));

    // ---- SORT ----
    if (sort.field) {
      result = [...result].sort((a, b) => {
        const A = a[sort.field!];
        const B = b[sort.field!];

        if (A === B) return 0;

        if (typeof A === "string" && typeof B === "string") {
          return sort.order === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        }

        if (typeof A === "number" && typeof B === "number") {
          return sort.order === "asc" ? A - B : B - A;
        }

        return 0;
      });
    }

    return result;
  }
);