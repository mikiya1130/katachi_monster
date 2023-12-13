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

  const [selfHp, setSelfHp] = useState<number>(50); //NOTE: 自分のHP
  const [opponentHp, setOpponentHp] = useState<number>(50); //NOTE: 相手ののHP

  const [selfGuScore, setSelfGuScore] = useState<number>(50); //NOTE: 自分のグーのスコア
  const [selfChokiScore, setSelfChokiScore] = useState<number>(50); //NOTE: 自分のチョキのスコア
  const [selfPaScore, setSelfPaScore] = useState<number>(50); //NOTE: 自分のパーのスコア

  const [opponentGuScore, setOpponentGuScore] = useState<number>(50); //NOTE: 相手のグーのスコア
  const [opponentChokiScore, setOpponentChokiScore] = useState<number>(50); //NOTE: 相手のチョキのスコア
  const [opponentPaScore, setOpponentPaScore] = useState<number>(50); //NOTE: 相手のパーのスコア

  const [outcome, setOutcome] = useState<"win" | "lose" | "draw" | null>("win"); // NOTE: 自分の勝敗
  const [selfHand, setSelfHand] = useState<"gu" | "choki" | "pa">("gu"); // NOTE: 自分の手
  const [opponentHand, setOpponentHand] = useState<"gu" | "choki" | "pa">("gu"); // NOTE: 相手の手

  const [state, setState] = useState<"buttonSelect" | "hpCalculate" | "attack">(
    "buttonSelect",
  );

  //読み込み時にバックエンドからデータを取ってくる
  useEffect(() => {
    setSelfHp(100);
    setOpponentHp(100);

    setSelfGuScore(10);
    setSelfChokiScore(20);
    setSelfPaScore(30);

    setOpponentGuScore(11);
    setOpponentChokiScore(21);
    setOpponentPaScore(22);

    setOutcome("win");
    setSelfHand("gu");
    setOpponentHand("choki");
  }, []);

  useEffect(() => {
    const monsterIdSelf = searchParams.get("monsterIdSelf") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterIdSelf(monsterIdSelf);

    const monsterIdOpponent = searchParams.get("monsterIdOpponent") ?? "2"; // TODO: パラメータない時の処理を実装する
    setMonsterIdOpponent(monsterIdOpponent);

    axios.get(`monster/${monsterIdSelf}/user_monster`).then((res) => {
      setImageSelf(res.data.base64image);
    });

    axios.get(`monster/${monsterIdOpponent}/user_monster`).then((res) => {
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
        hp={opponentHp}
        guSore={opponentGuScore}
        chokiScore={opponentChokiScore}
        paScore={opponentPaScore}
      />

      <Box sx={{ height: "30%", width: "100%" }}>
        {state === "buttonSelect" && <ButtonSelectCenter />}
        {state === "hpCalculate" && <HpCalculateCenter setState={setState} />}
        {state === "attack" && (
          <AttackCenter
            setState={setState}
            outcome={outcome}
            selfHand={selfHand}
            opponentHand={opponentHand}
          />
        )}
      </Box>

      <Field
        height="30%"
        color="red"
        monsterName="Self monster name"
        monsterImage={imageSelf}
        isSelf={true}
        hp={selfHp}
        guSore={selfGuScore}
        chokiScore={selfChokiScore}
        paScore={selfPaScore}
      />

      <Box ref={gtpRef} sx={{ height: "10%", width: "100%" }} pt="5px">
        <GtpButton
          gtpHeight={gtpHeight}
          state={state}
          setState={setState}
          setSelfHand={setSelfHand}
        />
      </Box>
    </Stack>
  );
};

export default BattleAttackSelect;
