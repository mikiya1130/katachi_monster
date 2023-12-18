export type TypeMonster = {
  image: string;
  name: string;
  hp: number;
  gu: number;
  choki: number;
  pa: number;
};

export type TypeHand = "gu" | "choki" | "pa";

export type TypeUser = {
  roomId: string;
  monster: TypeMonster | null;
  hand: TypeHand | null;
};

export type TypeOutcome = "win" | "lose" | "draw";

export type TypeCreateRoomCallback = (
  status: "success" | "error",
  roomId: string,
) => void;

export type TypeEnterRoomCallback = (status: "success" | "error") => void;
