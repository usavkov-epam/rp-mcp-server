import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";

import configs from "./configs";
import mcpServer from "./mcp/server";

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  console.error(`📨 New MCP request: ${req.method} ${req.url}`);

  res.on("close", () => transport.close());

  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = Number(configs.port || 3003);
app.listen(port, () => {
  console.error(`✅ MCP server running at http://localhost:${port}/mcp`);
});