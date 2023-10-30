"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

import Image from "@/components/Image";

const NamingMonster = () => {
  const message = "なまえをつけよう";

  // const width = useMediaQuery(theme.breakpoints.up(maxWidth))
  //   ? `${theme.breakpoints.values[maxWidth]}px`
  //   : "100vw";

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Stack p={4}>
      <Typography fontSize="2rem" align="center">
        {message}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Image
          // key={monster.id}
          // src={monster.base64image}
          // alt={`monster_${monster.id}`}
          src={"../../../images/animal_black_sheep_hitsuji.png"}
          alt={"monster"}
          p={1}
          width={`50%`}
        />
      </Box>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        alignItems="center"
        justifyContent="center"
        pt={4}
        sx={{
          "& > :not(style)": { m: 1, width: "80%" },
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
      <Box display="flex" alignItems="center" justifyContent="center" pt={1}>
        <Link href={`次のリンク`}>
          <Button variant="contained">つぎへ</Button>
        </Link>
      </Box>
    </Stack>
  );
};

export default NamingMonster;
