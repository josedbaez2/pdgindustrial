import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title_es:       z.string(),
    title_en:       z.string(),
    description_es: z.string(),
    description_en: z.string(),
    client:         z.string(),
    location:       z.string(),
    date:           z.coerce.date(),
    image:          z.string(),
    gallery:        z.array(z.string()).optional().default([]),
    category:       z.enum([
      'structures',
      'tanks',
      'fuel-stations',
      'electrical',
      'civil',
      'piping',
      'machinery',
    ]),
  }),
});

export const collections = { projects };
