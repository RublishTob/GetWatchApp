import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import {
  readDatabaseBase64,
  replaceDatabaseWith,
} from "@/services/googleBackUp/sqlLiteBackup";

import {
  uploadBackupBase64,
  listBackups,
  downloadBackup,
} from "./googleDrive";

import {
  signInGoogle,
  signOutGoogle,
  getFreshAccessToken,
  getCurrentUser,
  GoogleUser,
} from "./googleAuth";

import { initDB, closeDB } from "@/data/db";


const LAST_BACKUP_KEY = "last_db_backup";


export function useBackup(dbName = "getwatch.db") {
  const [loading, setLoading] = useState(false);

  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const [user, setUser] = useState<GoogleUser | null>(null);

  const [error, setError] = useState<string | null>(null);


  /* =============================
     INIT USER
  ============================= */

  useEffect(() => {
    loadUser();
    loadLastBackup();
  }, []);


  const loadUser = async () => {
    const current = await getCurrentUser();
    setUser(current);
  };


  const loadLastBackup = async () => {
    const ts = await AsyncStorage.getItem(LAST_BACKUP_KEY);
    setLastBackup(ts);
  };


  /* =============================
     HELPERS
  ============================= */

  const checkInternet = async () => {
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      throw new Error("NO_INTERNET");
    }
  };


  const ensureSignedIn = async () => {
    let token = await getFreshAccessToken();

    if (!token) {
      await signInGoogle();
      token = await getFreshAccessToken();
    }

    if (!token) {
      throw new Error("AUTH_FAILED");
    }

    await loadUser();

    return token;
  };


  /* =============================
     BACKUP
  ============================= */

  const backupNow = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await checkInternet();

      await ensureSignedIn();

      const db = await initDB();


      // Проверка таблицы
      const hasClients: boolean = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Clients';",
            [],
            (_, res) => resolve(res.rows.length > 0),
            (_, err) => {
              reject(err);
              return true;
            }
          );
        });
      });

      if (!hasClients) {
        throw new Error("NO_TABLE");
      }


      // Читаем базу
      const { base64 } = await readDatabaseBase64();


      const now = new Date();

      const filename = `backup_${now.toISOString().slice(0, 10)}_${now.getTime()}.db`;


      await uploadBackupBase64(base64, filename);


      const ts = new Date().toISOString();

      await AsyncStorage.setItem(LAST_BACKUP_KEY, ts);

      setLastBackup(ts);

      return true;

    } catch (err: any) {
      console.error("backup error", err);

      const msg = normalizeError(err);

      setError(msg);

      throw new Error(msg);

    } finally {
      setLoading(false);
    }
  }, []);


  /* =============================
     RESTORE
  ============================= */

  const restoreLatest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await checkInternet();

      await ensureSignedIn();


      const files = await listBackups();

      if (!files?.length) {
        throw new Error("NO_BACKUPS");
      }


      const latest = files[0];

      const { base64 } = await downloadBackup(latest.id);


      await closeDB().catch(() => {});

      await replaceDatabaseWith(base64);

      await initDB(true);

      return true;

    } catch (err: any) {
      console.error("restore error", err);

      const msg = normalizeError(err);

      setError(msg);

      throw new Error(msg);

    } finally {
      setLoading(false);
    }
  }, []);


  /* =============================
     LIST
  ============================= */

  const getBackupList = useCallback(async () => {
    await checkInternet();

    await ensureSignedIn();

    return listBackups();
  }, []);


  /* =============================
     AUTH
  ============================= */

  const signIn = async () => {
    await signInGoogle();
    await loadUser();
  };


  const signOut = async () => {
    await signOutGoogle();
    setUser(null);
  };


  /* =============================
     RETURN
  ============================= */

  return {
    loading,
    error,

    user,
    lastBackup,

    backupNow,
    restoreLatest,
    listBackups: getBackupList,

    signIn,
    signOut,
  };
}


/* =============================
   ERRORS
============================= */

function normalizeError(err: any): string {
  if (!err) return "UNKNOWN_ERROR";


  if (err.message === "NO_INTERNET") {
    return "Нет подключения к интернету";
  }

  if (err.message === "AUTH_FAILED") {
    return "Ошибка авторизации Google";
  }

  if (err.message === "NO_TABLE") {
    return "База данных повреждена";
  }

  if (err.message === "NO_BACKUPS") {
    return "Резервные копии не найдены";
  }


  if (
    typeof err?.message === "string" &&
    err.message.includes("storage")
  ) {
    return "Недостаточно места в Google Drive";
  }


  return err.message || "Неизвестная ошибка";
}