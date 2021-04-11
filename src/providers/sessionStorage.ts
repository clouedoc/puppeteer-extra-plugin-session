import { Page } from "puppeteer";

export async function getSessionStorage(page: Page) {
  return page.evaluate(() =>
    JSON.stringify(Object.assign({}, window.sessionStorage))
  );
}

export async function setSessionStorage(page: Page, sessionStorage: string) {
  await page.evaluate((sessionStorage: string) => {
    for (const [key, val] of Object.entries(JSON.parse(sessionStorage))) {
      window.sessionStorage.setItem(key, val as string);
    }
  }, sessionStorage);
}
