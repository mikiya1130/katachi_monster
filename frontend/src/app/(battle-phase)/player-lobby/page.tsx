"use client";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";

const PlayerLobby = () => {
  const locale = useLocale();

  return (
    <Centering p={4} spacing={10}>
      <Typography fontSize="2rem">{locale.PlayerLobby.title}</Typography>
      <Link href="/create-room">
        <Button variant="outlined">{locale.PlayerLobby.createRoom}</Button>
      </Link>
      <Link href="/enter-room">
        <Button variant="contained">{locale.PlayerLobby.enterRoom}</Button>
      </Link>
    </Centering>
  );
};

export default PlayerLobby;
