"use client";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Field from "@/app/(battle-phase)/battle-attack-select/Field";
import { axios } from "@/axios";
import Centering from "@/components/Centering";

const BattleResult = () => {
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

  const [outcome, setOutcome] = useState<"win" | "lose" | null>("lose"); //最終的な勝敗

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
    <Link href="/mode-select" style={{ textDecoration: "none" }}>
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
              color={outcome === "win" ? "red" : "blue"}
              sx={{
                fontWeight: 700,
              }}
            >
              Winner!
            </Typography>
          </Centering>
        </Box>

        <Field
          height="30%"
          color={outcome === "win" ? "red" : "blue"}
          monsterName="Opponent monster name"
          monsterImage={outcome === "win" ? imageSelf : imageOpponent}
          isSelf={outcome === "win" ? true : false}
        />

        <Box sx={{ height: "30%", width: "100%" }}>
          <Centering p={2}>
            <Typography
              fontSize="2rem"
              color={"red"}
              sx={{
                fontWeight: 700,
              }}
            >
              {outcome === "win"
                ? "You played exceptionally well!"
                : "Your time will come for victory!"}
            </Typography>
          </Centering>
        </Box>

        <Box sx={{ height: "10%", width: "100%" }}>
          <Centering p={2}>
            <Typography
              fontSize="2rem"
              sx={{
                fontWeight: 700,
              }}
            >
              Touch to Play Again
            </Typography>
          </Centering>
        </Box>
      </Stack>
    </Link>
  );
};

export default BattleResult;
