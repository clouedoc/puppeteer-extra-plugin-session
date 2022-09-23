import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { TestBrowserExecutablePath } from '../constants/constants';
import { SessionPlugin } from '../plugin/plugin';
import { CDPCookie } from '../schemas';

let browser: Browser;
let page: Page;
puppeteer.use(new SessionPlugin());
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    executablePath: TestBrowserExecutablePath,
    args: ['--no-sandbox'],
  });
  page = await browser.newPage();
  await page.goto('https://httpbin.org/ip');
});

afterAll(async () => {
  await browser?.close();
});

afterEach(async () => {
  // delete the "foo" cookie after each tests
  const session = await page.target().createCDPSession();
  await session.send('Network.deleteCookies', {
    name: 'foo',
    domain: 'httpbin.org',
  });
  await session.detach();
});

it('can get cookies', async () => {
  await page.evaluate(() => {
    function setCookie(
      cookieName: string,
      value: string,
      exDays?: number,
    ): void {
      const exDate = new Date();
      exDate.setDate(exDate.getDate() + (exDays || 0));
      const cookieValue =
        escape(value) +
        (exDays === null ? '' : '; expires=' + exDate.toUTCString());
      document.cookie = cookieName + '=' + cookieValue;
    }

    setCookie('foo', 'bar');
  });

  const session = await page.session.dump();

  // the cookie exists and was obtained
  expect(
    JSON.parse(session.cookie).some(
      (cookie: CDPCookie) => cookie.name === 'foo',
    ),
  ).toBe(true);

  // the cookie contains the right value
  expect(
    JSON.parse(session.cookie).find(
      (cookie: CDPCookie) => cookie.name === 'foo',
    )?.value,
  ).toBe('bar');
});

it('can edit and overwrite cookies', async () => {
  // set dummy cookie (foo:bar)
  await page.evaluate(() => {
    function setCookie(
      cookieName: string,
      value: string,
      exDays?: number,
    ): void {
      const exDate = new Date();
      exDate.setDate(exDate.getDate() + (exDays || 0));
      const c_value =
        escape(value) +
        (exDays === null ? '' : '; expires=' + exDate.toUTCString());
      document.cookie = cookieName + '=' + c_value;
    }

    setCookie('foo', 'bar');
  });

  const initialSession = await page.session.dump();

  // edit cookies
  initialSession.cookie = JSON.stringify(
    JSON.parse(initialSession.cookie).map((cookie: CDPCookie) => {
      // note: beware, here, it's baz, while before, it was ba*r*.
      cookie.value = 'baz';
      return cookie;
    }),
  );

  await page.session.restore(initialSession);

  const restoredSession = await page.session.dump();

  // the cookie exists again
  expect(
    JSON.parse(restoredSession.cookie).some(
      (cookie: CDPCookie) => cookie.name === 'foo',
    ),
  ).toBe(true);

  // the cookie contains the right value
  expect(
    JSON.parse(restoredSession.cookie).find(
      (cookie: CDPCookie) => cookie.name === 'foo',
    )?.value,
  ).toBe('baz');
});

it.todo('can add a cookie');
it.todo('gets cookies from other domains');
it.todo('overwrites cookies from other domain');
