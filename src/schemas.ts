import { z } from "zod";

/**
 * @see https://chromedevtools.github.io/devtools-protocol/tot/IndexedDB/#method-requestDatabaseNames
 */
export const CDPIndexedDBDatabaseNames = z.object({
  databaseNames: z.array(z.string()),
});
