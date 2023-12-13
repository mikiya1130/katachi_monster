"use client";

import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Centering from "@/components/Centering";
import Image from "@/components/Image";

type Props = {
  setState: Dispatch<SetStateAction<"buttonSelect" | "hpCalculate" | "attack">>;
  outcome: "win" | "lose" | "draw" | null;
  selfHand: "gu" | "choki" | "pa";
  opponentHand: "gu" | "choki" | "pa";
};

const AttackCenter = ({ setState, outcome, selfHand, opponentHand }: Props) => {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    //３秒後に勝敗を表示
    const timer = setTimeout(() => {
      setShowFirst(false);
    }, 3000);

    // 6秒後にsetStateで状態をbuttonSelectに変更
    const secondTimer = setTimeout(() => {
      setState("buttonSelect");
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [setState]);

  return (
    <Box height="100%">
      {showFirst ? (
        <Box p={2} height="100%">
          <Centering position="relative">
            <Image
              position="absolute"
              top={0}
              src={`images/${opponentHand}.png`}
              alt={`${opponentHand}`}
              objectFit="contain"
              sx={{ borderRadius: "50%", height: "40%" }}
            />
            <Image
              position="absolute"
              bottom={0}
              src={`images/${selfHand}.png`}
              alt={`${selfHand}`}
              objectFit="contain"
              sx={{ borderRadius: "50%", height: "40%" }}
            />
          </Centering>
        </Box>
      ) : outcome === "win" ? (
        <Centering p={2}>
          <Typography
            fontSize="2rem"
            sx={{
              fontWeight: 700,
              color: "red",
            }}
          >
            Attack successful!
          </Typography>
        </Centering>
      ) : outcome === "lose" ? (
        <Centering p={2}>
          <Typography
            fontSize="2rem"
            sx={{
              fontWeight: 700,
              color: "blue",
            }}
          >
            Attack failed!
          </Typography>
        </Centering>
      ) : (
        outcome === "draw" && (
          <Centering p={2}>
            <Typography
              fontSize="2rem"
              sx={{
                fontWeight: 700,
              }}
            >
              It&lsquo;s a draw
            </Typography>
          </Centering>
        )
      )}
    </Box>
  );
};

export default AttackCenter;
