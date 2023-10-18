"use client";

import { useMediaQuery } from "@mui/material";

import Camera from "@/app/take-picture/Camera";
import { maxWidth } from "@/consts";
import theme from "@/theme";

const TakePicture = () => {
  const width = useMediaQuery(theme.breakpoints.up(maxWidth))
    ? `${theme.breakpoints.values[maxWidth]}px`
    : "100vw";

  return <Camera width={width} height="100svh" />;
};

export default TakePicture;
