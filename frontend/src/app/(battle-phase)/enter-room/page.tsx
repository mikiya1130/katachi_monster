"use client";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const EnterRoom = () => {
  const router = useRouter();
  const title = "へやにはいる";
  const [isButtonRoading, setIsButtonRoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (!socket) {
      setSocket(io(process.env.NEXT_PUBLIC_WEBSOCKET_ORIGIN || ""));
    }

    if (socket) {
      socket.on("connect", () => {
        setIsButtonRoading(false);
      });
    }
  }, [socket, roomId]);

  // テキストフィールドの入力が4桁の数字のみ許可する
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 正規表現を使用して4桁の数字のみ許可
    if (/^\d{0,4}$/.test(value)) {
      setRoomId(value);
    }
  };

  const handleSubmit = () => {
    if (socket === null) return;
    setIsButtonRoading(true);
    socket.emit("enterRoom", roomId, (status: string) => {
      if (status === "success") {
        router.push("/monster-select");
      } else {
        setIsButtonRoading(false);
        // TODO: エラー処理実装
        console.log("error");
      }
    });
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
          けってい
        </Button>
      )}
    </Stack>
  );
};

export default EnterRoom;
