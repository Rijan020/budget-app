import { openDB } from 'idb';

const DB_NAME = 'budget_manager_db';
const DB_VERSION = 1;
const STORE_TRANSACTIONS = 'transactions';
const STORE_RECURRING = 'recurring';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
        const store = db.createObjectStore(STORE_TRANSACTIONS, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('date', 'date');
        store.createIndex('category', 'category');
        store.createIndex('amount', 'amount');
      }
      if (!db.objectStoreNames.contains(STORE_RECURRING)) {
        db.createObjectStore(STORE_RECURRING, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    }
  });
}

// Add transaction
export async function addTransaction(txn) {
  const db = await initDB();
  return db.add(STORE_TRANSACTIONS, txn);
}

// Get all transactions
export async function getAllTransactions() {
  const db = await initDB();
  return db.getAll(STORE_TRANSACTIONS);
}

// Update transaction
export async function updateTransaction(txn) {
  const db = await initDB();
  return db.put(STORE_TRANSACTIONS, txn);
}

// Delete transaction
export async function deleteTransaction(id) {
  const db = await initDB();
  return db.delete(STORE_TRANSACTIONS, id);
}

// Recurring income functions
export async function addRecurring(rec) {
  const db = await initDB();
  return db.add(STORE_RECURRING, rec);
}

export async function getAllRecurring() {
  const db = await initDB();
  return db.getAll(STORE_RECURRING);
}

export async function updateRecurring(rec) {
  const db = await initDB();
  return db.put(STORE_RECURRING, rec);
}

export async function deleteRecurring(id) {
  const db = await initDB();
  return db.delete(STORE_RECURRING, id);
}

// Clear all transactions
export async function clearTransactions() {
  const db = await initDB();
  return db.clear(STORE_TRANSACTIONS);
}
