/**
 * /select-silhouette?monsterId=${monsterId}
 */
"use client";

import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Image from "@/components/Image";
import LinkButton from "@/components/LinkButton";
import { useLocale } from "@/components/LocaleProvider";

const SelectSilhouette = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [segment, setSegment] = useState<string[][]>();
  const [segmentWidth, setSegmentWidth] = useState<number>(0);
  const [segmentHeight, setSegmentHeight] = useState<number>(0);
  const [
    includeSilhouettesNotReplacedPicture,
    setIncludeSilhouettesNotReplacedPicture,
  ] = useState<boolean>(true);

  const locale = useLocale();

  const decode_2d_list = (str: string) =>
    str.split("|").map((row: string) => row.split(","));

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);

    axios
      .get(`monster/${monsterId}/creating?return_segment=true`)
      .then((res) => {
        setImage(res.data.base64image);
        setSegment(decode_2d_list(res.data.segment));
      });
  }, [searchParams]);

  useEffect(() => {
    if (segment) {
      setSegmentWidth(segment[0].length);
      setSegmentHeight(segment.length);
      setIncludeSilhouettesNotReplacedPicture(
        segment.some((row) => row.some((value) => value.includes("s"))),
      );
    }
  }, [segment]);

  const clickSilhouette = (
    positionX: number,
    positionY: number,
  ): number | null => {
    const segmentX = Math.floor(segmentWidth * positionX);
    const segmentY = Math.floor(segmentHeight * positionY);
    if (segment) {
      const value = segment[segmentY][segmentX];
      if (value.startsWith("s") || value.startsWith("i")) {
        return Number(value.replace("s", "").replace("i", ""));
      }
    }
    return null;
  };

  const handleClickImage = (e: React.MouseEvent<HTMLElement>) => {
    const dom = e.currentTarget.getBoundingClientRect();
    const positionX = Math.max(0, e.clientX - dom.x) / dom.width;
    const positionY = Math.max(0, e.clientY - dom.y) / dom.height;
    const silhouetteId = clickSilhouette(positionX, positionY);
    if (silhouetteId !== null) {
      router.push(
        `/take-picture?monsterId=${monsterId}&silhouetteId=${silhouetteId}`,
      );
    }
  };

  return (
    <Centering height="inherit" spacing={4} padding={4}>
      {image !== "" && includeSilhouettesNotReplacedPicture && (
        <Typography variant="h5">シルエットをえらんでね</Typography>
      )}
      <Image
        src={image}
        alt="silhouette"
        onClick={handleClickImage}
        width="100%"
      />
      <Stack direction="row" spacing={4}>
        <LinkButton href="/level-select" variant="outlined">
          {locale.SelectSilhouette.backButton}
        </LinkButton>
        <LinkButton
          href={`/naming-monster?monsterId=${monsterId}`}
          variant="contained"
          disabled={includeSilhouettesNotReplacedPicture}
        >
          {locale.SelectSilhouette.nextButton}
        </LinkButton>
      </Stack>
    </Centering>
  );
};

export default SelectSilhouette;
