export type Monster = {
  image: string;
  name: string;
  hp: number;
  gu: number;
  choki: number;
  pa: number;
};

export type User = {
  roomId: string;
  monster: Monster;
};

export type createRoomCallback = (
  status: "success" | "error",
  roomId: string,
) => void;

export type enterRoomCallback = (status: "success" | "error") => void;
