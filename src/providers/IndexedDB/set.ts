import { Page } from "puppeteer";
import { dexieCore, dexieExportImport } from "./dexie";

function generateContentScript(data: string): string {
  return `(async() => {
    ${dexieCore}
    ${dexieExportImport}
    const importBlob = new Blob([\`${data}\`], { type: "text/json" });
    const importDB = await Dexie.import(importBlob, { overwriteValues: true });
    return importDB.backendDB();
  })()`;
}

// STEALTH: isolated worlds
// TODO: investigate database versions
export async function setIndexedDB(
  page: Page,
  data: string,
): Promise<void> {
  await page.evaluate(generateContentScript(data));
}

