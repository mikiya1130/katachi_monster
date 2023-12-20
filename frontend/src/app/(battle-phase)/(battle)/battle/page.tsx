"use client";
import { Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import Center from "@/app/(battle-phase)/(battle)/battle/Center";
import Field, { FieldRef } from "@/app/(battle-phase)/(battle)/battle/Field";
import GtpButton from "@/app/(battle-phase)/(battle)/battle/GtpButton";
import { State } from "@/app/(battle-phase)/(battle)/battle/State";
import sleep from "@/app/(battle-phase)/(battle)/battle/sleep";
import {
  TypeMonster,
  TypeOutcome,
} from "@/app/(battle-phase)/(battle)/battle/types";
import { BattleContext } from "@/app/(battle-phase)/(battle)/layout";
import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import { useLocale } from "@/components/LocaleProvider";
import Message, { MessageRef } from "@/components/Message";
import { useSocket } from "@/components/SocketProvider";
import { images, initialHP } from "@/consts";
import { TypeHand } from "@/types";

const BattleAttackSelect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const socket = useSocket();
  const locale = useLocale();
  const messageRef = useRef<MessageRef>(null);

  const [state, setState] = useState<State>("matching");

  const [monsterSelf, setMonsterSelf] = useState<TypeMonster | null>(null);
  const [monsterOpponent, setMonsterOpponent] = useState<TypeMonster | null>(
    null,
  );
  const fieldSelfRef = useRef<FieldRef>(null);
  const fieldOpponentRef = useRef<FieldRef>(null);

  const gtpRef = useRef<HTMLDivElement>(null);
  const [gtpHeight, setGtpHeight] = useState<number>(0);

  const [selfHand, setSelfHand] = useState<TypeHand>("gu");
  const [opponentHand, setOpponentHand] = useState<TypeHand>("gu");
  const [outcome, setOutcome] = useState<TypeOutcome>("win");
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const { setWinner } = useContext(BattleContext);

  useEffect(() => {
    if (gtpRef.current) {
      setGtpHeight(
        Math.min(
          gtpRef.current.clientHeight,
          (gtpRef.current.clientWidth - 10) / images.length,
        ),
      );
    }
  }, [gtpRef]);

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    axios.get(`monster/${monsterId}/user_monster`).then((res) => {
      setMonsterSelf({
        base64image: res.data.base64image,
        name: res.data.name,
        hp: initialHP,
        gu: res.data.gu,
        choki: res.data.choki,
        pa: res.data.pa,
      });
    });
  }, [searchParams]);

  const error = useCallback(async () => {
    console.error("battle-interrupt");
    messageRef.current?.call({
      type: "error",
      message: locale.BattleAttackSelect.errorMessage,
    });
    await sleep(3000);
  }, [locale.BattleAttackSelect.errorMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMonsterOpponent", (monsterOpponent: TypeMonster) => {
      setMonsterOpponent(monsterOpponent);
    });

    socket.on("updateHp", async (results) => {
      const selfResult = results[socket.id];
      const opponentResult =
        results[Object.keys(results).find((id) => id !== socket.id) ?? ""];

      const isComplete = selfResult.hp <= 0 || opponentResult.hp <= 0;
      setIsComplete(isComplete);
      if (isComplete) {
        if (!monsterSelf) return;
        setWinner({
          isSelf: selfResult.hp > 0,
          monster: { ...monsterSelf, hp: selfResult.hp },
        });
      }

      setSelfHand(selfResult.hand);
      setOpponentHand(opponentResult.hand);
      setState("attack/viewHand");
      await sleep(3000);

      setOutcome(selfResult.outcome);
      setState("attack/viewText");
      fieldSelfRef.current?.updateHp(selfResult.hp);
      fieldOpponentRef.current?.updateHp(opponentResult.hp);
      await sleep(3000);

      if (isComplete) {
        socket.disconnect();
        router.replace("/battle-result");
      } else {
        setState("buttonSelect");
      }
    });

    socket.on("battle-interrupt", () => {
      if (!isComplete) {
        error().then(() => {
          router.replace("/mode-select");
        });
      }
    });

    return () => {
      socket.off("receiveMonsterOpponent");
      socket.off("updateHp");
      socket.off("battle-interrupt");
    };
  }, [error, isComplete, monsterSelf, router, setWinner, socket]);

  useEffect(() => {
    if (!socket) return;

    if (state === "matching") {
      if (monsterSelf) {
        console.log("monsterSelf", monsterSelf);
        socket.emit("sendMonsterSelf", monsterSelf);
      }
    }
  }, [monsterSelf, socket, state]);

  useEffect(() => {
    if (state === "matching") {
      if (monsterOpponent) {
        (async () => {
          setState("start");
          await sleep(2000);
          setState("buttonSelect");
        })();
      }
    }
  }, [monsterOpponent, state]);

  const handleButtonSelected = async (hand: TypeHand) => {
    if (!socket) return;

    setState("hpCalculate");
    await sleep(1000);
    socket.emit("sendHandSelf", hand);
  };

  return (
    <>
      <Centering p={4} spacing={0}>
        <Field
          height="30%"
          color="blue"
          monster={monsterOpponent}
          isSelf={false}
          ref={fieldOpponentRef}
        />

        <Box sx={{ height: "30%", width: "100%" }}>
          {state === "matching" && <Center>VS</Center>}
          {state === "start" && (
            <Center>{locale.BattleAttackSelect.startMessage}</Center>
          )}
          {state === "buttonSelect" && (
            <Center>{locale.BattleAttackSelect.buttonSelectMessage}</Center>
          )}
          {state === "hpCalculate" && (
            <Center style={{ whiteSpace: "pre-wrap" }}>
              {locale.BattleAttackSelect.battleCry}
            </Center>
          )}
          {state === "attack/viewHand" && (
            <Box p={2} height="100%">
              <Centering position="relative">
                <Image
                  position="absolute"
                  top={0}
                  src={`images/${opponentHand}.png`}
                  alt={opponentHand}
                  height="40%"
                  objectFit="contain"
                  sx={{ borderRadius: "50%" }}
                />
                <Image
                  position="absolute"
                  bottom={0}
                  src={`images/${selfHand}.png`}
                  alt={selfHand}
                  height="40%"
                  objectFit="contain"
                  sx={{ borderRadius: "50%" }}
                />
              </Centering>
            </Box>
          )}
          {state === "attack/viewText" &&
            (outcome === "win" ? (
              <Center color="red">
                {locale.BattleAttackSelect.succsessfulMessage}
              </Center>
            ) : outcome === "lose" ? (
              <Center color="blue">
                {locale.BattleAttackSelect.failedMessage}
              </Center>
            ) : (
              outcome === "draw" && (
                <Center color="black">
                  {locale.BattleAttackSelect.drawMessage}
                </Center>
              )
            ))}
        </Box>

        <Field
          height="30%"
          color="red"
          monster={monsterSelf}
          isSelf={true}
          ref={fieldSelfRef}
        />

        <Box ref={gtpRef} sx={{ height: "10%", width: "100%" }} mt={1}>
          <GtpButton
            gtpHeight={gtpHeight}
            state={state}
            callbackButtonSelected={handleButtonSelected}
          />
        </Box>
      </Centering>
      <Message ref={messageRef} />
    </>
  );
};

export default BattleAttackSelect;
