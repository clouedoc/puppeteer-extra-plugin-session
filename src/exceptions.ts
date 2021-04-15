import { ZodError } from "zod";

export class CorruptedSessionDataError extends Error {
  constructor(public readonly zodError: ZodError) {
    super(
      `Session data couldn't be parsed. See the embedded ZodError for additional informations.`
    );
  }
}
