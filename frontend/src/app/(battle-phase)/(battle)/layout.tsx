"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";

import { TypeMonster } from "@/app/(battle-phase)/(battle)/battle/types";

export type Winner = {
  isSelf: boolean;
  monster: TypeMonster | null;
};

export type TypeBattleContext = {
  winner: Winner | null;
  setWinner: Dispatch<SetStateAction<Winner | null>>;
};

export const BattleContext = createContext<TypeBattleContext>(
  {} as TypeBattleContext,
);

type Props = {
  children: React.ReactNode;
};

const BattilePhaseLayout = ({ children }: Props) => {
  const [winner, setWinner] = useState<Winner | null>(null);

  return (
    <BattleContext.Provider value={{ winner, setWinner }}>
      {children}
    </BattleContext.Provider>
  );
};

export default BattilePhaseLayout;
