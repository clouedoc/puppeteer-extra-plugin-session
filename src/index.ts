/**
 * Export public modules.
 * TODO: make sure that everything is exported
 */
export * from "./constants";
export * from "./plugin";
export * from "./types";

/**
 * Export plugin factory as default export.
 * @return {SessionPlugin}
 */
import { SessionPlugin } from "./plugin";

export default () => new SessionPlugin();
