import clients from "D:/GetWatchApp/newClients.json";
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
SQLite.enablePromise(true);

export async function initDB() {
  db = await SQLite.openDatabase({
    name: "getwatch.db",
    location: "default",
  });

  await createTables();

  const isSeeded = await AsyncStorage.getItem("db_seeded");

  if (!isSeeded) {
    console.log("▶ First launch — seeding database...");
    await seedDatabase();
    await AsyncStorage.setItem("db_seeded", "true");
  } else {
    console.log("✔ DB already seeded");
  }

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