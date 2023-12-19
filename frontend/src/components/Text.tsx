/**
 * Typography のラッパー
 */
import { SxProps, Theme, Typography, TypographyProps } from "@mui/material";
import { CSSProperties } from "react";

type TextProps = {
  fontSize: string | number;
  width?: string;
  align?: "left" | "center" | "right";
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  children: React.ReactNode;
};
type Props = TypographyProps & TextProps;

const Text = ({
  fontSize,
  width = "100%",
  align = "center",
  children,
  sx = {},
  style = {},
  ...typographyProps
}: Props) => {
  return (
    <Typography
      fontSize={fontSize}
      width={width}
      align={align}
      sx={sx}
      style={style}
      {...typographyProps}
    >
      {children}
    </Typography>
  );
};

export default Text;
