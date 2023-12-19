"use client";
import { Typography } from "@mui/material";
import { CSSProperties } from "react";

import Centering from "@/components/Centering";

type Props = {
  children: React.ReactNode;
  style?: CSSProperties;
  color?: string;
};

const Center = ({ color = "black", style = {}, children }: Props) => {
  return (
    <Centering p={2}>
      <Typography
        fontSize="2rem"
        width="100%"
        align="center"
        sx={{
          fontWeight: 700,
          color: color,
        }}
        style={style}
      >
        {children}
      </Typography>
    </Centering>
  );
};

export default Center;
