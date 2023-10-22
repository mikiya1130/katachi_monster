/**
 * /take-picture?monsterId=${monsterId}&silhouetteId=${silhouetteId}
 */
"use client";

import { Cached } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Camera, { CameraState } from "@/app/take-picture/Camera";
import { axios } from "@/axios";
import Centering from "@/components/Centering";
import Message, { MessageRef } from "@/components/Message";
import { maxWidth } from "@/consts";
import theme from "@/theme";

const TakePicture = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");
  const [silhouetteId, setSilhouetteId] = useState<string>("1");
  const router = useRouter();
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const [silhouette, setSilhouette] = useState<string>();
  const messageRef = useRef<MessageRef>(null);
  const width = useMediaQuery(theme.breakpoints.up(maxWidth))
    ? `${theme.breakpoints.values[maxWidth]}px`
    : "100vw";

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);
    const silhouetteId = searchParams.get("silhouetteId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setSilhouetteId(silhouetteId);

    axios.get(`silhouette/${silhouetteId}?crop=true`).then((res) => {
      setSilhouette(res.data.base64image);
    });
  }, [searchParams]);

  const updateCameraStateCallback = (cameraState: CameraState) => {
    setCameraState(cameraState);

    if (cameraState == "error") {
      messageRef.current?.call({
        type: "error",
        message: "カメラにアクセスできません",
      });
    }
  };

  const takePictureCallback = (base64image: string) => {
    if (base64image === "") {
      messageRef.current?.call({
        type: "error",
        message: "撮影に失敗しました",
      });
      return;
    }

    messageRef.current?.call({
      type: "info",
      message: "画像を処理しています……",
    });

    axios
      .post("/extract", {
        silhouette_id: silhouetteId,
        base64image: base64image,
      })
      .then((res) => {
        const imageId: string = res.data.image_id;
        router.push(
          ` confirm-silhouette?monsterId=${monsterId}&silhouetteId=${silhouetteId}&imageId=${imageId}`,
        );
      })
      .catch((error) => {
        messageRef.current?.call({
          type: "error",
          message: error.message,
        });
      });
  };

  const handleClickBack = () => {
    router.push(`/select-silhouette?monsterId=${monsterId}`);
  };

  return (
    <>
      {cameraState !== "error" ? (
        <Box width={width} height="100svh" sx={{ position: "relative" }}>
          <Camera
            width={width}
            height="100svh"
            updateCameraStateCallback={updateCameraStateCallback}
            takePictureCallback={takePictureCallback}
            handleClickBack={handleClickBack}
          />
          <Centering
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            {cameraState === "loading" && (
              <>
                <CircularProgress />
                <Typography>{"カメラ読み込み中……"}</Typography>
              </>
            )}
            {cameraState === "loaded" && (
              <Box
                component="img"
                src={silhouette}
                width="100%"
                height="100%"
                sx={{ objectFit: "contain", opacity: 0.2 }}
              />
            )}
          </Centering>
        </Box>
      ) : (
        <Centering>
          <Button
            variant="contained"
            color="warning"
            size="large"
            startIcon={<Cached />}
            onClick={() => window.location.reload()}
          >
            {"再読み込み"}
          </Button>
        </Centering>
      )}
      <Message ref={messageRef} />
    </>
  );
};

export default TakePicture;
