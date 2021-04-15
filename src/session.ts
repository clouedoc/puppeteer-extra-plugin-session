import { Page } from "puppeteer";
import { getCookies, setCookies } from "./providers/cookies";
import { getAllIndexedDB, setAllIndexedDB } from "./providers/IndexedDB";
import { getLocalStorage, setLocalStorage } from "./providers/localStorage";
import {
  getSessionStorage,
  setSessionStorage,
} from "./providers/sessionStorage";
import { SessionData } from "./types";

/**
 * @param securityOrigin to get this: Dev Tools > Application > IndexedDB > properties of a database > security origin
 * @returns
 */
export async function getSessionData(
  page: Page,
  securityOrigin: string
): Promise<SessionData> {
  return {
    localStorage: await getLocalStorage(page),
    cookies: await getCookies(page),
    sessionStorage: await getSessionStorage(page),
    indexedDBDatabases: await getAllIndexedDB(page, securityOrigin),
  };
}

export async function setSessionData(page: Page, sessionData: SessionData) {
  await Promise.all([
    setCookies(page, sessionData.cookies),
    setLocalStorage(page, sessionData.localStorage),
    setSessionStorage(page, sessionData.sessionStorage),
    setAllIndexedDB(page, sessionData.indexedDBDatabases),
  ]);
}
