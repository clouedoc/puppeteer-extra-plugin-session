import { Page } from "puppeteer";

// TODO: use CDP all cookies method
export async function getCookies(page: Page) {
  return JSON.stringify(await page.cookies());
}

export async function setCookies(page: Page, cookies: string) {
  await page.setCookie(...JSON.parse(cookies));
}
