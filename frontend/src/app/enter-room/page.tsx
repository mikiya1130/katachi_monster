"use client";
import { Button, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";

const EnterRoom = () => {
  const title = "へやにはいる";
  const [inputValue, setInputValue] = useState("");

  // テキストフィールドの入力が4桁の数字のみ許可する
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 正規表現を使用して4桁の数字のみ許可
    if (/^\d{0,4}$/.test(value)) {
      setInputValue(value);
    }
  };

  return (
    <Stack
      p={4}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography fontSize="2rem" align="left">
        {title}
      </Typography>

      <TextField
        id="room-id"
        label="ID:"
        variant="filled"
        value={inputValue}
        type="text"
        onChange={handleInputChange}
        sx={{ maxWidth: "10rem" }}
      />

      <Link href={`/対戦部屋`}>
        <Button variant="contained">けってい</Button>
      </Link>
    </Stack>
  );
};

export default EnterRoom;
