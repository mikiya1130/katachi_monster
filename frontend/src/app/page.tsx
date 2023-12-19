"use client";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import { localeList, maxWidth } from "@/consts";
import theme from "@/theme";

const Home = () => {
  const locale = useLocale();
  const title = locale.Home.title;
  const titleMessage = locale.Home.titleMessage;
  const width = useMediaQuery(theme.breakpoints.up(maxWidth))
    ? `${theme.breakpoints.values[maxWidth]}px`
    : "100vw";
  const logoScale = locale.locale === "en" ? 1.5 : 0.9;
  const messageScale = locale.locale === "en" ? 1.0 : 0.6;

  const [selectedLocale, setSelectedLocale] = useState<string>(locale.locale);

  useEffect(() => {
    setSelectedLocale(locale.locale);
  }, [locale.locale]);

  const handleLocaleChange = (event: SelectChangeEvent) => {
    setSelectedLocale(event.target.value);
    window.location.assign(`/${event.target.value}`);
  };

  return (
    <>
      <Link
        href="/mode-select"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <Centering justifyContent="space-around">
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
      <Select
        value={selectedLocale}
        onChange={handleLocaleChange}
        sx={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        {localeList.map((locale) => (
          <MenuItem key={locale} value={locale}>
            {locale}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default Home;
