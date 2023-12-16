"use client";
import { Box, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Field from "@/app/(battle-phase)/battle/Field";
import GtpButton from "@/app/(battle-phase)/battle/GtpButton";
import { State } from "@/app/(battle-phase)/battle/State";
import AttackCenter from "@/app/(battle-phase)/battle/components/AttackCenter";
import ButtonSelectCenter from "@/app/(battle-phase)/battle/components/ButtonSelectCenter";
import HpCalculateCenter from "@/app/(battle-phase)/battle/components/HpCalculateCenter";
import MatchingCenter from "@/app/(battle-phase)/battle/components/MatchingCenter";
import { axios } from "@/axios";
import { useSocket } from "@/components/SocketProvider";

const BattleAttackSelect = () => {
  const searchParams = useSearchParams();
  const socket = useSocket();

  const [imageSelf, setImageSelf] = useState<string>("");
  const [imageOpponent, setImageOpponent] = useState<string>("");

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
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    axios.get(`monster/${monsterId}/user_monster`).then((res) => {
      setImageSelf(res.data.base64image);
    });
  }, [searchParams]);

  useEffect(() => {
    if (imageSelf !== "" && socket) {
      socket.on("receiveOpponentImage", (imageOpponent: string) => {
        setImageOpponent(imageOpponent);
      });

      socket.emit("sendSelfImage", imageSelf);
    }
  }, [imageSelf, socket]);

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
        monsterName="Opponent monster name"
        monsterImage={imageOpponent}
        isSelf={false}
      />

      <Box sx={{ height: "30%", width: "100%" }}>
        {state === "matching" && <MatchingCenter />}
        {state === "buttonSelect" && <ButtonSelectCenter />}
        {state === "hpCalculate" && <HpCalculateCenter setState={setState} />}
        {state === "attack" && (
          <AttackCenter setState={setState} outcome={outcome} />
        )}
      </Box>

      <Field
        height="30%"
        color="red"
        monsterName="Self monster name"
        monsterImage={imageSelf}
        isSelf={true}
      />

      <Box ref={gtpRef} sx={{ height: "10%", width: "100%" }} pt="5px">
        <GtpButton gtpHeight={gtpHeight} state={state} setState={setState} />
      </Box>
    </Stack>
  );
};

export default BattleAttackSelect;
