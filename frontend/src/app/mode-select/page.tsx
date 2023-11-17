"use client";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const ModeSelect = () => {
  const title = "モードせんたく";

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
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={10}
        width={"50%"}
      >
        <Link href={`/level-select`}>
          <Button variant="outlined">モンスターをつくる</Button>
        </Link>

        <Link href={`/player-lobby`}>
          <Button variant="contained">たたかう</Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default ModeSelect;
