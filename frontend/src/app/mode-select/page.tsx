"use client";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";

const ModeSelect = () => {
  const locale = useLocale();

  return (
    <Centering p={4} spacing={10}>
      <Typography fontSize="2rem">{locale.ModeSelect.title}</Typography>
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={10}
        width="50%"
      >
        <Link href="/level-select">
          <Button variant="outlined">
            {locale.ModeSelect.labelLevelSelect}
          </Button>
        </Link>

        <Link href="/player-lobby">
          <Button variant="contained">
            {locale.ModeSelect.labelPlayerLobby}
          </Button>
        </Link>
      </Stack>
    </Centering>
  );
};

export default ModeSelect;
