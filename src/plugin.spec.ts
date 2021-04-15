import puppeteer from "puppeteer-extra";
import { SessionManager } from "./manager";
import SessionPlugin from "./plugin";

puppeteer.use(SessionPlugin());

jest.setTimeout(15000);

it("injects the session manager when a page is created", async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  expect(page).toHaveProperty("session");
  expect(page.session).toBeInstanceOf(SessionManager);
  await browser.close();
});
