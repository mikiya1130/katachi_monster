/**
 * 画像表示用コンポーネント
 */
import { Box, BoxProps } from "@mui/material";

type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: string;
};
type Props = BoxProps & ImageProps;

const Image = ({
  src,
  alt,
  width = "auto",
  height = "auto",
  objectFit = "contain",
  ...boxProps
}: Props) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      width={width}
      height={height}
      sx={{ aspectRatio: 1, objectFit: objectFit }}
      {...boxProps}
    />
  );
};

export default Image;
