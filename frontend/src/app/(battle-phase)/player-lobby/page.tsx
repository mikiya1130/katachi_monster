"use client";

import Centering from "@/components/Centering";
import LinkButton from "@/components/LinkButton";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";

const PlayerLobby = () => {
  const locale = useLocale();

  return (
    <Centering p={4} spacing={10}>
      <Text fontSize="2rem">{locale.PlayerLobby.title}</Text>
      <LinkButton href="/create-room" variant="outlined">
        {locale.PlayerLobby.createRoom}
      </LinkButton>
      <LinkButton href="/enter-room" variant="contained">
        {locale.PlayerLobby.enterRoom}
      </LinkButton>
    </Centering>
  );
};

export default PlayerLobby;
