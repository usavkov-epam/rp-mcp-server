import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import z from "zod";

import { getItemsToInvestigate } from "../report-portal/services";
import registerGetItemsToInvestigateTool from "./tools/get_test_items_to_investigate";
import registerGetLaunchesTool from "./tools/get_launches";
import registerMarkTestsFlakyTool from "./tools/mark_tests_flaky";

export const mcpServer = new McpServer({
  name: "folio-report-portal-mcp-server",
  version: "1.0.0",
});

// ========== TOOLS ==========

/* Launch */
registerGetLaunchesTool(mcpServer);

/* Item */
registerGetItemsToInvestigateTool(mcpServer);
registerMarkTestsFlakyTool(mcpServer);

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

mcpServer.registerPrompt(
  'investigate-and-mark-flaky-tests',
  {
    title: "Investigate and Mark Flaky Tests from Report Portal",
    description: "A workflow to investigate failing tests from Report Portal by running them locally and marking passed ones as flaky",
    argsSchema: {
      team: z.string().describe('Team identifier (e.g., Volaris, Thunderjet, Spitfire, Firebird, Corsair, Folijet, Vega)'),
      launchName: z.string().optional().describe('Name of the test launch to investigate (default: runNightlyCypressEurekaTests)'),
    },
  },
  async ({ 
    team, 
    launchName = "runNightlyCypressEurekaTests",
  }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
Using #rp-folio-mcp-server 
1. Get recent ${launchName} tests marked for investigation for the ${team} team.
2. Run Cypress for these tests in Chrome. Wait for the run to complete.
3. Mark passed tests (that were failing in the ${launchName}) as flaky.
`,
          },
        },
      ],
    };
  }
);

// ===========================

export default mcpServer;
