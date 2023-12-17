"use client";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import { maxWidth } from "@/consts";
import { titleFont } from "@/theme";

const Home = () => {
  const locale = useLocale();
  const title = locale.Home.title;
  const titleMessage = locale.Home.titleMessage;
  const width = useMediaQuery(titleFont.breakpoints.up(maxWidth))
    ? `${titleFont.breakpoints.values[maxWidth]}px`
    : "100vw";
  const logoScale = 0.9;
  const messageScale = 0.6;

  return (
    <Link
      href="/mode-select"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Centering justifyContent="space-around">
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
      </Centering>
    </Link>
  );
};

export default Home;
