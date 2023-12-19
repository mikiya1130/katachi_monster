"use client";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import Centering from "@/components/Centering";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";
import { locales } from "@/consts";

const Home = () => {
  const locale = useLocale();
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
            fontSize="3rem"
            fontWeight={700}
            variant="h1"
            sx={{ textShadow: "0 0 5px" }}
          >
            {locale.Home.title}
          </Text>
          <Text fontSize="1.8rem">{locale.Home.titleMessage}</Text>
        </Centering>
      </Link>
      <Select
        value={selectedLocale}
        onChange={handleLocaleChange}
        sx={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        {Object.entries(locales).map(([code, language]) => (
          <MenuItem key={code} value={code}>
            {language}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default Home;
