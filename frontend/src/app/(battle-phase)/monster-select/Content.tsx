import { useEffect, useState } from "react";

import { TypeMonster } from "@/app/(create-phase)/level-select/types";
import { axios } from "@/axios";
import Image from "@/components/Image";

type Props = {
  monsterId: number;
  handleOpen: (imageInfo: TypeMonster) => void;
};

const Content = ({ monsterId, handleOpen }: Props) => {
  const [monster, setMonster] = useState<TypeMonster>({
    id: monsterId,
    base64image: "",
  });

  useEffect(() => {
    axios.get(`monster/${monsterId}/user_monster`).then((res) => {
      setMonster({
        id: monsterId,
        base64image: res.data.base64image,
      });
    });
  }, [monsterId]);

  return (
    <Image
      src={monster.base64image}
      alt={`monster_${monsterId}`}
      onClick={() => handleOpen(monster)}
      p={1}
      height="100%"
      border={2}
      borderColor="#000"
    />
  );
};

export default Content;
