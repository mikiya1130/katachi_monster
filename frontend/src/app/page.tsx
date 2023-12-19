"use client";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";
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
          <Text
            fontSize={`calc(${width} * ${logoScale} / ${title.length})`}
            fontWeight={700}
            variant="h1"
            sx={{
              textShadow: "0 0 5px",
            }}
          >
            {title}
          </Text>
          <Text
            fontSize={`calc(${width} * ${messageScale} / ${titleMessage.length})`}
          >
            {titleMessage}
          </Text>
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
