import { Avatar, Box, Chip, Stack } from "@mui/material";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { TypeMonster } from "@/app/(battle-phase)/(battle)/battle/types";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";
import { images } from "@/consts";
import { TypeImage } from "@/types";

type Props = {
  height: string;
  color: string;
  monster: TypeMonster | null;
  isSelf: boolean;
};

export type FieldRef = {
  updateHp: (hp: number) => void;
};

const Field = (
  { height, color, monster, isSelf }: Props,
  ref: ForwardedRef<FieldRef>,
) => {
  const direction = isSelf ? "column" : "column-reverse";
  const removeBorder = isSelf ? { borderTop: 0 } : { borderBottom: 0 };

  const filedInfoRef = useRef<HTMLDivElement>(null);
  const [fieldInfoHeight, setFieldInfoHeight] = useState<number>(0);
  const locale = useLocale();

  const [hp, setHp] = useState<string>("-");

  useImperativeHandle(ref, () => ({
    updateHp: (newHp: number) => {
      console.log(hp, newHp.toString(), hp === newHp.toString());

      if (!monster) return;
      if (hp === newHp.toString()) return;

      setHp(newHp.toString());
    },
  }));

  useEffect(() => {
    setHp(monster ? monster.hp.toString() : "-");
  }, [monster]);

  useEffect(() => {
    if (filedInfoRef.current) {
      setFieldInfoHeight(filedInfoRef.current.clientHeight);
    }
  }, [filedInfoRef]);

  return (
    <Stack direction={direction} sx={{ height: height, width: "100%" }}>
      <Stack
        ref={filedInfoRef}
        direction="row"
        justifyContent="space-around"
        sx={{ width: "100%", bgcolor: color }}
        p="5px"
      >
        <Chip
          avatar={
            <Avatar sx={{ bgcolor: "black" }} variant="rounded">
              <Text fontSize="1rem" fontWeight={700} color="white">
                HP
              </Text>
            </Avatar>
          }
          label={hp}
          variant="outlined"
          sx={{ borderRadius: "8px", bgcolor: "white", fontSize: "1.5rem" }}
        />
        {images.map(({ url, hand }: TypeImage) => {
          return (
            <Chip
              key={hand}
              avatar={<Avatar alt={hand} src={url} />}
              label={
                !monster
                  ? "-"
                  : hand === "gu"
                    ? monster.gu
                    : hand === "choki"
                      ? monster.choki
                      : hand === "pa"
                        ? monster.pa
                        : "-"
              }
              variant="outlined"
              sx={{ bgcolor: "white", fontSize: "1.5rem" }}
            />
          );
        })}
      </Stack>
      <Box
        sx={{
          ...{
            height: `calc(100% - ${fieldInfoHeight}px)`,
            width: "100%",
            border: `5px solid ${color}`,
          },
          ...removeBorder,
        }}
        pt="6px"
      >
        <Text fontSize="1rem" height="10%">
          {!isSelf && !monster
            ? locale.Field.message
            : monster
              ? monster.name
              : ""}
        </Text>
        <Centering>
          <Image
            src={monster ? monster.base64image : ""}
            alt="silhouette"
            width="100%"
            height="90%"
            objectFit="contain"
          />
        </Centering>
      </Box>
    </Stack>
  );
};

export default forwardRef(Field);
