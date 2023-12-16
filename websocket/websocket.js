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

const rooms = () => io.of("/").adapter.rooms;

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("createRoom", (callback) => {
    let roomId = "";
    const maxRetry = 100;
    for (let i = 0; i < maxRetry; i++) {
      roomId = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0");
      if (!rooms().has(roomId)) {
        socket.join(roomId);
        console.log("rooms", rooms());
        callback("success", roomId);
        return;
      }
    }
    callback("error", roomId);
  });

  socket.on("enterRoom", (roomId, callback) => {
    if (!rooms().has(roomId)) {
      callback("error");
      return;
    } else if (rooms().get(roomId).size >= 2) {
      callback("error");
      return;
    }
    socket.join(roomId);
    callback("success");
    console.log("rooms", rooms());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    console.log("rooms", rooms());
  });
});
