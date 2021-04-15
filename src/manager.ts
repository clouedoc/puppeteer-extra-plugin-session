import { Page } from "puppeteer";
import { ZodError } from "zod";
import { CorruptedSessionDataError } from "./exceptions";
import { SessionDataSchema } from "./schemas";
import { getSessionData, setSessionData } from "./session";
import { SessionData } from "./types";

export class SessionManager {
  constructor(protected readonly page: Page) {}

  public async dump(securityOrigin: string): Promise<SessionData> {
    return getSessionData(this.page, securityOrigin);
  }

  public async dumpString(securityOrigin: string): Promise<string> {
    return JSON.stringify(await getSessionData(this.page, securityOrigin));
  }

  public async restore(sessionData: SessionData): Promise<void> {
    try {
      var data = SessionDataSchema.parse(sessionData);
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
