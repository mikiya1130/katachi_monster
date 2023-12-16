"use client";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import Image from "@/components/Image";

type Props = {
  height: string;
  color: string;
  monsterName: string;
  monsterImage: string;
  isSelf: boolean;
};

const Field = ({ height, color, monsterName, monsterImage, isSelf }: Props) => {
  const direction = isSelf ? "column" : "column-reverse";
  const removeBorder = isSelf ? { borderTop: 0 } : { borderBottom: 0 };

  const filedInfoRef = useRef<HTMLDivElement>(null);
  const [fieldInfoHeight, setFieldInfoHeight] = useState<number>(0);

  useEffect(() => {
    if (filedInfoRef.current) {
      setFieldInfoHeight(filedInfoRef.current.clientHeight);
    }
  }, [filedInfoRef]);

  return (
    <Stack direction={direction} sx={{ height: height, width: "100%" }}>
      <Stack
        ref={filedInfoRef}
        direction="row"
        justifyContent="space-between"
        sx={{ width: "100%", bgcolor: color }}
        p="5px"
      >
        <Chip
          avatar={
            <Avatar sx={{ bgcolor: "black" }} variant="rounded">
              <Typography color="white" fontWeight={600}>
                HP
              </Typography>
            </Avatar>
          }
          label="100"
          variant="outlined"
          sx={{ borderRadius: "8px", bgcolor: "white" }}
        />
        <Chip
          avatar={<Avatar alt="Gu" src="images/gu.png" />}
          label="32"
          variant="outlined"
          sx={{ bgcolor: "white" }}
        />
        <Chip
          avatar={<Avatar alt="Gu" src="images/choki.png" />}
          label="10"
          variant="outlined"
          sx={{ bgcolor: "white" }}
        />
        <Chip
          avatar={<Avatar alt="Gu" src="images/pa.png" />}
          label="51"
          variant="outlined"
          sx={{ bgcolor: "white" }}
        />
      </Stack>
      <Box
        sx={{
          ...{
            height: `calc(100% - ${fieldInfoHeight}px)`,
            width: "100%",
            border: `5px solid ${color}`,
          },
          ...removeBorder,
        }}
        pt="6px"
      >
        <Box sx={{ height: "10%", width: "100%" }}>
          <Typography fontSize="1rem" align="center">
            {monsterName}
          </Typography>
        </Box>
        <Image
          src={monsterImage}
          alt="silhouette"
          objectFit="contain"
          sx={{ height: "90%", width: "100%" }}
        />
      </Box>
    </Stack>
  );
};

export default Field;
