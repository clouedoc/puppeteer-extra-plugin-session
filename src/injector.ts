import { Page as VanillaPage } from "puppeteer";
import { SessionManager } from "./manager";

export interface SessionPage extends VanillaPage {
  readonly session: SessionManager;
}

/**
 * Inject a new SessionPlugin instance into a Puppeteer page.
 * Makes self available on the `session` property.
 */
export function inject(page: VanillaPage): SessionPage {
  return Object.defineProperty(page, "session", {
    value: new SessionManager(page),
    writable: false,
  });
}
