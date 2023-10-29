"use client";
import { Box, Rating, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import Swiper from "@/app/level-select/Swiper";
import { imagesLevel1, imagesLevel2, imagesLevel3 } from "@/sampleImages";
import { TypeSelectedImageInfo } from "@/types";

const LevelSelect = () => {
  const swiperList: TypeSelectedImageInfo[][] = [
    imagesLevel1,
    imagesLevel2,
    imagesLevel3,
  ];

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

  return (
    <Stack py={5} height="100%">
      <Typography fontSize="2rem">レベル</Typography>
      <Stack direction="column" spacing={3} flexGrow={1}>
        {swiperList.map((images, level) => {
          return (
            <Box key={level} flexGrow={1} ref={boxRef}>
              <Rating
                value={level + 1}
                max={swiperList.length}
                readOnly
                sx={{ fontSize: "2rem" }}
                ref={ratingRef}
              />
              <Swiper images={images} height={swiperHeight} />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default LevelSelect;
