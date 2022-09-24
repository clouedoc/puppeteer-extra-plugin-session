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

/**
 * All the storage providers!
 */
const allStorageProviders: StorageProviderName[] = Object.values(
  StorageProviderName,
);

export async function getSessionData(
  page: Page,
  providers: StorageProviderName[] = allStorageProviders,
): Promise<SessionData> {
  const data: Partial<SessionData> = {};
  for (const provider of providers) {
    data[provider] = await storageProviderMap[provider].get(page);
  }
  return data;
}

export async function setSessionData(
  page: Page,
  sessionData: SessionData,
  providers: StorageProviderName[] = allStorageProviders,
): Promise<void> {
  await Promise.all(
    providers.map(async (providerName) => {
      const data = sessionData[providerName];
      if (data) {
        await storageProviderMap[providerName].set(page, data);
      }
    }),
  );
}
