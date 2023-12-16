export type User = {
  roomId: string;
  image: string;
  name: string;
  hp: number;
  gu: number;
  choki: number;
  pa: number;
};

export type createRoomCallback = (
  status: "success" | "error",
  roomId: string,
) => void;

export type enterRoomCallback = (status: "success" | "error") => void;
