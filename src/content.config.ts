import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const sector = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sector' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    oneLiner: z.string(),
    lede: z.string(),
    dealSlugs: z.array(z.string()).default([]),
    testimonial: z.object({
      quote: z.string(),
      attribution: z.string(),
    }).optional(),
  }),
});

const service = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/service' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    oneLiner: z.string(),
    lede: z.string(),
    dealSlugs: z.array(z.string()).default([]),
    testimonial: z.object({
      quote: z.string(),
      attribution: z.string(),
    }).optional(),
  }),
});

const deal = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/deal' }),
  schema: z.object({
    companyA: z.string(),
    companyB: z.string().optional(),
    year: z.number().int(),
    type: z.enum(['sell-side', 'buy-side', 'pe']),
    sector: z.enum(['technology-services', 'management-consulting', 'digital-media-marketing', 'human-capital-management']),
    geoFrom: z.string().optional(),
    geoTo: z.string().optional(),
    description: z.string().optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    isPartner: z.boolean().default(false),
    order: z.number(),
    bio: z.string(),
    manifesto: z.string().optional(),
    portrait: z.string().optional(),
    linkedIn: z.string().url().optional(),
  }),
});

const insight = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insight' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { sector, service, deal, team, insight };
