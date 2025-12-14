import AsyncStorage from "@react-native-async-storage/async-storage";
import { restoreDatabaseFromDrive, checkDriveBackupExists } from "@/services/autoBackUp/index";

const FIRST_RUN_KEY = "first_run_flag";

export async function autoRestoreOnFreshDevice(): Promise<void> {
  try {
    const isFirstRun = await AsyncStorage.getItem(FIRST_RUN_KEY);

    if (isFirstRun) {
      return; // Уже не первый запуск
    }

    console.log("▶ Первый запуск — пробуем авто-восстановление...");

    // Ставим флаг, чтобы не повторялось
    await AsyncStorage.setItem(FIRST_RUN_KEY, "1");

    const hasBackup = await checkDriveBackupExists();

    if (!hasBackup) {
      console.log("▶ Бэкапа не найдено — авто-restore пропущено.");
      return;
    }

    await restoreDatabaseFromDrive();

    console.log("▶ Авто-восстановление успешно выполнено");

  } catch (e) {
    console.warn("Ошибка авто-восстановления:", e);
  }
}