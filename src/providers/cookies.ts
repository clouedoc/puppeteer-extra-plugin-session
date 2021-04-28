import { Cookie, Page } from "puppeteer";

export async function getCookies(page: Page) {
  const client = await page.target().createCDPSession();
  const { cookies } = await client.send(
    'Network.getAllCookies'
  ) as { cookies: Cookie[] }

  return JSON.stringify(cookies);
}

export async function setCookies(page: Page, cookies: string) {
  await page.setCookie(...JSON.parse(cookies));
}
