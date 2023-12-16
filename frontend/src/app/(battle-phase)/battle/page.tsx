"use client";
import { Box, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Center from "@/app/(battle-phase)/battle/Center";
import Field from "@/app/(battle-phase)/battle/Field";
import GtpButton from "@/app/(battle-phase)/battle/GtpButton";
import { State } from "@/app/(battle-phase)/battle/State";
import sleep from "@/app/(battle-phase)/battle/sleep";
import {
  TypeHand,
  TypeMonster,
  TypeOutcome,
} from "@/app/(battle-phase)/battle/types";
import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import { useSocket } from "@/components/SocketProvider";

const BattleAttackSelect = () => {
  const searchParams = useSearchParams();
  const socket = useSocket();

  const [monsterSelf, setMonsterSelf] = useState<TypeMonster | null>(null);
  const [monsterOpponent, setMonsterOpponent] = useState<TypeMonster | null>(
    null,
  );

  const gtpRef = useRef<HTMLDivElement>(null);
  const [gtpHeight, setGtpHeight] = useState<number>(0);

  const [selfHand, setSelfHand] = useState<TypeHand>("gu");
  const [opponentHand, setOpponentHand] = useState<TypeHand>("gu");
  const [outcome, setOutcome] = useState<TypeOutcome>("win");
  const [state, setState] = useState<State>("matching");

  const images = [
    {
      url: "images/gu.png",
      title: "gu",
    },
    {
      url: "images/choki.png",
      title: "choki",
    },
    {
      url: "images/pa.png",
      title: "pa",
    },
  ];

  useEffect(() => {
    if (gtpRef.current) {
      setGtpHeight(
        Math.min(
          gtpRef.current.clientHeight,
          (gtpRef.current.clientWidth - 10) / images.length,
        ),
      );
    }
  }, [gtpRef, images.length]);

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    axios.get(`monster/${monsterId}/user_monster`).then((res) => {
      setMonsterSelf({
        base64image: res.data.base64image,
        name: res.data.name,
        hp: 100,
        gu: res.data.gu,
        choki: res.data.choki,
        pa: res.data.pa,
      });
    });
  }, [searchParams]);

  useEffect(() => {
    if (state === "matching") {
      if (monsterSelf && socket) {
        console.log("monsterSelf", monsterSelf);
        socket.on("receiveMonsterOpponent", (monsterOpponent: TypeMonster) => {
          setMonsterOpponent(monsterOpponent);
        });

        socket.emit("sendMonsterSelf", monsterSelf);
      }
    }
  }, [monsterSelf, socket, state]);

  useEffect(() => {
    if (state === "matching") {
      (async () => {
        if (monsterOpponent) {
          setState("start");
          await sleep(2000);
          setState("buttonSelect");
        }
      })();
    }
  }, [monsterOpponent, state]);

  const handleButtonSelected = async (hand: TypeHand) => {
    setState("hpCalculate");
    await sleep(1000);

    socket?.on("updateHp", async (results) => {
      const selfResult = results[socket.id];
      const opponentResult =
        results[Object.keys(results).find((id) => id !== socket.id) ?? ""];

      setSelfHand(selfResult.hand);
      setOpponentHand(opponentResult.hand);
      setState("attack/viewHand");
      await sleep(3000);

      setOutcome(selfResult.outcome);
      setState("attack/viewText");
      setMonsterSelf((prev) => {
        if (prev) {
          return { ...prev, hp: selfResult.hp };
        }
        return null;
      });
      setMonsterOpponent((prev) => {
        if (prev) {
          return { ...prev, hp: opponentResult.hp };
        }
        return null;
      });
      await sleep(3000);

      setState("buttonSelect");
    });

    socket?.emit("sendHandSelf", hand);
  };

  return (
    <Stack
      p={4}
      spacing={0}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Field
        height="30%"
        color="blue"
        monster={monsterOpponent}
        isSelf={false}
      />

      <Box sx={{ height: "30%", width: "100%" }}>
        {state === "matching" && <Center>VS</Center>}
        {state === "start" && <Center>Battle start!!</Center>}
        {state === "buttonSelect" && <Center>Choose a button!</Center>}
        {state === "hpCalculate" && (
          <Center>
            Rock! <br /> Scissors! <br /> Paper!
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
                objectFit="contain"
                sx={{ borderRadius: "50%", height: "40%" }}
              />
              <Image
                position="absolute"
                bottom={0}
                src={`images/${selfHand}.png`}
                alt={selfHand}
                objectFit="contain"
                sx={{ borderRadius: "50%", height: "40%" }}
              />
            </Centering>
          </Box>
        )}
        {state === "attack/viewText" &&
          (outcome === "win" ? (
            <Center color="red">Attack successful!</Center>
          ) : outcome === "lose" ? (
            <Center color="blue">Attack failed!</Center>
          ) : (
            outcome === "draw" && (
              <Center color="black">It&lsquo;s a draw</Center>
            )
          ))}
      </Box>

      <Field height="30%" color="red" monster={monsterSelf} isSelf={true} />

      <Box ref={gtpRef} sx={{ height: "10%", width: "100%" }} pt="5px">
        <GtpButton
          gtpHeight={gtpHeight}
          state={state}
          callbackButtonSelected={handleButtonSelected}
        />
      </Box>
    </Stack>
  );
};

export default BattleAttackSelect;
