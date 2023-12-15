const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.Server(app);
console.log("process.env.FRONTEND_ORIGIN", process.env.FRONTEND_ORIGIN);
const io = socketIo(server, { cors: { origin: process.env.FRONTEND_ORIGIN } });

const PORT = 3333;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("server: connected");
});
