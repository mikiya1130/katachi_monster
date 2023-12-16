"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

type Props = {
  children: React.ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_ORIGIN || "");
    console.log("newSocket: ", newSocket);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newSocket.on("connect_error", (err: any) => {
      console.error(`connect_error: [${err.type || "Unknown"}] ${err.message}`);
    });

    return () => {
      console.log("disconnected");
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => useContext(SocketContext);
