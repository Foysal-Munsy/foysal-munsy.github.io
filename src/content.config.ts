import { defineCollection, z } from "astro:content";

// Projects / case studies. Each MDX file under src/content/projects/ is a full
// case study. `slug` is derived from the filename by Astro.
const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        role: z.string(),
        timeframe: z.string(),
        // Short tags rendered as pills on the card and detail header.
        tech: z.array(z.string()),
        // Optional external links shown in the header.
        repo: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        // Controls ordering in lists (lower shows first).
        order: z.number().default(0),
        // Surface this project on the homepage highlights.
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

// Research & publications. Each entry can be a full write-up (MDX body) and/or
// point to an external DOI / report link.
const research = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        // e.g. "BSc Thesis" or a journal name.
        venue: z.string(),
        year: z.string(),
        tags: z.array(z.string()).default([]),
        // External links.
        doi: z.string().url().optional(),
        link: z.string().url().optional(),
        // Link to a full report (e.g. a Google Drive folder / PDF). Rendered as
        // a "Full report" link rather than a DOI.
        fullReport: z.string().url().optional(),
        order: z.number().default(0),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

// Blog posts for later. Same MDX-driven pattern.
const blog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        publishDate: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

export const collections = { projects, research, blog };
