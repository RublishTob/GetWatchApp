import SQLite, { SQLiteDatabase, ResultSet, Transaction } from "react-native-sqlite-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import clients from "C:/React/GetWatchApp/newClients.json";
import { Client } from "@/entities/Client";
import RNFS from 'react-native-fs';

SQLite.enablePromise(true);
SQLite.DEBUG(false);

let db: SQLiteDatabase | null = null;

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export interface OldClient {
  Id: number;
  InProcess?: number;
  DateIn: string;
  DateOut: string;
  NumberOfPhone?: string;
  Cost?: string;
  Name?: string;
  Surname?: string;
  NameOfWatch?: string;
  Reason?: string;
  ViewOfWatch?: string;
  Guarantee?: string;
}

// ----------------------------------------------------------------------
// INIT
// ----------------------------------------------------------------------

export async function initDB(restoreMode = false): Promise<SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabase({
    name: "getwatch.db",
    location: "default",
  });
  return db;
}

export async function closeDB(): Promise<void> {
  if (!db) return;

  try {
    await db.close();
  } catch (e) {
    console.warn("closeDB error", e);
  }

  db = null;
}

export function getDbInstance(): SQLiteDatabase {
  if (!db) throw new Error("DB not initialized! Call initDB() first.");
  return db;
}

// ----------------------------------------------------------------------
// CLEAR
// ----------------------------------------------------------------------

export async function clearDatabase(): Promise<void> {
  const instance = getDbInstance();

  await instance.executeSql("DELETE FROM Clients;");
  await instance.executeSql("DELETE FROM sqlite_sequence WHERE name='Clients';");
  await AsyncStorage.removeItem("db");
}

// ----------------------------------------------------------------------
// CREATE TABLES
// ----------------------------------------------------------------------

async function createTables(): Promise<void> {
  const instance = getDbInstance();

  await instance.executeSql(`
    CREATE TABLE IF NOT EXISTS Clients (
      id INTEGER PRIMARY KEY NOT NULL,
      clientName TEXT,
      lastname TEXT,
      numberOfPhone TEXT,
      price INTEGER,
      nameOfWatch TEXT,
      reason TEXT,
      viewOfWatch TEXT,
      warrantyMonths INTEGER,
      dateIn INTEGER,
      dateOut INTEGER,
      hasWarranty INTEGER,
      accepted INTEGER,
      isConflictClient INTEGER
    );
  `);
}

// ----------------------------------------------------------------------
// SEED
// ----------------------------------------------------------------------

export async function seedDatabase(): Promise<void> {
  if(!clients) return;
  const instance = getDbInstance();

  await new Promise<void>((resolve, reject) => {
    instance.transaction(
      (tx) => {
        clients.forEach((client) => {
          tx.executeSql(
            `INSERT OR REPLACE INTO Clients 
              (id, clientName, lastname, numberOfPhone, price, nameOfWatch, reason,
               viewOfWatch, warrantyMonths, dateIn, dateOut, hasWarranty, accepted, isConflictClient)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              client.id,
              client.clientName,
              client.lastname,
              client.numberOfPhone,
              client.price,
              client.nameOfWatch,
              client.reason,
              client.viewOfWatch,
              client.warrantyMonths,
              client.dateIn,
              client.dateOut,
              client.hasWarranty ? 1 : 0,
              client.accepted ? 1 : 0,
              client.isConflictClient ? 1 : 0,
            ]
          );
        });
      },
      (err) => reject(err),
      () => resolve()
    );
  });

  console.log("✔ DB seeded");
}

// ----------------------------------------------------------------------
// GET CLIENTS
// ----------------------------------------------------------------------

export async function getClients(): Promise<Client[]> {
  const instance = getDbInstance();

  const result = await instance.executeSql(`SELECT * FROM Clients`);
  const rows = result[0].rows;

  const arr: Client[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);

    arr.push({
      id: row.id,
      clientName: row.clientName,
      lastname: row.lastname,
      numberOfPhone: row.numberOfPhone,
      price: row.price,
      nameOfWatch: row.nameOfWatch,
      reason: row.reason,
      viewOfWatch: row.viewOfWatch,
      warrantyMonths: row.warrantyMonths,
      dateIn: row.dateIn,
      dateOut: row.dateOut,
      hasWarranty: Boolean(row.hasWarranty),
      accepted: Boolean(row.accepted),
      isConflictClient: Boolean(row.isConflictClient),
    });
  }

  return arr;
}

// ----------------------------------------------------------------------
// GET CLIENT BY ID
// ----------------------------------------------------------------------

export async function getClientById(id: number): Promise<Client | null> {
  const instance = getDbInstance();

  const result = await instance.executeSql(
    `SELECT * FROM Clients WHERE id = ? LIMIT 1`,
    [id]
  );

  if (result[0].rows.length === 0) return null;

  const row = result[0].rows.item(0);

  return {
    id: row.id,
    clientName: row.clientName,
    lastname: row.lastname,
    numberOfPhone: row.numberOfPhone,
    price: row.price,
    nameOfWatch: row.nameOfWatch,
    reason: row.reason,
    viewOfWatch: row.viewOfWatch,
    warrantyMonths: row.warrantyMonths,
    dateIn: row.dateIn,
    dateOut: row.dateOut,
    hasWarranty: Boolean(row.hasWarranty),
    accepted: Boolean(row.accepted),
    isConflictClient: Boolean(row.isConflictClient),
  };
}

// ----------------------------------------------------------------------
// ADD CLIENT
// ----------------------------------------------------------------------

type NewClient = Omit<Client, "id">;

export async function addClient(data: NewClient): Promise<number> {
  const instance = getDbInstance();

  const id = Date.now();

  await instance.executeSql(
    `
      INSERT INTO Clients (
        id, clientName, lastname, numberOfPhone, price,
        nameOfWatch, reason, viewOfWatch, warrantyMonths,
        dateIn, dateOut, hasWarranty, accepted, isConflictClient
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.clientName,
      data.lastname,
      data.numberOfPhone,
      data.price,
      data.nameOfWatch,
      data.reason,
      data.viewOfWatch,
      data.warrantyMonths,
      data.dateIn,
      data.dateOut,
      data.hasWarranty ? 1 : 0,
      data.accepted ? 1 : 0,
      data.isConflictClient ? 1 : 0,
    ]
  );

  return id;
}

// ----------------------------------------------------------------------
// DELETE CLIENT
// ----------------------------------------------------------------------

export async function deleteClient(id: number): Promise<void> {
  const instance = getDbInstance();
  await instance.executeSql("DELETE FROM Clients WHERE id = ?", [id]);
}

// ----------------------------------------------------------------------
// UPDATE FULL CLIENT
// ----------------------------------------------------------------------

export async function updateClient(client: Client): Promise<void> {
  const instance = getDbInstance();

  await instance.executeSql(
    `
      UPDATE Clients SET
        clientName=?, lastname=?, numberOfPhone=?, price=?,
        nameOfWatch=?, reason=?, viewOfWatch=?, warrantyMonths=?,
        dateIn=?, dateOut=?, hasWarranty=?, accepted=?, isConflictClient=?
      WHERE id=?
    `,
    [
      client.clientName,
      client.lastname,
      client.numberOfPhone,
      client.price,
      client.nameOfWatch,
      client.reason,
      client.viewOfWatch,
      client.warrantyMonths,
      client.dateIn,
      client.dateOut,
      client.hasWarranty ? 1 : 0,
      client.accepted ? 1 : 0,
      client.isConflictClient ? 1 : 0,
      client.id,
    ]
  );
}

// ----------------------------------------------------------------------
// UPDATE PARTIAL CLIENT
// ----------------------------------------------------------------------

export async function updateClientPartialInDb(
  data: Partial<Client> & { id: number }
): Promise<Client> {
  const instance = getDbInstance();

  const existing = await getClientById(data.id);
  if (!existing) throw new Error("Client not found");

  const updated: Client = { ...existing, ...data };

  await updateClient(updated);

  return updated;
}

// ----------------------------------------------------------------------
// IMPORT OLD JSON
// ----------------------------------------------------------------------

export async function importOldJsonClients(oldClients: OldClient[]): Promise<void> {
  for (const old of oldClients) {
    const newClient: Client = {
      id: old.Id,
      clientName: old.Name ?? "",
      lastname: old.Surname ?? "",
      numberOfPhone: old.NumberOfPhone ?? "",
      price: Number(old.Cost ?? 0),
      nameOfWatch: old.NameOfWatch ?? "",
      reason: old.Reason ?? "",
      viewOfWatch: old.ViewOfWatch ?? "",
      warrantyMonths: Number(old.Guarantee ?? 0),
      dateIn: Date.parse(old.DateIn),
      dateOut: Date.parse(old.DateOut),
      hasWarranty: Boolean(old.Guarantee && old.Guarantee !== "0"),
      accepted: old.InProcess === 1,
      isConflictClient: false,
    };

    await updateClient(newClient);
  }
}
export async function reopenDatabase() {
  console.log("🔄 Reopening SQLite database...");

  try {
    if (db) {
      console.log("🛑 Closing old DB connection...");
      await db.close();
      db = null;
    }
  } catch (e) {
    console.warn("⚠ DB close error (not critical):", e);
  }

  console.log("📂 Opening new DB connection...");

  db = await SQLite.openDatabase({
    name: "getwatch.db",
    location: "default",
  });

  await createTables();

  console.log("✅ Database reopened successfully.");
  return db;
}

export async function restoreDatabaseFromBase64(base64: string): Promise<boolean> {
  console.log("♻ Restoring database from backup...");

  try {
    const dbPath = `${RNFS.DocumentDirectoryPath}/getwatch.db`;
    const tempPath = `${RNFS.DocumentDirectoryPath}/getwatch_restore_${Date.now()}.db`;

    // 1. Пишем во временный файл
    await RNFS.writeFile(tempPath, base64, "base64");

    const stat = await RNFS.stat(tempPath);
    if (!stat || Number(stat.size) < 2000) {
      throw new Error("Backup file is too small — looks corrupted");
    }

    // 2. Закрываем текущую БД
    try {
      if (db) {
        console.log("🔒 Closing previous DB before restore...");
        await db.close();
        db = null;
      }
    } catch (e) {
      console.warn("⚠ Error closing DB (ignored):", e);
    }

    // 3. Удаляем старый getwatch.db
    try {
      await RNFS.unlink(dbPath);
      console.log("🗑 Old DB removed");
    } catch {}

    // 4. Переименовываем временный → основной
    await RNFS.moveFile(tempPath, dbPath);
    console.log("📁 Backup restored to", dbPath);

    // 5. Открываем БД заново
    await reopenDatabase();

    console.log("✅ Database restore finished successfully.");

    return true;
  } catch (err) {
    console.error("❌ Restore failed:", err);
    return false;
  }
}

export async function logClientsCount() {
  try {
    const db = await SQLite.openDatabase({ name: 'getwatch.db', location: 'default' });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM Clients;',
        [],
        (_, results) => {
          const count = results.rows.item(0).count;
          console.log(`Количество клиентов в базе: ${count}`);
        },
        (_, error) => {
          console.error('Ошибка при подсчёте клиентов:', error);
          return true;
        }
      );
    });
  } catch (err) {
    console.error('Не удалось открыть базу:', err);
  }
}
