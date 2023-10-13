"use client";

import { Typography } from "@mui/material";
import React from "react";

import { axios } from "@/axios";

const LevelSelect = () => {
  const [response, setResponse] = React.useState({ data: "" });

  React.useEffect(() => {
    axios.get("/test").then((res) => {
      setResponse(res.data);
    });
  }, []);

  return <Typography>{response.data}</Typography>;
};

export default LevelSelect;
