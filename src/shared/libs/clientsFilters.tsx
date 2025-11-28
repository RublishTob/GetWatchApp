import { Client } from "@/entities";
import {
  normalizeDate,
  isDeliveryExpired,
  isWarrantyActive,
} from "./dateUtils";

export const buildClientFilters = (filters: any, today: number) => {
  return [
    // DELIVERY ONLY — клиент принят + дата выдачи прошла
    (c: Client) =>
      !filters.onDeliveryOnly ||
      (c.accepted && isDeliveryExpired(c.dateOut, today)),

    // conflictOnly — только конфликтные
    (c: Client) => !filters.conflictOnly || c.isConflictClient,

    // acceptedOnly — только принятые, но не просроченные
    (c: Client) =>
      !filters.acceptedOnly ||
      (c.accepted && !isDeliveryExpired(c.dateOut, today)),

    // warrantyOnly — гарантия активна
    (c: Client) =>
      !filters.warrantyOnly ||
      (c.hasWarranty &&
        isWarrantyActive(c.dateOut, c.warrantyMonths, today)),

    // priceFrom
    (c: Client) =>
      filters.priceFrom === null || c.price >= filters.priceFrom,

    // priceTo
    (c: Client) =>
      filters.priceTo === null || c.price <= filters.priceTo,

    // dateFrom
    (c: Client) =>
      filters.dateFrom === null || c.dateIn >= filters.dateFrom,

    // dateTo
    (c: Client) =>
      filters.dateTo === null || c.dateOut <= filters.dateTo,
  ];
};