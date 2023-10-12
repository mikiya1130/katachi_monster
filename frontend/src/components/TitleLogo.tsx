"use client";

import { useMediaQuery } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";

import { maxWidth, title } from "@/consts";
import { titleFont } from "@/theme";

const TitleLogo = () => {
  const width = useMediaQuery(titleFont.breakpoints.up(maxWidth))
    ? `${titleFont.breakpoints.values[maxWidth]}px`
    : "100vw";
  const scale = 0.9;

  return (
    <ThemeProvider theme={titleFont}>
      <Typography
        variant="h1"
        sx={{
          fontSize: `calc(${width} * ${scale} / ${title.length})`,
          fontWeight: 700,
          textShadow: "0 0 5px",
        }}
      >
        {title}
      </Typography>
    </ThemeProvider>
  );
};

export default TitleLogo;
