"use client";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { TypeMonster } from "@/app/(battle-phase)/(battle)/battle/types";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import { useLocale } from "@/components/LocaleProvider";
import { images } from "@/consts";
import { TypeImage } from "@/types";

type Props = {
  height: string;
  color: string;
  monster: TypeMonster | null;
  isSelf: boolean;
};

const Field = ({ height, color, monster, isSelf }: Props) => {
  const direction = isSelf ? "column" : "column-reverse";
  const removeBorder = isSelf ? { borderTop: 0 } : { borderBottom: 0 };

  const filedInfoRef = useRef<HTMLDivElement>(null);
  const [fieldInfoHeight, setFieldInfoHeight] = useState<number>(0);
  const locale = useLocale();

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
              <Typography color="white" fontWeight={600}>
                HP
              </Typography>
            </Avatar>
          }
          label={monster ? monster.hp : "-"}
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
        <Typography height="10%" fontSize="1rem" align="center">
          {!isSelf && !monster
            ? locale.Field.message
            : monster
              ? monster.name
              : ""}
        </Typography>
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

export default Field;
