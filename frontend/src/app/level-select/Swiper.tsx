import { Stack } from "@mui/material";
import { useState } from "react";

import ModalContent from "@/app/level-select/ModalContent";
import { TypeSelectedImageInfo } from "@/app/level-select/types";
import Image from "@/components/Image";
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
    <Stack
      height={height}
      direction="row"
      gap={2}
      px={2}
      sx={{
        overflowX: "scroll",
      }}
    >
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.base64image}
          alt={`monster_${image.id}`}
          onClick={() => handleOpen(image)}
          p={1}
          height="100%"
          border={2}
          borderColor="#000"
        />
      ))}
      {selectedImageInfo && (
        <ModalContent
          selectedImageInfo={selectedImageInfo}
          handleClose={handleClose}
        />
      )}
    </Stack>
  );
};

export default Swiper;
