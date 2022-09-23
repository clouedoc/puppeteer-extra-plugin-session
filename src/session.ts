import { Page } from 'puppeteer';
import {
  StorageProvider,
  StorageProviderName,
} from './classes/storage-provider';
import { CookieStorageProvider } from './providers/cookies';
import { IndexedDBStorageProvider } from './providers/indexedDb';
import { LocalStorageProvider } from './providers/localStorage';
import { SessionStorageProvider } from './providers/sessionStorage';
import { SessionData } from './types/session-data';

export const storageProviderMap: Record<
  StorageProviderName,
  StorageProvider
> = {
  [StorageProviderName.Cookie]: new CookieStorageProvider(),
  [StorageProviderName.LocalStorage]: new LocalStorageProvider(),
  [StorageProviderName.SessionStorage]: new SessionStorageProvider(),
  [StorageProviderName.IndexedDB]: new IndexedDBStorageProvider(),
};

export async function getSessionData(page: Page): Promise<SessionData> {
  return {
    localStorage: await storageProviderMap.localStorage.get(page),
    cookie: await storageProviderMap.cookie.get(page),
    sessionStorage: await storageProviderMap.sessionStorage.get(page),
    indexedDB: await storageProviderMap.indexedDB.get(page),
  };
}

export async function setSessionData(
  page: Page,
  sessionData: SessionData,
): Promise<void> {
  await Promise.all(
    Object.values(storageProviderMap).map(async (provider) => {
      const data = sessionData[provider.name];
      if (data) {
        await provider.set(page, data);
      }
    }),
  );
}
