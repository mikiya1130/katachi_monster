"use client";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const PlayerLobby = () => {
  const title = "たたかうじゅんび";

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
      <Link href={``}>
        <Button variant="outlined">たいせんするへやをつくる</Button>
      </Link>

      <Link href={``}>
        <Button variant="contained">たいせんするへやにはいる</Button>
      </Link>
    </Stack>
  );
};

export default PlayerLobby;
