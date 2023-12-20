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
import Animation, { AnimationRef } from "@/components/Animation";
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
  const animationRef = useRef<AnimationRef>(null);
  const [fieldInfoHeight, setFieldInfoHeight] = useState<number>(0);
  const locale = useLocale();

  const [hp, setHp] = useState<string>("-");

  const damageAnimation = () => {
    if (!animationRef.current) return;

    const MovePositionX = {
      0.0: 0,
      0.16: -20,
      0.33: 20,
      0.5: 0,
      0.66: -20,
      0.83: 20,
      1.0: 0,
    };
    const MovePositionY = {
      0.0: 0,
      0.16: 10,
      0.33: 10,
      0.5: 0,
      0.66: -10,
      0.83: -10,
      1.0: 0,
    };
    const MoveOpacity = {
      0.0: 1,
      0.2: 0,
      0.4: 1,
      0.6: 0,
      0.8: 1,
      1.0: 1,
    };
    const duration = 250;

    animationRef.current.exec(
      MovePositionX,
      MovePositionY,
      MoveOpacity,
      duration,
    );
  };

  useImperativeHandle(ref, () => ({
    updateHp: (updateHp: number) => {
      if (!monster) return;
      if (hp === updateHp.toString()) return;

      const duration = 500;
      const interval = duration / Math.abs(updateHp - monster.hp);
      let newHp = parseInt(hp);

      damageAnimation();
      const intervalId = setInterval(() => {
        newHp = newHp + (updateHp > monster.hp ? 1 : -1);
        setHp(newHp.toString());
        if (newHp === updateHp) {
          clearInterval(intervalId);
        }
      }, interval);
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
        <Animation width="100%" height="90%" ref={animationRef}>
          <Centering>
            <Image
              src={monster ? monster.base64image : ""}
              alt="silhouette"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Centering>
        </Animation>
      </Box>
    </Stack>
  );
};

export default forwardRef(Field);
