"use client";
import { Box, Rating, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import Swiper from "@/app/(create-phase)/level-select/Swiper";
import { TypeMonster } from "@/app/(create-phase)/level-select/types";
import { axios } from "@/axios";

const LevelSelect = () => {
  const [monstersList, setMonstersList] = useState<TypeMonster[][]>(
    Array.from(new Array(3), (_, i) =>
      new Array(5)
        .fill(null)
        .map((_, j) => ({ id: 10 * i + j, base64image: "" })),
    ),
  );

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
