import {} from "puppeteer";
import {} from "puppeteer-core";
import { PluginOptions } from "puppeteer-extra-plugin";
import { z } from "zod";
import { SessionManager } from "./manager";
import { SessionDataSchema } from "./schemas";

export interface SessionPluginOptions extends PluginOptions {}

export type SessionData = z.infer<typeof SessionDataSchema>;

/**
 * This part down below works for some reason, and that's all I need to know.
 * May TypeScript bless you the same way I was.
 */

export type SessionPluginPageAdditions = {
  session: SessionManager;
};

declare module "puppeteer" {
  interface Page extends SessionPluginPageAdditions {}
}

declare module "puppeteer-core" {
  interface Page extends SessionPluginPageAdditions {}
}
