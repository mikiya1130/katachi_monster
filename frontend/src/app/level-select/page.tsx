import { Rating, Typography } from "@mui/material";
import Image from "next/image";

const imagesLevel1 = [
  {
    url: "/../../../images/animal_black_sheep_hitsuji.png",
    title: "sheep_hitsuji",
    width: 100,
    height: 100,
  },
  {
    url: "/../../../images/animal_hitsuji_shiboubi.png",
    title: "hitsuji_shiboubi",
    width: 100,
    height: 100,
  },
  {
    url: "/../../../images/animal_marmot_longhair.png",
    title: "uma",
    width: 100,
    height: 100,
  },
];

const imagesLevel2 = [
  {
    url: "/../../../images/animal_oryx.png",
    title: "sheep_hitsuji",
    width: 100,
    height: 100,
  },
  {
    url: "/../../../images/animal_shirohera_koumori.png",
    title: "hitsuji_shiboubi",
    width: 100,
    height: 100,
  },
  {
    url: "/../../../images/animal_shirohera_koumori.png",
    title: "uma",
    width: 100,
    height: 100,
  },
];

const imagesLevel3 = [
  {
    url: "/../../../images/animal_thomsons_gazelle.png",
    title: "sheep_hitsuji",
    width: 100,
    height: 100,
  },
  {
    url: "/../../../images/animal_shirohera_koumori.png",
    title: "hitsuji_shiboubi",
    width: 100,
    height: 100,
  },
  {
    url: "/../../../images/animal_shirohera_koumori.png",
    title: "uma",
    width: 100,
    height: 100,
  },
];

const LevelSelect = () => {
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

  return (
    <div>
      <div style={levelStyle}>
        <Typography>レベル</Typography>
        <Rating name="level3" value={1} max={3} size="large" readOnly />
        <div style={imageContainerStyle}>
          {imagesLevel1.map((image, index) => (
            <div key={index} style={{ ...imageStyle, ...borderedImageStyle }}>
              <Image
                src={image.url}
                alt={image.title}
                width={image.width} // 画像の幅を指定
                height={image.height} // 画像の高さを指定
              />
            </div>
          ))}
        </div>
      </div>

      <div style={levelStyle}>
        <Rating name="level2" value={2} max={3} size="large" readOnly />
        <div style={imageContainerStyle}>
          {imagesLevel2.map((image, index) => (
            <div key={index} style={{ ...imageStyle, ...borderedImageStyle }}>
              <Image
                src={image.url}
                alt={image.title}
                width={image.width} // 画像の幅を指定
                height={image.height} // 画像の高さを指定
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Rating name="level1" value={3} max={3} size="large" readOnly />
        <div style={imageContainerStyle}>
          {imagesLevel3.map((image, index) => (
            <div key={index} style={{ ...imageStyle, ...borderedImageStyle }}>
              <Image
                src={image.url}
                alt={image.title}
                width={image.width} // 画像の幅を指定
                height={image.height} // 画像の高さを指定
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
