"use client";
import { Box, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import AttackCenter from "@/app/(battle-phase)/battle-attack-select/AttackCenter";
import ButtonSelectCenter from "@/app/(battle-phase)/battle-attack-select/ButtonSelectCenter";
import Field from "@/app/(battle-phase)/battle-attack-select/Field";
import GtpButton from "@/app/(battle-phase)/battle-attack-select/GtpButton";
import HpCalculateCenter from "@/app/(battle-phase)/battle-attack-select/HpCalculateCenter";
import { axios } from "@/axios";

const BattleAttackSelect = () => {
  const searchParams = useSearchParams();

  const [monsterIdSelf, setMonsterIdSelf] = useState<string>("1");
  const [monsterIdOpponent, setMonsterIdOpponent] = useState<string>("1");
  const [imageSelf, setImageSelf] = useState<string>("");
  const [imageOpponent, setImageOpponent] = useState<string>("");

  const gtpRef = useRef<HTMLDivElement>(null);
  const [gtpHeight, setGtpHeight] = useState<number>(0);

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

  const hp = 100;

  const [outcome, setOutcome] = useState<"win" | "lose" | "draw" | null>("win");

  const [state, setState] = useState<"buttonSelect" | "hpCalculate" | "attack">(
    "buttonSelect",
  );

  useEffect(() => {
    const monsterIdSelf = searchParams.get("monsterIdSelf") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterIdSelf(monsterIdSelf);

    const monsterIdOpponent = searchParams.get("monsterIdOpponent") ?? "2"; // TODO: パラメータない時の処理を実装する
    setMonsterIdOpponent(monsterIdOpponent);

    axios.get(`monster/${monsterIdSelf}`).then((res) => {
      setImageSelf(res.data.base64image);
    });

    axios.get(`monster/${monsterIdOpponent}`).then((res) => {
      setImageOpponent(res.data.base64image);
    });
  }, [searchParams]);

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
