/**
 * /confirm-silhouette?monsterId=${monsterId}&silhouetteId=${silhouetteId}&pictureId=${pictureId}
 */
"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import LinkButton from "@/components/LinkButton";
import { useLocale } from "@/components/LocaleProvider";

const ConfirmSilhouette = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");
  const [silhouetteId, setSilhouetteId] = useState<string>("1");
  const [image, setImage] = useState<string>("");
  const [matchRate, setMatchRate] = useState<number>(0);
  const locale = useLocale();

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);
    const silhouetteId = searchParams.get("silhouetteId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setSilhouetteId(silhouetteId);

    const pictureId = searchParams.get("pictureId");
    if (pictureId) {
      axios.get(`/picture/${pictureId}?overlap_silhouette=true`).then((res) => {
        setImage(res.data.base64image);
        setMatchRate(res.data.match_rate);
      });
    }
  }, [searchParams]);

  return (
    <Centering spacing={4} padding={4}>
      <Image src={image} alt="silhouette" width="100%" />
      <Box>
        <Typography variant="h5" align="center">
          {locale.ConfirmSilhouette.message}
        </Typography>
        <Typography variant="h3" align="center">
          {matchRate}%
        </Typography>
      </Box>
      <Stack direction="row" spacing={4}>
        <LinkButton
          href={`/take-picture?monsterId=${monsterId}&silhouetteId=${silhouetteId}`}
          variant="outlined"
        >
          {locale.ConfirmSilhouette.retakeButton}
        </LinkButton>
        <LinkButton
          href={`/select-silhouette?monsterId=${monsterId}`}
          variant="contained"
        >
          {locale.ConfirmSilhouette.confirmButton}
        </LinkButton>
      </Stack>
    </Centering>
  );
};

export default ConfirmSilhouette;
