import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve("server/.env")
});

import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import {dbConnection} from "./src/config/db.js";
import {errorHandler} from "./src/middlewares/error.middleware.js";
import authRouter from "./src/routes/auth.routes.js";
import AuthVerify from "auth-verify";
import Anthropic from "@anthropic-ai/sdk";
import userRouter from "./src/routes/user.routes.js";
import {Server} from "socket.io";
import {subscriber} from "./src/config/redispubsub.js";

const app = express();

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100 // limit each IP to 100 requests
});

export const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

dbConnection();

app.set("trust proxy", 1);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const auth = new AuthVerify({})

app.get('/', (req, res) => {
    res.json({"Working": true});
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// https://redkalam.com
// http://localhost:3000
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

subscriber.subscribe("essay-completed");

subscriber.on("message", (channel, message) => {
    if(channel === "essay-completed") {

        const data = JSON.parse(message);

        io.to(data.userId).emit(
            "essay-completed",
            data
        );
    }
});

io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
    });

});

console.log(process.env.JWT_SECRET ?? "undefined");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "OK" : "MISSING");
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

export const google = auth.oauth.google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
});

export const resendApiKey = process.env.RESEND_API_KEY;