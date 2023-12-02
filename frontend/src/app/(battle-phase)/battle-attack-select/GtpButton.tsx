"use client";

import { Button, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

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

type Props = {
  gtpHeight: number;
  state: "buttonSelect" | "hpCalculate" | "attack";
  setState: Dispatch<SetStateAction<"buttonSelect" | "hpCalculate" | "attack">>;
};

const GtpButton = ({ gtpHeight, state, setState }: Props) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const buttonHandler = (buttonTitle: string) => {
    setActiveButton(buttonTitle);
    setState("hpCalculate");
  };

  return (
    <Stack direction="row" justifyContent="space-between">
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
