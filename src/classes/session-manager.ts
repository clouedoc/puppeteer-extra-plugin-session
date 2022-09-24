import { Page } from 'puppeteer';
import { ZodError } from 'zod';
import { CorruptedSessionDataError } from '../exceptions';
import { SessionDataSchema } from '../schemas';
import { getSessionData, setSessionData } from '../session';
import { SessionData } from '../types/session-data';
import { StorageProviderName } from './storage-provider';

export interface ISessionManagerOptions {
  /**
   * List of storage providers to enable.
   * If none is provided, all the storage providers will be enabled.
   */
  storageProviders?: StorageProviderName[];
}

export const defaultSessionManagerOptions: ISessionManagerOptions = {
  storageProviders: Object.values(StorageProviderName),
};

export class SessionManager {
  protected readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  public async dump(
    options: ISessionManagerOptions = defaultSessionManagerOptions,
  ): Promise<SessionData> {
    return getSessionData(this.page, options.storageProviders);
  }

  public async restore(
    sessionData: SessionData,
    options: ISessionManagerOptions = defaultSessionManagerOptions,
  ): Promise<void> {
    let data;
    try {
      data = SessionDataSchema.parse(sessionData);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new CorruptedSessionDataError(err);
      }

      throw err;
    }

    await setSessionData(this.page, data, options.storageProviders);
  }

  /**
   * Helper function to serialize the output of dump into JSON format.
   */
  public async dumpString(
    options: ISessionManagerOptions = defaultSessionManagerOptions,
  ): Promise<string> {
    return JSON.stringify(await this.dump(options));
  }

  /**
   * Helper function to parse a JSON string into a SessionData object and feed it to `restore`
   */
  public async restoreString(
    sessionData: string,
    options: ISessionManagerOptions = defaultSessionManagerOptions,
  ): Promise<void> {
    await this.restore(JSON.parse(sessionData), options);
  }
}
