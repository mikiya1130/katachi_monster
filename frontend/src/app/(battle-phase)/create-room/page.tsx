"use client";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

const CreateRoom = () => {
  const title = "へやをつくる";
  const ID = 1234;

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

      <Typography fontSize="2rem" align="left">
        ID:{ID}
      </Typography>
    </Stack>
  );
};

export default CreateRoom;
