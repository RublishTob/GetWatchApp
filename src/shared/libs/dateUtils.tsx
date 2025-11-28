export const normalizeDate = (d: Date | number) =>
  new Date(d).setHours(0, 0, 0, 0);

export const isDeliveryExpired = (dateOut: number, today: number) =>
  normalizeDate(dateOut) < today;

export const isWarrantyActive = (
  dateOut: number,
  warrantyMonths: number,
  today: number
) => {
  const end = new Date(dateOut);
  end.setMonth(end.getMonth() + warrantyMonths);
  return today < normalizeDate(end);
};
