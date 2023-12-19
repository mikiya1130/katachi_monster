import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/600.css";
import "@fontsource/noto-sans/700.css"; // NOTE: 700 選んでも Bold にならない？？
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/600.css";
import "@fontsource/noto-sans-jp/700.css"; // NOTE: 700 選んでも Bold にならない？？
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/600.css";
import "@fontsource/noto-sans-kr/700.css"; // NOTE: 700 選んでも Bold にならない？？
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/600.css";
import "@fontsource/noto-sans-sc/700.css"; // NOTE: 700 選んでも Bold にならない？？

import { CssBaseline } from "@mui/material";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import LocaleProvider from "@/components/LocaleProvider";
import { maxWidth } from "@/consts";
import theme from "@/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shape Monster",
  description: "~Let’s search! create! battle!~",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocaleProvider>
            <Container
              maxWidth={maxWidth}
              disableGutters
              sx={{ height: "100svh", overflow: "clip" }}
            >
              {children}
            </Container>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
