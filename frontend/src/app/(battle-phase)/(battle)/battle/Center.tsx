"use client";
import { CSSProperties } from "react";

import Centering from "@/components/Centering";
import Text from "@/components/Text";

type Props = {
  children: React.ReactNode;
  style?: CSSProperties;
  color?: string;
};

const Center = ({ color = "black", style = {}, children }: Props) => {
  return (
    <Centering p={2}>
      <Text fontSize="2rem" fontWeight={700} color={color} style={style}>
        {children}
      </Text>
    </Centering>
  );
};

export default Center;
