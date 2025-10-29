import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import mcpServer from "./mcp/server";

async function main() {
  console.error("Starting MCP server in stdio mode...");

  const transport = new StdioServerTransport();

  await mcpServer.connect(transport);

  console.error("MCP stdio server running. Use inspector to interact.");
}

main().catch(err => {
  console.error("Stdio server crashed:", err);
  process.exit(1);
});