
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { MCPClient } from "@mastra/mcp";

// NEW WAY (getToolsets - requires custom endpoint)
const aciAgent = new Agent({
    name: "General purpose Agent",
    instructions: `You are a helpful assistant with access to a variety of tools.`,
    model: openai("gpt-4o-mini"),
    // No tools here - they come dynamically
});

// Custom function to handle requests with toolsets
export async function handleACIRequest(messages, userConfig) {

    console.log({ userConfigUserId: userConfig?.userId });
    const mcp = new MCPClient({
        timeout: 60000,
        servers: {
            "aci-mcp-unified": {
                "command": "uvx",
                "args": ["aci-mcp", "unified-server", "--linked-account-owner-id", "user01", "--allowed-apps-only"],
                "env": {
                    "ACI_API_KEY": "AGENT_API_KEY_HERE", // Replace with your actual API key
                }
            },
        }
    });

    try {
        const toolsets = await mcp.getToolsets();

        const response = await aciAgent.generate(messages, {
            toolsets, // Pass toolsets per request
            maxSteps: 3
        });

        return response;
    } finally {
        await mcp.disconnect();
    }
}