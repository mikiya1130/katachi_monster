"use client";
import { CircularProgress, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSocket } from "@/components/SocketProvider";

const CreateRoom = () => {
  const router = useRouter();
  const socket = useSocket();
  const title = "へやをつくる";
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (socket && !roomId) {
      socket.emit("createRoom", (status: string, roomId: string) => {
        if (status === "success") {
          setRoomId(roomId);
        } else {
          // TODO: エラー処理実装
          console.log("error: createRoom");
        }
      });

      socket.on("matching", () => {
        router.push("/monster-select");
      });
    }
  }, [socket, roomId, router]);

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
