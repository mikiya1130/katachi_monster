"use client";
import { Box, Button, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Field from "@/app/(battle-phase)/battle-attack-select/Field";
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
        monsterName="あいてのモンスターのなまえ"
        monsterImage={imageOpponent}
        isSelf={false}
      />

      <Box sx={{ height: "30%", width: "100%" }}></Box>

      <Field
        height="30%"
        color="red"
        monsterName="じぶんのモンスターのなまえ"
        monsterImage={imageSelf}
        isSelf={true}
      />

      <Box ref={gtpRef} sx={{ height: "10%", width: "100%" }} pt="5px">
        <Stack direction="row" justifyContent="space-between">
          {images.map((image) => (
            <Button
              key={image.title}
              sx={{
                height: gtpHeight,
                width: gtpHeight,
                backgroundImage: `url(${image.url})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                borderRadius: "50%",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default BattleAttackSelect;
