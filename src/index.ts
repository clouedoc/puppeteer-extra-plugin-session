/**
 * Export public modules.
 * TODO: make sure that everything is exported
 */
export * from "./constants";
export * from "./exceptions";
export * from "./injector";
export * from "./manager";
export * from "./plugin";
export * from "./schemas";
export * from "./session";

/**
 * Export plugin factory as default export.
 * @return {SessionPlugin}
 */
import { SessionPlugin } from "./plugin";

export default () => new SessionPlugin();
