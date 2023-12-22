import { useEffect, useState } from "react";

import { TypeMonster } from "@/app/(battle-phase)/monster-select/types";
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
    name: "",
    gu: 0,
    choki: 0,
    pa: 0,
  });

  useEffect(() => {
    axios.get(`monster/${monsterId}/fallback`).then((res) => {
      setMonster({
        id: monsterId,
        base64image: res.data.base64image,
        name: res.data.name,
        gu: res.data.gu,
        choki: res.data.choki,
        pa: res.data.pa,
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
