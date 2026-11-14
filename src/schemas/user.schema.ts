import { z } from 'zod';

export const UserSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    token: z.string().min(1),
  })
  .passthrough();
