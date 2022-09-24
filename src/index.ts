/**
 * Export public modules.
 * TODO: make sure that everything is exported
 */
export * from './classes/session-manager';
export * from './classes/storage-provider';
export * from './constants/constants';
export * from './exceptions';
export * from './plugin/injector';
export * from './plugin/plugin';
export * from './schemas';
export * from './session';

/**
 * Export plugin factory as default export.
 * @return {SessionPlugin}
 */
import { SessionPlugin } from './plugin/plugin';

export default (): SessionPlugin => new SessionPlugin();
