// 参考：Default theme viewer (https://mui.com/material-ui/customization/default-theme/)

"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    // mode: "dark",
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: ["Noto Sans", "Noto Sans JP", "sans-serif"].join(","),
  },
});

export default theme;
