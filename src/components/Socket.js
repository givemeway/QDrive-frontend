import { io } from "socket.io-client";
import { server } from "../config.js";

// const URL = process.env.REACT_APP_ENV === "production" ? undefined : server;
console.log(server);
export const socket = io(server, { autoConnect: false });
