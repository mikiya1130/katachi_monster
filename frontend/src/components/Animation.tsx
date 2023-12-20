import { Box, BoxProps, SxProps, Theme } from "@mui/material";
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

type AnimationProps = {
  fps?: number;
  sx?: SxProps<Theme>;
  children: ReactNode;
};
type Props = BoxProps & AnimationProps;

export type AnimationRef = {
  exec: (
    movePositionX: { [time: number]: number },
    movePositionY: { [time: number]: number },
    moveOpacity: { [time: number]: number },
    duration: number,
  ) => void;
};

const Animation = (
  { fps = 30, children, sx = {}, ...boxProps }: Props,
  ref: ForwardedRef<AnimationRef>,
) => {
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);

  const calcValueOfTime = (
    time: number,
    obj: { [time: number]: number },
  ): number => {
    const times = Object.keys(obj)
      .map((x) => parseFloat(x))
      .sort();
    for (let i = 0; i < times.length - 1; i++) {
      const timeBegin = times[i];
      const timeEnd = times[i + 1];
      if (timeBegin <= time && time <= timeEnd) {
        return (
          obj[timeBegin] +
          ((obj[timeEnd] - obj[timeBegin]) * (time - timeBegin)) /
            (timeEnd - timeBegin)
        );
      }
    }
    throw new Error("time is out of range");
  };

  useImperativeHandle(ref, () => ({
    exec: (
      movePositionX: { [time: number]: number },
      movePositionY: { [time: number]: number },
      moveOpacity: { [time: number]: number },
      duration: number,
    ) => {
      const interval = 1000 / fps;
      const stepTime = interval / duration; // interval : stepTime = duration : 1
      let time = 0.0; // 0.0(0%) ~ 1.0(100%)

      const intervalId = setInterval(() => {
        setPosX(calcValueOfTime(time, movePositionX));
        setPosY(calcValueOfTime(time, movePositionY));
        setOpacity(calcValueOfTime(time, moveOpacity));

        if (time >= 1.0) {
          clearInterval(intervalId);
        }
        time = Math.min(time + stepTime, 1.0);
      }, interval);
    },
  }));

  return (
    <Box {...boxProps} sx={sx} position="relative">
      <Box height="100%" width="100%" visibility="hidden">
        {children}
      </Box>
      <Box
        height="100%"
        width="100%"
        position="absolute"
        left={posX}
        top={posY}
        sx={{ opacity: opacity }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default forwardRef(Animation);
