"use client";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/LocaleProvider";
import { useSocket } from "@/components/SocketProvider";

const EnterRoom = () => {
  const router = useRouter();
  const socket = useSocket();
  const locale = useLocale();
  const title = locale.EnterRoom.message;
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

      <TextField
        id="room-id"
        label="ID:"
        variant="filled"
        value={roomId}
        type="text"
        onChange={handleInputChange}
        sx={{ maxWidth: "10rem" }}
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
    </Stack>
  );
};

export default EnterRoom;
