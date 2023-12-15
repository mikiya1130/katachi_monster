"use client";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";

const CreateRoom = () => {
  const title = "へやをつくる";
  const ID = 1234;

  const handleConnect = () => {
    console.log("clicked");
    console.log("WEBSOCKET_ORIGIN:", process.env.NEXT_PUBLIC_WEBSOCKET_ORIGIN);
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_ORIGIN || "");
    socket.on("connect", () => {
      console.log("client: connected");
    });
  };

  return (
    <Stack
      p={4}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      height="100%"
      onClick={handleConnect}
    >
      <Typography fontSize="2rem" align="left">
        {title}
      </Typography>

      <Typography fontSize="2rem" align="left">
        ID:{ID}
      </Typography>
    </Stack>
  );
};

export default CreateRoom;
