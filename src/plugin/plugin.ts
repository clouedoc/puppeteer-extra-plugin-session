import { Page } from 'puppeteer';
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';
import { PLUGIN_NAME } from '../constants/constants';
import { ISessionPluginOptions } from '../types';
import { inject } from './injector';

// TODO: use documentation.js to generate documentation in README.md

/**
 * Puppeteer Extra Session Plugin
 */
export class SessionPlugin extends PuppeteerExtraPlugin {
  /**
   * Constructor
   * Receives standard puppeteer-extra plugin config options.
   */
  public constructor(opts: ISessionPluginOptions = {}) {
    super(opts);
  }

  /**
   * Describe the identifier for plugin.
   */
  public get name(): string {
    return PLUGIN_NAME;
  }

  public async onPageCreated(page: Page): Promise<void> {
    inject(page);
  }
}

/**
 * Export plugin factory as default export.
 */
export default (): SessionPlugin => new SessionPlugin();
