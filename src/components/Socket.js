import { io } from "socket.io-client";
import { PRODUCTION } from "../config.js";

const server =
  process.env.REACT_APP_ENV === PRODUCTION
    ? process.env.REACT_APP_SOCKET_API_URL
    : "http://localhost:3005";
console.log("Socket Server-->", server);
export const socket = io(server, { autoConnect: false });
