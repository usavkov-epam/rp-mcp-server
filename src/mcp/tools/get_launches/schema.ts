import { z } from "zod";

export const inputSchema = {
  limit: z.number()
    .min(1)
    .max(100)
    .default(5)
    .describe("Number of launches to fetch"),
}

export const outputSchema = {
  launches: z.array(z.object({
    id: z.number(),
    uuid: z.string(),
    name: z.string(),
    number: z.number(),
    status: z.string(),
    startTime: z.number(),
    endTime: z.number().optional(),
  })),
};