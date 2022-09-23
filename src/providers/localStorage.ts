import { Page } from 'puppeteer';
import {
  StorageProvider,
  StorageProviderName,
} from '../classes/storage-provider';

export class LocalStorageProvider extends StorageProvider {
  public get name(): StorageProviderName {
    return StorageProviderName.LocalStorage;
  }

  public async get(page: Page): Promise<string> {
    // STEALTH: use isolated worlds
    const localStorage = await page.evaluate(() =>
      Object.assign({}, window.localStorage),
    );
    return JSON.stringify(localStorage);
  }

  public async set(page: Page, data: string): Promise<void> {
    // STEALTH: use isolated worlds
    await page.evaluate((localStorage: string) => {
      for (const [key, val] of Object.entries(JSON.parse(localStorage))) {
        window.localStorage.setItem(key, val as string);
      }
    }, data);
  }
}
