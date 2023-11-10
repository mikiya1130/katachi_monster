/**
 * /view-details?monsterId=${monsterId}
 */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ViewDetails = () => {
  const searchParams = useSearchParams();
  const [monsterId, setMonsterId] = useState<string>("1");

  useEffect(() => {
    const monsterId = searchParams.get("monsterId") ?? "1"; // TODO: パラメータない時の処理を実装する
    setMonsterId(monsterId);
  }, [searchParams]);

  return `ViewDetails monsterId=${monsterId}`;
};

export default ViewDetails;
