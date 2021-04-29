import { z } from "zod";

/**
 * @see https://chromedevtools.github.io/devtools-protocol/tot/IndexedDB/#method-requestDatabaseNames
 */
export const CDPIndexedDBDatabaseNames = z.object({
  databaseNames: z.array(z.string()),
});

/**
 * IndexedDB schemas
 */
export const CursorRecordSchema = z.record(z.any())
export type CursorRecord = z.infer<typeof CursorRecordSchema>
export const IndexedDBRecordSchema = z.record(CursorRecordSchema);
export type IndexedDBRecord = z.infer<typeof IndexedDBRecordSchema>;
export const IndexedDBDatabaseSchema = z.object({
  name: z.string(),
  data: IndexedDBRecordSchema,
  securityOrigin: z.string(),
});
export type IndexedDBDatabase = z.infer<typeof IndexedDBDatabaseSchema>;

const CDPSameSite = z.enum(["Strict", "Lax", "None"]);
const CDPCookiePriority = z.enum(["Low", "Medium", "High"]);
const CDPSourceScheme = z.enum(["Unset", "NonSecure", "Secure"]);

/**
 * CDP Network.Cookie schema
 * @see https://chromedevtools.github.io/devtools-protocol/tot/Network/#type-Cookie
 */
export const CDPCookieSchema = z.object({
  name: z.string(),
  value: z.string(),
  domain: z.string(),
  path: z.string(),
  expires: z.number(),
  size: z.number(),
  httpOnly: z.boolean(),
  secure: z.boolean(),
  session: z.boolean(),
  sameSite: CDPSameSite.optional(),
  priority: CDPCookiePriority,
  sameParty: z.boolean(),
  sourceScheme: CDPSourceScheme,
  sourcePort: z.number(),
});
export type CDPCookie = z.infer<typeof CDPCookieSchema>;

/**
 * CDP Network.CookieParam schema
 * @see https://chromedevtools.github.io/devtools-protocol/tot/Network/#type-CookieParam
 */
export const CDPCookieParam = z.object({
  name: z.string(),
  value: z.string(),
  url: z.string().optional(),
  domain: z.string().optional(),
  path: z.string().optional(),
  secure: z.boolean().optional(),
  httpOnly: z.boolean().optional(),
  sameSite: CDPSameSite.optional(),
  /**
   * Time since Epoch
   */
  expires: z.number().optional(),
  priority: CDPCookiePriority.optional(),
  sameParty: z.boolean().optional(),
  sourceScheme: CDPSourceScheme.optional(),
  sourcePort: z.number().optional(),
});

export const SessionDataSchema = z.object({
  localStorage: z.string(),
  sessionStorage: z.string(),
  indexedDBDatabases: z.array(IndexedDBDatabaseSchema),
  cookies: z.array(CDPCookieSchema),
});
