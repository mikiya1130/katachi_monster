"use client";
import { Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useState } from "react";

import Centering from "@/components/Centering";
import Image from "@/components/Image";

const NamingMonster = () => {
  const message = "なまえをつけよう";

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isButtonDisabled = inputValue.length < 1 || inputValue.length > 10;

  return (
    <Centering p={4} spacing={4}>
      <Typography fontSize="2rem">{message}</Typography>
      <Image
        src="../../../images/animal_black_sheep_hitsuji.png"
        alt="monster"
        maxHeight="30%" // NOTE: 値の調整注意
        width="100%"
      />
      <TextField
        id="filled-basic"
        label="モンスターのなまえ"
        variant="filled"
        value={inputValue}
        sx={{ maxWidth: "13rem" }} // NOTE: Max10文字が入る大きさ
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        disabled={isButtonDisabled}
        // onClick={handleNextClick}
      >
        つぎへ
      </Button>
    </Centering>
  );
};

export default NamingMonster;
