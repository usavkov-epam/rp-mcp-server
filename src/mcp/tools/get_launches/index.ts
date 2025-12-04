import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

import { default as config } from './config';
import { getLaunches } from '../../../report-portal/services';

export default function registerGetLaunchesTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get_launches",
    config,
    async ({ limit }) => {
      const { data: launches } = await getLaunches({ limit });
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
    });
};
