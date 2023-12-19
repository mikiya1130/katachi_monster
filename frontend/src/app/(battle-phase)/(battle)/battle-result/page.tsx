"use client";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import Field from "@/app/(battle-phase)/(battle)/battle/Field";
import { BattleContext } from "@/app/(battle-phase)/(battle)/layout";
import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";

const BattleResult = () => {
  const { winner } = useContext(BattleContext);
  const locale = useLocale();
  const router = useRouter();

  if (!winner) {
    // リロードで context が消えた時
    router.push("/mode-select");
  }

  return (
    <Link
      href="/mode-select"
      style={{ color: "inherit", textDecoration: "none" }}
    >
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
                sx={{ fontWeight: 700 }}
              >
                {winner.isSelf
                  ? locale.BattleResult.titleWinner
                  : locale.BattleResult.titleLoser}
              </Typography>
            </Centering>
          </Box>

          <Field
            height="30%"
            color="red"
            monster={winner.monster}
            isSelf={true}
          />

          <Box sx={{ height: "30%", width: "100%" }}>
            <Centering p={2}>
              <Typography fontSize="2rem" sx={{ fontWeight: 700 }}>
                {winner.isSelf
                  ? locale.BattleResult.messageWinner
                  : locale.BattleResult.messageLoser}
              </Typography>
            </Centering>
          </Box>

          <Box sx={{ height: "10%", width: "100%" }}>
            <Centering p={2}>
              <Typography fontSize="1.5rem" sx={{ fontWeight: 700 }}>
                {locale.BattleResult.touchMassage}
              </Typography>
            </Centering>
          </Box>
        </Stack>
      )}
    </Link>
  );
};

export default BattleResult;
