import { z } from "zod";
import { ExportedIndexedDBDatabase } from "./providers/IndexedDB";

/**
 * @see https://chromedevtools.github.io/devtools-protocol/tot/IndexedDB/#method-requestDatabaseNames
 */
export const CDPIndexedDBDatabaseNames = z.object({
  databaseNames: z.array(z.string()),
});

export const SessionDataSchema = z.object({
  localStorage: z.string(),
  sessionStorage: z.string(),
  indexedDBDatabases: z.array(ExportedIndexedDBDatabase),
  cookies: z.string(),
});
