import { CssBaseline } from "@mui/material";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import theme from "@/app/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "カタチモンスター",
  description: "",
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
          <Container
            maxWidth="sm"
            disableGutters
            sx={{ height: "100svh", overflow: "clip" }}
          >
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
