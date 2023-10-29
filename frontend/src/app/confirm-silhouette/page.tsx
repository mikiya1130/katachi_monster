/**
 * /confirm-silhouette?monsterId=${monsterId}&silhouetteId=${silhouetteId}&pictureId=${pictureId}
 */
"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Image from "@/components/Image";

const ConfirmSilhouette = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");
  const [silhouetteId, setSilhouetteId] = useState<string>("1");
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);
    const silhouetteId = searchParams.get("silhouetteId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setSilhouetteId(silhouetteId);

    const pictureId = searchParams.get("pictureId");
    if (pictureId) {
      axios.get(`/picture/${pictureId}?overlap_silhouette=true`).then((res) => {
        setImage(res.data.base64image);
      });
    }
  }, [searchParams]);

  return (
    <Centering spacing={4} padding={4}>
      <Image src={image} alt="silhouette" width="100%" />
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
    </Centering>
  );
};

export default ConfirmSilhouette;
