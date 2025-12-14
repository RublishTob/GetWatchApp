import { readDatabaseBase64, replaceDatabaseWith } from "@/services/googleBackUp/sqlLiteBackup";
import { uploadBackupBase64, listBackups, downloadBackup } from "@/services/googleBackUp/googleDrive";
import { getFreshAccessToken, signInGoogle } from "@/services/googleBackUp/googleAuth";

export const DB_NAME = "getwatch.db";

/**
 * Проверяет авторизацию и возвращает access токен
 */
export async function ensureGoogleAuth(): Promise<string> {
  let token = await getFreshAccessToken();
  if (!token) {
    await signInGoogle();
    token = await getFreshAccessToken();
  }
  if (!token) throw new Error("Google auth failed");

  return token;
}

/**
 * Создаёт бэкап базы данных и заливает в Google Drive
 */
export async function backupDatabaseToDrive(): Promise<string> {
  await ensureGoogleAuth();

  const { base64 } = await readDatabaseBase64();

  const now = new Date();
  const filename = `backup_${now.toISOString().slice(0, 10)}_${now.getTime()}.db`;

  await uploadBackupBase64(base64, filename);

  console.log("▶ backupDatabaseToDrive: uploaded", filename);

  return filename;
}

/**
 * Проверяет — есть ли хоть один файл-бэкап
 */
export async function checkDriveBackupExists(): Promise<boolean> {
  await ensureGoogleAuth();

  const files = await listBackups();
  return Array.isArray(files) && files.length > 0;
}

/**
 * Качает последний бэкап и заменяет локальную базу
 */
export async function restoreDatabaseFromDrive(): Promise<void> {
  await ensureGoogleAuth();

  const files = await listBackups();
  if (!files || !files.length) {
    throw new Error("No backups available on Drive");
  }

  const latest = files[0]; // уже отсортировано в listBackups()
  const fileId = latest.id;

  const { base64, name } = await downloadBackup(fileId);

  console.log("▶ restoreDatabaseFromDrive: downloaded", name);

  await replaceDatabaseWith(base64);

  console.log("▶ restoreDatabaseFromDrive: DB replaced");
}