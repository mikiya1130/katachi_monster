import { Box, Stack } from "@mui/material";
import { useState } from "react";

import ModalContent from "@/app/level-select/ModalContent";
import { TypeSelectedImageInfo } from "@/types";
type Props = {
  images: TypeSelectedImageInfo[];
  height: number | string;
};

const Swiper = ({ images, height }: Props) => {
  const [selectedImageInfo, setSelectedImageInfo] =
    useState<null | TypeSelectedImageInfo>(null);

  const handleOpen = (imageInfo: TypeSelectedImageInfo) => {
    setSelectedImageInfo(imageInfo);
  };

  const handleClose = () => {
    setSelectedImageInfo(null);
  };

  return (
    <Box style={{ height: height }}>
      <Stack
        height="100%"
        direction="row"
        gap={2}
        px={2}
        sx={{
          overflowX: "scroll",
        }}
      >
        {images.map((image, index) => (
          <Box key={index}>
            <Box
              component="img"
              src={image.url}
              alt={image.title}
              onClick={() => handleOpen(image)}
              p={1}
              height="100%"
              border={2}
              borderColor="#000"
              sx={{
                aspectRatio: 1,
                objectFit: "contain",
              }}
            />

            {selectedImageInfo && (
              <ModalContent
                selectedImageInfo={selectedImageInfo}
                handleClose={handleClose}
              />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Swiper;
