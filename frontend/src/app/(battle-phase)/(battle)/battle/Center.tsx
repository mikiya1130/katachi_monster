"use client";
import { Typography } from "@mui/material";

import Centering from "@/components/Centering";

type Props = {
  children: React.ReactNode;
  color?: string;
};

const Center = ({ color = "black", children }: Props) => {
  return (
    <Centering p={2}>
      <Typography
        fontSize="2rem"
        sx={{
          fontWeight: 700,
          color: color,
        }}
      >
        {children}
      </Typography>
    </Centering>
  );
};

export default Center;
