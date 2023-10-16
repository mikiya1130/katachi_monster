"use client";

import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

const ConfirmSilhouette = () => {
  const searchParams = useSearchParams();

  return <Typography>{searchParams.get("imagePath")}</Typography>;
};

export default ConfirmSilhouette;
