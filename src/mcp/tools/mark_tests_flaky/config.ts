import { inputSchema, outputSchema } from "./schema";

export default {
  title: "Mark passed tests as flaky",
  description: "Mark tests that passed as flaky in ReportPortal",
  inputSchema,
  outputSchema,
};
