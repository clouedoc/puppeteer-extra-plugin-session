import { Page } from "puppeteer";
import { z } from "zod";
import { getDatabaseNames } from "./database-names";
import { getIndexedDB, indexedDBRecord } from "./get";
import { setIndexedDB } from "./set";

export const exportedIndexedDBDatabase = z.object({
  name: z.string(),
  data: indexedDBRecord,
  securityOrigin: z.string(),
});

export type ExportedIndexedDBDatabase = z.infer<
  typeof exportedIndexedDBDatabase
>;

/**
 * @param securityOrigin get this from the "application > IndexedDB" developper panel
 * @returns databases
 */
export async function getAllIndexedDB(page: Page, securityOrigin: string): Promise<ExportedIndexedDBDatabase[]> {
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
  databases: ExportedIndexedDBDatabase[]
) {
  for (const db of databases) {
    if (!page.url().includes(db.securityOrigin)) {
      await page.goto(db.securityOrigin);
    }

    await setIndexedDB(page, db.data, db.name);
  }
}
