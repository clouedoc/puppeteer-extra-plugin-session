import {} from 'puppeteer';
import {} from 'puppeteer-core';
import { PluginOptions } from 'puppeteer-extra-plugin';
import { SessionManager } from './classes/session-manager';

export interface ISessionPluginOptions extends PluginOptions {}

/**
 * This part down below works for some reason, and that's all I need to know.
 * May TypeScript bless you the same way I was.
 */

export interface ISessionPluginPageAdditions {
  session: SessionManager;
}

declare module 'puppeteer' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Page extends ISessionPluginPageAdditions {}
}

declare module 'puppeteer-core' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Page extends ISessionPluginPageAdditions {}
}
