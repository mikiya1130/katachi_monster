"use client";
import { Button, CircularProgress, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import { useSocket } from "@/components/SocketProvider";

const EnterRoom = () => {
  const router = useRouter();
  const socket = useSocket();
  const locale = useLocale();
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

  const handleSubmit = () => {
    if (socket) {
      setIsButtonRoading(true);
      socket.emit("enterRoom", roomId, (status: string) => {
        if (status === "success") {
          console.log("enterRoom");
        } else {
          console.error("enterRoom");
          setIsButtonRoading(false);
        }
      });

      socket.on("matching", () => {
        router.push("/monster-select");
      });
    }
  };

  return (
    <Centering p={4} spacing={10}>
      <Typography fontSize="2rem">{locale.EnterRoom.message}</Typography>

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
  );
};

export default EnterRoom;
