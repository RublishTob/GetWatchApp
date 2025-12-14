import AsyncStorage from "@react-native-async-storage/async-storage";
import { showBackupNotification } from "./notifyBackUp";
import { backupDatabaseToDrive } from "@/services/autoBackUp/index";

const LAST_BACKUP_KEY = "last_backup_date";

export async function autoBackupOncePerMonth(): Promise<void> {
  try {
    const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
    const now = new Date();

    if (lastBackupStr) {
      const lastBackup = new Date(lastBackupStr);

      const diffMonths =
        (now.getFullYear() - lastBackup.getFullYear()) * 12 +
        (now.getMonth() - lastBackup.getMonth());

      if (diffMonths < 1) {
        console.log("▶ Авто-бэкап: пропущено (месяц ещё не прошёл)");
        return;
      }
    }

    console.log("▶ Авто-бэкап: выполняем...");
    await backupDatabaseToDrive();

    await AsyncStorage.setItem(LAST_BACKUP_KEY, now.toISOString());

    await showBackupNotification();

  } catch (e) {
    console.warn("Ошибка авто-бэкапа:", e);
  }
}