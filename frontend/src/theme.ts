// 参考：Default theme viewer (https://mui.com/material-ui/customization/default-theme/)

"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    // mode: "dark",
  },
});

export const titleFont = createTheme({
  typography: {
    fontFamily: ["Noto Sans JP", "sans-serif"].join(","),
  },
});

export default theme;
