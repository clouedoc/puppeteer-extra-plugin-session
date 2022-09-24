import os from 'os';

/**
 * Define the plugin name to report to extra.
 */
export const PLUGIN_NAME: string = 'session';

/**
 * Used for testing only.
 *
 * Get this by navigating to chrome://version
 */
export let TestBrowserExecutablePath: string | undefined = undefined;

switch (os.platform()) {
  case 'darwin':
    TestBrowserExecutablePath =
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    break;
  case 'linux':
    TestBrowserExecutablePath = '/usr/bin/google-chrome';
    break;
}
