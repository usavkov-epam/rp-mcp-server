import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

import { markTestsAsFlaky } from '../../../report-portal/services';
import { default as config } from './config';

export default function registerMarkTestsFlakyTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "mark_tests_flaky",
    config,
    async ({ testItemIds }) => {
      console.error('Marking tests as flaky in MCP tool:', testItemIds);
      const { success, updatedCount } = await markTestsAsFlaky({ testItemIds });
      
      console.error('Tests marked as flaky:', updatedCount);
      
      const structured = { success, updatedCount };

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
