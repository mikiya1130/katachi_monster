import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import {
  Hand,
  Monster,
  User,
  createRoomCallback,
  enterRoomCallback,
} from "./types";

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
  users[userId] = { roomId: roomId, monster: null, hand: null };
  socket.join(roomId);
  console.log("rooms", rooms());
  console.log("users", users);
};

const calculateGTP = (
  userHand: Hand,
  opponentHand: Hand,
  userMonster: Monster,
  opponentMonster: Monster,
): [Monster, Monster] => {
  if (userHand === opponentHand) {
    return [userMonster, opponentMonster];
  } else if (userHand === "gu") {
    if (opponentHand === "choki") {
      opponentMonster.hp -= userMonster.gu;
    } else {
      userMonster.hp -= opponentMonster.pa;
    }
  } else if (userHand === "choki") {
    if (opponentHand === "pa") {
      opponentMonster.hp -= userMonster.choki;
    } else {
      userMonster.hp -= opponentMonster.gu;
    }
  } else if (userHand === "pa") {
    if (opponentHand === "gu") {
      opponentMonster.hp -= userMonster.pa;
    } else {
      userMonster.hp -= opponentMonster.choki;
    }
  }
  userMonster.hp = Math.max(userMonster.hp, 0);
  opponentMonster.hp = Math.max(opponentMonster.hp, 0);
  return [userMonster, opponentMonster];
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
    if (getRoom(roomId).size !== 1) {
      callback("error");
      return;
    }
    enterRoom(roomId, socket);
    callback("success");
    io.to(roomId).emit("matching");
  });

  socket.on("sendMonsterSelf", (monster: Monster) => {
    const userId = socket.id;
    const roomId = users[userId].roomId;
    const opponentId = Array.from(getRoom(roomId)).find((id) => id !== userId);
    users[userId].monster = monster;

    if (opponentId === undefined) {
      console.error("opponentId is not found");
      return;
    }

    if (users[opponentId].monster) {
      // 相手画像の取得
      socket.emit("receiveMonsterOpponent", users[opponentId].monster);
      // 自身の画像を相手に送信
      socket.broadcast.to(roomId).emit("receiveMonsterOpponent", monster);
    }
  });

  socket.on("sendHandSelf", (hand: Hand) => {
    const userId = socket.id;
    const roomId = users[userId].roomId;
    const opponentId = Array.from(getRoom(roomId)).find((id) => id !== userId);
    users[userId].hand = hand;

    if (opponentId === undefined) {
      console.error("opponentId is not found");
      return;
    }

    const opponentHand = users[opponentId].hand;
    const userMonster = users[userId].monster;
    const opponentMonster = users[opponentId].monster;
    if (opponentHand && userMonster && opponentMonster) {
      // じゃんけん計算
      const [newUserMonster, newOpponentMonster] = calculateGTP(
        hand,
        opponentHand,
        userMonster,
        opponentMonster,
      );
      // 更新
      users[userId].monster = newUserMonster;
      users[opponentId].monster = newOpponentMonster;
      users[userId].hand = null;
      users[opponentId].hand = null;
      // 結果を送信
      io.sockets.in(roomId).emit("updateHp", {
        [userId]: newUserMonster.hp,
        [opponentId]: newOpponentMonster.hp,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    console.log("rooms", rooms());
  });
});