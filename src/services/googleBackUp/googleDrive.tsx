// googleDrive.ts
// Нет внешней библиотеки — используем fetch к Google Drive REST API v3
import { getFreshAccessToken } from './googleAuth';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

const DRIVE_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';

export interface DriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
}

// helper to call API
async function callDrive(path: string, method = 'GET', accessToken?: string, body?: any, headers: Record<string, string> = {}) {
  const token = accessToken ?? (await getFreshAccessToken());
  if (!token) throw new Error('No access token for Google Drive');
  const res = await fetch(`${DRIVE_BASE}${path}`, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Drive API error ${res.status}: ${txt}`);
  }
  return res.json();
}

// Ensure appDataFolder exists is not needed — it's implicit. We'll create files with parents=['appDataFolder']
// Upload base64 backup into appDataFolder
export async function uploadBackupBase64(base64Data: string, filename: string) {
  const token = await getFreshAccessToken();
  if (!token) throw new Error('No access token');

  // multipart upload
  const boundary = '-------RNBackupBoundary' + Date.now();
  const meta = {
    name: filename,
    parents: ['appDataFolder'],
  };
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // build multipart body: metadata + binary
  const bodyParts: (string | Uint8Array)[] = [];
  bodyParts.push(delimiter);
  bodyParts.push('Content-Type: application/json; charset=UTF-8\r\n\r\n');
  bodyParts.push(JSON.stringify(meta));
  bodyParts.push(delimiter);
  bodyParts.push('Content-Type: application/octet-stream\r\n\r\n');

  // convert base64 to bytes
  const binary = base64ToUint8Array(base64Data);
  bodyParts.push(binary);
  bodyParts.push(closeDelimiter);

  const merged = mergeParts(bodyParts);

  const res = await fetch(`${DRIVE_UPLOAD}/files?uploadType=multipart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': merged.byteLength.toString(),
    },
    body: merged,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }

  const uploaded = await res.json();
  // launch cleanup in background (await it or not — по желанию)
  cleanupOldBackups(3).catch(e => console.warn('cleanup failed', e));
  return uploaded;

}

export async function listBackups(): Promise<DriveBackupFile[]> {
  const token = await getFreshAccessToken();
  if (!token) throw new Error('No access token');

  const res = await fetch(
    `${DRIVE_BASE}/files?spaces=appDataFolder&fields=files(id,name,createdTime)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const json = await res.json();

  const files: DriveBackupFile[] = (json.files ?? []).map((f: any) => ({
    id: f.id,
    name: f.name,
    createdTime: f.createdTime,
  }));

  const backups = files.filter(f => f.name.startsWith("backup_"));

  backups.sort((a: DriveBackupFile, b: DriveBackupFile) =>
    new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  );

  return backups;
}

export async function downloadBackup(id: string): Promise<{ base64: string; name: string }> {
  const token = await getFreshAccessToken();
  if (!token) throw new Error('No access token');

  // get metadata (name)
  const meta = await callDrive(`/files/${id}?fields=name,size,mimeType`);
  const name = meta.name ?? `backup_${id}.db`;

  const res = await fetch(`${DRIVE_BASE}/files/${id}?alt=media`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Download failed ${res.status}: ${text}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength < 2048) {
    // очень маленький файл — возможно повреждение
    console.warn('Downloaded backup looks very small', arrayBuffer?.byteLength);
    throw new Error('Downloaded backup is too small or corrupted');
  }

  // временно сохранить и проверить
  const tempPath = `${RNFS.DocumentDirectoryPath}/.tmp_restore_${Date.now()}.db`;
  const u8 = new Uint8Array(arrayBuffer);
  const base64 = uint8ArrayToBase64(u8);

  await RNFS.writeFile(tempPath, base64, 'base64');

  try {
    const stat = await RNFS.stat(tempPath);
    if (!stat || Number(stat.size) < 100) {
      // странное поведение — удаляем и fail
      await RNFS.unlink(tempPath).catch(() => null);
      throw new Error('Downloaded backup seems corrupted after write');
    }
    // OK — прочитаем файл обратно в base64 и вернём
    const finalBase64 = await RNFS.readFile(tempPath, 'base64');
    // удаляем temp
    await RNFS.unlink(tempPath).catch(() => null);

    return { base64: finalBase64, name };
  } catch (e) {
    // cleanup and throw
    await RNFS.unlink(tempPath).catch(() => null);
    throw e;
  }
}

export async function deleteBackup(id: string) {
  const token = await getFreshAccessToken();
  if (!token) throw new Error('No access token');
  const res = await fetch(`${DRIVE_BASE}/files/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Delete failed ${res.status}: ${txt}`);
  }
  return true;
}

/* ----- helpers ----- */
function base64ToUint8Array(base64: string): Uint8Array {
  const buf = Buffer.from(base64, 'base64');
  return new Uint8Array(buf);
}

function uint8ArrayToBase64(u8: Uint8Array): string {
  // Buffer.from accepts Uint8Array
  return Buffer.from(u8).toString('base64');
}

function mergeParts(parts: (string | Uint8Array)[]): Uint8Array {
  // map to Buffer and concat
  const buffers = parts.map(p => (typeof p === 'string' ? Buffer.from(p) : Buffer.from(p)));
  const merged = Buffer.concat(buffers);
  return new Uint8Array(merged);
}
function decodeBase64(s: string) { // fallback
  return global.atob ? global.atob(s) : Buffer.from(s, 'base64').toString('binary');
}
function encodeBase64(s: string) { return global.btoa ? global.btoa(s) : Buffer.from(s, 'binary').toString('base64'); }

export async function cleanupOldBackups(maxToKeep = 10) {
  const backups = await listBackups(); // уже реализованная функция
  if (!backups || backups.length <= maxToKeep) return true;

  // backups уже отсортированы новым->старым, удаляем самые старые
  const toDelete = backups.slice(maxToKeep);
  for (const f of toDelete) {
    try {
      await deleteBackup(f.id);
      console.log(`Deleted old backup ${f.name} (${f.id})`);
    } catch (e) {
      console.warn('Failed to delete old backup', f.id, e);
    }
  }
  return true;
}