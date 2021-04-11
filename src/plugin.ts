import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin";
import { PLUGIN_NAME } from "./constants";
import { SessionPluginOptions } from "./types";

// TODO: use documentation.js to generate documentation in README.md

/**
 * Puppeteer Extra Session Plugin
 */
export class SessionPlugin extends PuppeteerExtraPlugin {
  /**
   * Provide fallbacks if resolution fails.
   * @type {string}
   * @protected
   */
  protected _fallbackTz: string | undefined;

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
}

/**
 * Export plugin factory as default export.
 * @return {SessionPlugin}
 */
export default () => new SessionPlugin();
