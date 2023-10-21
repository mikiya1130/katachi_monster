/**
 * /confirm-silhouette?monsterId=${monsterId}&silhouetteId=${silhouetteId}&imagePath=${imagePath}
 */
"use client";

import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { axios } from "@/axios";

const ConfirmSilhouette = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");
  const [silhouetteId, setSilhouetteId] = useState<string>("1");
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);
    const silhouetteId = searchParams.get("silhouetteId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setSilhouetteId(silhouetteId);

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
        sx={{ width: "100%", aspectRatio: 1, objectFit: "contain" }}
      />
      <Stack direction="row" spacing={4}>
        <Link
          href={`/take-picture?monsterId=${monsterId}&silhouetteId=${silhouetteId}`}
        >
          <Button variant="outlined">とりなおし</Button>
        </Link>
        <Link href={`/select-silhouette?monsterId=${monsterId}`}>
          <Button variant="contained">けってい</Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default ConfirmSilhouette;
