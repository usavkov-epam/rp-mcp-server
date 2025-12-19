import { z } from "zod";

export const inputSchema = {
  name: z.enum([
    'runNightlyCypressEurekaTests',
    'folioQualityGates',
  ]),
  team: z.enum([
    "Thunderjet",
    "Spitfire",
    "Firebird",
    "Corsair",
    "Folijet",
    "Vega",
    "Volaris",
  ])
    .describe("Team identifier")
    .optional(),
};

export const outputSchema = {
  items: z.array(z.object({
    testPath: z.string(),
    testItemId: z.number(),
  })),
  totalRecords: z.number(),
};
