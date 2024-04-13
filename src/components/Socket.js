import { io } from "socket.io-client";
import { server } from "../config.js";

console.log(server);
export const socket = io(server, { autoConnect: false });
