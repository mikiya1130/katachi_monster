"use client";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import Message, { MessageRef } from "@/components/Message";
import { useSocket } from "@/components/SocketProvider";
import Text from "@/components/Text";

const EnterRoom = () => {
  const router = useRouter();
  const socket = useSocket();
  const locale = useLocale();
  const messageRef = useRef<MessageRef>(null);
  const [isButtonRoading, setIsButtonRoading] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (socket) {
      setIsButtonRoading(false);
    }
  }, [socket]);

  // テキストフィールドの入力が4桁の数字のみ許可する
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 正規表現を使用して4桁の数字のみ許可
    if (/^\d{0,4}$/.test(value)) {
      setRoomId(value);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("matching", () => {
      router.push("/monster-select");
    });

    return () => {
      socket.off("matching");
    };
  }, [router, socket]);

  const handleSubmit = () => {
    if (!socket) return;

    setIsButtonRoading(true);
    socket.emit("enterRoom", roomId, (status: string) => {
      if (status === "success") {
        console.log("enterRoom");
      } else {
        console.error("enterRoom");
        messageRef.current?.call({
          type: "error",
          message: locale.EnterRoom.errorMessage,
        });
        setIsButtonRoading(false);
      }
    });
  };

  return (
    <>
      <Centering p={4} spacing={10}>
        <Text fontSize="2rem">{locale.EnterRoom.message}</Text>

        <TextField
          id="room-id"
          label="ID:"
          variant="filled"
          value={roomId}
          type="text"
          inputProps={{ inputMode: "numeric" }}
          onChange={handleInputChange}
          sx={{ maxWidth: "10rem" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // エンターキー押下時の処理
              handleSubmit();
            }
          }}
        />

        {isButtonRoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            disabled={roomId.length !== 4}
            onClick={handleSubmit}
          >
            {locale.EnterRoom.confirmButton}
          </Button>
        )}
      </Centering>
      <Message ref={messageRef} />
    </>
  );
};

export default EnterRoom;
