import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

import ModalContent from "@/app/level-select/ModalContent";
import { TypeSelectedImageInfo } from "@/types";
type Props = {
  images: TypeSelectedImageInfo[];
};

const Swiper = ({ images }: Props) => {
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
    <div {...handlers}>
      <Stack
        direction="row"
        sx={{
          overflowX: "scroll",
        }}
      >
        {images.map((image) => (
          <>
            <Box
              key={image.title}
              p={1}
              border={2}
              borderColor="#000"
              sx={{
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <Image
                src={image.url}
                alt={image.title}
                width={image.width}
                height={image.height}
                onClick={() => handleOpen2()}
                onClickCapture={() => handleOpen(image)}
              />
              {selectedImageInfo && (
                <ModalContent
                  selectedImageInfo={selectedImageInfo}
                  handleClose={handleClose}
                />
              )}
            </Box>
          </>
        ))}
      </Stack>
    </div>
  );
};

export default Swiper;
