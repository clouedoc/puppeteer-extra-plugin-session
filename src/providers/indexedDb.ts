import { Page } from 'puppeteer';
import {
  StorageProvider,
  StorageProviderName,
} from '../classes/storage-provider';
import { dexieCore, dexieExportImport } from '../constants/dexie';
import {
  CDPIndexedDBDatabaseNames,
  IndexedDBDatabaseSchema,
  IndexedDBSchema,
} from '../schemas';

export class IndexedDBStorageProvider extends StorageProvider {
  public get name(): StorageProviderName {
    return StorageProviderName.IndexedDB;
  }

  public async get(page: Page): Promise<string> {
    const securityOrigin = await page.evaluate(() => location.origin);

    const dbNames = await getDatabaseNames(page, securityOrigin);

    const indexedDBs = await Promise.all(
      dbNames.map((db) => getIndexedDB(page, db)),
    );

    return JSON.stringify(
      dbNames.map((db, index) => {
        return {
          name: db,
          data: indexedDBs[index],
          securityOrigin,
        };
      }),
    );
  }

  public async set(page: Page, data: string): Promise<void> {
    const databases = IndexedDBDatabaseSchema.array().parse(JSON.parse(data));

    for (const db of databases) {
      if (!page.url().includes(db.securityOrigin)) {
        await page.goto(db.securityOrigin);
      }

      await setIndexedDB(page, db.data);
    }
  }
}

function generateSetContentScript(data: string): string {
  return `(async() => {
    // note(clouedoc): required for some websites
    // see https://stackoverflow.com/a/48690342/4564097
    define = undefined;
    exports = undefined;
    if (window.module) module.exports = undefined;

    ${dexieCore}
    ${dexieExportImport}
    const importBlob = new Blob([\`${data}\`], { type: "text/json" });
    const importDB = await Dexie.import(importBlob, { overwriteValues: true });
    return importDB.backendDB();
  })()`;
}

// STEALTH: isolated worlds
// TODO: investigate database versions
export async function setIndexedDB(page: Page, data: string): Promise<void> {
  await page.evaluate(generateSetContentScript(data));
}

// TODO: change this to an appropriate name
export async function getDatabaseNames(
  page: Page,
  securityOrigin: string,
): Promise<string[]> {
  const session = await page.target().createCDPSession();

  let dbNames: string[];
  try {
    const resp = CDPIndexedDBDatabaseNames.parse(
      await session.send('IndexedDB.requestDatabaseNames', {
        securityOrigin,
      }),
    );
    dbNames = resp.databaseNames;
  } catch (err) {
    if ((err as Error).message.includes('No document for given frame found')) {
      dbNames = [];
    } else {
      throw err;
    }
  }

  await session.detach();

  return dbNames;
}

function generateGetContentScript(dbName: string): string {
  return `
  (async() => {
    // note(clouedoc): required for some websites
    // see https://stackoverflow.com/a/48690342/4564097
    define = undefined;
    exports = undefined;
    if (window.module) module.exports = undefined;

    ${dexieCore}
    ${dexieExportImport}
    const db = await new Dexie("${dbName}").open();
    const blob = await db.export();
    return blob.text();
  })()`;
}

// STEALTH: isolated worlds
async function getIndexedDB(page: Page, dbName: string): Promise<string> {
  const result = await page.evaluate(generateGetContentScript(dbName));
  return IndexedDBSchema.parse(result);
}
