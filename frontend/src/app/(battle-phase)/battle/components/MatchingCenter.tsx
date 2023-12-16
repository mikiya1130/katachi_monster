"use client";
import { Typography } from "@mui/material";

import Centering from "@/components/Centering";

const MatchingCenter = () => {
  return (
    <Centering p={2}>
      <Typography
        fontSize="2rem"
        sx={{
          fontWeight: 700,
        }}
      >
        VS
      </Typography>
    </Centering>
  );
};

export default MatchingCenter;
