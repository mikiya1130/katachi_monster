"use client";

import { useMediaQuery } from "@mui/material";
import Typography from "@mui/material/Typography";

import { maxWidth, titleMessage } from "@/consts";
import { titleFont } from "@/theme";

const TitleMessage = () => {
  const width = useMediaQuery(titleFont.breakpoints.up(maxWidth))
    ? `${titleFont.breakpoints.values[maxWidth]}px`
    : "100vw";
  const scale = 0.6;

  return (
    <Typography
      variant="body1"
      sx={{
        fontSize: `calc(${width} * ${scale} / ${titleMessage.length})`,
      }}
    >
      {titleMessage}
    </Typography>
  );
};

export default TitleMessage;
