import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

import { getItemsToInvestigate } from '../../../report-portal/services';
import { default as config } from './config';

export default function registerGetItemsToInvestigateTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get_test_items_to_investigate",
    config,
    async ({ name, team }) => {
      const {
        data: items,
        totalRecords,
        testPaths,
      } = await getItemsToInvestigate({ name, team });
      console.error('Items retrieved in MCP tool:', items, totalRecords);
      const structured = { testPaths };

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
}
