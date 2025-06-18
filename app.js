// Or if using Express.js
import 'dotenv/config'
import rateLimit from "express-rate-limit"

import express from "express";
import bodyParser from 'body-parser'
import cors from 'cors';
import { handleWeatherRequest } from './weatherAgent.js';
import { handleACIRequest } from './aciDev.js';

const app = express();


const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
// Apply the rate limiting middleware to all requests
app.use(limiter)

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
    cors({
        origin: "*", // <-- location of the react app were connecting to
        methods: ['GET', 'POST'],
    })
);


const payloadSample = `
{
    "messages": [
        {
            "role": "user",
            "content": "What is the weather in London?"
        }
    ],
    "userConfig": {
        "apiKey": "15b1e002fc78426fb20170852251706"
    }
}
`

app.post('/api/weather/generate', async (req, res) => {
    try {
        const { messages, userConfig } = req.body;
        const response = await handleWeatherRequest(messages, userConfig);
        res.json({ text: response.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/aci/generate', async (req, res) => {
    try {
        const { messages, userConfig } = req.body;
        const response = await handleACIRequest(messages, userConfig);
        res.json({ text: response.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.NODE_PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

