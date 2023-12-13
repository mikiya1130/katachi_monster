"use client";

import { Button, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

const images: { url: string; title: "gu" | "choki" | "pa" }[] = [
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

type Props = {
  gtpHeight: number;
  state: "buttonSelect" | "hpCalculate" | "attack";
  setState: Dispatch<SetStateAction<"buttonSelect" | "hpCalculate" | "attack">>;
  setSelfHand: Dispatch<SetStateAction<"gu" | "choki" | "pa">>;
};

const GtpButton = ({ gtpHeight, state, setState, setSelfHand }: Props) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const buttonHandler = (buttonTitle: "gu" | "choki" | "pa") => {
    setActiveButton(buttonTitle);
    setSelfHand(buttonTitle);
    //TODO: バックエンドに出した手を送る
    setState("hpCalculate"); //送信出来たら別の画面に移る
  };

  return (
    <Stack direction="row" justifyContent="space-between" pt={1}>
      {images.map((image) => (
        <Button
          key={image.title}
          onClick={() => buttonHandler(image.title)}
          sx={{
            height: gtpHeight,
            width: gtpHeight,
            backgroundImage: `url(${image.url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            borderRadius: "50%",
            visibility:
              state === "buttonSelect" ||
              (state === "hpCalculate" && activeButton === image.title)
                ? "visible"
                : "hidden",
          }}
        />
      ))}
    </Stack>
  );
};

export default GtpButton;
