import { Stack } from "@mui/material";
import Link from "next/link";
import TitleLogo from "@/components/TitleLogo";
import TitleMessage from "@/components/TitleMessage";

const Home = () => {
  return (
    <Link
      href="/level-select"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Stack
        justifyContent="space-around"
        textAlign="center"
        sx={{ height: "100%" }}
      >
        <TitleLogo />
        <TitleMessage />
      </Stack>
    </Link>
  );
};

export default Home;
