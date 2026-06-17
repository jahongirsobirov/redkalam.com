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
import { Redis } from "ioredis";

export const publisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

export const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

console.log(
    "REDIS HOST:",
    process.env.REDIS_HOST ? "OK" : "MISSING"
);

console.log(
    "REDIS PORT:",
    process.env.REDIS_PORT ? "OK" : "MISSING"
);