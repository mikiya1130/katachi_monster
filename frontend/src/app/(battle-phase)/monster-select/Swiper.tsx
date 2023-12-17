import { Stack, Typography } from "@mui/material";
import { useState } from "react";

import Content from "@/app/(battle-phase)/monster-select/Content";
import ModalContent from "@/app/(battle-phase)/monster-select/ModalContent";
import { TypeMonster } from "@/app/(battle-phase)/monster-select/types";
import Centering from "@/components/Centering";
import LinkButton from "@/components/LinkButton";
type Props = {
  monsterIds: number[];
  height: number | string;
};

const Swiper = ({ monsterIds, height }: Props) => {
  const [monster, setMonster] = useState<null | TypeMonster>(null);

  const handleOpen = (imageInfo: TypeMonster) => {
    setMonster(imageInfo);
  };

  const handleClose = () => {
    setMonster(null);
  };

  return (
    <Stack
      height={height}
      direction="row"
      gap={2}
      px={2}
      sx={{
        overflowX: "scroll",
      }}
    >
      {monsterIds.length !== 0 ? (
        monsterIds.map((monsterId) => (
          <Content
            key={monsterId}
            monsterId={monsterId}
            handleOpen={handleOpen}
          />
        ))
      ) : (
        <Centering>
          <Typography>このレベルのモンスターはいません</Typography>
          <LinkButton href="/level-select" variant="outlined">
            さくさいしにいく
          </LinkButton>
        </Centering>
      )}
      {monster && <ModalContent monster={monster} handleClose={handleClose} />}
    </Stack>
  );
};

export default Swiper;
