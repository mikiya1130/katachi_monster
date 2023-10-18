"use client";

import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

import { axios } from "@/axios";

const LevelSelect = () => {
  const [response, setResponse] = useState({ data: "" });

  useEffect(() => {
    axios.get("/test").then((res) => {
      setResponse(res.data);
    });
  }, []);

  return <Typography>{response.data}</Typography>;
};

export default LevelSelect;
