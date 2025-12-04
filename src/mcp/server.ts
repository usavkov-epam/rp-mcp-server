import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";

import registerGetItemsToInvestigateTool from "./tools/get_test_items_to_investigate";
import registerGetLaunchesTool from "./tools/get_launches";
import z from "zod";
import { getItemsToInvestigate } from "../report-portal/services";

export const mcpServer = new McpServer({
  name: "folio-report-portal-mcp-server",
  version: "1.0.0",
});

// ========== TOOLS ==========

/* Launch */
registerGetLaunchesTool(mcpServer);

/* Item */
registerGetItemsToInvestigateTool(mcpServer);

// ===========================

// ========= PROMPTS =========
mcpServer.registerPrompt(
  "run-failed-cypress-tests-locally",
  {
    title: "Run Cypress Tests",
    description: "Run Cypress tests for items marked for investigation",
    argsSchema: {
      name: completable(
        z.string(),
        (value) => ['runNightlyCypressEurekaTests', 'folioQualityGates'].filter(t => t.toLowerCase().includes(value.toLowerCase()))
      ).describe("Test to run"),
      team: completable(
        z.string(),
        (value) => ["Thunderjet", "Spitfire", "Firebird", "Corsair", "Folijet", "Vega", "Volaris"].filter(t => t.toLowerCase().includes(value.toLowerCase()))
      ).describe("Team to filter tests by"),
    },
  },
  async ({ name, team }) => {
    try {
      const { testPaths } = await getItemsToInvestigate({ name, team });

      if (!testPaths || testPaths.length === 0) {
        return {
          messages: [
            {
              role: "assistant",
              content: { type: "text", text: `No test paths found for team: ${team || "any"}` },
            },
          ],
        };
      }

      const specArg = testPaths.join(",");
      const command = `npx cypress run --spec "${specArg}" --headless --quiet`;

      return {
        messages: [
          {
            role: "user",
            content: { type: "text", text: `Running ${testPaths.length} Cypress test(s) for team: ${team || "all"}` },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: "Executing command:\n" + command,
            },
          },
        ],
      };
    } catch (error: any) {
      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Error running Cypress: ${error.message}`,
            },
          },
        ],
      };
    }
  },
)

// ===========================

export default mcpServer;
