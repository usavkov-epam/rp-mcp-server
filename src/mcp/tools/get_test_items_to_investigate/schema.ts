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
  // items: z.array(z.object({
  //   id: z.number(),
  //   uuid: z.string(),
  //   name: z.string(),
  //   status: z.string(),
  //   startTime: z.number(),
  //   endTime: z.number().optional(),
  //   codeRef: z.string().optional(),
  //   testCaseId: z.string().optional(),
  // })),
  // totalRecords: z.number(),
  testPaths: z.array(z.string()),
};
