import { Page } from "puppeteer";

// FIXME: make this TypeScript-compliant
// STEALTH: isolated worlds
export async function getIndexedDB(
  page: Page,
  dbName: string
): Promise<{ [x: string]: any }> {
  return (await page.evaluate((dbName: string) => {
    return new Promise((resolve, reject) => {
      // note: no need to specify a version property; we are opening the database as it is.
      const request = window.indexedDB.open(dbName);

      request.onsuccess = (e: any) => {
        const idbDatabase = e.target.result;
        const exportObject = {};
        if (idbDatabase.objectStoreNames.length === 0)
          resolve(JSON.stringify(exportObject));
        else {
          const transaction = idbDatabase.transaction(
            idbDatabase.objectStoreNames,
            "readonly"
          );

          transaction.addEventListener("error", reject);

          for (const storeName of idbDatabase.objectStoreNames) {
            const allObjects = {};
            transaction
              .objectStore(storeName)
              .openCursor()
              .addEventListener("success", (event: any) => {
                const cursor = event.target.result;
                if (cursor) {
                  // Cursor holds value, put it into store data
                  // @ts-expect-error
                  allObjects[cursor.key] = cursor.value;
                  cursor.continue();
                } else {
                  // No more values, store is done
                  // @ts-expect-error
                  exportObject[storeName] = allObjects;

                  // Last store was handled
                  if (
                    idbDatabase.objectStoreNames.length ===
                    Object.keys(exportObject).length
                  ) {
                    resolve(exportObject);
                  }
                }
              });
          }
        }
      };

      request.onerror = (err) => {
        console.error(err);
      };
    });
  }, dbName)) as object;
}
