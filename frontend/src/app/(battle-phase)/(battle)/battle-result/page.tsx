"use client";
import Link from "next/link";
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
    if (!winner) {
      // リロードで context が消えた時
      router.push("/mode-select");
    }
  }, [router, winner]);

  return (
    <Link
      href="/mode-select"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      {winner && winner.monster && (
        <Centering
          p={4}
          alignItems="center"
          justifyContent="space-evenly"
          height="100%"
        >
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
        </Centering>
      )}
    </Link>
  );
};

export default BattleResult;
