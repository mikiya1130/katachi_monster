import Image from "next/image";
import React from "react";

import ModalContent from "@/app/level-select/ModalContent";
import { TypeSelectedImageInfo } from "@/types";

type Props = {
  images: TypeSelectedImageInfo[];
};

const Swiper = ({ images }: Props) => {
  const imageContainerStyle = {
    display: "flex", // 画像を横に並べるために flex レイアウトを使用
  };

  const imageStyle = {
    width: "30%", // 画像の幅
    marginRight: "30px", // 画像の間隔
  };

  // 画像を四角で囲むためのスタイル
  const borderedImageStyle = {
    border: "2px solid #000", // 枠線のスタイルを設定
    padding: "10px", // 枠線内の余白を追加
  };

  const levelStyle = {
    marginBottom: "50px",
    fontSize: "50px",
  };

  const [selectedImageInfo, setSelectedImageInfo] =
    React.useState<null | TypeSelectedImageInfo>(null);

  const handleOpen = (imageInfo: TypeSelectedImageInfo) => {
    // 画像クリック時にモーダルを開く関数
    setSelectedImageInfo(imageInfo); // 選択された画像情報を設定
  };

  const handleClose = () => {
    setSelectedImageInfo(null);
  };

  return (
    <div style={levelStyle}>
      <div style={imageContainerStyle}>
        {images.map((image, index) => (
          <div key={index} style={{ ...imageStyle, ...borderedImageStyle }}>
            <Image
              src={image.url}
              alt={image.title}
              width={image.width} // 画像の幅を指定
              height={image.height} // 画像の高さを指定
              onClick={() => handleOpen(image)}
            />
            {selectedImageInfo && (
              <ModalContent
                selectedImageInfo={selectedImageInfo}
                handleClose={handleClose}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Swiper;
