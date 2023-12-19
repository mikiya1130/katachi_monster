"use client";
import { Box, Rating, Stack } from "@mui/material";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

import Swiper from "@/app/(create-phase)/level-select/Swiper";
import { axios } from "@/axios";
import { useLocale } from "@/components/LocaleProvider";
import Message, { MessageRef } from "@/components/Message";
import Text from "@/components/Text";

const LevelSelect = () => {
  const messageRef = useRef<MessageRef>(null);

  const [monsterIdsList, setMonsterIdsList] = useState<number[][]>([
    [],
    [],
    [],
  ]);

  const boxRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLSpanElement>(null);
  const [swiperHeight, setSwiperHeight] = useState<number>(0);
  const locale = useLocale();

  useEffect(() => {
    if (boxRef.current && ratingRef.current) {
      const boxHeight = boxRef.current.clientHeight;
      const ratingHeight = ratingRef.current.clientHeight;
      setSwiperHeight(boxHeight - ratingHeight);
    }
  }, [boxRef, ratingRef]);

  useEffect(() => {
    axios
      .get("monsters")
      .then((res) => {
        setMonsterIdsList(res.data.monster_ids);
      })
      .catch((err) => {
        if (isAxiosError(err)) {
          console.log(err.response?.data.detail);
          messageRef.current?.call({
            type: "error",
            message: err.response?.data.detail,
          });
        }
      });
  }, []);

  return (
    <>
      <Stack py={5} height="100%">
        <Text fontSize="2rem" align="left">
          {locale.LevelSelect.level}
        </Text>
        <Stack direction="column" spacing={3} flexGrow={1}>
          {monsterIdsList.map((monsterIds, level) => {
            return (
              <Box key={level} flexGrow={1} ref={boxRef}>
                <Rating
                  value={level + 1}
                  max={monsterIdsList.length}
                  readOnly
                  sx={{ fontSize: "2rem" }}
                  ref={ratingRef}
                />
                <Swiper monsterIds={monsterIds} height={swiperHeight} />
              </Box>
            );
          })}
        </Stack>
      </Stack>
      <Message ref={messageRef} />
    </>
  );
};

export default LevelSelect;
