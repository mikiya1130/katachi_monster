import { Box, Stack } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useSwipeable } from "react-swipeable";

import ModalContent from "@/app/level-select/ModalContent";
import { TypeSelectedImageInfo } from "@/types";
type Props = {
  images: TypeSelectedImageInfo[];
};

const Swiper = ({ images }: Props) => {
  // const imageContainerStyle = {
  //   display: "flex", // 画像を横に並べるために flex レイアウトを使用
  // };

  // const imageStyle = {
  //   width: "30%", // 画像の幅
  //   marginRight: "30px", // 画像の間隔
  // };

  // // 画像を四角で囲むためのスタイル
  // const borderedImageStyle = {
  //   border: "2px solid #000", // 枠線のスタイルを設定
  //   padding: "10px", // 枠線内の余白を追加
  // };

  // const levelStyle = {
  //   marginBottom: "50px",
  //   fontSize: "50px",
  // };

  const [selectedImageInfo, setSelectedImageInfo] =
    React.useState<null | TypeSelectedImageInfo>(null);

  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpen = (imageInfo: TypeSelectedImageInfo) => {
    console.log("capture phase");
    // 画像クリック時にモーダルを開く関数
    setSelectedImageInfo(imageInfo); // 選択された画像情報を設定
  };

  const handleOpen2 = () => {
    console.log("戻り phase");
  };

  const handleClose = () => {
    setSelectedImageInfo(null);
  };

  // const handleSwiped = (eventData: { dir: string }) => {
  //   if (eventData.dir === "Left" && currentImageIndex < images.length - 1) {
  //     setCurrentImageIndex(currentImageIndex + 1);
  //   } else if (eventData.dir === "Right" && currentImageIndex > 0) {
  //     setCurrentImageIndex(currentImageIndex - 1);
  //   }
  // };

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      // eventData.stopPropagation();
      console.log("User Swiped!", eventData);
    },
  });

  return (
    <div {...handlers}>
      <Stack
        direction="row"
        sx={{
          overflowX: "scroll", // 横スクロールを有効にする
        }}
      >
        {images.map((image) => (
          <>
            <Box
              key={image.title}
              sx={{
                textAlign: "center",
                margin: "0 auto",
                border: "2px solid #000",
                padding: "10px",
              }}
            >
              <Image
                src={image.url}
                alt={image.title}
                width={image.width} // 画像の幅を指定
                height={image.height} // 画像の高さを指定
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
