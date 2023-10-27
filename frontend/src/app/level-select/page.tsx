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
  const headerHeight = "1rem";
  const contentHeight = `calc(${height} - ${headerHeight})`;

  return (
    <Stack py={5} direction="column" justifyContent="center" height="100svh">
      <Typography fontSize={headerHeight}>レベル</Typography>
      <Stack direction="column" height={contentHeight}>
        {swiperList.map((images, level) => {
          return (
            <Box flexGrow={1} key={level}>
              <Rating
                value={level + 1}
                max={swiperList.length}
                size="large"
                readOnly
              />
              <Swiper images={images} />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default LevelSelect;
