import { Page } from 'puppeteer';
import { ZodError } from 'zod';
import { CorruptedSessionDataError } from '../exceptions';
import { SessionDataSchema } from '../schemas';
import { getSessionData, setSessionData } from '../session';
import { SessionData } from '../types/session-data';

export class SessionManager {
  protected readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  public async dump(): Promise<SessionData> {
    return getSessionData(this.page);
  }

  public async dumpString(): Promise<string> {
    return JSON.stringify(await getSessionData(this.page));
  }

  public async restore(sessionData: SessionData): Promise<void> {
    let data;
    try {
      data = SessionDataSchema.parse(sessionData);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new CorruptedSessionDataError(err);
      }

      throw err;
    }

    await setSessionData(this.page, data);
  }

  public async restoreString(sessionData: string): Promise<void> {
    await setSessionData(this.page, JSON.parse(sessionData));
  }
}
