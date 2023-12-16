export type Monster = {
  image: string;
  name: string;
  hp: number;
  gu: number;
  choki: number;
  pa: number;
};

export type Hand = "gu" | "choki" | "pa";

export type User = {
  roomId: string;
  monster: Monster | null;
  hand: Hand | null;
};

export type Outcome = "win" | "lose" | "draw";

export type createRoomCallback = (
  status: "success" | "error",
  roomId: string,
) => void;

export type enterRoomCallback = (status: "success" | "error") => void;
