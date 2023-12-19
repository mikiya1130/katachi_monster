"use client";
import { Stack } from "@mui/material";

import Centering from "@/components/Centering";
import LinkButton from "@/components/LinkButton";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";

const ModeSelect = () => {
  const locale = useLocale();

  return (
    <Centering p={4} spacing={10}>
      <Text fontSize="2rem">{locale.ModeSelect.title}</Text>
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={10}
        width="50%"
      >
        <LinkButton href="/level-select" variant="outlined">
          {locale.ModeSelect.labelLevelSelect}
        </LinkButton>

        <LinkButton href="/player-lobby" variant="contained">
          {locale.ModeSelect.labelPlayerLobby}
        </LinkButton>
      </Stack>
    </Centering>
  );
};

export default ModeSelect;
