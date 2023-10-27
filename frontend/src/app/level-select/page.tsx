"use client";
import { Rating, Stack, Typography } from "@mui/material";

import Swiper from "@/app/level-select/Swiper";
import { imagesLevel1, imagesLevel2, imagesLevel3 } from "@/sampleImages";
import { TypeSelectedImageInfo } from "@/types";

const LevelSelect = () => {
  const swiperList: TypeSelectedImageInfo[][] = [
    imagesLevel1,
    imagesLevel2,
    imagesLevel3,
  ];

  return (
    <Stack py={5} direction="column" justifyContent="center" height="100svh">
      <Typography>レベル</Typography>
      {swiperList.map((images, level) => {
        return (
          <>
            <Rating
              value={level + 1}
              max={swiperList.length}
              size="large"
              readOnly
            />
            <Swiper images={images} />
          </>
        );
      })}
    </Stack>
  );
};

export default LevelSelect;
