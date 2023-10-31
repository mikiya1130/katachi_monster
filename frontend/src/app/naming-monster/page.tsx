"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useState } from "react";

import Image from "@/components/Image";

const NamingMonster = () => {
  const message = "なまえをつけよう";

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isButtonDisabled = inputValue.length < 1 || inputValue.length > 10;

  return (
    <Stack
      p={4}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography fontSize="2rem" align="center">
        {message}
      </Typography>

      <Image
        src={"../../../images/animal_black_sheep_hitsuji.png"}
        alt={"monster"}
        width={`50%`}
      />

      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        sx={{
          "& > :not(style)": { m: 1, width: "13rem" },
        }}
      >
        <TextField
          id="filled-basic"
          label="モンスターのなまえ"
          variant="filled"
          value={inputValue}
          onChange={handleInputChange}
        />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          disabled={isButtonDisabled}
          // onClick={handleNextClick}
        >
          つぎへ
        </Button>
      </Box>
    </Stack>
  );
};

export default NamingMonster;
