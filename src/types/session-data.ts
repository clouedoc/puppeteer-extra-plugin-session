import { z } from 'zod';
import { SessionDataSchema } from '../schemas';

export type SessionData = z.infer<typeof SessionDataSchema>;
