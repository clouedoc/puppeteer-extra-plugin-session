import { Page } from "puppeteer";
import * as z from "zod";
import { getCookies, setCookies } from "./providers/cookies";
import {
  ExportedIndexedDBDatabase,
  getAllIndexedDB,
  setAllIndexedDB,
} from "./providers/IndexedDB";
import { getLocalStorage, setLocalStorage } from "./providers/localStorage";
import {
  getSessionStorage,
  setSessionStorage,
} from "./providers/sessionStorage";

export const SessionData = z.object({
  localStorage: z.string(),
  sessionStorage: z.string(),
  indexedDBDatabases: z.array(ExportedIndexedDBDatabase),
  cookies: z.string(),
});
export type SessionData = z.infer<typeof SessionData>;

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
