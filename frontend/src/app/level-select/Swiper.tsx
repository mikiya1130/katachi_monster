import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

import ModalContent from "@/app/level-select/ModalContent";
import { TypeSelectedImageInfo } from "@/types";
type Props = {
  images: TypeSelectedImageInfo[];
  height: string;
};

const Swiper = ({ images, height }: Props) => {
  const [selectedImageInfo, setSelectedImageInfo] =
    useState<null | TypeSelectedImageInfo>(null);

  const handleOpen = (imageInfo: TypeSelectedImageInfo) => {
    console.log("capture phase");
    setSelectedImageInfo(imageInfo);
  };

  const handleOpen2 = () => {
    console.log("戻り phase");
  };

  const handleClose = () => {
    setSelectedImageInfo(null);
  };

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      console.log("User Swiped!", eventData);
    },
  });

  return (
    <div {...handlers} style={{ height: height }}>
      <Stack
        height="100%"
        direction="row"
        gap={2}
        px={2}
        sx={{
          overflowX: "scroll",
        }}
      >
        {images.map((image) => (
          <>
            <Box
              component="img"
              src={image.url}
              alt={image.title}
              onClick={() => handleOpen2()}
              onClickCapture={() => handleOpen(image)}
              key={image.title}
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
          </>
        ))}
      </Stack>
    </div>
  );
};

export default Swiper;
