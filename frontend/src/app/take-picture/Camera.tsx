import { ArrowBack, Cached, RadioButtonChecked } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { axios } from "@/axios";
import Message, { MessageRef } from "@/components/Message";

type Props = {
  width: string;
  height: string;
};
type State = "loading" | "loaded" | "error";

const Camera = ({ width, height }: Props) => {
  const scale = 0.3;
  const [access, setAccess] = useState<State>("loading");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messageRef = useRef<MessageRef>(null);
  const router = useRouter();

  useEffect(() => {
    if (!videoRef) return;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      .then((stream) => {
        if (videoRef.current && videoRef.current.srcObject == null) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setAccess("loaded");
        }
      })
      .catch(() => {
        messageRef.current?.call({
          type: "error",
          message: "カメラにアクセスできません",
        });
        setAccess("error");
      });
  }, [videoRef, setAccess]);

  const postImage = async (base64image: string): Promise<string> => {
    return axios
      .post("/extract", {
        base64image: base64image,
      })
      .then((res) => {
        const imagePath: string = res.data.upload_path;
        return imagePath;
      })
      .catch((error) => {
        messageRef.current?.call({
          type: "error",
          message: error.message,
        });
        return "";
      });
  };

  const takePicture = () => {
    if (wrapperRef.current && videoRef.current && canvasRef.current) {
      const displayWidth = wrapperRef.current.clientWidth;
      const displayHeight = wrapperRef.current.clientHeight;
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      let drawX = 0;
      let drawY = 0;
      let drawW = videoWidth;
      let drawH = videoHeight;

      if (displayWidth / displayHeight < videoWidth / videoHeight) {
        const crop = videoWidth - displayWidth * (videoHeight / displayHeight);
        drawX = crop / 2;
        drawW = videoWidth - crop;
      } else {
        const crop = videoHeight - displayHeight * (videoWidth / displayWidth);
        drawY = crop / 2;
        drawH = videoHeight - crop;
      }

      canvasRef.current.width = drawW;
      canvasRef.current.height = drawH;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx && videoRef.current) {
        ctx.drawImage(
          videoRef.current,
          drawX,
          drawY,
          drawW,
          drawH,
          0,
          0,
          drawW,
          drawH,
        );
        const base64image = canvasRef.current.toDataURL("image/png");
        messageRef.current?.call({
          type: "info",
          message: "画像を処理しています……",
        });
        postImage(base64image).then((imagePath) => {
          if (imagePath) {
            router.push(`/confirm-silhouette?imagePath=${imagePath}`);
          }
        });
      }
    }
  };

  return (
    <Stack
      width={width}
      height={height}
      alignItems="center"
      justifyContent="center"
      sx={{ position: "relative" }}
      ref={wrapperRef}
    >
      {access === "loading" && (
        <>
          <CircularProgress />
          <Typography>{"カメラ読み込み中……"}</Typography>
        </>
      )}
      <video
        width="100%"
        height="100%"
        ref={videoRef}
        style={{ position: "absolute", objectFit: "cover" }}
      />
      <canvas ref={canvasRef} style={{ display: "hidden" }} />
      {access === "loaded" && (
        <Stack
          direction="row"
          justifyContent="center"
          sx={{
            position: "absolute",
            width: "100%",
            bottom: `calc(${width} * ${scale} / 3)`,
          }}
        >
          <IconButton
            onClick={() => {
              router.push("/select-silhouette");
            }}
            sx={{
              position: "absolute",
              left: 0,
              width: `calc(${width} * ${scale} * 0.6)`,
              height: `calc(${width} * ${scale} * 0.6)`,
              marginX: 4,
              marginY: `calc(${width} * ${scale} * 0.2)`, // (1.0 - height) / 2
              color: "white",
            }}
          >
            <ArrowBack sx={{ width: "100%", height: "100%" }} />
          </IconButton>
          <IconButton
            onClick={takePicture}
            sx={{
              width: `calc(${width} * ${scale})`,
              height: `calc(${width} * ${scale})`,
              color: "white",
            }}
          >
            <RadioButtonChecked sx={{ width: "100%", height: "100%" }} />
          </IconButton>
        </Stack>
      )}
      {access === "error" && (
        <Button
          variant="contained"
          color="warning"
          size="large"
          startIcon={<Cached />}
          onClick={() => window.location.reload()}
        >
          {"再読み込み"}
        </Button>
      )}
      <Message ref={messageRef} />
    </Stack>
  );
};

export default Camera;
