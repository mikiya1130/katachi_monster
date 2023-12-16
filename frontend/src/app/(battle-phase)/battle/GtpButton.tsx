"use client";

import { Button, Stack } from "@mui/material";
import { useState } from "react";

import { State } from "@/app/(battle-phase)/battle/State";
import { TypeHand } from "@/app/(battle-phase)/battle/types";

const images: { url: string; title: TypeHand }[] = [
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
  state: State;
  callbackButtonSelected: (hand: TypeHand) => void;
};

const GtpButton = ({ gtpHeight, state, callbackButtonSelected }: Props) => {
  const [activeButton, setActiveButton] = useState<TypeHand | null>(null);

  const buttonHandler = (buttonTitle: TypeHand) => {
    if (state === "buttonSelect") {
      setActiveButton(buttonTitle);
      callbackButtonSelected(buttonTitle);
    }
  };

  return (
    <Stack direction="row" justifyContent="space-around" pt={1}>
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
