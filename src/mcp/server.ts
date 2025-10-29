import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getLaunchesTool } from "./tools/launches.tool";

export const mcpServer = new McpServer({
  name: "folio-report-portal-mcp-server",
  version: "1.0.0",
});

mcpServer.registerTool(
  "get_launches",
  {
    title: "Get recent launches",
    description: "Fetch recent launches from ReportPortal",
    inputSchema: {
      limit: z.number()
        .min(1)
        .max(100)
        .default(5)
        .describe("Number of launches to fetch"),
    },
    outputSchema: {
      launches: z.array(z.object({
        id: z.number(),
        name: z.string(),
        number: z.number(),
        status: z.string(),
        startTime: z.number(),
        endTime: z.number().optional(),
      })),
    },
  },
  async ({ limit }) => {
    const launches = await getLaunchesTool(limit);
    console.error('Launches retrieved in MCP tool:', launches);
    const structured = { launches };
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(structured, null, 2),
        },
      ],
      structuredContent: structured,
    };
  }
);

export default mcpServer;
