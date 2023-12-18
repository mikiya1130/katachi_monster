"use client";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { useLocale } from "@/components/LocaleProvider";

const PlayerLobby = () => {
  const local = useLocale();
  const title = local.PlayerLobby.title;

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
      <Link href={`/create-room`}>
        <Button variant="outlined">{local.PlayerLobby.createRoom}</Button>
      </Link>

      <Link href={`/enter-room`}>
        <Button variant="contained">{local.PlayerLobby.enterRoom}</Button>
      </Link>
    </Stack>
  );
};

export default PlayerLobby;
