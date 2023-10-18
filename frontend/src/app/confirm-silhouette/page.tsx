"use client";

import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { axios } from "@/axios";

const ConfirmSilhouette = () => {
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const imagePath = searchParams.get("imagePath");
    if (imagePath) {
      axios.get(imagePath, { responseType: "blob" }).then((res) => {
        setImage(URL.createObjectURL(res.data));
      });
    }
  }, [searchParams]);

  return (
    <Stack
      height="inherit"
      alignItems="center"
      justifyContent="center"
      spacing={4}
      padding={4}
    >
      <Box
        component="img"
        src={image}
        sx={{ aspectRatio: 1, objectFit: "contain" }}
      />
      <Stack direction="row" spacing={4}>
        <Link href="/take-picture">
          <Button variant="outlined">とりなおし</Button>
        </Link>
        <Link href="/select-silhouette">
          <Button variant="contained">けってい</Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default ConfirmSilhouette;
