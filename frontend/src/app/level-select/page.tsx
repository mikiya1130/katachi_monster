"use client";
import { Box, Rating, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import Swiper from "@/app/level-select/Swiper";
import { TypeMonster } from "@/app/level-select/types";
import { axios } from "@/axios";

const LevelSelect = () => {
  const [monstersList, setMonstersList] = useState<TypeMonster[][]>([
    [],
    [],
    [],
  ]);

  const boxRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLSpanElement>(null);
  const [swiperHeight, setSwiperHeight] = useState<number>(0);

  useEffect(() => {
    if (boxRef.current && ratingRef.current) {
      const boxHeight = boxRef.current.clientHeight;
      const ratingHeight = ratingRef.current.clientHeight;
      setSwiperHeight(boxHeight - ratingHeight);
    }
  }, [boxRef, ratingRef]);

  useEffect(() => {
    axios.get("monster").then((res) => {
      console.log(res.data.monsters);
      setMonstersList(res.data.monsters);
    });
  }, []);

  return (
    <Stack py={5} height="100%">
      <Typography fontSize="2rem">レベル</Typography>
      <Stack direction="column" spacing={3} flexGrow={1}>
        {monstersList.map((monsters, level) => {
          return (
            <Box key={level} flexGrow={1} ref={boxRef}>
              <Rating
                value={level + 1}
                max={monstersList.length}
                readOnly
                sx={{ fontSize: "2rem" }}
                ref={ratingRef}
              />
              <Swiper monsters={monsters} height={swiperHeight} />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default LevelSelect;
