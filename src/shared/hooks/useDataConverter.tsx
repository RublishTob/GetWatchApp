import { useCallback } from "react";

/**
 * Хук для конвертации даты в timestamp и обратно
 */
export function useDateConverter(){
  /**
   * Преобразует дату (Date или string) в число (timestamp)
   */
  const toTimestamp = useCallback((date: Date | string): number => {
    if (!date) {return NaN;}
    const parsed = typeof date === "string" ? new Date(date) : date;
    return parsed.getTime();
  }, []);

  /**
   * Преобразует timestamp обратно в объект Date
   */
  const fromTimestamp = useCallback((timestamp: number): Date => {
    return new Date(timestamp);
  }, []);

  /**
   * Форматирует дату в строку (например, для UI)
   */
  const formatDate = useCallback(
    (date: Date | string | number, locale = "ru-RU"): string => {
      if (!date) {return "";}
      const parsed =
        typeof date === "number"
          ? new Date(date)
          : typeof date === "string"
          ? new Date(date)
          : date;
      return parsed.toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    [],
  );

  return {
    toTimestamp,
    fromTimestamp,
    formatDate,
  };
}
