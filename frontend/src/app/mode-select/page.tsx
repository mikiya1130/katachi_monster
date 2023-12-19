"use client";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { useLocale } from "@/components/LocaleProvider";

const ModeSelect = () => {
  const locale = useLocale();

  return (
    <Stack
      p={4}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
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
    </Stack>
  );
};

export default ModeSelect;
