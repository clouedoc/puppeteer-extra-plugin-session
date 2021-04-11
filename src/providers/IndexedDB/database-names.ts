import { Page } from "puppeteer";
import { CDPIndexedDBDatabaseNames } from "../../schemas";

// TODO: change this to an appropriate name
export async function getDatabaseNames(page: Page, securityOrigin: string) {
  const session = await page.target().createCDPSession();

  const dbNames = CDPIndexedDBDatabaseNames.parse(
    await session.send("IndexedDB.requestDatabaseNames", {
      securityOrigin,
    })
  );

  await session.detach();

  return dbNames.databaseNames;
}
