//NOTE:勝敗の計算をするときに真ん中に表示される待機画面

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
      {/*
        //現状：クリックしたら"attack"という状態にする
          理想：勝敗がバックエンドから帰ってきたら"attack"という状態にする}
      */}
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
