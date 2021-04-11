import { Page } from "puppeteer";
import { z } from "zod";
import { getDatabaseNames } from "./database-names";
import { getIndexedDB } from "./get";
import { setIndexedDB } from "./set";

export const ExportedIndexedDBDatabase = z.object({
  name: z.string(),
  data: z.any(),
  securityOrigin: z.string(),
});

export type ExportedIndexedDBDatabase = z.infer<
  typeof ExportedIndexedDBDatabase
>;

/**
 * @param securityOrigin get this from the "application > IndexedDB" developper panel
 * @returns databases
 */
export async function getAllIndexedDB(page: Page, securityOrigin: string) {
  const dbNames = await getDatabaseNames(page, securityOrigin);

  const databases: ExportedIndexedDBDatabase[] = [];

  for (const db of dbNames) {
    databases.push({
      name: db,
      data: await getIndexedDB(page, db),
      securityOrigin,
    });
  }

  return databases;
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
