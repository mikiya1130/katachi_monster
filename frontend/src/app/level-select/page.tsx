"use client";
import { Box, Rating, Stack, Typography } from "@mui/material";

import Swiper from "@/app/level-select/Swiper";
import { imagesLevel1, imagesLevel2, imagesLevel3 } from "@/sampleImages";
import { TypeSelectedImageInfo } from "@/types";

const LevelSelect = () => {
  const swiperList: TypeSelectedImageInfo[][] = [
    imagesLevel1,
    imagesLevel2,
    imagesLevel3,
  ];

  const height = "100svh";
  const headerHeight = "2rem";
  const contentHeight = `calc(${height} - 80px - ${headerHeight})`; // 80pxは一番外側のStackのpy
  const ratingHeight = "2rem";
  const swiperHeight = `calc(100% - ${ratingHeight})`;

  return (
    <Stack py={5} direction="column" justifyContent="center" height="100svh">
      <Typography fontSize={headerHeight}>レベル</Typography>
      <Stack direction="column" height={contentHeight} spacing={3}>
        {swiperList.map((images, level) => {
          return (
            <Box flexGrow={1} flexShrink={1} key={level}>
              <Rating
                value={level + 1}
                max={swiperList.length}
                readOnly
                sx={{ fontSize: ratingHeight }}
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
