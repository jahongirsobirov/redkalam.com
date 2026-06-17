import { io } from "socket.io-client";

// https://redkalam.com
// http://localhost:3000
export const socket = io("http://localhost:3000", {
    autoConnect: true,
    transports: ["websocket", "polling"],
    withCredentials: true
});