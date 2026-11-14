import { z } from 'zod';

export const ArticleSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    body: z.string(),
    tagList: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
    favorited: z.boolean(),
    favoritesCount: z.number(),
    author: z.object({ username: z.string() }).passthrough(),
  })
  .passthrough();