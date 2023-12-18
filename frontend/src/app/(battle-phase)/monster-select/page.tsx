"use client";
import { Box, Rating, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import Swiper from "@/app/(battle-phase)/monster-select/Swiper";
import { axios } from "@/axios";
import { useLocale } from "@/components/LocaleProvider";
import { useSocket } from "@/components/SocketProvider";

const MonsterSelect = () => {
  const socket = useSocket();
  const [monsterIdsList, setMonsterIdsList] = useState<number[][]>([
    [],
    [],
    [],
  ]);

  const boxRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLSpanElement>(null);
  const [swiperHeight, setSwiperHeight] = useState<number>(0);
  const local = useLocale();

  useEffect(() => {
    console.log(socket);
  }, [socket]);

  useEffect(() => {
    if (boxRef.current && ratingRef.current) {
      const boxHeight = boxRef.current.clientHeight;
      const ratingHeight = ratingRef.current.clientHeight;
      setSwiperHeight(boxHeight - ratingHeight);
    }
  }, [boxRef, ratingRef]);

  useEffect(() => {
    axios.get("monsters?only_user_monsters=true").then((res) => {
      setMonsterIdsList(res.data.monster_ids);
    });
  }, []);

  return (
    <Stack py={5} height="100%">
      <Typography fontSize="2rem">{local.LevelSelect.level}</Typography>
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
  );
};

export default MonsterSelect;
