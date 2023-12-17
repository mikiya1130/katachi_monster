"use client";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

import Field from "@/app/(battle-phase)/(battle)/battle/Field";
import { BattleContext } from "@/app/(battle-phase)/(battle)/layout";
import Centering from "@/components/Centering";

const BattleResult = () => {
  const { winner } = useContext(BattleContext);

  return (
    <Link href="/mode-select" style={{ textDecoration: "none" }}>
      {winner && winner.monster && (
        <Stack
          p={4}
          spacing={0}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Box sx={{ height: "30%", width: "100%" }}>
            <Centering p={2}>
              <Typography
                fontSize="2rem"
                color={winner.isSelf ? "red" : "blue"}
                sx={{
                  fontWeight: 700,
                }}
              >
                Winner!
              </Typography>
            </Centering>
          </Box>

          <Field
            height="30%"
            color={winner.isSelf ? "red" : "blue"}
            monster={winner.monster}
            isSelf={winner.isSelf ?? true}
          />

          <Box sx={{ height: "30%", width: "100%" }}>
            <Centering p={2}>
              <Typography
                fontSize="2rem"
                color={"red"}
                sx={{
                  fontWeight: 700,
                }}
              >
                {winner.isSelf
                  ? "You played exceptionally well!"
                  : "Your time will come for victory!"}
              </Typography>
            </Centering>
          </Box>

          <Box sx={{ height: "10%", width: "100%" }}>
            <Centering p={2}>
              <Typography
                fontSize="2rem"
                sx={{
                  fontWeight: 700,
                }}
              >
                Touch to Play Again
              </Typography>
            </Centering>
          </Box>
        </Stack>
      )}
    </Link>
  );
};

export default BattleResult;
