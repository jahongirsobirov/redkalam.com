import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /var/www/redkalam/server/.env
// server/.env
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});
import Anthropic from "@anthropic-ai/sdk";

export const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

console.log(
    "ANTHROPIC:",
    process.env.ANTHROPIC_API_KEY ? "OK" : "MISSING"
);

