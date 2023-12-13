"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Field from "@/app/(battle-phase)/battle-attack-select/Field";
import { axios } from "@/axios";
import Centering from "@/components/Centering";

const MatchWaiting = () => {
  const searchParams = useSearchParams();

  const [monsterIdSelf, setMonsterIdSelf] = useState<string>("1");
  const [monsterIdOpponent, setMonsterIdOpponent] = useState<string>("1");
  const [imageSelf, setImageSelf] = useState<string>("");
  const [imageOpponent, setImageOpponent] = useState<string>("");

  const [selfHp, setSelfHp] = useState<number>(50); //NOTE: 自分のHP
  const [opponentHp, setOpponentHp] = useState<number>(50); //NOTE: 相手ののHP

  const [selfGuScore, setSelfGuScore] = useState<number>(50); //NOTE: 自分のグーのスコア
  const [selfChokiScore, setSelfChokiScore] = useState<number>(50); //NOTE: 自分のチョキのスコア
  const [selfPaScore, setSelfPaScore] = useState<number>(50); //NOTE: 自分のパーのスコア

  const [opponentGuScore, setOpponentGuScore] = useState<number>(50); //NOTE: 相手のグーのスコア
  const [opponentChokiScore, setOpponentChokiScore] = useState<number>(50); //NOTE: 相手のチョキのスコア
  const [opponentPaScore, setOpponentPaScore] = useState<number>(50); //NOTE: 相手のパーのスコア

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

  const [matching, setMatching] = useState<boolean>(false); //マッチングしたかどうかを真偽値で入れる変数
  const [battleStart, setBattleStart] = useState<boolean>(false);

  //TODO: 通信が完了したらmatchingをtrueにする
  useEffect(() => {
    setMatching(true);
  }, [matching]);

  //通信完了後
  useEffect(() => {
    if (matching == true) {
      //３秒後にバトルスタートを表示
      const timer = setTimeout(() => {
        setBattleStart(true);
      }, 3000);

      // 6秒後にbattle-attack-selectに遷移
      const secondTimer = setTimeout(() => {
        //TODO: ページ遷移
      }, 6000);

      return () => {
        clearTimeout(timer);
        clearTimeout(secondTimer);
      };
    }
  }, [matching]);

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

  // TODO: 読み込み時にバックエンドからデータを取ってくる
  useEffect(() => {
    setSelfHp(100);
    setOpponentHp(100);

    setSelfGuScore(10);
    setSelfChokiScore(20);
    setSelfPaScore(30);

    setOpponentGuScore(11);
    setOpponentChokiScore(21);
    setOpponentPaScore(22);
  }, []);

  return (
    <Box height="100%">
      {!matching ? (
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
                sx={{
                  fontWeight: 700,
                }}
              >
                あいてがモンスターをえらんでいるよ
              </Typography>
            </Centering>
          </Box>
          <Box sx={{ height: "30%", width: "100%" }}>
            <Centering p={2}>
              <Typography
                fontSize="2rem"
                sx={{
                  fontWeight: 700,
                }}
              >
                VS
              </Typography>
            </Centering>
          </Box>

          <Field
            height="30%"
            color="red"
            monsterName="Self monster name"
            monsterImage={imageSelf}
            isSelf={true}
            guSore={selfGuScore}
            chokiScore={selfChokiScore}
            paScore={selfPaScore}
            hp={selfHp}
          />

          <Box
            ref={gtpRef}
            sx={{ height: "10%", width: "100%" }}
            pt="5px"
          ></Box>
        </Stack>
      ) : battleStart ? (
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
            guSore={opponentGuScore}
            chokiScore={opponentChokiScore}
            paScore={opponentPaScore}
            hp={opponentHp}
          />

          <Box sx={{ height: "30%", width: "100%" }}>
            <Centering p={2}>
              <Typography
                fontSize="2rem"
                sx={{
                  fontWeight: 700,
                }}
              >
                バトルスタート！！
              </Typography>
            </Centering>
          </Box>

          <Field
            height="30%"
            color="red"
            monsterName="Self monster name"
            monsterImage={imageSelf}
            isSelf={true}
            guSore={selfGuScore}
            chokiScore={selfChokiScore}
            paScore={selfPaScore}
            hp={selfHp}
          />

          <Box
            ref={gtpRef}
            sx={{ height: "10%", width: "100%" }}
            pt="5px"
          ></Box>
        </Stack>
      ) : (
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
            guSore={opponentGuScore}
            chokiScore={opponentChokiScore}
            paScore={opponentPaScore}
            hp={opponentHp}
          />

          <Box sx={{ height: "30%", width: "100%" }}>
            <Centering p={2}>
              <Typography
                fontSize="2rem"
                sx={{
                  fontWeight: 700,
                }}
              >
                VS
              </Typography>
            </Centering>
          </Box>

          <Field
            height="30%"
            color="red"
            monsterName="Self monster name"
            monsterImage={imageSelf}
            isSelf={true}
            guSore={selfGuScore}
            chokiScore={selfChokiScore}
            paScore={selfPaScore}
            hp={selfHp}
          />

          <Box
            ref={gtpRef}
            sx={{ height: "10%", width: "100%" }}
            pt="5px"
          ></Box>
        </Stack>
      )}
    </Box>
  );
};

export default MatchWaiting;
