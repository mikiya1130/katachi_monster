import { Stack } from "@mui/material";
import { useState } from "react";

import ModalContent from "@/app/(create-phase)/level-select/ModalContent";
import { TypeMonster } from "@/app/(create-phase)/level-select/types";
import Image from "@/components/Image";
type Props = {
  monsters: TypeMonster[];
  height: number | string;
};

const Swiper = ({ monsters, height }: Props) => {
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
      {monsters.map((monster) => (
        <Image
          key={monster.id}
          src={monster.base64image}
          alt={`monster_${monster.id}`}
          onClick={() => handleOpen(monster)}
          p={1}
          height="100%"
          border={2}
          borderColor="#000"
        />
      ))}
      {monster && <ModalContent monster={monster} handleClose={handleClose} />}
    </Stack>
  );
};

export default Swiper;
