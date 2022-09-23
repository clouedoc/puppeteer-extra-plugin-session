import { Page } from 'puppeteer';
import { z } from 'zod';
import {
  StorageProvider,
  StorageProviderName,
} from '../classes/storage-provider';
import { CDPCookieParam, CDPCookieSchema } from '../schemas';

export class CookieStorageProvider extends StorageProvider {
  public get name(): StorageProviderName {
    return StorageProviderName.Cookie;
  }

  public async get(page: Page): Promise<string> {
    const session = await page.target().createCDPSession();
    const resp = await session.send('Network.getAllCookies');
    await session.detach();

    /**
     * @see https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-getAllCookies
     */
    const parsed = z.object({ cookies: z.array(CDPCookieSchema) }).parse(resp);

    return JSON.stringify(parsed.cookies);
  }

  public async set(page: Page, data: string): Promise<void> {
    const session = await page.target().createCDPSession();

    const parsed = z.array(CDPCookieParam).parse(JSON.parse(data));

    /**
     * @see https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-setCookies
     */
    await session.send('Network.setCookies', {
      cookies: parsed,
    });

    await session.detach();
  }
}
