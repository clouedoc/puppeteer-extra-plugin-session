import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import { TestBrowserExecutablePath } from "../constants";
import { SessionPlugin } from "../plugin";

let browser: Browser;
let page: Page;
puppeteer.use(new SessionPlugin());
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    executablePath: TestBrowserExecutablePath,
  });
  page = await browser.newPage();
  await page.goto("https://httpbin.org/ip");
});

afterAll(async () => {
  await browser?.close();
});

afterEach(async () => {
  // delete the "foo" cookie after each tests
  const session = await page.target().createCDPSession();
  await session.send("Network.deleteCookies", {
    name: "foo",
    domain: "httpbin.org",
  });
  await session.detach();
});

it("can get cookies", async () => {
  await page.evaluate(() => {
    function setCookie(c_name: string, value: string, exdays?: number) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + (exdays || 0));
      var c_value =
        escape(value) +
        (exdays == null ? "" : "; expires=" + exdate.toUTCString());
      document.cookie = c_name + "=" + c_value;
    }

    setCookie("foo", "bar");
  });

  const session = await page.session.dump("_");

  // the cookie exists and was obtained
  expect(session.cookies.some((cookie) => cookie.name === "foo")).toBe(true);

  // the cookie contains the right value
  expect(session.cookies.find((cookie) => cookie.name === "foo")?.value).toBe(
    "bar"
  );
});

it("can edit and overwrite cookies", async () => {
  // set dummy cookie (foo:bar)
  await page.evaluate(() => {
    function setCookie(c_name: string, value: string, exdays?: number) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + (exdays || 0));
      var c_value =
        escape(value) +
        (exdays == null ? "" : "; expires=" + exdate.toUTCString());
      document.cookie = c_name + "=" + c_value;
    }

    setCookie("foo", "bar");
  });

  const initialSession = await page.session.dump("_");

  // edit cookies
  initialSession.cookies = initialSession.cookies.map((cookie) => {
    // note: beware, here, it's baz, while before, it was ba*r*.
    cookie.value = "baz";
    return cookie;
  });

  await page.session.restore(initialSession);

  const restoredSession = await page.session.dump("_");

  // the cookie exists again
  expect(restoredSession.cookies.some(
    (cookie) => cookie.name === "foo")
  ).toBe(true);

  // the cookie contains the right value
  expect(restoredSession.cookies.find(
    (cookie) => cookie.name === "foo"
  )?.value).toBe("baz");
});

it.todo("can add a cookie");
it.todo("gets cookies from other domains");
it.todo("overwrites cookies from other domain");
