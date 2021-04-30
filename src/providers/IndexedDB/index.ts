import { Page } from "puppeteer";
import { IndexedDBDatabase } from "../../schemas";
import { getDatabaseNames } from "./database-names";
import { getIndexedDB } from "./get";
import { setIndexedDB } from "./set";

/**
 * @param securityOrigin get this from the "application > IndexedDB" developper panel
 * @returns databases
 */
export async function getAllIndexedDB(page: Page, securityOrigin: string): Promise<IndexedDBDatabase[]> {
  const dbNames = await getDatabaseNames(page, securityOrigin);

  const indexedDBs = await Promise.all(
    dbNames.map(db => getIndexedDB(page, db))
  )

  return dbNames.map((db, index) => {
    return {
      name: db,
      data: indexedDBs[index],
      securityOrigin,
    };
  });
}

export async function setAllIndexedDB(
  page: Page,
  databases: IndexedDBDatabase[]
) {
  for (const db of databases) {
    if (!page.url().includes(db.securityOrigin)) {
      await page.goto(db.securityOrigin);
    }

    await setIndexedDB(page, db.data);
  }
}
