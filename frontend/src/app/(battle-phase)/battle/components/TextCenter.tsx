"use client";
import { Typography } from "@mui/material";

import Centering from "@/components/Centering";

type Props = {
  children: React.ReactNode;
};

const TextCenter = ({ children }: Props) => {
  return (
    <Centering p={2}>
      <Typography
        fontSize="2rem"
        sx={{
          fontWeight: 700,
        }}
      >
        {children}
      </Typography>
    </Centering>
  );
};

export default TextCenter;
