import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import { User, createRoomCallback, enterRoomCallback } from "./types";

const app = express();
const server = http.createServer(app);
console.log("cors arrow origin:", process.env.FRONTEND_ORIGIN);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN },
});

const PORT = 3333;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const users: { [userId: string]: User } = {};

const rooms = () => io.of("/").adapter.rooms;

const getRoom = (roomId: string) => rooms().get(roomId) ?? new Set();

const enterRoom = (roomId: string, socket: Socket) => {
  const userId = socket.id;
  users[userId] = {
    roomId: roomId,
    image: "",
    name: "",
    hp: 100,
    gu: 0,
    choki: 0,
    pa: 0,
  };
  socket.join(roomId);
  console.log("rooms", rooms());
  console.log("users", users);
};

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("createRoom", (callback: createRoomCallback) => {
    let roomId = "";
    const maxRetry = 100;
    for (let i = 0; i < maxRetry; i++) {
      roomId = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0");
      if (!rooms().has(roomId)) {
        enterRoom(roomId, socket);
        callback("success", roomId);
        return;
      }
    }
    callback("error", roomId);
  });

  socket.on("enterRoom", (roomId: string, callback: enterRoomCallback) => {
    if (getRoom(roomId).size >= 2) {
      callback("error");
      return;
    }
    enterRoom(roomId, socket);
    callback("success");
    io.to(roomId).emit("matching");
  });

  socket.on("sendSelfImage", (image: string) => {
    const userId = socket.id;
    const roomId = users[userId]["roomId"];
    const opponentId = Array.from(getRoom(roomId)).find((id) => id !== userId);
    users[userId]["image"] = image;

    if (opponentId === undefined) {
      console.error("opponentId is not found");
      return;
    }

    if (users[opponentId]["image"] !== "") {
      // 相手画像の取得
      socket.emit("receiveOpponentImage", users[opponentId]["image"]);
    }
    // 自身の画像を相手に送信
    socket.broadcast.to(roomId).emit("receiveOpponentImage", image);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    console.log("rooms", rooms());
  });
});
