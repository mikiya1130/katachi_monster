"use client";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import { useSocket } from "@/components/SocketProvider";
import Text from "@/components/Text";

const CreateRoom = () => {
  const router = useRouter();
  const socket = useSocket();
  const locale = useLocale();
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (!socket) return;

    socket.on("matching", () => {
      router.push("/monster-select");
    });

    return () => {
      socket.off("matching");
    };
  }, [router, socket]);

  useEffect(() => {
    if (!socket) return;
    if (roomId) return;

    socket.emit("createRoom", (status: string, roomId: string) => {
      if (status === "success") {
        setRoomId(roomId);
      } else {
        // TODO: エラー処理実装
        console.error("createRoom");
      }
    });
  }, [socket, roomId, router]);

  return (
    <Centering p={4} spacing={10}>
      <Text fontSize="2rem">{locale.CreateRoom.message}</Text>

      {roomId ? (
        <Text fontSize="2rem">ID: {roomId}</Text>
      ) : (
        <CircularProgress />
      )}
    </Centering>
  );
};

export default CreateRoom;
