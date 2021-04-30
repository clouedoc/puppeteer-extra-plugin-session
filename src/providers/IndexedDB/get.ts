import { Page } from "puppeteer";
import { IndexedDBSchema } from "../../schemas";
import { dexieCore, dexieExportImport } from "./dexie";

function generateContentScript(dbName: string): string {
  return `
  (async() => {
    ${dexieCore}
    ${dexieExportImport}
    const db = await new Dexie("${dbName}").open();
    const blob = await db.export();
    return blob.text();
  })()`
}

// STEALTH: isolated worlds
export async function getIndexedDB(
  page: Page,
  dbName: string
): Promise<string> {
  const result = await page.evaluate(generateContentScript(dbName));
  return IndexedDBSchema.parse(result);
}