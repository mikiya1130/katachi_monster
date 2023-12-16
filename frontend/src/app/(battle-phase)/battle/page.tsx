"use client";
import { Box, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Field from "@/app/(battle-phase)/battle/Field";
import GtpButton from "@/app/(battle-phase)/battle/GtpButton";
import { State } from "@/app/(battle-phase)/battle/State";
import AttackCenter from "@/app/(battle-phase)/battle/components/AttackCenter";
import TextCenter from "@/app/(battle-phase)/battle/components/TextCenter";
import sleep from "@/app/(battle-phase)/battle/sleep";
import { TypeMonster } from "@/app/(battle-phase)/battle/types";
import { axios } from "@/axios";
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

  const [outcome, setOutcome] = useState<"win" | "lose" | "draw" | null>("win");
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
    if (monsterSelf && socket) {
      console.log("monsterSelf", monsterSelf);
      socket.on("receiveMonsterOpponent", (monsterOpponent: TypeMonster) => {
        setMonsterOpponent(monsterOpponent);
      });

      socket.emit("sendMonsterSelf", monsterSelf);
    }
  }, [monsterSelf, socket]);

  useEffect(() => {
    (async () => {
      if (monsterOpponent) {
        setState("start");
        await sleep(3000);
        setState("buttonSelect");
      }
    })();
  }, [monsterOpponent]);

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
        {state === "matching" && <TextCenter text="VS" />}
        {state === "start" && <TextCenter text="Battle start!!" />}
        {state === "buttonSelect" && <TextCenter text="Choose a button!" />}
        {state === "hpCalculate" && (
          <TextCenter text="Rock!<br />Scissors!<br />Paper!" />
        )}
        {state === "attack" && (
          <AttackCenter setState={setState} outcome={outcome} />
        )}
      </Box>

      <Field height="30%" color="red" monster={monsterSelf} isSelf={true} />

      <Box ref={gtpRef} sx={{ height: "10%", width: "100%" }} pt="5px">
        <GtpButton gtpHeight={gtpHeight} state={state} setState={setState} />
      </Box>
    </Stack>
  );
};

export default BattleAttackSelect;
