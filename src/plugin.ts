import { Page } from "puppeteer";
import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin";
import { PLUGIN_NAME } from "./constants";
import { inject } from "./injector";
import { SessionPluginOptions } from "./types";

// TODO: use documentation.js to generate documentation in README.md

/**
 * Puppeteer Extra Session Plugin
 */
export class SessionPlugin extends PuppeteerExtraPlugin {
  /**
   * Constructor
   * Receives standard puppeteer-extra plugin config options.
   */
  public constructor(opts: SessionPluginOptions = {}) {
    super(opts);
  }

  /**
   * Describe the identifier for plugin.
   */
  public get name() {
    return PLUGIN_NAME;
  }

  public async onPageCreated(page: Page) {
    inject(page);
  }
}

/**
 * Export plugin factory as default export.
 */
export default () => new SessionPlugin();
