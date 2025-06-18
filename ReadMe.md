## Description

This repo was created to show the issue I have trying to integrate aci.dev into a mastra agent. I added a weather agent to show it works with ordinary MCP server.

For convinence, I added an express route to make it easy to all.

## Getting started

To get started, run this in your terminal:

```
npm i
npm run dev
```

This will install the necessary packages and start out the dev server.

Unless, a server port is configured, the server should be running on port 5000.

No, you can make `POST` request to the endpoint. Eg for the weather agent, it would be:

```
http://localhost:5000/api/weather/generate

const sampleBodyJSONPayload = `
{
    "messages": [
        {
            "role": "user",
            "content": "What is the weather in London?"
        }
    ],
    "userConfig": {
        "apiKey": "15b1e002fc78426fb20170852251706" //feel free to use this API.
    }
}
`

```

For ACI, it would be:

```
http://localhost:5000/api/aci/generate

const sampleBodyJSONPayload = `
{
    "messages": [
        {
            "role": "user",
            "content": "What are you capable of?"
        }
    ]
}
`
```

Preview ReadMe!
