// sqliteBackup.ts
import RNFS from 'react-native-fs';

const DB_NAME = 'getwatch.db';
const DB_PATH = "/data/data/com.getwatchapp/databases/getwatch.db";

export async function readDatabaseBase64() {
  const exists = await RNFS.exists(DB_PATH);
  if (!exists) throw new Error('Database not found');

  const base64 = await RNFS.readFile(DB_PATH, "base64");
  return { base64, path: DB_PATH };
}
export function getFilesDir(): string {
  return DB_PATH;
}

export async function replaceDatabaseWith(base64: string) {
  const tempPath = DB_PATH + ".tmp";

  console.log("DB_PATH:", DB_PATH);
  console.log("TEMP:", tempPath);

  // 1 — записать временный файл
  await RNFS.writeFile(tempPath, base64, "base64");

  const stat = await RNFS.stat(tempPath);
  if (!stat || Number(stat.size) < 800) throw new Error("Backup too small");

  // 2 — удалить старый
  try { await RNFS.unlink(DB_PATH); } catch {}

  // 3 — переименовать временный → основной
  await RNFS.moveFile(tempPath, DB_PATH);

  console.log("Restored DB written to", DB_PATH);

  return DB_PATH;
}