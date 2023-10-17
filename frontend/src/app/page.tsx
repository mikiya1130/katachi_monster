"use client";
import { Stack, ThemeProvider, useMediaQuery } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { maxWidth } from "@/consts";
import { titleFont } from "@/theme";

const Home = () => {
  const title = "カタチモンスター";
  const titleMessage = "タッチしてスタート";
  const width = useMediaQuery(titleFont.breakpoints.up(maxWidth))
    ? `${titleFont.breakpoints.values[maxWidth]}px`
    : "100vw";
  const logoScale = 0.9;
  const messageScale = 0.6;

  return (
    <Link
      href="/level-select"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Stack
        justifyContent="space-around"
        textAlign="center"
        sx={{ height: "100%" }}
      >
        <ThemeProvider theme={titleFont}>
          <Typography
            variant="h1"
            sx={{
              fontSize: `calc(${width} * ${logoScale} / ${title.length})`,
              fontWeight: 700,
              textShadow: "0 0 5px",
            }}
          >
            {title}
          </Typography>
        </ThemeProvider>
        <Typography
          variant="body1"
          sx={{
            fontSize: `calc(${width} * ${messageScale} / ${titleMessage.length})`,
          }}
        >
          {titleMessage}
        </Typography>
      </Stack>
    </Link>
  );
};

export default Home;
