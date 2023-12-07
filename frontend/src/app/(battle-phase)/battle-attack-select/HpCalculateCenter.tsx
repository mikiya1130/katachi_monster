"use client";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import Centering from "@/components/Centering";

type Props = {
  setState: Dispatch<SetStateAction<"buttonSelect" | "hpCalculate" | "attack">>;
};

const HpCalculateCenter = ({ setState }: Props) => {
  return (
    <Centering p={2} onClick={() => setState("attack")}>
      <Typography
        fontSize="2rem"
        sx={{
          fontWeight: 700,
        }}
      >
        Rock! <br />
        Scissors! <br />
        Paper!
      </Typography>
    </Centering>
  );
};

export default HpCalculateCenter;
