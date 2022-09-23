import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { TestBrowserExecutablePath } from '../constants/constants';
import { SessionPlugin } from '../plugin/plugin';

jest.setTimeout(15000);

let browser: Browser;
let page: Page;
puppeteer.use(new SessionPlugin()).use(StealthPlugin());
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    executablePath: TestBrowserExecutablePath,
    args: ['--no-sandbox'],
  });
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('https://twitter.com/', { waitUntil: 'networkidle2' });
});

afterAll(async () => {
  await browser?.close();
});

it('can get localdb', async () => {
  const session = await page.session.dump();

  // the db exist and was obtained
  expect(session.indexedDB).toHaveLength(1);
  expect(
    JSON.parse(session.indexedDB).some(
      (db: { name: string }) => db.name === 'localforage',
    ),
  ).toBe(true);
});

it('can set indexDB', async () => {
  const session = await page.session.dump();
  expect(
    JSON.parse(session.indexedDB).some(
      (db: { name: string }) => db.name === 'localforage',
    ),
  ).toBe(true);

  // Delete the database using CDP
  const client = await page.target().createCDPSession();
  await client.send('IndexedDB.deleteDatabase', {
    databaseName: 'localforage',
    securityOrigin: 'https://twitter.com',
  });
  await client.detach();

  // Dump the session again to make sure there is no localforage
  const emptySession = await page.session.dump();
  expect(
    JSON.parse(emptySession.indexedDB).some(
      (db: { name: string }) => db.name === 'localforage',
    ),
  ).toBe(false);

  // Restore the indexedDB
  await page.session.restore(session);

  // Check to make sure the db was restored
  const finalSession = await page.session.dump();
  expect(
    JSON.parse(finalSession.indexedDB).some(
      (db: { name: string }) => db.name === 'localforage',
    ),
  ).toBe(true);
});
