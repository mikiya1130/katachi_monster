"use client";
import { CircularProgress, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const CreateRoom = () => {
  const title = "へやをつくる";
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (!socket) {
      setSocket(io(process.env.NEXT_PUBLIC_WEBSOCKET_ORIGIN || ""));
    }

    if (socket) {
      socket.on("connect", () => {
        socket.emit("createRoom", (status: string, roomId: string) => {
          if (status === "success") {
            setRoomId(roomId);
          } else {
            // TODO: エラー処理実装
            console.log("error");
          }
        });
      });
    }
  }, [socket, roomId]);

  return (
    <Stack
      p={4}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography fontSize="2rem" align="left">
        {title}
      </Typography>

      {roomId ? (
        <Typography fontSize="2rem" align="left">
          ID:{roomId}
        </Typography>
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};

export default CreateRoom;
