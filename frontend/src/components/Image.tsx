/**
 * 画像表示用コンポーネント
 */
import { Box, BoxProps, Skeleton, SxProps, Theme } from "@mui/material";

type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: string;
  sx?: SxProps<Theme>;
};
type Props = BoxProps & ImageProps;

const Image = ({
  src,
  alt,
  width = "auto",
  height = "auto",
  objectFit = "contain",
  sx = {},
  ...boxProps
}: Props) => {
  const ImageComponent = (
    <Box
      component="img"
      src={src}
      alt={alt}
      width={width}
      height={height}
      sx={[
        { aspectRatio: 1, objectFit: objectFit },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...boxProps}
    />
  );

  return <>{src ? ImageComponent : <Skeleton>{ImageComponent}</Skeleton>}</>;
};

export default Image;
