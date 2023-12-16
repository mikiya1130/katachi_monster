"use client";
import { Typography } from "@mui/material";

import Centering from "@/components/Centering";

type Props = {
  text: string;
};

const TextCenter = ({ text }: Props) => {
  return (
    <Centering p={2}>
      <Typography
        fontSize="2rem"
        sx={{
          fontWeight: 700,
        }}
      >
        {text}
      </Typography>
    </Centering>
  );
};

export default TextCenter;
