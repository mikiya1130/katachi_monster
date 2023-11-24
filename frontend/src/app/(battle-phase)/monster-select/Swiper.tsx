import { Stack } from "@mui/material";
import { useState } from "react";

import ModalContent from "@/app/(battle-phase)/monster-select/ModalContent";
import Content from "@/app/(create-phase)/level-select/Content";
import { TypeMonster } from "@/app/(create-phase)/level-select/types";
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
      {monsterIds.map((monsterId) => (
        <Content
          key={monsterId}
          monsterId={monsterId}
          handleOpen={handleOpen}
        />
      ))}
      {monster && <ModalContent monster={monster} handleClose={handleClose} />}
    </Stack>
  );
};

export default Swiper;
