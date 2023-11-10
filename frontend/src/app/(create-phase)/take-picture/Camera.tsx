import { ArrowBack, RadioButtonChecked } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  width: string;
  height: string;
  updateCameraStateCallback: (cameraState: CameraState) => void;
  takePictureCallback: (base64image: string) => void;
  handleClickBack: () => void;
};
export type CameraState = "loading" | "loaded" | "error";

const Camera = ({
  width,
  height,
  updateCameraStateCallback,
  takePictureCallback,
  handleClickBack,
}: Props) => {
  const scale = 0.3;
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateCameraState = useCallback(
    (cameraState: CameraState) => {
      setCameraState(cameraState);
      updateCameraStateCallback(cameraState);
    },
    [updateCameraStateCallback],
  );

  const loadCamera = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      .then((stream) => {
        if (videoRef.current && videoRef.current.srcObject == null) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          updateCameraState("loaded");
        }
      })
      .catch(() => {
        updateCameraState("error");
      });
  }, [updateCameraState]);

  useEffect(() => {
    if (videoRef) {
      loadCamera();
    }
  }, [videoRef, loadCamera, updateCameraStateCallback]);

  const takePicture = () => {
    let base64image = "";

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
        base64image = canvasRef.current.toDataURL("image/png");
      }
    }

    takePictureCallback(base64image);
  };

  return (
    <Box
      width={width}
      height={height}
      sx={{ position: "relative" }}
      ref={wrapperRef}
    >
      <video
        width="100%"
        height="100%"
        muted={true}
        autoPlay={true}
        playsInline={true}
        ref={videoRef}
        style={{ position: "absolute", objectFit: "cover" }}
      />
      {cameraState === "loaded" && (
        <>
          <canvas ref={canvasRef} style={{ display: "hidden" }} />
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
              onClick={handleClickBack}
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
        </>
      )}
    </Box>
  );
};

export default Camera;
