import clients from "C:/React/GetWatchApp/newClients.json";
import SQLite from 'react-native-sqlite-storage';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

SQLite.enablePromise(true);
SQLite.DEBUG(false);

export interface Client {
  id: number;
  clientName: string;
  lastname: string;
  numberOfPhone: string;
  price: number;
  nameOfWatch: string;
  reason: string;
  viewOfWatch: string;
  warrantyMonths: number;
  dateIn: number;
  dateOut: number;
  hasWarranty: boolean;
  accepted: boolean;
  isConflictClient: boolean;
}

let db: SQLite.SQLiteDatabase | null = null;

// -----------------------------
// INIT DB
// -----------------------------


export async function clearDatabase() {
  console.log("⚠ Clearing SQL database...");

  if (!db) {
    db = await SQLite.openDatabase({
      name: "getwatch.db",
      location: "default",
    });
  }

  // Удаляем данные
  await db.executeSql("DELETE FROM Clients;");

  // Сбрасываем автоинкремент первичного ключа, чтобы ID шли с 1
  await db.executeSql("DELETE FROM sqlite_sequence WHERE name='Clients';");

  // Удаляем флаг сидирования
  await AsyncStorage.removeItem("db_seeded");

  console.log("✔ Database cleared. Ready to reseed.");

  // После этого можно вызывать initDB() или seedDatabase()
}

SQLite.enablePromise(true);

async function getRealDbPath(): Promise<string> {
  const db: SQLiteDatabase = await SQLite.openDatabase({
    name: "getwatch.db",
    location: "default",
  });

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "PRAGMA database_list;",
        [],
        (_, resultSet:any) => {
          try {
            const row = resultSet.rows.item(0);
            console.log("REAL PATH =", row.file);
            resolve(row.file);
          } catch (e) {
            reject(e);
          }
        },
        (_, err:any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}


export async function initDB(restoreMode = false) {

  if (db) {
    try { await db.close(); } catch {}
    db = null;
  }
   db = await SQLite.openDatabase({
     name: "getwatch.db",
     location: "default",
   });

   getRealDbPath();

    if (!restoreMode) {
    await createTables();
    const isSeeded = await AsyncStorage.getItem("db");
  
     if (!isSeeded) {
       console.log("▶ First launch — seeding database...");
       await seedDatabase();
       await AsyncStorage.setItem("db", "true");
     } else {
       console.log("✔ DB already seeded");
     }
  }


  return db;
}

export async function closeDB() {
  if (!db) return;
  try {
    await db.close();
  } catch (e) {
    console.warn('closeDB error', e);
  }
  db = null;
}

export function getDbInstance() {
  if (!db) throw new Error('Database not opened. Call initDB() first.');
  return db;
}

export function seedDatabase() {
  if (!db) return;

  db.executeSql("DELETE FROM Clients");

  db.transaction(tx => {
    clients.forEach(client => {
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
          client.isConflictClient ? 1 : 0
        ],
        () => {
          // success callback, можно логировать успех
        },
        (tx, error) => {
          console.error('Error inserting client:', error);
          return false; // чтобы транзакция не откатывалась
        }
      );
    });
  }, error => {
    console.error('Transaction error:', error);
  }, () => {
    console.log('All clients inserted successfully');
  });
}

// -----------------------------
// CREATE TABLE
// -----------------------------
async function createTables() {
  if (!db) return;

  await db.executeSql(`
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

// -----------------------------
// ADD CLIENT
// -----------------------------
export async function addClient(client: Omit<Client, "id">) {
  if (!db) await initDB();

  const id = Date.now();

  await db!.executeSql(
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

  return id;
}

// -----------------------------
// DELETE CLIENT BY ID
// -----------------------------

export async function deleteClient(id: number) {
  if (!db) await initDB();
  await db?.executeSql("DELETE FROM Clients WHERE id = ?", [id]);
  return id;
}

// -----------------------------
// UPDATE CLIENT BY ID
// -----------------------------
export async function updateClient(client: Client) {
  if (!db) await initDB();

  await db!.executeSql(
    `
      UPDATE Clients SET
        clientName = ?, lastname = ?, numberOfPhone = ?, price = ?,
        nameOfWatch = ?, reason = ?, viewOfWatch = ?, warrantyMonths = ?,
        dateIn = ?, dateOut = ?, hasWarranty = ?, accepted = ?, isConflictClient = ?
      WHERE id = ?
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

// -----------------------------
// GET ALL CLIENTS
// -----------------------------
export async function getClients(): Promise<Client[]> {
  if (!db) await initDB();

  const result = await db!.executeSql(`SELECT * FROM Clients`);
  const rows = result[0].rows;

  const clients: Client[] = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows.item(i);

    clients.push({
      id: item.id,
      clientName: item.clientName,
      lastname: item.lastname,
      numberOfPhone: item.numberOfPhone,
      price: item.price,
      nameOfWatch: item.nameOfWatch,
      reason: item.reason,
      viewOfWatch: item.viewOfWatch,
      warrantyMonths: item.warrantyMonths,
      dateIn: item.dateIn,
      dateOut: item.dateOut,
      hasWarranty: !!item.hasWarranty,
      accepted: !!item.accepted,
      isConflictClient: !!item.isConflictClient,
    });
  }

  return clients;
}

// -----------------------------
// IMPORT OLD DATABASE DATA (JSON)
// -----------------------------
interface OldClient {
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

export async function importOldJsonClients(oldClients: OldClient[]) {
  if (!db) await initDB();

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
      isConflictClient: false, // отсутствовало в старой БД
    };

    await updateClient(newClient); // upsert логика
  }
}

export async function getClientById(id: number): Promise<Client | null> {
  if (!db) await initDB();

  const res = await db!.executeSql(`SELECT * FROM Clients WHERE id = ? LIMIT 1`, [id]);
  const rows = res[0].rows;
  if (rows.length === 0) return null;
  const item = rows.item(0);
  return {
    id: item.id,
    clientName: item.clientName,
    lastname: item.lastname,
    numberOfPhone: item.numberOfPhone,
    price: item.price,
    nameOfWatch: item.nameOfWatch,
    reason: item.reason,
    viewOfWatch: item.viewOfWatch,
    warrantyMonths: item.warrantyMonths,
    dateIn: item.dateIn,
    dateOut: item.dateOut,
    hasWarranty: !!item.hasWarranty,
    accepted: !!item.accepted,
    isConflictClient: !!item.isConflictClient,
  };
}
export async function updateClientPartialInDb(data: Partial<Client> & { id: number }) {
  if (!db) await initDB();

  const existing = (await getClientById(data.id));

  const updated = { ...existing, ...data };

  await db!.executeSql(
    `
      UPDATE Clients SET
        clientName=?, lastname=?, numberOfPhone=?, price=?,
        nameOfWatch=?, reason=?, viewOfWatch=?, warrantyMonths=?,
        dateIn=?, dateOut=?, hasWarranty=?, accepted=?, isConflictClient=?
      WHERE id=?
    `,
    [
      updated.clientName,
      updated.lastname,
      updated.numberOfPhone,
      updated.price,
      updated.nameOfWatch,
      updated.reason,
      updated.viewOfWatch,
      updated.warrantyMonths,
      updated.dateIn,
      updated.dateOut,
      updated.hasWarranty ? 1 : 0,
      updated.accepted ? 1 : 0,
      updated.isConflictClient ? 1 : 0,
      updated.id
    ]
  );

  return updated;
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
