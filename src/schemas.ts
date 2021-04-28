import { z } from "zod";
import { exportedIndexedDBDatabase } from "./providers/IndexedDB";

/**
 * @see https://chromedevtools.github.io/devtools-protocol/tot/IndexedDB/#method-requestDatabaseNames
 */
export const CDPIndexedDBDatabaseNames = z.object({
  databaseNames: z.array(z.string()),
});

export const SessionDataSchema = z.object({
  localStorage: z.string(),
  sessionStorage: z.string(),
  indexedDBDatabases: z.array(exportedIndexedDBDatabase),
  cookies: z.string(),
});
