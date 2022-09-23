import { ZodError } from 'zod';

export class CorruptedSessionDataError extends Error {
  public readonly zodError: ZodError;
  public constructor(zodError: ZodError) {
    super(
      `Session data couldn't be parsed. See the embedded ZodError for additional informations.`,
    );
    this.zodError = zodError;
  }
}
