import { Page } from 'puppeteer';
import {
  StorageProvider,
  StorageProviderName,
} from '../classes/storage-provider';

export class SessionStorageProvider extends StorageProvider {
  public get name(): StorageProviderName {
    return StorageProviderName.SessionStorage;
  }

  public async get(page: Page): Promise<string> {
    // STEALTH: use isolated worlds
    return page.evaluate(() =>
      JSON.stringify(Object.assign({}, window.sessionStorage)),
    );
  }

  public async set(page: Page, data: string): Promise<void> {
    // STEALTH: use isolated worlds
    await page.evaluate((sessionStorage: string) => {
      for (const [key, val] of Object.entries(JSON.parse(sessionStorage))) {
        window.sessionStorage.setItem(key, val as string);
      }
    }, data);
  }
}
