"use client";
import { Typography } from "@mui/material";

import Centering from "@/components/Centering";

const ButtonSelectCenter = () => {
  return (
    <Centering p={2}>
      <Typography
        fontSize="2rem"
        sx={{
          fontWeight: 700,
        }}
      >
        Choose a button!
      </Typography>
    </Centering>
  );
};

export default ButtonSelectCenter;
