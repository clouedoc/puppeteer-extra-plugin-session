import { Page } from "puppeteer";

export async function getLocalStorage(page: Page) {
  // STEALTH: use isolated worlds
  const localStorage = await page.evaluate(() =>
    Object.assign({}, window.localStorage)
  );
  return JSON.stringify(localStorage);
}

export async function setLocalStorage(page: Page, localStorage: string) {
  // STEALTH: use isolated worlds
  await page.evaluate((localStorage: string) => {
    for (const [key, val] of Object.entries(JSON.parse(localStorage))) {
      window.localStorage.setItem(key, val as string);
    }
  }, localStorage);
}
