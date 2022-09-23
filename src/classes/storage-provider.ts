import { Page } from 'puppeteer';

export enum StorageProviderName {
  Cookie = 'cookie',
  LocalStorage = 'localStorage',
  SessionStorage = 'sessionStorage',
  IndexedDB = 'indexedDB',
}

export abstract class StorageProvider {
  public abstract name: StorageProviderName;
  public abstract get(page: Page): Promise<string>;
  public abstract set(page: Page, data: string): Promise<void>;
}
