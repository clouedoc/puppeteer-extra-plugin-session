import { Page } from "puppeteer";
import { CursorRecord, IndexedDBRecord } from "../../schemas";

// STEALTH: isolated worlds
export async function getIndexedDB(
  page: Page,
  dbName: string
): Promise<IndexedDBRecord> {
  return page.evaluate(async (dbName: string) => {
    const idbDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
      // note: no need to specify a version property; we are opening the database as it is.
      const openRequest = window.indexedDB.open(dbName);
      openRequest.onerror = () => reject("Could not open the database");
      openRequest.onsuccess = () => resolve(openRequest.result);
    })

    // If there are no objectStoreNames then return an empty object
    if (idbDatabase.objectStoreNames.length === 0) return {}

    return new Promise<IndexedDBRecord>((resolve, reject) => {
      // Convert the DOMStringList to a String[]
      const objectStoreNames = Array.from(idbDatabase.objectStoreNames);

      // Create a readonly transaction
      const transaction = idbDatabase.transaction(
        objectStoreNames,
        "readonly"
      );

      // Reject the event on transaction error
      transaction.onerror = reject;

      const indexedDBObject: IndexedDBRecord = {};
      for (const storeName of objectStoreNames) {
        const cursorObject: CursorRecord = {};
        const txRequest = transaction.objectStore(storeName).openCursor();
        txRequest.onsuccess = () => {
          // TODO make sure the txRequest result is different each cursor
          const cursor = txRequest.result;
          if (cursor) {
            // Cursor holds value, put it into store data
            cursorObject[cursor.key.toString()] = cursor.value;
            cursor.continue();
          } else {
            // No more values, store is done
            indexedDBObject[storeName] = cursorObject;

            // Last store was handled
            if (
              objectStoreNames.length ===
              Object.keys(indexedDBObject).length
            ) {
              resolve(indexedDBObject);
            }
          }
        }
      }
    })
  }, dbName)
}
