import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import { TestBrowserExecutablePath } from "../../constants";
import { SessionPlugin } from "../../plugin";
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

let browser: Browser;
let page: Page;
puppeteer.use(new SessionPlugin()).use(StealthPlugin());
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    executablePath: TestBrowserExecutablePath,
  });
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("https://twitter.com/", { waitUntil: 'networkidle2'});
});

afterAll(async () => {
  await browser?.close();
});

it("can get localdb", async () => {
  const session = await page.session.dump("https://twitter.com");

  // the db exist and was obtained
  expect(session.indexedDBDatabases).toHaveLength(1)
  expect(session.indexedDBDatabases.some((db) => db.name === "localforage")).toBe(true);
});

it("can set indexDB", async () => {
  const session = await page.session.dump("https://twitter.com");
  expect(session.indexedDBDatabases.some((db) => db.name === "localforage")).toBe(true);

  // Delete the database using CDP
  const client = await page.target().createCDPSession();
  await client.send("IndexedDB.deleteDatabase", {
    databaseName: "localforage",
    securityOrigin: "https://twitter.com",
  });
  await client.detach();

  // Dump the session again to make sure there is no localforage
  const emptySession = await page.session.dump("https://twitter.com");
  expect(emptySession.indexedDBDatabases.some((db) => db.name === "localforage")).toBe(false);

  // Restore the indexedDB
  await page.session.restore(session)

  // Check to make sure the db was restored
  const finalSession = await page.session.dump("https://twitter.com");
  expect(finalSession.indexedDBDatabases.some((db) => db.name === "localforage")).toBe(true);
});

