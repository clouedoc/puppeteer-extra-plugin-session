import { Page } from "puppeteer";
import { IndexedDBRecord } from "../../schemas";

// STEALTH: isolated worlds
// TODO: investigate database versions
export async function setIndexedDB(page: Page, data: IndexedDBRecord, dbName: string) {
  await page.evaluate(
    (data: IndexedDBRecord, dbName: string) => {
      return new Promise<void>((resolve, reject) => {
        // TODO should this be a function?
        function initDB() {
          const request = window.indexedDB.open(dbName, 1);
          request.onsuccess = function () {};
          request.onupgradeneeded = function () {};
          request.onerror = function (event) {
            reject(event);
          };
        }

        // opens the DB at version 1, to allow us triggering a version change
        // to inject our scraped database
        initDB();

        // the list of required stores, that we must create or which must exist
        const requiredStoreNames = Object.keys(data);

        // note: open with version 2 for some reason
        const request = window.indexedDB.open(dbName, 2);

        // create the object stores
        request.onupgradeneeded = () => {
          const db = request.result;

          for (const storeName of requiredStoreNames) {
            try {
              db.createObjectStore(storeName);
            } catch (err) {
              // don't mind name conflicts
              if (err.name !== "ConstraintError") {
                // but mind other kind of errors...
                throw err;
              }
            }
          }
        };

        request.onerror = (err) => reject(err.toString());
        request.onsuccess = () => {
          const idbDatabase = request.result;

          // open a transaction with all our created stores
          const transaction = idbDatabase.transaction(
            requiredStoreNames,
            "readwrite"
          );
          transaction.onerror = reject;

          // This should not trigger until all the objects are stored
          transaction.oncomplete = () => resolve();

          for (const storeName of requiredStoreNames) {
            for (const [key, value] of Object.entries(data[storeName])) {
              transaction.objectStore(storeName).put(value, key);
            }
          }
        };
      });
    },
    data,
    dbName
  );
}
