
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { MCPClient } from "@mastra/mcp";

// NEW WAY (getToolsets - requires custom endpoint)
const weatherAgent = new Agent({
    name: "Weather Agent",
    instructions: `You are a helpful weather assistant. You can:
    - Get current weather information for any city
    - Provide air quality data
    - Give detailed weather conditions including temperature, humidity, and wind speed
    
    Always use the weather tools to get accurate, real-time weather data.`,
    model: openai("gpt-4o-mini"),
    // No tools here - they come dynamically
});

// Custom function to handle requests with toolsets
export async function handleWeatherRequest(messages, userConfig) {
    console.log({ userConfigApiKey: userConfig?.apiKey, scope: "handleWeatherRequest" });
    const mcp = new MCPClient({
        servers: {
            weather: {
                command: "npx",
                args: ["-y", "@swonixs/weatherapi-mcp"],
                env: {
                    WEATHER_API_KEY: userConfig?.apiKey || process.env.WEATHER_API_KEY
                }
            }
        }
    });

    try {
        const toolsets = await mcp.getToolsets();

        const response = await weatherAgent.generate(messages, {
            toolsets, // Pass toolsets per request
            maxSteps: 3
        });

        return response;
    } finally {
        await mcp.disconnect();
    }
}