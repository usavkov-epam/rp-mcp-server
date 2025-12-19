import { z } from "zod";

export const inputSchema = {
  testItemIds: z.array(z.number())
    .describe("Array of test item IDs to mark as flaky")
    .min(1, "At least one test item ID is required"),
};

export const outputSchema = {
  success: z.boolean(),
  updatedCount: z.number(),
};
