import { z } from 'zod'

export const LinkSchema = z
  .object({
    pdf: z.string().url().optional(),
    code: z.string().url().optional(),
    dataset: z.string().url().optional(),
    project: z.string().url().optional(),
  })
  .partial()
  .default({})

export const PaperSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number(),
  venue: z.string(),
  authors: z.array(z.string()),
  paper_type: z.string().optional().default(''),
  threat_model: z.string().optional().default(''),
  keywords: z.array(z.string()).default([]),
  subfields: z.array(z.string()).default([]),
  tasks: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  models: z.array(z.string()).default([]),
  datasets: z.array(z.string()).default([]),
  metrics: z.array(z.string()).default([]),
  summary: z.string(),
  findings: z.string().optional().default(''),
  limitations: z.string().optional().default(''),
  future_work: z.string().optional().default(''),
  tags: z.array(z.string()).default([]),
  links: LinkSchema,
})

export type Paper = z.infer<typeof PaperSchema>
export const PaperCollectionSchema = z.array(PaperSchema)

