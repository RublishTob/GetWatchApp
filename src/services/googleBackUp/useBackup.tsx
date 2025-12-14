import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { readDatabaseBase64, replaceDatabaseWith } from '@/services/googleBackUp/sqlLiteBackup';
import { uploadBackupBase64, listBackups, downloadBackup } from './googleDrive';
import { signInGoogle, getFreshAccessToken } from './googleAuth';
import { initDB, closeDB } from '@/data/db';

const LAST_BACKUP_KEY = 'last_db_backup';

export function useBackup(dbName = 'getwatch.db') {
  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const ensureSignedIn = useCallback(async () => {
    let token = await getFreshAccessToken();
    if (!token) {
      await signInGoogle();
      token = await getFreshAccessToken();
    }
    if (!token) throw new Error('Google auth failed');
    return token;
  }, []);

const backupNow = useCallback(async () => {
  setLoading(true);
  try {
    await ensureSignedIn();

    const db = await initDB();

    const hasClientsTable: boolean = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='Clients';",
          [],
          (_, result) => resolve(result.rows.length > 0),
          (_, error) => { reject(error); return true; }
        );
      });
    });

    if (!hasClientsTable) {
      throw new Error('Таблица Clients не создана, бэкап невозможен');
    }

    const { base64 } = await readDatabaseBase64();

    const now = new Date();
    const filename = `backup_${now.toISOString().slice(0, 10)}_${now.getTime()}.db`;
    await uploadBackupBase64(base64, filename);

    const ts = new Date().toISOString();
    await AsyncStorage.setItem(LAST_BACKUP_KEY, ts);
    setLastBackup(ts);

    console.log('Бэкап успешно создан:', filename);
    return true;
  } catch (err: any) {
    console.error('backupNow error', err);
    Alert.alert('Ошибка бэкапа', err.message ?? String(err));
    throw err;
  } finally {
    setLoading(false);
  }
}, [ensureSignedIn]);


const restoreLatest = useCallback(async () => {
  setLoading(true);
  try {
    await ensureSignedIn();

    const files = await listBackups();
    if (!files?.length) throw new Error('No backups found');

    const latestId = files[0].id;
    const { base64, name } = await downloadBackup(latestId);

    console.log('Downloaded backup', name);

    await new Promise<void>((resolve, reject) => {
      closeDB()
        .then(() => resolve())
        .catch(err => {
          console.warn('closeDB failed, trying anyway', err);
          resolve();
        });
    });

    await replaceDatabaseWith(base64);
    console.log('Database replaced successfully');

    await initDB(true);
  } catch (err: any) {
    console.error('restoreLatest error', err);
    Alert.alert('Ошибка восстановления', err.message ?? String(err));
    throw err;
  } finally {
    setLoading(false);
  }
}, [dbName, ensureSignedIn]);

  const getBackupList = useCallback(async () => {
    await ensureSignedIn();
    return listBackups();
  }, [ensureSignedIn]);

  return {
    loading,
    backupNow,
    restoreLatest,
    listBackups: getBackupList,
    lastBackup,
  };
}