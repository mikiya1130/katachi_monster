"use client";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import Field from "@/app/(battle-phase)/(battle)/battle/Field";
import { BattleContext } from "@/app/(battle-phase)/(battle)/layout";
import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";

const BattleResult = () => {
  const { winner } = useContext(BattleContext);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (winner && winner.isSelf) {
      intervalId = setInterval(() => {
        confetti({
          spread: 1000,
          startVelocity: 15,
          origin: { x: 0.5, y: 0.1 },
        });
      }, 2000);
    }

    return () => {
      confetti.reset();
      clearInterval(intervalId);
    };
  }, [winner]);

  useEffect(() => {
    if (!winner) {
      // リロードで context が消えた時
      router.replace("/mode-select");
    }
  }, [router, winner]);

  return (
    <Centering
      p={4}
      alignItems="center"
      justifyContent="space-evenly"
      height="100%"
      onClick={() => router.replace("/mode-select")}
    >
      {winner && winner.monster && (
        <>
          <Text
            fontSize="2rem"
            fontWeight={700}
            color={winner.isSelf ? "red" : "blue"}
          >
            {winner.isSelf
              ? locale.BattleResult.titleWinner
              : locale.BattleResult.titleLoser}
          </Text>

          <Field
            height="30%"
            color="red"
            monster={winner.monster}
            isSelf={true}
          />

          <Text fontSize="2rem" fontWeight={700}>
            {winner.isSelf
              ? locale.BattleResult.messageWinner
              : locale.BattleResult.messageLoser}
          </Text>

          <Text fontSize="1.5rem" fontWeight={700}>
            {locale.BattleResult.touchMassage}
          </Text>
        </>
      )}
    </Centering>
  );
};

export default BattleResult;
