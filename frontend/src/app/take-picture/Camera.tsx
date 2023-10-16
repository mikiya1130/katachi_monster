import { Cached, RadioButtonChecked } from "@mui/icons-material";
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
  const [numWidth, setNumWidth] = useState<number>(0);
  const [numHeight, setNumHeight] = useState<number>(0);
  const [access, setAccess] = useState<State>("loading");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messageRef = useRef<MessageRef>(null);
  const router = useRouter();

  useEffect(() => {
    if (wrapperRef && wrapperRef.current) {
      setNumWidth(wrapperRef.current.clientWidth);
      setNumHeight(wrapperRef.current.clientHeight);
    }
  }, [width, height]);

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
    if (canvasRef.current) {
      canvasRef.current.width = numWidth;
      canvasRef.current.height = numHeight;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, numWidth, numHeight);
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
      <canvas ref={canvasRef} style={{ position: "absolute" }} />
      {access === "loaded" && (
        <IconButton
          onClick={takePicture}
          sx={{
            position: "absolute",
            bottom: `calc(${width} * ${scale} / 3)`,
            color: "white",
          }}
        >
          <RadioButtonChecked sx={{ fontSize: `calc(${width} * ${scale})` }} />
        </IconButton>
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
