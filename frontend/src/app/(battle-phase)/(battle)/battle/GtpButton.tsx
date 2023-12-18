"use client";

import { Button, Stack } from "@mui/material";
import { useState } from "react";

import { State } from "@/app/(battle-phase)/(battle)/battle/State";
import { images } from "@/consts";
import { TypeHand, TypeImage } from "@/types";

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
      {images.map(({ url, hand }: TypeImage) => (
        <Button
          key={hand}
          onClick={() => buttonHandler(hand)}
          sx={{
            height: gtpHeight,
            width: gtpHeight,
            backgroundImage: `url(${url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            borderRadius: "50%",
            visibility:
              state === "buttonSelect" ||
              (state === "hpCalculate" && activeButton === hand)
                ? "visible"
                : "hidden",
          }}
        />
      ))}
    </Stack>
  );
};

export default GtpButton;
