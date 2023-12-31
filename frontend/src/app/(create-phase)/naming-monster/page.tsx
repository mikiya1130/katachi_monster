/**
 * /naming-monster?monsterId=${monsterId}
 */
"use client";
import { Button, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";

const NamingMonster = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");
  const [image, setImage] = useState<string>("");
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const locale = useLocale();

  const invalidInputValue = inputValue.length < 1 || inputValue.length > 10;

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);
    axios.get(`monster/${monsterId}/creating`).then((res) => {
      setImage(res.data.base64image);
    });
  }, [searchParams]);

  useEffect(() => {
    setIsButtonDisabled(invalidInputValue);
  }, [invalidInputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNextClick = () => {
    if (invalidInputValue) return;

    setIsButtonDisabled(true);
    axios
      .post(`monster/${monsterId}`, { name: inputValue })
      .then(() => {
        router.push("/mode-select");
      })
      .catch(() => {
        setIsButtonDisabled(invalidInputValue);
      });
  };

  return (
    <Centering p={4} spacing={4}>
      <Text fontSize="2rem">{locale.NamingMonster.message}</Text>
      <Image
        src={image}
        alt="monster"
        maxHeight="30%" // NOTE: 値の調整注意
        width="100%"
      />
      <TextField
        id="filled-basic"
        label={locale.NamingMonster.monsterName}
        variant="filled"
        value={inputValue}
        sx={{ maxWidth: "13rem" }} // NOTE: Max10文字が入る大きさ
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // エンターキー押下時の処理
            handleNextClick();
          }
        }}
      />
      <Button
        variant="contained"
        disabled={isButtonDisabled}
        onClick={handleNextClick}
      >
        {locale.NamingMonster.next}
      </Button>
    </Centering>
  );
};

export default NamingMonster;
