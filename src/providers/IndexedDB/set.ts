import { Page } from "puppeteer";

// STEALTH: isolated worlds
// FIXME: make this TypeScript-compliant
// TODO: investigate database versions
export async function setIndexedDB(page: Page, data: object, dbName: string) {
  await page.evaluate(
    (data: any, dbName: string) => {
      return new Promise<void>((resolve, reject) => {
        function initDB() {
          var request = window.indexedDB.open(dbName, 1);
          request.onsuccess = function () {};
          request.onupgradeneeded = function () {};
          request.onerror = function (event: any) {
            throw new Error(event.target.errorCode);
          };
        }

        initDB(); // opens the DB at version 1, to allow us trigerring a version change
        // to inject our scraped database

        // the list of required stores, that we must create or which must exist
        const requiredStoreNames = Object.keys(data);

        const request = window.indexedDB.open(dbName, 2); // note: open with version 2 for some reason

        // create the object stores
        request.onupgradeneeded = (e: any) => {
          const db: IDBDatabase = e.target.result;

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

        request.onsuccess = (e: any) => {
          const idbDatabase: IDBDatabase = e.target.result;

          // open a transaction with all our created stores
          const transaction = idbDatabase.transaction(
            requiredStoreNames,
            "readwrite"
          );

          transaction.addEventListener("error", reject);

          for (const storeName of requiredStoreNames) {
            for (const [key, value] of Object.entries(data[storeName])) {
              transaction.objectStore(storeName).put(value, key);
            }
            // @ts-expect-error
            request.oncomplete = resolve();
          }
          resolve();
        };

        request.onerror = (err) => {
          throw new Error(err.toString());
        };
      });
    },
    // @ts-expect-error
    data,
    dbName
  );
}
