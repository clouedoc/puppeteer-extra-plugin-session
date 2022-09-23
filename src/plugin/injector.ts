import { Page as VanillaPage } from 'puppeteer';
import { SessionManager } from '../classes/session-manager';

export interface ISessionPage extends VanillaPage {
  readonly session: SessionManager;
}

/**
 * Inject a new SessionPlugin instance into a Puppeteer page.
 * Makes self available on the `session` property.
 */
export function inject(page: VanillaPage): ISessionPage {
  return Object.defineProperty(page, 'session', {
    value: new SessionManager(page),
    writable: false,
  });
}
